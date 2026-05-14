import { getAdjustedBudgetPerGuest, getCityTier, getCityMultiplier } from '@/lib/cityTiers'

describe('getCityTier', () => {
  it('returns A for Jakarta', () => expect(getCityTier('Jakarta')).toBe('A'))
  it('returns A for Surabaya', () => expect(getCityTier('Surabaya')).toBe('A'))
  it('returns A for Bandung', () => expect(getCityTier('Bandung')).toBe('A'))
  it('returns B for Jogja', () => expect(getCityTier('Jogja')).toBe('B'))
  it('returns B for Solo', () => expect(getCityTier('Solo')).toBe('B'))
  it('returns B for Medan', () => expect(getCityTier('Medan')).toBe('B'))
  it('returns B for Batam', () => expect(getCityTier('Batam')).toBe('B'))
  it('returns C for smaller city', () => expect(getCityTier('Purwokerto')).toBe('C'))
  it('supports fallback city categories', () => {
    expect(getCityTier('Kota besar lainnya')).toBe('A')
    expect(getCityTier('Kota menengah lainnya')).toBe('B')
    expect(getCityTier('Kota kecil lainnya')).toBe('C')
  })
})

describe('getCityMultiplier', () => {
  it('returns 1.25 for Tier A', () => expect(getCityMultiplier('A')).toBe(1.25))
  it('returns 1.00 for Tier B', () => expect(getCityMultiplier('B')).toBe(1.00))
  it('returns 0.85 for Tier C', () => expect(getCityMultiplier('C')).toBe(0.85))
})

describe('getAdjustedBudgetPerGuest', () => {
  it('makes the same raw budget tighter in higher-cost cities', () => {
    const jakarta = getAdjustedBudgetPerGuest(50_000_000, 300, 'Jakarta')
    const purwokerto = getAdjustedBudgetPerGuest(50_000_000, 300, 'Purwokerto')
    expect(jakarta).toBeLessThan(purwokerto)
  })
})
