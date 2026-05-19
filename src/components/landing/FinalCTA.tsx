import Link from 'next/link'

export function FinalCTA() {
  return (
    <section className="px-6 md:px-8 pt-0 pb-14 md:pb-28 bg-nikah-bg">
      <div
        className="max-w-[540px] mx-auto text-center text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, var(--landing-deep, var(--nikah-deep)) 0%, var(--landing-deep-dark, #3D1419) 100%)',
          borderRadius: 28,
          padding: '44px 34px',
          boxShadow: '0 18px 48px rgba(90,30,42,0.22)',
        }}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute rounded-full bg-white/5" style={{ width: 260, height: 260, top: -120, right: -100 }} aria-hidden="true" />
        <div className="pointer-events-none absolute rounded-full bg-white/5" style={{ width: 200, height: 200, bottom: -80, left: -80 }} aria-hidden="true" />

        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-nikah-pink mb-3" style={{ letterSpacing: '0.18em' }}>
            Gratis · Tanpa Daftar
          </p>
          <h2
            className="text-white leading-snug mb-3"
            className="text-[28px] md:text-[36px]"
            style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 500, lineHeight: 1.08, textWrap: 'balance' } as React.CSSProperties}
          >
            Mulai Cek Wedding Plan Kamu
          </h2>
          <p className="font-light mb-6 leading-relaxed" style={{ color: 'rgba(232,192,204,0.85)', fontSize: 15 }}>
            Selesai dalam 2 menit, tanpa login. Gratis.
          </p>
          <Link
            href="/onboarding"
            className="block w-full text-nikah-deep font-extrabold rounded-full text-center transition-colors hover:bg-nikah-pink"
            style={{
              background: '#fff',
              padding: '18px',
              fontSize: 15,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}
          >
            Mulai Sekarang →
          </Link>
        </div>
      </div>
    </section>
  )
}
