import { NextResponse } from 'next/server'
import { trackServer } from '@/lib/analytics'
import { captureApiError } from '@/lib/sentry'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  getMidtransApiBaseUrl,
  getMidtransBasicAuthHeader,
  verifyMidtransSignature,
} from '@/lib/midtrans'

export const runtime = 'nodejs'

interface MidtransNotification {
  order_id?: string
  status_code?: string
  gross_amount?: string
  signature_key?: string
  transaction_status?: string
  fraud_status?: string
  payment_type?: string
  transaction_id?: string
}

function isSuccessfulPayment(status?: string, fraudStatus?: string) {
  if (status === 'settlement') return true
  if (status === 'capture') return !fraudStatus || fraudStatus.toLowerCase() === 'accept'
  return false
}

export async function POST(request: Request) {
  let notification: MidtransNotification

  try {
    notification = await request.json()
  } catch {
    await trackServer('payment_webhook_failed', { reason: 'invalid_json' })
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const orderId = notification.order_id
  const statusCode = notification.status_code
  const grossAmount = notification.gross_amount
  const signatureKey = notification.signature_key

  if (!orderId || !statusCode || !grossAmount || !signatureKey) {
    await trackServer('payment_webhook_failed', { reason: 'incomplete_notification' })
    return NextResponse.json({ error: 'Incomplete Midtrans notification.' }, { status: 400 })
  }

  await trackServer('payment_webhook_received', { provider: 'midtrans' })

  // Validate order_id format to reject unexpected inputs early
  if (!/^BN-\d+-[a-f0-9]{8}$/i.test(orderId)) {
    await trackServer('payment_webhook_failed', { reason: 'invalid_order_id' })
    return NextResponse.json({ error: 'Invalid order_id format.' }, { status: 400 })
  }

  if (!verifyMidtransSignature({ orderId, statusCode, grossAmount, signatureKey })) {
    await trackServer('payment_webhook_failed', { reason: 'invalid_signature' })
    return NextResponse.json({ error: 'Invalid Midtrans signature.' }, { status: 403 })
  }

  try {
    const statusResponse = await fetch(`${getMidtransApiBaseUrl()}/${encodeURIComponent(orderId)}/status`, {
      headers: {
        Authorization: getMidtransBasicAuthHeader(),
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!statusResponse.ok) {
      await trackServer('payment_webhook_failed', { reason: 'midtrans_status_failed', status: statusResponse.status })
      return NextResponse.json({ error: 'Failed to verify Midtrans status.' }, { status: 502 })
    }

    const verified = await statusResponse.json() as MidtransNotification
    const transactionStatus = verified.transaction_status ?? notification.transaction_status
    const fraudStatus = verified.fraud_status ?? notification.fraud_status
    const paymentType = verified.payment_type ?? notification.payment_type
    const transactionId = verified.transaction_id ?? notification.transaction_id

    const admin = createAdminClient()
    const { data: payment, error: paymentError } = await admin
      .from('payments')
      .select('user_id, amount')
      .eq('order_id', orderId)
      .single()

    if (paymentError || !payment) {
      await trackServer('payment_webhook_failed', { reason: 'order_not_found' })
      return NextResponse.json({ error: 'Payment order not found.' }, { status: 404 })
    }

    const verifiedGrossAmount = Number(verified.gross_amount ?? grossAmount)
    if (Number.isFinite(verifiedGrossAmount) && Math.round(verifiedGrossAmount) !== payment.amount) {
      await trackServer('payment_webhook_failed', { reason: 'amount_mismatch' })
      return NextResponse.json({ error: 'Payment amount mismatch.' }, { status: 400 })
    }

    const nextStatus = isSuccessfulPayment(transactionStatus, fraudStatus)
      ? 'paid'
      : transactionStatus ?? 'pending'

    const { error: updatePaymentError } = await admin
      .from('payments')
      .update({
        status: nextStatus,
        transaction_status: transactionStatus,
        fraud_status: fraudStatus,
        payment_type: paymentType,
        transaction_id: transactionId,
      })
      .eq('order_id', orderId)

    if (updatePaymentError) {
      await trackServer('payment_webhook_failed', { reason: 'payment_update_failed' })
      return NextResponse.json({ error: updatePaymentError.message }, { status: 500 })
    }

    if (isSuccessfulPayment(transactionStatus, fraudStatus)) {
      // Only update if not already premium — makes this idempotent for Midtrans retries
      const { error: premiumError } = await admin
        .from('app_users')
        .update({
          is_premium: true,
          premium_since: new Date().toISOString(),
          payment_reference: orderId,
        })
        .eq('id', payment.user_id)
        .eq('is_premium', false)

      if (premiumError) {
        await trackServer('payment_webhook_failed', { reason: 'premium_update_failed' })
        return NextResponse.json({ error: premiumError.message }, { status: 500 })
      }
    }

    await trackServer(isSuccessfulPayment(transactionStatus, fraudStatus) ? 'payment_webhook_paid' : 'payment_webhook_status_updated', {
      provider: 'midtrans',
      payment_status: nextStatus,
      payment_type: paymentType,
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    await trackServer('payment_webhook_failed', { reason: 'exception' })
    captureApiError(error, '/api/payments/midtrans/webhook')
    const message = error instanceof Error ? error.message : 'Webhook failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
