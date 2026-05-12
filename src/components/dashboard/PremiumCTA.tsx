export function PremiumCTA() {
  const waNumber  = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const waMessage = encodeURIComponent(
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    'Halo, saya ingin membeli akses BudgetNikah. Mohon konfirmasi.'
  )
  const waUrl      = `https://wa.me/${waNumber}?text=${waMessage}`
  const trakteerUrl = process.env.NEXT_PUBLIC_PAYMENT_URL ?? '#'

  return (
    <div className="bg-gradient-to-b from-[#F5E8EC] to-[#EDD6DE] rounded-2xl p-6 border border-nikah-border">
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">
        <span aria-hidden="true">✨</span> Dapatkan semua fitur
      </p>
      <h2 className="text-lg font-extrabold text-nikah-text mb-1">BudgetNikah</h2>
      <p className="text-sm text-nikah-muted mb-4">
        Rp 99.000 · sekali bayar · akses seumur hidup
      </p>
      <div className="flex flex-col gap-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-nikah-deep text-white font-bold py-3.5 rounded-full text-sm text-center"
        >
          Chat WhatsApp →
        </a>
        <a
          href={trakteerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full border border-nikah-deep text-nikah-deep font-semibold py-3.5 rounded-full text-sm text-center"
        >
          Beli via Trakteer
        </a>
      </div>
    </div>
  )
}
