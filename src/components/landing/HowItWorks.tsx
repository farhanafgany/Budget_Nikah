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
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve text-center mb-2" style={{ letterSpacing: '0.16em' }}>
          Cara Kerja
        </p>
        <h2 className="font-extrabold tracking-tight text-[34px] md:text-[42px] text-nikah-text text-center mb-12 leading-tight" style={{ letterSpacing: '-0.02em' } as React.CSSProperties}>
          Mulai dalam <em>3 langkah</em>
        </h2>

        <div className="max-w-[660px] mx-auto">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex gap-5 items-start">
              {/* Left column: circle + connector */}
              <div className={`flex flex-col items-center flex-shrink-0 self-stretch ${i < STEPS.length - 1 ? '' : ''}`}>
                <div
                  className="rounded-full bg-gradient-to-br from-[#F5E8EC] to-[#EDD6DE] flex items-center justify-center border border-[#E8C0CC] flex-shrink-0"
                  style={{ width: 52, height: 52 }}
                >
                  <span
                    className="text-nikah-deep"
                    style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontWeight: 600, fontSize: 22 }}
                  >
                    {step.number}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 mt-2"
                    style={{ width: 2, background: 'linear-gradient(180deg, #E8C0CC, transparent)', minHeight: 24 }}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Right column: text */}
              <div className={`pt-2 ${i < STEPS.length - 1 ? 'pb-8' : ''}`}>
                <h3 className="text-lg md:text-xl font-bold text-nikah-text mb-1">{step.title}</h3>
                <p className="text-base md:text-lg text-nikah-muted font-light leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
