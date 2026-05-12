export type WeddingStyle = 'simple' | 'elegant' | 'luxury' | 'traditional' | 'modern'
export type PlanningPriority = 'hemat' | 'balanced' | 'experience'

export interface AllocationInput {
  totalBudget: number
  guestCount: number
  weddingStyle: WeddingStyle | string
  planningPriority: PlanningPriority | string
}

export interface AllocationCategory {
  percentage: number
  estimatedAmount: number
}

export interface AllocationResult {
  catering: AllocationCategory
  venue: AllocationCategory
  decoration: AllocationCategory
  documentation: AllocationCategory
  mua: AllocationCategory
  souvenir: AllocationCategory
  entertainment: AllocationCategory
  emergencyFund: AllocationCategory
}

type AllocationMap = Record<keyof AllocationResult, number>

const STYLE_BASE: Record<string, AllocationMap> = {
  simple:      { catering:48, venue:16, decoration:11, documentation:6, mua:4, souvenir:6, entertainment:3, emergencyFund:6 },
  elegant:     { catering:42, venue:20, decoration:14, documentation:7, mua:5, souvenir:5, entertainment:4, emergencyFund:3 },
  luxury:      { catering:36, venue:24, decoration:18, documentation:8, mua:6, souvenir:3, entertainment:5, emergencyFund:0 },
  traditional: { catering:50, venue:15, decoration:12, documentation:5, mua:4, souvenir:7, entertainment:2, emergencyFund:5 },
  modern:      { catering:40, venue:18, decoration:15, documentation:9, mua:5, souvenir:4, entertainment:7, emergencyFund:2 },
}

const PRIORITY_DELTA: Record<string, Partial<AllocationMap>> = {
  hemat:      { emergencyFund:+5, decoration:-2, entertainment:-2, mua:-1 },
  balanced:   {},
  experience: { emergencyFund:-3, entertainment:+2, decoration:+2, souvenir:-1 },
}

function applyDelta(base: AllocationMap, delta: Partial<AllocationMap>): AllocationMap {
  const result = { ...base }
  for (const [k, v] of Object.entries(delta)) {
    result[k as keyof AllocationMap] = (result[k as keyof AllocationMap] ?? 0) + (v ?? 0)
  }
  const total = Object.values(result).reduce((s, n) => s + n, 0)
  if (total !== 100) result.catering += (100 - total)
  return result
}

export function calculateAllocation(input: AllocationInput): AllocationResult {
  const styleKey    = input.weddingStyle    in STYLE_BASE     ? input.weddingStyle    : 'elegant'
  const priorityKey = input.planningPriority in PRIORITY_DELTA ? input.planningPriority : 'balanced'

  const pct = applyDelta(STYLE_BASE[styleKey], PRIORITY_DELTA[priorityKey])

  // Distribute rounding errors so amounts sum exactly to totalBudget
  const raw = {} as Record<keyof AllocationResult, number>
  let allocated = 0
  const keys = Object.keys(pct) as (keyof AllocationResult)[]

  keys.forEach((k, i) => {
    if (i < keys.length - 1) {
      raw[k] = Math.round((pct[k] / 100) * input.totalBudget)
      allocated += raw[k]
    } else {
      raw[k] = input.totalBudget - allocated
    }
  })

  const result = {} as AllocationResult
  keys.forEach(k => {
    result[k] = { percentage: pct[k], estimatedAmount: raw[k] }
  })
  return result
}
