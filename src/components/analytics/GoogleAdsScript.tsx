'use client'

import Script from 'next/script'
import { GOOGLE_ADS_ID } from '@/lib/googleAds'

/**
 * Muat global Google tag (gtag.js) untuk Google Ads.
 * strategy="afterInteractive" memastikan script hanya jalan di browser,
 * setelah halaman interactive — tidak ada SSR error.
 *
 * Dipasang di root layout agar tersedia di semua halaman.
 */
export function GoogleAdsScript() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-ads-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);}
            window.gtag('js', new Date());
            window.gtag('config', '${GOOGLE_ADS_ID}');
          `,
        }}
      />
    </>
  )
}
