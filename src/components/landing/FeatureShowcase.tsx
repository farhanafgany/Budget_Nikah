const FEATURES = [
  {
    eyebrow: 'Fitur Utama',
    title: 'Wedding Readiness Score',
    desc: 'Skor deterministik 0–100 yang menjelaskan kenapa segitu — bukan angka random.',
  },
  {
    eyebrow: 'Dashboard Paid',
    title: 'Prioritas Sekarang',
    desc: 'Gabungan deadline vendor dan checklist terdekat, jadi kamu tahu harus mulai dari mana.',
  },
  {
    eyebrow: 'Vendor',
    title: 'Pembayaran Vendor',
    desc: 'Pantau DP, sisa bayar, dan deadline pelunasan dalam satu tempat.',
  },
  {
    eyebrow: 'Tabungan',
    title: 'Target Nabung Bulanan',
    desc: 'Tahu nominal yang perlu disiapkan tiap bulan agar siap di hari H.',
  },
  {
    eyebrow: 'Checklist',
    title: 'Checklist + Catatan',
    desc: 'Timeline 50+ item dan tempat mencatat keputusan penting.',
  },
  {
    eyebrow: 'Seserahan',
    title: 'Seserahan Custom',
    desc: 'Atur daftar seserahan sesuai kebutuhan dan kebiasaan keluarga kalian.',
  },
]

export function FeatureShowcase() {
  return (
    <section id="fitur" className="px-6 md:px-8 py-20 md:py-28 bg-white">
      <div className="max-w-[1080px] mx-auto">
        <p className="text-xs font-extrabold uppercase tracking-widest text-nikah-mauve text-center mb-3">
          Semua dalam satu tempat
        </p>
        <h2
          className="text-[34px] md:text-[44px] text-nikah-text text-center mb-11 leading-tight"
          style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 500, textWrap: 'balance' } as React.CSSProperties}
        >
          Yang <em>kamu dapat</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="bg-white border border-nikah-border rounded-[18px] hover:-translate-y-0.5 transition-all duration-200"
              style={{ padding: '26px 24px', boxShadow: '0 1px 2px rgba(90,30,42,0.035)' }}
            >
              <p className="inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-nikah-mauve mb-5" style={{ background: 'var(--landing-pink, #FBECEF)' }}>
                {f.eyebrow}
              </p>
              <h3 className="text-base font-extrabold text-nikah-text mb-2">{f.title}</h3>
              <p className="text-sm text-nikah-muted leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
