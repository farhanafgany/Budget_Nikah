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
    <section id="cara-kerja" className="px-6 py-20 bg-white">
      <div className="max-w-xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve text-center mb-2">
          Cara Kerja
        </p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-nikah-text text-center mb-12">
          Mulai dalam 3 langkah
        </h2>
        <div className="space-y-8">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex gap-5 items-start">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F5E8EC] to-[#EDD6DE] flex items-center justify-center shadow-sm border border-[#E8C0CC]">
                  <span className="text-lg font-extrabold text-nikah-deep">{step.number}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px h-8 bg-gradient-to-b from-[#E8C0CC] to-transparent mt-2" aria-hidden="true" />
                )}
              </div>
              <div className="pt-2">
                <h3 className="text-base md:text-lg font-bold text-nikah-text mb-1">{step.title}</h3>
                <p className="text-sm md:text-base text-nikah-muted font-light leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
