const STEPS = [
  {
    number: '1',
    title: 'Isi profil wedding',
    description: 'Input nama, kota, tanggal, budget, dan jumlah tamu. Selesai dalam 2 menit.',
  },
  {
    number: '2',
    title: 'Lihat hasil analisis',
    description: 'Dapatkan Wedding Readiness Score dan alokasi budget riil per kategori dalam Rupiah.',
  },
  {
    number: '3',
    title: 'Rencanakan bersama',
    description: 'Gunakan Checklist, Tabungan Nikah, dan Seserahan untuk tetap on track sampai hari H.',
  },
]

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="px-6 md:px-8 py-20 md:py-28 bg-nikah-bg">
      <div className="max-w-[1080px] mx-auto">
        <p className="text-xs font-extrabold uppercase tracking-widest text-nikah-mauve text-center mb-3" style={{ letterSpacing: '0.16em' }}>
          Cara Kerja
        </p>
        <h2
          className="text-[34px] md:text-[44px] text-nikah-text text-center mb-11 leading-tight"
          style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 500, letterSpacing: '-0.02em' } as React.CSSProperties}
        >
          Mulai dalam <em>3 langkah</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-[860px] mx-auto">
          {STEPS.map(step => (
            <div
              key={step.number}
              className="bg-white border border-nikah-border rounded-[20px]"
              style={{ padding: '32px 30px', boxShadow: '0 4px 16px rgba(90,30,42,0.035)' }}
            >
              <div
                className="text-nikah-mauve mb-5"
                style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 600, fontSize: 32, lineHeight: 1 }}
              >
                {step.number}.
              </div>
              <h3 className="text-base font-extrabold text-nikah-text mb-2">{step.title}</h3>
              <p className="text-sm text-nikah-muted font-light leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
