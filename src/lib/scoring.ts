import { getAdjustedBudgetPerGuest, getCityMultiplier, getCityTier } from './cityTiers'
import type { AllocationResult } from './allocation'

export type ReadinessLabel = 'High Risk' | 'Moderate' | 'Healthy'
export type PressureLevel  = 'Low' | 'Medium' | 'High'

export interface ScoreInput {
  totalBudget: number
  guestCount: number
  weddingStyle: string
  planningPriority: string
  weddingCity: string
  allocation: AllocationResult
}

export interface ScoreResult {
  score: number
  label: ReadinessLabel
}

export function calculateScore(input: ScoreInput): ScoreResult {
  const { totalBudget, guestCount, weddingStyle, planningPriority, weddingCity, allocation } = input

  let score = 100
  const cityMultiplier = getCityMultiplier(getCityTier(weddingCity))
  const budgetPerGuest = getAdjustedBudgetPerGuest(totalBudget, guestCount, weddingCity)
  const emergencyPct   = allocation.emergencyFund.percentage

  if (budgetPerGuest < 120_000)                                   score -= 25
  if (budgetPerGuest < 30_000)                                    score -= 25
  if (weddingStyle === 'luxury' && totalBudget < 100_000_000 * cityMultiplier) score -= 20
  if (weddingStyle === 'elegant' && budgetPerGuest < 180_000)     score -= 10
  if (guestCount > 800)                                           score -= 10
  if (guestCount >= 800)                                          score -= 5
  if (planningPriority === 'hemat')                               score += 5
  if (emergencyPct < 10)                                          score -= 10

  score = Math.max(0, Math.min(100, Math.round(score)))

  return { score, label: getLabel(score) }
}

function getLabel(score: number): ReadinessLabel {
  if (score >= 70) return 'Healthy'
  if (score >= 40) return 'Moderate'
  return 'High Risk'
}

export function calculatePressureLevel(score: number): PressureLevel {
  if (score >= 70) return 'Low'
  if (score >= 40) return 'Medium'
  return 'High'
}
