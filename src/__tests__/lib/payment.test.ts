import { PREMIUM_PRICE, formatPaymentAmount, getPremiumPaymentAmount } from '@/lib/payment'

const originalPaymentTestAmount = process.env.PAYMENT_TEST_AMOUNT

describe('payment helpers', () => {
  afterEach(() => {
    if (originalPaymentTestAmount === undefined) {
      delete process.env.PAYMENT_TEST_AMOUNT
    } else {
      process.env.PAYMENT_TEST_AMOUNT = originalPaymentTestAmount
    }
  })

  it('uses the regular premium price by default', () => {
    delete process.env.PAYMENT_TEST_AMOUNT

    expect(getPremiumPaymentAmount()).toBe(PREMIUM_PRICE)
  })

  it('uses PAYMENT_TEST_AMOUNT when configured', () => {
    process.env.PAYMENT_TEST_AMOUNT = '1000'

    expect(getPremiumPaymentAmount()).toBe(1000)
  })

  it('falls back to the regular premium price when PAYMENT_TEST_AMOUNT is invalid', () => {
    process.env.PAYMENT_TEST_AMOUNT = 'not-a-number'

    expect(getPremiumPaymentAmount()).toBe(PREMIUM_PRICE)

    process.env.PAYMENT_TEST_AMOUNT = '0'

    expect(getPremiumPaymentAmount()).toBe(PREMIUM_PRICE)
  })

  it('formats the regular price and test amount for display', () => {
    expect(formatPaymentAmount(PREMIUM_PRICE)).toBe('Rp 149rb')
    expect(formatPaymentAmount(1000)).toBe('Rp 1.000')
  })
})
