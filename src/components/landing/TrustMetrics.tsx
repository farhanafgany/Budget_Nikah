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

const CARD_BG = 'linear-gradient(145deg, #FEF5F7 0%, #F3DDE5 100%)'
const CARD_BORDER = '#E8C4CE'
const CARD_NUM_COLOR = '#8B3A52'

export function TrustMetrics() {
  return (
    <section className="px-6 md:px-8 py-14 md:py-24 bg-white">
      <div className="max-w-[1080px] mx-auto">
        <p className="text-center text-xs font-extrabold uppercase tracking-widest text-nikah-mauve mb-3">
          Cara kerja yang transparan
        </p>
        <h2
          className="text-[28px] md:text-[44px] text-nikah-text text-center mb-7 md:mb-11 leading-tight"
          style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 500, textWrap: 'balance' } as React.CSSProperties}
        >
          Bukan tebak-tebakan — semua angka punya dasar.
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
          {METRICS.map(metric => (
            <div
              key={metric.label}
              className="rounded-[18px] p-4 lg:p-6"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, boxShadow: '0 2px 8px rgba(90,30,42,0.06)' }}
            >
              <div
                className="leading-none mb-3"
                style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontSize: 34, fontWeight: 500, color: CARD_NUM_COLOR }}
              >
                {metric.value}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-nikah-text mb-1">{metric.label}</h3>
                <p className="text-xs text-nikah-muted leading-relaxed font-light">{metric.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
