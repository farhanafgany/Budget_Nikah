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
        <h2 className="font-extrabold tracking-tight text-3xl md:text-4xl text-center text-nikah-text mb-2">
          Banyak pasangan merasakan hal yang sama
        </h2>
        <p className="text-center text-nikah-muted text-sm md:text-base mb-10 font-light">
          Perencanaan wedding memang overwhelming — sampai kamu punya angka yang jelas.
        </p>
        <div className="flex flex-col gap-3">
          {PAINS.map((p) => (
            <div
              key={p.text}
              className="bg-nikah-bg border border-nikah-border rounded-2xl px-6 py-4 flex items-center gap-4 hover:shadow-[0_4px_24px_rgba(107,53,69,0.12)] hover:border-nikah-mauve/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="text-3xl flex-shrink-0" aria-hidden="true">{p.icon}</span>
              <p className="text-base md:text-lg font-semibold text-nikah-text leading-snug">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
