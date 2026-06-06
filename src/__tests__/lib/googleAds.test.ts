import { GOOGLE_ADS_ID, GOOGLE_ADS_PURCHASE_LABEL, firePurchaseConversion } from '@/lib/googleAds'

describe('Google Ads conversion tracking', () => {
  beforeEach(() => {
    delete window.gtag
    delete window.dataLayer
  })

  it('queues the purchase conversion when gtag has not loaded yet', () => {
    firePurchaseConversion(149_000, 'BN-123-abcdef12')

    expect(window.dataLayer).toEqual([
      [
        'event',
        'conversion',
        {
          send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_PURCHASE_LABEL}`,
          value: 149_000,
          currency: 'IDR',
          transaction_id: 'BN-123-abcdef12',
        },
      ],
    ])
  })

  it('uses an existing gtag function when available', () => {
    const gtag = jest.fn()
    window.gtag = gtag

    firePurchaseConversion(149_000, 'BN-123-abcdef12')

    expect(gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_PURCHASE_LABEL}`,
      value: 149_000,
      currency: 'IDR',
      transaction_id: 'BN-123-abcdef12',
    })
  })
})
