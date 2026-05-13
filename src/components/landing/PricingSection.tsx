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
  return (
    <section className="px-6 py-20 bg-nikah-bg" id="harga">
      <div className="max-w-lg mx-auto">

        <div className="bg-nikah-deep rounded-3xl p-8 shadow-[0_20px_60px_rgba(107,53,69,0.5),0_4px_16px_rgba(107,53,69,0.3)] relative overflow-hidden">

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-white/5" aria-hidden="true" />

          <div className="relative z-10">
            {/* Header */}
            <p className="text-xs font-bold uppercase tracking-widest text-nikah-pink mb-4 text-center">Akses Seumur Hidup</p>
            <div className="text-center mb-6">
              <div className="text-5xl font-extrabold text-white mb-1">Rp 99.000</div>
              <p className="text-nikah-pink/80 text-sm">Bayar sekali · Pakai sampai hari H</p>
            </div>

            {/* Feature list */}
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

            {/* CTA */}
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-nikah-deep font-extrabold py-5 rounded-full text-base text-center shadow-lg hover:bg-nikah-pink transition-colors active:scale-95"
              >
                Dapatkan Akses Sekarang →
              </a>
            )}
            <p className="text-center text-xs text-nikah-pink/60 mt-4">
              Konfirmasi via WhatsApp · Akses aktif dalam 1×24 jam
            </p>
          </div>
        </div>


      </div>
    </section>
  )
}
