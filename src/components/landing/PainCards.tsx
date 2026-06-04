import Link from 'next/link'

const PAINS = [
  {
    q: 'Takut overbudget sebelum hari H?',
    note: 'Tanpa angka yang jelas, setiap pengeluaran terasa berat.',
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

const MOBILE_PAINS = PAINS.slice(0, 3)

export function PainCards() {
  return (
    <section data-landing-section="pain-cards" className="px-6 md:px-8 py-14 md:py-28 bg-white">
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

        <div className="flex flex-col gap-3 md:hidden max-w-[720px] mx-auto">
          {MOBILE_PAINS.map((item) => (
            <div
              key={item.q}
              data-landing-card="pain"
              className="bg-nikah-bg border border-nikah-border"
              style={{ padding: '16px 18px' }}
            >
              <p className="font-bold text-nikah-text leading-snug mb-1" style={{ fontSize: 15 }}>{item.q}</p>
              <p className="text-nikah-muted font-light leading-relaxed" style={{ fontSize: 13.5 }}>{item.note}</p>
            </div>
          ))}
        </div>

        <div className="hidden flex-col gap-4 md:flex md:gap-[18px] max-w-[720px] mx-auto">
          {PAINS.map((item) => (
            <div
              key={item.q}
              data-landing-card="pain"
              className="bg-nikah-bg border border-nikah-border border-l-4 border-l-nikah-mauve rounded-[20px] hover:border-l-nikah-deep hover:translate-x-0.5 transition-all duration-150"
              style={{ padding: '18px 20px' }}
            >
              <p className="font-bold text-nikah-text leading-snug mb-1.5" style={{ fontSize: 16 }}>{item.q}</p>
              <p className="text-nikah-muted font-light leading-relaxed" style={{ fontSize: 14 }}>{item.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 md:mt-8 text-center max-w-[720px] mx-auto">
          <Link
            href="/onboarding"
            data-landing-cta="free-block"
            className="inline-flex items-center justify-center bg-nikah-deep text-white font-extrabold rounded-full text-sm transition-colors hover:opacity-90 active:scale-95"
            style={{ padding: '16px 32px' }}
          >
            Mulai simulasi gratis →
          </Link>
          <p className="mt-3 text-xs text-nikah-muted font-light">Tanpa daftar · Selesai 2 menit</p>
        </div>
      </div>
    </section>
  )
}
