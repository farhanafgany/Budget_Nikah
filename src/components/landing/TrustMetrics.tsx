const METRICS = [
  {
    value: '50+',
    label: 'checklist nikah',
    desc: 'Urutan kerja dari H-12 bulan sampai minggu terakhir.',
  },
  {
    value: '6',
    label: 'kategori biaya',
    desc: 'Catering, venue, dekor, dokumentasi, MUA, dan pos penting lain.',
  },
  {
    value: '12',
    label: 'bulan timeline',
    desc: 'Membantu pasangan melihat apa yang perlu dibereskan lebih dulu.',
  },
  {
    value: '3',
    label: 'tier kota',
    desc: 'Estimasi menyesuaikan Jakarta, kota besar, dan kota kecil.',
  },
]

export function TrustMetrics() {
  return (
    <section className="px-6 md:px-8 py-14 md:py-24 bg-white">
      <div className="max-w-[1080px] mx-auto">
        <p className="text-center text-xs font-extrabold uppercase tracking-widest text-nikah-mauve mb-3">
          Kenapa BudgetNikah berbeda
        </p>
        <h2
          className="text-[28px] md:text-[44px] text-nikah-text text-center mb-7 md:mb-11 leading-tight"
          style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 500, textWrap: 'balance' } as React.CSSProperties}
        >
          Bukan tebak-tebakan — semua angka punya dasar.
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {METRICS.map(metric => (
            <div
              key={metric.label}
              className="border border-nikah-border rounded-[18px] p-5 md:p-6"
              style={{ background: 'var(--landing-band, var(--nikah-bg))', boxShadow: '0 1px 2px rgba(90,30,42,0.04)' }}
            >
              <div
                className="text-nikah-deep leading-none mb-3"
                style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontSize: 38, fontWeight: 500 }}
              >
                {metric.value}
              </div>
              <h3 className="text-sm font-extrabold text-nikah-text mb-1.5">{metric.label}</h3>
              <p className="text-xs text-nikah-muted leading-relaxed font-light">{metric.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
