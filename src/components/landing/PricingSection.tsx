import Link from 'next/link'

const WHAT_YOU_GET = [
  'Wedding Readiness Score (0–100)',
  'Estimasi biaya riil per kategori',
  'Kalkulasi nabung/bulan otomatis',
  'Checklist 50+ item berbasis timeline',
  'Tabungan Nikah tracker',
  'Daftar Seserahan lengkap',
]

export function PricingSection() {
  const waNumber  = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const waMessage = encodeURIComponent(
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    'Halo, saya ingin membeli akses BudgetNikah. Mohon konfirmasi.'
  )
  const waUrl       = `https://wa.me/${waNumber}?text=${waMessage}`
  const trakteerUrl = process.env.NEXT_PUBLIC_PAYMENT_URL ?? '#'

  return (
    <section className="px-6 py-16 bg-nikah-bg" id="harga">
      <div className="max-w-sm mx-auto">
        <div className="bg-gradient-to-b from-[#F5E8EC] to-[#EDD6DE] rounded-3xl p-7 text-center shadow-sm border border-nikah-border">
          <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-3">Harga</p>
          <div className="text-4xl font-extrabold text-nikah-deep mb-1">Rp 99.000</div>
          <p className="text-sm text-nikah-muted mb-6">sekali bayar · akses seumur hidup</p>

          <ul className="text-left space-y-2 mb-6">
            {WHAT_YOU_GET.map(item => (
              <li key={item} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-nikah-deep flex-shrink-0 flex items-center justify-center" aria-hidden="true">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-nikah-text">{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center"
            >
              Chat WhatsApp →
            </a>
            <a
              href={trakteerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full border border-nikah-deep text-nikah-deep font-semibold py-3.5 rounded-full text-sm text-center"
            >
              Beli via Trakteer
            </a>
          </div>

          <p className="text-xs text-nikah-muted mt-4">
            Setelah pembayaran, konfirmasi via WhatsApp untuk aktivasi akses.
          </p>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-nikah-muted mb-2">Cek score dulu — gratis, tanpa login</p>
          <Link
            href="/onboarding"
            className="text-sm font-bold text-nikah-deep underline underline-offset-2"
          >
            Mulai cek →
          </Link>
        </div>
      </div>
    </section>
  )
}
