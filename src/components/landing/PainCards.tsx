const PAINS = [
  {
    q: 'Takut overbudget sebelum hari H?',
    note: 'Tanpa angka yang jelas, setiap pengeluaran terasa mencekam.',
  },
  {
    q: 'Bingung harus mulai dari mana?',
    note: 'Semua terasa urgent — padahal ada urutan yang masuk akal.',
  },
  {
    q: 'Biaya vendor terus membengkak tanpa kontrol?',
    note: 'DP satu, lunas dua, tiba-tiba saldo terkuras.',
  },
  {
    q: 'Takut ada yang kelewat di hari H?',
    note: 'Checklist di kepala mudah hilang, checklist di apps lebih tenang.',
  },
]

export function PainCards() {
  return (
    <section className="px-6 md:px-8 py-14 md:py-28 bg-white">
      <div className="max-w-[1080px] mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-2">
          Kamu tidak sendirian
        </p>
        <h2
          className="font-extrabold tracking-tight text-[28px] md:text-[42px] text-center text-nikah-text mb-3 leading-tight"
          style={{ letterSpacing: '-0.02em', textWrap: 'balance' } as React.CSSProperties}
        >
          Banyak pasangan merasakan <em>hal yang sama</em>
        </h2>
        <p className="text-center text-nikah-muted text-base md:text-lg mb-7 md:mb-12 font-light max-w-lg mx-auto leading-relaxed">
          Perencanaan wedding memang overwhelming — sampai kamu punya angka yang jelas.
        </p>
        <div className="flex flex-col gap-4 md:gap-[18px] max-w-[720px] mx-auto">
          {PAINS.map((item) => (
            <div
              key={item.q}
              className="bg-nikah-bg border border-nikah-border border-l-4 border-l-nikah-mauve rounded-[20px] px-7 py-6 hover:border-l-nikah-deep hover:translate-x-0.5 transition-all duration-150"
            >
              <p className="text-[17px] font-bold text-nikah-text leading-snug mb-1">{item.q}</p>
              <p className="text-sm text-nikah-muted font-light leading-relaxed">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
