'use client'

import Script from 'next/script'
import * as Sentry from '@sentry/nextjs'
import { useRef, useState } from 'react'
import { track } from '@/lib/analytics'

declare global {
  interface MidtransPaymentResult {
    order_id?: string
  }

  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: MidtransPaymentResult) => void
          onPending?: () => void
          onError?: () => void
          onClose?: () => void
        },
      ) => void
    }
  }
}

interface Props {
  isProduction?: boolean
  loginRedirectHref?: string
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

const PAYMENT_TIMEOUT_MS = 25_000

export function MidtransPaymentButton({ isProduction = false, loginRedirectHref = '/auth/login?next=/premium', className, style, children }: Props) {
  const [loading, setLoading] = useState(false)
  const [scriptReady, setScriptReady] = useState(false)
  const [error, setError] = useState('')

  // Reuse snap token across open/close cycles to avoid duplicate order rows.
  const cachedTokenRef = useRef<{ snapToken: string; orderId: string } | null>(null)

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
  const snapScriptUrl = isProduction
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js'

  async function handlePay() {
    setError('')
    setLoading(true)
    track('premium_payment_clicked', {
      cta_location: 'premium_payment_button',
      target: 'payment',
      is_signed_in: true,
    })
    track('payment_started', { provider: 'midtrans' })
    Sentry.addBreadcrumb({
      category: 'payment',
      message: 'payment_started',
      level: 'info',
    })

    try {
      let snapToken: string
      let orderId: string

      if (cachedTokenRef.current) {
        // Reuse existing token so we don't create another orphan payment row.
        snapToken = cachedTokenRef.current.snapToken
        orderId = cachedTokenRef.current.orderId
      } else {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), PAYMENT_TIMEOUT_MS)

        let response: Response
        try {
          response = await fetch('/api/payments/midtrans/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
          })
        } finally {
          clearTimeout(timeoutId)
        }

        const data = await response.json() as { order_id?: string; snap_token?: string; error?: string; reused?: boolean }

        if (response.status === 401) {
          track('auth_required_for_payment', { source: 'payment_create' })
          window.location.href = loginRedirectHref
          return
        }

        if (!response.ok || !data.snap_token) {
          track('payment_create_failed', { status: response.status })
          throw new Error(data.error || 'Gagal membuat transaksi.')
        }

        snapToken = data.snap_token
        orderId = data.order_id ?? ''
        cachedTokenRef.current = { snapToken, orderId }
        track('payment_create_succeeded', { provider: 'midtrans', reused: Boolean(data.reused) })
      }

      if (!clientKey) {
        throw new Error('Client key Midtrans belum dikonfigurasi.')
      }

      if (!window.snap || !scriptReady) {
        track('payment_snap_not_ready', { provider: 'midtrans' })
        throw new Error('Midtrans Snap belum siap. Tunggu sebentar lalu coba lagi.')
      }

      track('payment_snap_opened', { provider: 'midtrans' })
      Sentry.addBreadcrumb({
        category: 'payment',
        message: 'payment_snap_opened',
        level: 'info',
      })
      window.snap.pay(snapToken, {
        onSuccess: async (result) => {
          cachedTokenRef.current = null
          const finalOrderId = result.order_id ?? orderId
          track('payment_success_callback', { provider: 'midtrans' })

          if (finalOrderId) {
            await fetch('/api/payments/midtrans/confirm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order_id: finalOrderId }),
            }).catch(() => null)
          }

          window.location.replace('/premium/success')
        },
        onPending: () => {
          cachedTokenRef.current = null
          track('payment_pending_callback', { provider: 'midtrans' })
          setLoading(false)
          window.location.replace('/premium')
        },
        onError: () => {
          cachedTokenRef.current = null
          track('payment_error_callback', { provider: 'midtrans' })
          Sentry.addBreadcrumb({
            category: 'payment',
            message: 'payment_error_callback',
            level: 'warning',
          })
          setError('Pembayaran belum berhasil. Silakan coba lagi.')
          setLoading(false)
        },
        onClose: () => {
          track('payment_closed', { provider: 'midtrans' })
          setLoading(false)
        },
      })
    } catch (err) {
      const isTimeout = err instanceof Error && err.name === 'AbortError'
      track('payment_start_failed', {
        provider: 'midtrans',
        reason: isTimeout ? 'timeout' : 'error',
      })
      Sentry.addBreadcrumb({
        category: 'payment',
        message: isTimeout ? 'payment_timeout' : 'payment_start_failed',
        level: 'warning',
      })
      setError(isTimeout
        ? 'Koneksi lambat. Periksa internet kamu, lalu coba lagi.'
        : (err instanceof Error ? err.message : 'Gagal memulai pembayaran.')
      )
      setLoading(false)
    }
  }

  return (
    <>
      {clientKey && (
        <Script
          src={snapScriptUrl}
          data-client-key={clientKey}
          strategy="afterInteractive"
          onReady={() => {
            setScriptReady(true)
            track('payment_snap_script_ready', { provider: 'midtrans' })
          }}
          onLoad={() => {
            setScriptReady(true)
            track('payment_snap_script_ready', { provider: 'midtrans' })
          }}
        />
      )}
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className={className}
        style={style}
      >
        {loading ? 'Membuka pembayaran...' : children ?? 'Dapatkan Akses Sekarang →'}
      </button>
      {error && (
        <p className="text-xs text-red-600" style={{ margin: '10px 0 0' }}>
          {error}
        </p>
      )}
    </>
  )
}
