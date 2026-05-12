import Link from 'next/link'

const WHAT_YOU_GET = [
  { label: 'Wedding Readiness Score (0–100)',      note: 'tahu seberapa siap kamu' },
  { label: 'Estimasi biaya riil per kategori',      note: 'dalam Rupiah, bukan estimasi abstrak' },
  { label: 'Kalkulasi nabung/bulan otomatis',       note: 'langsung tahu targetnya' },
  { label: 'Checklist 50+ item berbasis timeline',  note: '12 bulan hingga H-1 minggu' },
  { label: 'Tabungan Nikah tracker',                note: 'pantau progress setiap saat' },
  { label: 'Daftar Seserahan lengkap',              note: 'centang satu per satu' },
]

export function PricingSection() {
  const waNumber  = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const waMessage = encodeURIComponent(
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    'Halo, saya ingin membeli akses BudgetNikah. Mohon konfirmasi.'
  )
  const waUrl       = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null
  const trakteerUrl = process.env.NEXT_PUBLIC_PAYMENT_URL ?? null

  return (
    <section className="px-6 py-20 bg-nikah-bg" id="harga">
      <div className="max-w-lg mx-auto">

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-nikah-deep text-white text-xs font-bold px-4 py-1.5 rounded-full">
            <span aria-hidden="true">✨</span> Akses Seumur Hidup
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#F5E8EC] to-[#EDD6DE] rounded-3xl p-8 shadow-xl border border-[#E8C0CC] relative overflow-hidden">

          {/* Decorative circle */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/20" aria-hidden="true" />

          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-4 text-center">Investasi Pernikahan</p>

            {/* Price */}
            <div className="text-center mb-1">
              <span className="text-5xl font-extrabold text-nikah-deep">Rp 99.000</span>
            </div>
            <p className="text-center text-nikah-muted text-sm mb-2">sekali bayar · akses seumur hidup</p>
            <p className="text-center text-xs text-nikah-mauve font-semibold mb-7">
              Setara 1–2x kopi premium. Dipakai sampai hari H.
            </p>

            {/* Feature list */}
            <ul className="space-y-3 mb-8">
              {WHAT_YOU_GET.map(item => (
                <li key={item.label} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-nikah-deep flex-shrink-0 flex items-center justify-center mt-0.5" aria-hidden="true">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm md:text-base font-semibold text-nikah-text">{item.label}</span>
                    <span className="text-xs text-nikah-muted ml-1">— {item.note}</span>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5">
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center shadow-lg hover:opacity-90 active:scale-95 transition-all"
                >
                  Chat WhatsApp →
                </a>
              )}
              {trakteerUrl && (
                <a
                  href={trakteerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-white border border-nikah-deep text-nikah-deep font-semibold py-3.5 rounded-full text-sm text-center hover:bg-nikah-bg transition-colors"
                >
                  Beli via Trakteer →
                </a>
              )}
            </div>

            <p className="text-xs text-nikah-muted mt-5 text-center leading-relaxed">
              Setelah pembayaran, konfirmasi via WhatsApp.<br />Akses aktif dalam 1×24 jam.
            </p>
          </div>
        </div>

        {/* Free CTA below */}
        <div className="text-center mt-8 bg-white rounded-2xl p-5 border border-nikah-border">
          <p className="text-sm font-semibold text-nikah-text mb-1">Belum yakin? Coba dulu gratis.</p>
          <p className="text-xs text-nikah-muted mb-3">Lihat score & estimasi budget kamu — tanpa login, tanpa bayar.</p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1 text-sm font-bold text-nikah-deep underline underline-offset-2"
          >
            Mulai cek gratis →
          </Link>
        </div>

      </div>
    </section>
  )
}
