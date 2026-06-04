'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { clearOnboardingStore } from '@/stores/onboardingStore'
import { firePurchaseConversion } from '@/lib/googleAds'
import { PREMIUM_PRICE } from '@/lib/payment'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  useEffect(() => {
    // Selalu bersihkan localStorage onboarding setelah masuk halaman ini.
    clearOnboardingStore()

    // Hanya fire Google Ads conversion kalau order_id ada di URL
    // (artinya redirect datang dari Midtrans onSuccess, bukan URL diketik manual)
    // dan confirm API memverifikasi bahwa pembayaran benar-benar settled.
    if (!orderId) return

    fetch('/api/payments/midtrans/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId }),
    })
      .then((r) => r.json())
      .then((data: { is_premium?: boolean }) => {
        if (data.is_premium) {
          firePurchaseConversion(PREMIUM_PRICE, orderId)
        }
      })
      .catch(() => null)
  }, [orderId])

  return (
    <main
      className="premium-theme min-h-screen bg-nikah-bg px-4 py-8 flex items-center justify-center"
      style={{
        background: 'var(--landing-bg, var(--nikah-bg))',
      }}
    >
      <section
        className="w-full max-w-[452px] bg-white border border-nikah-border text-center"
        style={{ borderRadius: 24, padding: '40px 32px', boxShadow: '0 12px 40px rgba(90,30,42,0.08)' }}
      >
        <div className="flex justify-center" style={{ marginBottom: 26 }}>
          <BrandLogo size="md" />
        </div>
        <span className="inline-flex items-center justify-center bg-nikah-bg text-nikah-deep" style={{ width: 58, height: 58, borderRadius: 20, marginBottom: 18 }}>
          <CheckCircle2 size={28} strokeWidth={1.8} />
        </span>
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve" style={{ marginBottom: 8 }}>
          Pembayaran berhasil
        </p>
        <h1
          className="text-nikah-text"
          style={{
            fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 36,
            lineHeight: 1.04,
            margin: '0 0 12px',
          }}
        >
          Akses kalian sudah siap.
        </h1>
        <p className="text-nikah-muted font-light" style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 6px' }}>
          Selamat — kalian sudah ambil langkah yang tepat.
        </p>
        <p className="text-nikah-muted font-light" style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>
          Sekarang persiapan bisa berjalan lebih tenang, dari satu tempat, sampai hari H.
        </p>
        <div
          className="border border-nikah-border bg-nikah-bg text-left"
          style={{ borderRadius: 18, padding: '16px 18px', marginBottom: 22 }}
        >
          {[
            'Prioritas terdekat sudah bisa dilihat.',
            'Checklist, vendor, tabungan, dan catatan bisa mulai disimpan.',
            'Kalian bisa kembali kapan saja dengan akun yang sama.',
          ].map(item => (
            <p key={item} className="text-nikah-muted" style={{ fontSize: 13, lineHeight: 1.45, margin: '0 0 8px' }}>
              <span className="font-bold text-nikah-deep">✓</span> {item}
            </p>
          ))}
        </div>
        <Link
          href="/dashboard"
          className="block w-full bg-nikah-deep text-white font-bold rounded-full text-sm text-center hover:opacity-90 transition"
          style={{ padding: '15px 22px' }}
        >
          Masuk ke Dashboard
        </Link>
      </section>
    </main>
  )
}

export default function PremiumSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
