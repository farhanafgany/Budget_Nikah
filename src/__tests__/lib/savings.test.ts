import { calculateMonthlySavings, monthsUntilDate } from '@/lib/savings'

describe('calculateMonthlySavings', () => {
  it('returns ceil of remaining divided by months', () => {
    expect(calculateMonthlySavings(12_000_000, 0, 12)).toBe(1_000_000)
  })

  it('rounds up to nearest integer', () => {
    expect(calculateMonthlySavings(10_000_000, 0, 3)).toBe(3_333_334)
  })

  it('returns 0 when already at or above target', () => {
    expect(calculateMonthlySavings(10_000_000, 10_000_000, 12)).toBe(0)
    expect(calculateMonthlySavings(10_000_000, 15_000_000, 12)).toBe(0)
  })

  it('returns remaining when monthsLeft is 0', () => {
    expect(calculateMonthlySavings(10_000_000, 3_000_000, 0)).toBe(7_000_000)
  })
})

describe('monthsUntilDate', () => {
  const NOW = new Date('2026-05-12').getTime()

  it('returns 12 for null', () => {
    expect(monthsUntilDate(null, NOW)).toBe(12)
  })

  it('returns 12 for empty string', () => {
    expect(monthsUntilDate('', NOW)).toBe(12)
  })

  it('returns 12 for past date', () => {
    expect(monthsUntilDate('2025-01-01', NOW)).toBe(12)
  })

  it('calculates months for exactly 12 months ahead', () => {
    expect(monthsUntilDate('2027-05-12', NOW)).toBe(12)
  })

  it('returns at least 1 for near future', () => {
    expect(monthsUntilDate('2026-05-20', NOW)).toBe(1)
  })
})
