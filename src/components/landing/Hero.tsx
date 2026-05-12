import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-16 text-center bg-gradient-to-b from-nikah-bg to-[#F5EBF0]">
      <div className="mb-8 text-xs font-bold tracking-widest uppercase text-nikah-mauve">
        BudgetNikah
      </div>

      <h1 className="text-3xl md:text-5xl font-extrabold text-nikah-text leading-tight max-w-xl mb-4">
        Cek Apakah Rencana Weddingmu Sudah Realistis.
      </h1>

      <p className="text-nikah-muted font-light text-base md:text-lg max-w-md mb-10 leading-relaxed">
        BudgetNikah membantu pasangan memahami kesiapan wedding mereka sebelum biaya dan persiapan terasa overwhelming.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/onboarding"
          className="w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center hover:opacity-90 transition"
        >
          Cek Wedding Plan Kamu →
        </Link>
        <a
          href="#simulasi"
          className="w-full border border-nikah-deep text-nikah-deep font-semibold py-4 rounded-full text-sm text-center hover:bg-nikah-pink/30 transition"
        >
          Lihat Contoh Simulasi
        </a>
      </div>

      {/* Sticky mobile CTA — only visible on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-4 bg-white/90 backdrop-blur border-t border-nikah-border">
        <Link
          href="/onboarding"
          className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center"
        >
          Mulai Cek Sekarang →
        </Link>
      </div>
    </section>
  )
}
