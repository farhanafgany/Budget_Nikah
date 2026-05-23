import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit } from '@/lib/rateLimit'
import { trackServer } from '@/lib/analytics'
import { captureApiError } from '@/lib/sentry'
import {
  getMidtransBasicAuthHeader,
  getMidtransSnapBaseUrl,
} from '@/lib/midtrans'
import { PAYMENT_CURRENCY, PREMIUM_PRODUCT_NAME, getPremiumPaymentAmount } from '@/lib/payment'

export const runtime = 'nodejs'

const PENDING_PAYMENT_REUSE_WINDOW_MS = 24 * 60 * 60 * 1000

interface SnapResponse {
  token?: string
  redirect_url?: string
  error_messages?: string[]
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    await trackServer('payment_create_failed', { reason: 'unauthenticated' })
    return NextResponse.json({ error: 'Login diperlukan sebelum pembayaran.' }, { status: 401 })
  }

  const limited = await checkRateLimit(request, {
    key: 'payment:create',
    limit: 5,
    window: '10 m',
    identifier: user.id,
  })
  if (limited) return limited

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!appUrl) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_APP_URL belum dikonfigurasi.' }, { status: 500 })
  }

  try {
    await trackServer('payment_create_requested', { provider: 'midtrans' })
    const admin = createAdminClient()
    const amount = getPremiumPaymentAmount()
    const reusablePaymentCreatedAfter = new Date(Date.now() - PENDING_PAYMENT_REUSE_WINDOW_MS).toISOString()

    const { data: reusablePayment, error: reusablePaymentError } = await admin
      .from('payments')
      .select('order_id, snap_token, redirect_url')
      .eq('user_id', user.id)
      .eq('amount', amount)
      .eq('currency', PAYMENT_CURRENCY)
      .eq('product_name', PREMIUM_PRODUCT_NAME)
      .eq('status', 'pending')
      .not('snap_token', 'is', null)
      .gte('created_at', reusablePaymentCreatedAfter)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (reusablePaymentError) {
      await trackServer('payment_create_failed', { reason: 'pending_lookup_failed' })
      return NextResponse.json({ error: reusablePaymentError.message }, { status: 500 })
    }

    if (reusablePayment?.snap_token) {
      await trackServer('payment_create_reused', { provider: 'midtrans' })
      return NextResponse.json({
        order_id: reusablePayment.order_id,
        snap_token: reusablePayment.snap_token,
        redirect_url: reusablePayment.redirect_url,
        reused: true,
      })
    }

    const orderId = `BN-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`

    const { error: insertError } = await admin.from('payments').insert({
      user_id: user.id,
      order_id: orderId,
      amount,
      currency: PAYMENT_CURRENCY,
      product_name: PREMIUM_PRODUCT_NAME,
      status: 'pending',
    })

    if (insertError) {
      await trackServer('payment_create_failed', { reason: 'insert_failed' })
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    const snapPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      item_details: [
        {
          id: 'budgetnikah-premium',
          price: amount,
          quantity: 1,
          name: PREMIUM_PRODUCT_NAME,
        },
      ],
      customer_details: {
        email: user.email,
      },
      callbacks: {
        finish: `${appUrl}/premium/success`,
      },
    }

    const response = await fetch(`${getMidtransSnapBaseUrl()}/transactions`, {
      method: 'POST',
      headers: {
        Authorization: getMidtransBasicAuthHeader(),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(snapPayload),
    })

    const snap = await response.json() as SnapResponse

    if (!response.ok || !snap.token) {
      await admin
        .from('payments')
        .update({
          status: 'create_failed',
          raw_notification: snap,
        })
        .eq('order_id', orderId)

      await trackServer('payment_create_failed', {
        provider: 'midtrans',
        status: response.status,
      })
      return NextResponse.json({
        error: snap.error_messages?.join(', ') || 'Gagal membuat transaksi Midtrans.',
      }, { status: 502 })
    }

    await admin
      .from('payments')
      .update({
        snap_token: snap.token,
        redirect_url: snap.redirect_url,
      })
      .eq('order_id', orderId)

    await trackServer('payment_create_succeeded', { provider: 'midtrans' })
    return NextResponse.json({
      order_id: orderId,
      snap_token: snap.token,
      redirect_url: snap.redirect_url,
    })
  } catch (error) {
    await trackServer('payment_create_failed', { reason: 'exception' })
    captureApiError(error, '/api/payments/midtrans/create')
    const message = error instanceof Error ? error.message : 'Gagal membuat transaksi.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
