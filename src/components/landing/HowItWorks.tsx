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
    <section className="px-6 py-16 bg-white">
      <div className="max-w-md mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve text-center mb-2">
          Cara Kerja
        </p>
        <h2 className="text-2xl font-extrabold text-nikah-text text-center mb-10">
          Mulai dalam 3 langkah
        </h2>
        <div className="space-y-6">
          {STEPS.map(step => (
            <div key={step.number} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F5E8EC] to-[#EDD6DE] flex-shrink-0 flex items-center justify-center">
                <span className="text-base font-extrabold text-nikah-deep">{step.number}</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-nikah-text mb-1">{step.title}</h3>
                <p className="text-sm text-nikah-muted font-light leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
