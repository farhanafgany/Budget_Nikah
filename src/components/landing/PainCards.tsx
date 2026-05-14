const PAINS = [
  'Takut overbudget sebelum hari H?',
  'Bingung harus mulai dari mana?',
  'Biaya terus membengkak tanpa kontrol?',
  'Takut persiapan berantakan di hari H?',
]

export function PainCards() {
  return (
    <section className="px-6 md:px-8 py-20 md:py-28 bg-white">
      <div className="max-w-[1080px] mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-2">
          Kamu tidak sendirian
        </p>
        <h2 className="font-extrabold tracking-tight text-[34px] md:text-[42px] text-center text-nikah-text mb-3 leading-tight" style={{ letterSpacing: '-0.02em', textWrap: 'balance' } as React.CSSProperties}>
          Banyak pasangan merasakan <em>hal yang sama</em>
        </h2>
        <p className="text-center text-nikah-muted text-base md:text-lg mb-10 md:mb-12 font-light max-w-lg mx-auto leading-relaxed">
          Perencanaan wedding memang overwhelming — sampai kamu punya angka yang jelas.
        </p>
        <div className="flex flex-col gap-4 md:gap-[22px] max-w-[720px] mx-auto">
          {PAINS.map((text) => (
            <div
              key={text}
              className="bg-nikah-bg border border-nikah-border border-l-4 border-l-nikah-mauve rounded-[26px] px-8 py-7 hover:border-l-nikah-deep hover:translate-x-0.5 transition-all duration-150"
            >
              <p className="text-[18px] font-bold text-nikah-text leading-snug">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
