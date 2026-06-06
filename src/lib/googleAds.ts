export const GOOGLE_ADS_ID = 'AW-18185574807'
export const GOOGLE_ADS_PURCHASE_LABEL = 'uzNkCMjrzrIcEJezx99D'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

function getGtag() {
  window.dataLayer = window.dataLayer || []

  if (typeof window.gtag !== 'function') {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args)
    }
  }

  return window.gtag
}

/**
 * Fire a Google Ads purchase conversion event.
 * Hanya dipanggil setelah pembayaran sukses — jangan dipanggil
 * di landing page, pricing page, atau halaman checkout start.
 *
 * @param value - Nilai transaksi dalam IDR (contoh: 149000)
 * @param transactionId - ID transaksi unik (pakai order_id Midtrans).
 *   Dipakai Google Ads untuk dedup agar satu pembelian tidak terhitung
 *   dua kali kalau halaman success ke-load ulang atau nanti ada
 *   tracking server-side tambahan.
 */
export function firePurchaseConversion(value: number, transactionId?: string) {
  if (typeof window === 'undefined') return

  getGtag()('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_PURCHASE_LABEL}`,
    value,
    currency: 'IDR',
    ...(transactionId ? { transaction_id: transactionId } : {}),
  })
}
