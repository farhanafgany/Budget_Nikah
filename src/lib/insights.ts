import type { AllocationResult } from './allocation'

export interface Insight {
  type: string
  icon: string
  message: string
}

export interface InsightInput {
  totalBudget: number
  guestCount: number
  weddingStyle: string
  planningPriority: string
  weddingCity: string
  allocation: AllocationResult
  score: number
}

export function generateInsights(input: InsightInput): Insight[] {
  const { allocation, weddingStyle, totalBudget, guestCount, score } = input
  const insights: Insight[] = []

  if (allocation.catering.percentage > 45) {
    insights.push({
      type: 'catering_dominant',
      icon: '🍽️',
      message: 'Catering kemungkinan menjadi pengeluaran terbesar dalam wedding plan ini.',
    })
  }

  if (allocation.emergencyFund.percentage < 10) {
    insights.push({
      type: 'low_emergency_fund',
      icon: '⚠️',
      message: 'Dana darurat wedding masih cukup kecil untuk perubahan mendadak.',
    })
  }

  if (weddingStyle === 'luxury' && totalBudget < 100_000_000) {
    insights.push({
      type: 'luxury_budget_mismatch',
      icon: '💎',
      message: 'Style luxury saat ini mungkin akan memberi tekanan cukup besar pada budget.',
    })
  }

  if (guestCount > 700) {
    insights.push({
      type: 'high_guest_count',
      icon: '👥',
      message: 'Jumlah tamu yang besar dapat meningkatkan tekanan budget secara signifikan.',
    })
  }

  if (score >= 70) {
    insights.push({
      type: 'positive_outlook',
      icon: '✨',
      message: 'Rencana ini terlihat realistis. Pertahankan dana darurat agar lebih tenang.',
    })
  }

  while (insights.length < 3) {
    insights.push({
      type: 'budget_review',
      icon: '💡',
      message: 'Lakukan review budget setiap bulan untuk menjaga rencana tetap on track.',
    })
  }

  return insights.slice(0, 5)
}
