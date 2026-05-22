import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit } from '@/lib/rateLimit'
import { trackServer } from '@/lib/analytics'
import { captureApiError } from '@/lib/sentry'
import {
  getMidtransApiBaseUrl,
  getMidtransBasicAuthHeader,
} from '@/lib/midtrans'

export const runtime = 'nodejs'

interface MidtransStatusResponse {
  order_id?: string
  gross_amount?: string
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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    await trackServer('payment_confirm_failed', { reason: 'unauthenticated' })
    return NextResponse.json({ error: 'Login diperlukan sebelum konfirmasi pembayaran.' }, { status: 401 })
  }

  const limited = await checkRateLimit(request, {
    key: 'payment:confirm',
    limit: 10,
    window: '10 m',
    identifier: user.id,
  })
  if (limited) return limited

  let body: { order_id?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  if (!body.order_id) {
    await trackServer('payment_confirm_failed', { reason: 'missing_order_id' })
    return NextResponse.json({ error: 'order_id diperlukan.' }, { status: 400 })
  }

  try {
    const admin = createAdminClient()
    const { data: payment, error: paymentError } = await admin
      .from('payments')
      .select('user_id, amount')
      .eq('order_id', body.order_id)
      .eq('user_id', user.id)
      .single()

    if (paymentError || !payment) {
      await trackServer('payment_confirm_failed', { reason: 'order_not_found' })
      return NextResponse.json({ error: 'Payment order tidak ditemukan.' }, { status: 404 })
    }

    const statusResponse = await fetch(`${getMidtransApiBaseUrl()}/${encodeURIComponent(body.order_id)}/status`, {
      headers: {
        Authorization: getMidtransBasicAuthHeader(),
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!statusResponse.ok) {
      await trackServer('payment_confirm_failed', { reason: 'midtrans_status_failed', status: statusResponse.status })
      return NextResponse.json({ error: 'Gagal memverifikasi status Midtrans.' }, { status: 502 })
    }

    const verified = await statusResponse.json() as MidtransStatusResponse
    const verifiedGrossAmount = Number(verified.gross_amount)

    if (Number.isFinite(verifiedGrossAmount) && Math.round(verifiedGrossAmount) !== payment.amount) {
      await trackServer('payment_confirm_failed', { reason: 'amount_mismatch' })
      return NextResponse.json({ error: 'Nominal pembayaran tidak sesuai.' }, { status: 400 })
    }

    const transactionStatus = verified.transaction_status
    const fraudStatus = verified.fraud_status
    const nextStatus = isSuccessfulPayment(transactionStatus, fraudStatus)
      ? 'paid'
      : transactionStatus ?? 'pending'

    const { error: updatePaymentError } = await admin
      .from('payments')
      .update({
        status: nextStatus,
        transaction_status: transactionStatus,
        fraud_status: fraudStatus,
        payment_type: verified.payment_type,
        transaction_id: verified.transaction_id,
        raw_notification: verified,
      })
      .eq('order_id', body.order_id)

    if (updatePaymentError) {
      await trackServer('payment_confirm_failed', { reason: 'payment_update_failed' })
      return NextResponse.json({ error: updatePaymentError.message }, { status: 500 })
    }

    if (isSuccessfulPayment(transactionStatus, fraudStatus)) {
      const { error: premiumError } = await admin
        .from('app_users')
        .update({
          is_premium: true,
          premium_since: new Date().toISOString(),
          payment_reference: body.order_id,
        })
        .eq('id', user.id)

      if (premiumError) {
        await trackServer('payment_confirm_failed', { reason: 'premium_update_failed' })
        return NextResponse.json({ error: premiumError.message }, { status: 500 })
      }
    }

    await trackServer('payment_confirm_succeeded', {
      provider: 'midtrans',
      payment_status: nextStatus,
      is_premium: isSuccessfulPayment(transactionStatus, fraudStatus),
    })
    return NextResponse.json({
      ok: true,
      status: nextStatus,
      is_premium: isSuccessfulPayment(transactionStatus, fraudStatus),
    })
  } catch (error) {
    await trackServer('payment_confirm_failed', { reason: 'exception' })
    captureApiError(error, '/api/payments/midtrans/confirm')
    const message = error instanceof Error ? error.message : 'Konfirmasi pembayaran gagal.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
