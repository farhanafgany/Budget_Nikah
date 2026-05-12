export type CityTier = 'A' | 'B' | 'C'

const TIER_A = new Set(['Jakarta', 'Surabaya', 'Bandung'])
const TIER_B = new Set(['Batam', 'Jogja', 'Solo', 'Medan'])

export function getCityTier(city: string): CityTier {
  if (TIER_A.has(city)) return 'A'
  if (TIER_B.has(city)) return 'B'
  return 'C'
}

export function getCityMultiplier(tier: CityTier): number {
  const map: Record<CityTier, number> = { A: 1.25, B: 1.0, C: 0.85 }
  return map[tier]
}

export const TIER_A_CITIES = Array.from(TIER_A)
export const TIER_B_CITIES = Array.from(TIER_B)
export const ALL_CITIES = [...Array.from(TIER_A), ...Array.from(TIER_B)]
