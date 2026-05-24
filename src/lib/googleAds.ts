export const GOOGLE_ADS_ID = 'AW-18185574807'
export const GOOGLE_ADS_PURCHASE_LABEL = 'uzNkCMjrzrIcEJezx99D'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

/**
 * Fire a Google Ads purchase conversion event.
 * Hanya dipanggil setelah pembayaran sukses — jangan dipanggil
 * di landing page, pricing page, atau halaman checkout start.
 *
 * @param value - Nilai transaksi dalam IDR (contoh: 149000)
 */
export function firePurchaseConversion(value: number) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  window.gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_PURCHASE_LABEL}`,
    value,
    currency: 'IDR',
  })
}
