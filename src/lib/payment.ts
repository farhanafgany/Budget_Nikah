export const PREMIUM_PRODUCT_NAME = 'BudgetNikah Premium'
export const PREMIUM_PRICE = 149_000
export const PAYMENT_CURRENCY = 'IDR'

export function getPremiumPaymentAmount() {
  const testAmount = process.env.PAYMENT_TEST_AMOUNT
  if (!testAmount) return PREMIUM_PRICE

  const amount = Number(testAmount)
  if (!Number.isFinite(amount) || amount <= 0) return PREMIUM_PRICE

  return Math.round(amount)
}

export function buildPremiumSuccessUrl(appUrl: string, orderId?: string) {
  const url = new URL('/premium/success', appUrl)
  if (orderId) url.searchParams.set('order_id', orderId)

  return url.toString()
}

export function formatPaymentAmount(amount: number) {
  if (amount === PREMIUM_PRICE) return 'Rp 149rb'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: PAYMENT_CURRENCY,
    maximumFractionDigits: 0,
  }).format(amount)
}
