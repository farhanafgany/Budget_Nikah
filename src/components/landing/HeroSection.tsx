import Link from 'next/link'

const DEMO_STATS = [
  { value: '73',     label: 'Readiness Score', badge: 'Healthy',   badgeClass: 'bg-green-100 text-green-700' },
  { value: 'Rp 4,6jt', label: 'nabung/bulan',   badge: null,        badgeClass: '' },
  { value: '18/50',  label: 'checklist selesai',  badge: null,        badgeClass: '' },
]

export function HeroSection() {
  return (
    <section aria-label="Hero" className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-16 text-center bg-gradient-to-b from-nikah-bg to-[#F5EBF0]">
      <div className="mb-6 text-xs font-bold tracking-widest uppercase text-nikah-mauve">
        BudgetNikah
      </div>

      <h1 className="text-3xl md:text-5xl font-extrabold text-nikah-text leading-tight max-w-xl mb-3">
        &ldquo;Berapa yang harus aku tabung bulan ini?&rdquo;
      </h1>

      <p className="text-nikah-muted font-light text-base md:text-lg max-w-sm mb-8 leading-relaxed">
        Pertanyaan yang akhirnya bisa kamu jawab.
      </p>

      {/* Demo stat pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {DEMO_STATS.map(stat => (
          <div
            key={stat.label}
            className="bg-white border border-nikah-border rounded-2xl px-4 py-3 text-center shadow-sm min-w-[90px]"
          >
            <div className="text-lg font-extrabold text-nikah-deep leading-none mb-0.5">{stat.value}</div>
            {stat.badge && (
              <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block mb-0.5 ${stat.badgeClass}`}>
                {stat.badge}
              </div>
            )}
            <div className="text-[11px] text-nikah-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      <Link
        href="/onboarding"
        className="w-full max-w-xs bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center hover:opacity-90 transition"
      >
        Cek Sekarang →
      </Link>
      <p className="text-xs text-nikah-muted mt-3">Gratis · Tanpa login · 2 menit</p>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-4 bg-white/90 backdrop-blur border-t border-nikah-border">
        <Link
          href="/onboarding"
          className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center"
        >
          Cek Sekarang →
        </Link>
      </div>
    </section>
  )
}
