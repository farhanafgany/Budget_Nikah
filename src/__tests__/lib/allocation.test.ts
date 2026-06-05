import { calculateAllocation, type AllocationInput } from '@/lib/allocation'

const base: AllocationInput = {
  totalBudget: 100_000_000,
  guestCount: 300,
  weddingStyle: 'elegant',
  planningPriority: 'balanced',
}

describe('calculateAllocation', () => {
  it('returns 8 categories', () => {
    const result = calculateAllocation(base)
    expect(Object.keys(result)).toHaveLength(8)
  })

  it('percentages sum to 100', () => {
    const result = calculateAllocation(base)
    const total = Object.values(result).reduce((s, c) => s + c.percentage, 0)
    expect(total).toBe(100)
  })

  it('estimated amounts sum to totalBudget', () => {
    const result = calculateAllocation(base)
    const total = Object.values(result).reduce((s, c) => s + c.estimatedAmount, 0)
    expect(total).toBe(base.totalBudget)
  })

  it('luxury style has higher venue percentage than simple', () => {
    const luxury = calculateAllocation({ ...base, weddingStyle: 'luxury' })
    const simple = calculateAllocation({ ...base, weddingStyle: 'simple' })
    expect(luxury.venue.percentage).toBeGreaterThan(simple.venue.percentage)
  })

  it('hemat priority has higher emergency fund than experience', () => {
    const hemat = calculateAllocation({ ...base, planningPriority: 'hemat' })
    const exp   = calculateAllocation({ ...base, planningPriority: 'experience' })
    expect(hemat.emergencyFund.percentage).toBeGreaterThan(exp.emergencyFund.percentage)
  })

  // Regression: luxury/modern + experience dulu bikin emergencyFund jadi negatif
  // (luxury 0 - 3 = -3, modern 2 - 3 = -1) yang bocor jadi "Rp -X" di /result.
  it.each(['luxury', 'modern', 'elegant', 'simple', 'traditional'] as const)(
    'never produces negative percentage or amount for %s + experience',
    (weddingStyle) => {
      const result = calculateAllocation({ ...base, weddingStyle, planningPriority: 'experience' })
      Object.values(result).forEach(category => {
        expect(category.percentage).toBeGreaterThanOrEqual(0)
        expect(category.estimatedAmount).toBeGreaterThanOrEqual(0)
      })
    }
  )

  it('still sums to 100% and full budget for luxury + experience', () => {
    const result = calculateAllocation({ ...base, weddingStyle: 'luxury', planningPriority: 'experience' })
    const pctTotal = Object.values(result).reduce((s, c) => s + c.percentage, 0)
    const amountTotal = Object.values(result).reduce((s, c) => s + c.estimatedAmount, 0)
    expect(pctTotal).toBe(100)
    expect(amountTotal).toBe(base.totalBudget)
  })
})
