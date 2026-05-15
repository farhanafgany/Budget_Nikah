import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  getMidtransBasicAuthHeader,
  getMidtransSnapBaseUrl,
} from '@/lib/midtrans'
import { PAYMENT_CURRENCY, PREMIUM_PRICE, PREMIUM_PRODUCT_NAME } from '@/lib/payment'

export const runtime = 'nodejs'

interface SnapResponse {
  token?: string
  redirect_url?: string
  error_messages?: string[]
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Login diperlukan sebelum pembayaran.' }, { status: 401 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!appUrl) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_APP_URL belum dikonfigurasi.' }, { status: 500 })
  }

  try {
    const admin = createAdminClient()
    const orderId = `BN-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
    const amount = PREMIUM_PRICE

    const { error: insertError } = await admin.from('payments').insert({
      user_id: user.id,
      order_id: orderId,
      amount,
      currency: PAYMENT_CURRENCY,
      product_name: PREMIUM_PRODUCT_NAME,
      status: 'pending',
    })

    if (insertError) {
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
        finish: `${appUrl}/dashboard`,
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

    return NextResponse.json({
      order_id: orderId,
      snap_token: snap.token,
      redirect_url: snap.redirect_url,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal membuat transaksi.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
