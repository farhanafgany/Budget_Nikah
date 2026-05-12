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
})
