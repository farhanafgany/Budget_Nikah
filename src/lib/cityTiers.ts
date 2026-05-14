export type CityTier = 'A' | 'B' | 'C'

const TIER_A = new Set([
  'Jakarta',
  'Tangerang',
  'Tangerang Selatan',
  'Bekasi',
  'Depok',
  'Bogor',
  'Surabaya',
  'Bandung',
  'Denpasar',
  'Kota besar lainnya',
])

const TIER_B = new Set([
  'Medan',
  'Semarang',
  'Yogyakarta',
  'Jogja',
  'Solo',
  'Malang',
  'Batam',
  'Makassar',
  'Palembang',
  'Pekanbaru',
  'Balikpapan',
  'Samarinda',
  'Manado',
  'Pontianak',
  'Padang',
  'Banjarmasin',
  'Kota menengah lainnya',
])

const TIER_C = new Set([
  'Purwokerto',
  'Cirebon',
  'Tegal',
  'Kediri',
  'Madiun',
  'Jember',
  'Tasikmalaya',
  'Garut',
  'Magelang',
  'Pekalongan',
  'Kota kecil lainnya',
])

export function getCityTier(city: string): CityTier {
  const normalized = city.trim()
  if (TIER_A.has(normalized)) return 'A'
  if (TIER_B.has(normalized)) return 'B'
  return 'C'
}

export function getCityMultiplier(tier: CityTier): number {
  const map: Record<CityTier, number> = { A: 1.25, B: 1.0, C: 0.85 }
  return map[tier]
}

export function getAdjustedBudgetPerGuest(totalBudget: number, guestCount: number, city: string): number {
  if (guestCount <= 0) return 0
  const rawBudgetPerGuest = totalBudget / guestCount
  const cityMultiplier = getCityMultiplier(getCityTier(city))
  return rawBudgetPerGuest / cityMultiplier
}

export const TIER_A_CITIES = Array.from(TIER_A)
export const TIER_B_CITIES = Array.from(TIER_B)
export const TIER_C_CITIES = Array.from(TIER_C)
export const ALL_CITIES = [...Array.from(TIER_A), ...Array.from(TIER_B), ...Array.from(TIER_C)]
