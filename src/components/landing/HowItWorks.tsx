const STEPS = [
  {
    number: '1',
    title: 'Isi profil wedding',
    description: 'Input nama, kota, tanggal, budget, dan jumlah tamu. Selesai dalam 2 menit.',
    badge: 'free' as const,
  },
  {
    number: '2',
    title: 'Lihat hasil analisis',
    description: 'Dapatkan Wedding Readiness Score dan alokasi budget riil per kategori dalam Rupiah.',
    badge: 'free' as const,
  },
  {
    number: '3',
    title: 'Rencanakan sampai hari H',
    description: 'Buka dashboard lengkap: Checklist 50+ item, Tabungan Nikah, dan Vendor Tracker untuk tetap on track sampai hari H.',
    badge: 'premium' as const,
  },
]

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="px-6 md:px-8 py-14 md:py-28 bg-nikah-bg">
      <div className="max-w-[1080px] mx-auto">
        <p className="text-xs font-extrabold uppercase tracking-widest text-nikah-mauve text-center mb-3" style={{ letterSpacing: '0.16em' }}>
          Cara Kerja
        </p>
        <h2
          className="text-[28px] md:text-[44px] text-nikah-text text-center mb-8 md:mb-11 leading-tight"
          style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontWeight: 600, letterSpacing: '-0.02em' } as React.CSSProperties}
        >
          Mulai dalam <em>3 langkah</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-[860px] mx-auto">
          {STEPS.map(step => (
            <div
              key={step.number}
              className="bg-white border border-nikah-border rounded-[20px] px-5 py-5 md:px-[30px] md:py-8"
              style={{ boxShadow: '0 4px 16px rgba(90,30,42,0.035)' }}
            >
              <div
                className="text-nikah-mauve mb-5"
                style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 600, fontSize: 32, lineHeight: 1 }}
              >
                {step.number}.
              </div>
              <h3 className="text-base font-extrabold text-nikah-text mb-2">{step.title}</h3>
              <p className="text-sm text-nikah-muted font-light leading-relaxed">{step.description}</p>
              {step.badge === 'free' && (
                <span
                  className="inline-flex items-center gap-1 mt-3 text-[10px] font-extrabold uppercase tracking-wide rounded-full px-2.5 py-1"
                  style={{ background: '#EEF7EE', border: '1px solid #C8E6C9', color: '#2F7A3F' }}
                >
                  ✓ Gratis
                </span>
              )}
              {step.badge === 'premium' && (
                <span
                  className="inline-flex items-center gap-1 mt-3 text-[10px] font-extrabold uppercase tracking-wide rounded-full px-2.5 py-1"
                  style={{ background: '#FBF2EC', border: '1px solid #E8D0C0', color: '#8B4513' }}
                >
                  🔓 Fitur Premium · Rp 149rb
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
