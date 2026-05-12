const PAINS = [
  { icon: '😰', text: 'Takut overbudget sebelum hari H?' },
  { icon: '😵', text: 'Bingung harus mulai dari mana?' },
  { icon: '💸', text: 'Biaya terus membengkak tanpa kontrol?' },
  { icon: '😟', text: 'Takut persiapan berantakan di hari H?' },
]

export function PainCards() {
  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-2">
          Kamu tidak sendirian
        </p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-nikah-text mb-2">
          Banyak pasangan merasakan hal yang sama
        </h2>
        <p className="text-center text-nikah-muted text-sm md:text-base mb-10 font-light">
          Perencanaan wedding memang overwhelming — sampai kamu punya angka yang jelas.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {PAINS.map((p) => (
            <div
              key={p.text}
              className="bg-nikah-bg border border-nikah-border rounded-2xl p-5 flex flex-col items-center gap-3 text-center hover:shadow-md hover:border-[#E8C0CC] transition-all"
            >
              <span className="text-3xl" aria-hidden="true">{p.icon}</span>
              <p className="text-sm md:text-base font-medium text-nikah-text leading-snug">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
