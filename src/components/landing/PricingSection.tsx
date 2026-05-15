const WHAT_YOU_GET = [
  { label: 'Tahu prioritas yang harus dibereskan dulu', note: 'tugas dan deadline paling dekat' },
  { label: 'Tidak lupa DP dan pelunasan vendor',        note: 'sisa bayar dan jatuh tempo lebih jelas' },
  { label: 'Target nabung bulanan lebih kebaca',        note: 'progress tabungan sampai hari H' },
  { label: 'Checklist 50+ item agar tidak ada yang kelewat', note: '12 bulan hingga H-1 minggu' },
  { label: 'Keputusan penting tidak tercecer',          note: 'catatan, reminder, dan ide dalam dashboard' },
  { label: 'Budget per kategori lebih terkendali',      note: 'benchmark agar tidak kebablasan' },
]

export function PricingSection() {
  return (
    <section className="px-6 md:px-8 py-20 md:py-28 bg-white" id="harga">
      <div className="max-w-[1080px] mx-auto">

        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve text-center mb-2">
          Sekali bayar, akses seumur hidup
        </p>
        <h2 className="font-extrabold tracking-tight text-[34px] md:text-[42px] text-nikah-text text-center mb-10 leading-tight" style={{ letterSpacing: '-0.02em', textWrap: 'balance' } as React.CSSProperties}>
          Pegangan kecil untuk keputusan nikah yang <em>besar</em>
        </h2>

        <div className="max-w-[540px] mx-auto">
        <div className="bg-nikah-deep rounded-[28px] relative overflow-hidden" style={{ padding: '40px 36px', boxShadow: '0 24px 60px rgba(107,53,69,0.32)' }}>

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-white/5" aria-hidden="true" />

          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-nikah-pink mb-4 text-center">Akses Seumur Hidup</p>
            <div className="text-center mb-6">
              <div className="text-white mb-1" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontSize: 54, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>
                Rp 149.000
              </div>
              <p className="text-nikah-pink/80 text-sm">Bayar sekali · Pakai sampai hari H</p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 mb-6 text-center">
              <p className="text-sm text-white font-semibold">
                Sekali bayar untuk menemani persiapan sampai hari H.
              </p>
              <p className="text-xs text-nikah-pink/70 mt-1">
                Tanpa biaya bulanan, termasuk update fitur BudgetNikah ke depannya.
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {WHAT_YOU_GET.map(item => (
                <li key={item.label} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center mt-0.5" aria-hidden="true">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-base font-semibold text-white">{item.label}</span>
                    <span className="text-sm text-nikah-pink/70 ml-1">— {item.note}</span>
                  </div>
                </li>
              ))}
            </ul>

            <a
              href="/auth/login?next=/dashboard"
              className="block w-full bg-white text-nikah-deep font-extrabold py-5 rounded-full text-base text-center shadow-lg transition-colors active:scale-95 hover:bg-nikah-pink"
            >
              Dapatkan Akses Sekarang →
            </a>

            <p className="text-center text-xs text-nikah-pink/60 mt-4">
              Pembayaran otomatis · Tidak ada subscription · Akses seumur hidup
            </p>
          </div>
        </div>
        </div>

      </div>
    </section>
  )
}
