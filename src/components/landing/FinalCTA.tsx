import Link from 'next/link'

export function FinalCTA() {
  return (
    <section className="px-6 py-20 bg-gradient-to-b from-[#F5EBF0] to-nikah-bg">
      <div className="max-w-md mx-auto bg-nikah-deep rounded-3xl p-8 text-center shadow-xl">
        <p className="text-nikah-pink text-xs font-bold uppercase tracking-widest mb-3">
          Gratis · Tanpa Daftar
        </p>
        <h2 className="font-extrabold tracking-tight text-white text-2xl mb-3 leading-snug">
          Mulai Cek Wedding Plan Kamu
        </h2>
        <p className="text-nikah-pink/80 text-base font-light mb-6 leading-relaxed">
          Jawab 3 langkah singkat dan dapatkan Wedding Readiness Score kamu sekarang.
        </p>
        <Link
          href="/onboarding"
          className="block w-full bg-white text-nikah-deep font-bold py-4 rounded-full text-sm hover:bg-nikah-pink transition"
        >
          Mulai Sekarang →
        </Link>
      </div>
    </section>
  )
}
