const PAINS = [
  { icon: '😰', text: 'Takut overbudget sebelum hari H' },
  { icon: '😵', text: 'Bingung harus mulai dari mana' },
  { icon: '🤯', text: 'Terlalu banyak keputusan sekaligus' },
  { icon: '💸', text: 'Biaya terus membengkak tanpa kontrol' },
  { icon: '😟', text: 'Takut persiapan berantakan di hari H' },
  { icon: '😓', text: 'Keluarga punya ekspektasi berbeda-beda' },
]

export function PainCards() {
  return (
    <section className="px-6 py-16 bg-white">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-2">
        Kamu tidak sendirian
      </p>
      <h2 className="text-2xl font-extrabold text-center text-nikah-text mb-8">
        Banyak pasangan merasakan hal yang sama
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
        {PAINS.map((p) => (
          <div
            key={p.text}
            className="bg-nikah-bg border border-nikah-border rounded-2xl p-4 flex flex-col items-center gap-2 text-center"
          >
            <span className="text-2xl">{p.icon}</span>
            <p className="text-xs font-medium text-nikah-text leading-snug">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
