import { calculateScore, calculatePressureLevel, type ScoreInput } from '@/lib/scoring'
import { calculateAllocation } from '@/lib/allocation'

function makeInput(overrides: Partial<Omit<ScoreInput, 'allocation'>> = {}): ScoreInput {
  const base = {
    totalBudget: 150_000_000,
    guestCount: 300,
    weddingStyle: 'elegant' as const,
    planningPriority: 'balanced' as const,
    weddingCity: 'Jakarta',
    ...overrides,
  }
  return { ...base, allocation: calculateAllocation(base) }
}

describe('calculateScore', () => {
  it('returns a number between 0 and 100', () => {
    const { score } = calculateScore(makeInput())
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('reduces score when budget per guest is very low', () => {
    const low = calculateScore(makeInput({ totalBudget: 10_000_000, guestCount: 500 }))
    const ok  = calculateScore(makeInput({ totalBudget: 150_000_000, guestCount: 300 }))
    expect(low.score).toBeLessThan(ok.score)
  })

  it('reduces score for luxury style with insufficient budget', () => {
    const luxury = calculateScore(makeInput({ weddingStyle: 'luxury', totalBudget: 50_000_000 }))
    const simple = calculateScore(makeInput({ weddingStyle: 'simple', totalBudget: 50_000_000 }))
    expect(luxury.score).toBeLessThan(simple.score)
  })

  it('returns Healthy label for high score', () => {
    const { label } = calculateScore(makeInput({ totalBudget: 300_000_000, guestCount: 200 }))
    expect(label).toBe('Healthy')
  })

  it('returns High Risk label for very low budget/high guests', () => {
    const { label } = calculateScore(makeInput({ totalBudget: 5_000_000, guestCount: 800 }))
    expect(label).toBe('High Risk')
  })

  it('Tier A city scores lower than Tier C for the same tight budget', () => {
    const tierA = calculateScore(makeInput({ totalBudget: 50_000_000, guestCount: 300, weddingCity: 'Jakarta' }))
    const tierC = calculateScore(makeInput({ totalBudget: 50_000_000, guestCount: 300, weddingCity: 'Purwokerto' }))
    expect(tierA.score).toBeLessThan(tierC.score)
  })
})

describe('calculatePressureLevel', () => {
  it('returns Low for score >= 70',  () => expect(calculatePressureLevel(75)).toBe('Low'))
  it('returns Medium for score 40-69', () => expect(calculatePressureLevel(55)).toBe('Medium'))
  it('returns High for score < 40',  () => expect(calculatePressureLevel(30)).toBe('High'))
})
