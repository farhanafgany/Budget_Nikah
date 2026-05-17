'use client'

import Script from 'next/script'
import { useState } from 'react'

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

export function MidtransPaymentButton({ isProduction = false, loginRedirectHref = '/auth/login?next=/premium', className, style, children }: Props) {
  const [loading, setLoading] = useState(false)
  const [scriptReady, setScriptReady] = useState(false)
  const [error, setError] = useState('')

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
  const snapScriptUrl = isProduction
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js'

  async function handlePay() {
    setError('')

    setLoading(true)

    try {
      const response = await fetch('/api/payments/midtrans/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json() as { order_id?: string; snap_token?: string; error?: string }

      if (response.status === 401) {
        window.location.href = loginRedirectHref
        return
      }

      if (!response.ok || !data.snap_token) {
        throw new Error(data.error || 'Gagal membuat transaksi.')
      }

      if (!clientKey) {
        throw new Error('Client key Midtrans belum dikonfigurasi.')
      }

      if (!window.snap || !scriptReady) {
        throw new Error('Midtrans Snap belum siap. Tunggu sebentar lalu coba lagi.')
      }

      window.snap.pay(data.snap_token, {
        onSuccess: async (result) => {
          const orderId = result.order_id ?? data.order_id

          if (orderId) {
            await fetch('/api/payments/midtrans/confirm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order_id: orderId }),
            }).catch(() => null)
          }

          window.location.replace('/premium/success')
        },
        onPending: () => window.location.replace('/premium'),
        onError: () => {
          setError('Pembayaran belum berhasil. Silakan coba lagi.')
          setLoading(false)
        },
        onClose: () => setLoading(false),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memulai pembayaran.')
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
          onReady={() => setScriptReady(true)}
          onLoad={() => setScriptReady(true)}
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
