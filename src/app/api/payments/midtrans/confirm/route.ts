import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
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
    return NextResponse.json({ error: 'Login diperlukan sebelum konfirmasi pembayaran.' }, { status: 401 })
  }

  let body: { order_id?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  if (!body.order_id) {
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
      return NextResponse.json({ error: 'Gagal memverifikasi status Midtrans.' }, { status: 502 })
    }

    const verified = await statusResponse.json() as MidtransStatusResponse
    const verifiedGrossAmount = Number(verified.gross_amount)

    if (Number.isFinite(verifiedGrossAmount) && Math.round(verifiedGrossAmount) !== payment.amount) {
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
        return NextResponse.json({ error: premiumError.message }, { status: 500 })
      }
    }

    return NextResponse.json({
      ok: true,
      status: nextStatus,
      is_premium: isSuccessfulPayment(transactionStatus, fraudStatus),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Konfirmasi pembayaran gagal.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
