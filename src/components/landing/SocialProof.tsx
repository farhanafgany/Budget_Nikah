import Link from 'next/link'

export function SocialProof() {
  return (
    <section className="px-6 md:px-8 py-14 md:py-28 bg-white">
      <div className="max-w-[660px] mx-auto text-center">
        <p className="text-xs font-extrabold uppercase tracking-widest text-nikah-mauve mb-3" style={{ letterSpacing: '0.16em' }}>
          Dibangun untuk konteks Indonesia
        </p>
        <h2
          className="text-[34px] md:text-[44px] text-nikah-text mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 500, letterSpacing: '-0.02em' } as React.CSSProperties}
        >
          Bukan spreadsheet kering, bukan app generik.
        </h2>
        <p className="text-[17px] text-nikah-muted font-light leading-relaxed" style={{ maxWidth: 520, margin: '0 auto 12px' }}>
          Scoring menyesuaikan kota, budget, dan jumlah tamu — karena wedding di Jakarta dan di Yogyakarta tidak bisa pakai rumus yang sama.
        </p>
        <p className="text-[17px] text-nikah-muted font-light leading-relaxed" style={{ maxWidth: 520, margin: '0 auto 32px' }}>
          Hasilnya bukan angka abstrak — tapi rencana yang bisa langsung dijalankan.
        </p>
        <p className="text-xs text-nikah-muted font-light mb-8" style={{ letterSpacing: '0.04em' }}>
          3 hari tanpa pertanyaan · Bayar sekali, selamanya · Tanpa langganan
        </p>
        <Link
          href="/onboarding"
          className="flex w-full md:w-auto md:inline-flex items-center justify-center bg-nikah-deep text-white font-extrabold rounded-full text-sm transition-colors active:scale-95 hover:opacity-90"
          style={{ padding: '16px 32px' }}
        >
          Coba Gratis Dulu →
        </Link>
      </div>
    </section>
  )
}
