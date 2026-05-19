import Link from 'next/link'

const FEATURES = [
  {
    tier: 'free' as const,
    title: 'Wedding Readiness Score',
    desc: 'Skor deterministik 0–100 yang menjelaskan kenapa segitu — bukan angka random.',
  },
  {
    tier: 'paid' as const,
    title: 'Prioritas Sekarang',
    desc: 'Gabungan deadline vendor dan checklist terdekat, jadi kamu tahu harus mulai dari mana.',
  },
  {
    tier: 'paid' as const,
    title: 'Pembayaran Vendor',
    desc: 'Pantau DP, sisa bayar, dan deadline pelunasan dalam satu tempat.',
  },
  {
    tier: 'paid' as const,
    title: 'Target Nabung Bulanan',
    desc: 'Tahu nominal yang perlu disiapkan tiap bulan agar siap di hari H.',
  },
  {
    tier: 'paid' as const,
    title: 'Checklist + Catatan',
    desc: 'Timeline 50+ item dan tempat mencatat keputusan penting.',
  },
  {
    tier: 'paid' as const,
    title: 'Seserahan Custom',
    desc: 'Atur daftar seserahan sesuai kebutuhan dan kebiasaan keluarga kalian.',
  },
]

export function FeatureShowcase() {
  return (
    <section id="fitur" className="px-6 md:px-8 py-14 md:py-28 bg-white">
      <div className="max-w-[1080px] mx-auto">
        <p className="text-xs font-extrabold uppercase tracking-widest text-nikah-mauve text-center mb-3">
          Semua dalam satu tempat
        </p>
        <h2
          className="text-[26px] md:text-[44px] text-nikah-text text-center mb-7 md:mb-11 leading-tight"
          style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 500, textWrap: 'balance' } as React.CSSProperties}
        >
          Dari cek awal sampai rencana yang bisa dijalankan.
        </h2>

        <div className="-mx-6 lg:mx-0">
          <div
            className="flex flex-nowrap gap-3 overflow-x-auto px-6 pb-3 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
          >
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="flex-shrink-0 w-[72vw] snap-start lg:w-auto bg-white border border-nikah-border rounded-[18px] hover:-translate-y-0.5 transition-all duration-200 p-4 md:p-6"
              style={{ boxShadow: '0 1px 2px rgba(90,30,42,0.035)' }}
            >
              {f.tier === 'free' ? (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide mb-4"
                  style={{ background: '#EEF7EE', border: '1px solid #C8E6C9', color: '#2F7A3F' }}
                >
                  ✓ Gratis
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide mb-4"
                  style={{ background: 'var(--landing-pink, #FBECEF)', border: '1px solid #E8D0C0', color: '#7D3F5A' }}
                >
                  Premium
                </span>
              )}
              <h3 className="text-base font-extrabold text-nikah-text mb-2">{f.title}</h3>
              <p className="text-sm text-nikah-muted leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
          </div>
        </div>

        <p className="text-center mt-10 text-sm text-nikah-muted font-light">
          Mulai dari Wedding Readiness Score yang bisa{' '}
          <Link href="/onboarding" className="font-semibold text-nikah-deep hover:underline">
            dicoba sekarang
          </Link>
          {' '}— gratis, tanpa daftar.
        </p>
      </div>
    </section>
  )
}
