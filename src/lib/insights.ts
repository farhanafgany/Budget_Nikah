import type { AllocationResult } from './allocation'
import { calculateMonthlySavings, monthsUntilDate } from './savings'
import { formatRupiah } from './utils'

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
  weddingDate?: string
}

export function generateInsights(input: InsightInput): Insight[] {
  const { allocation, weddingStyle, totalBudget, guestCount, score, weddingDate } = input
  const insights: Insight[] = []

  const budgetPerGuest = guestCount > 0 ? Math.round(totalBudget / guestCount) : 0

  if (allocation.catering.percentage > 45) {
    insights.push({
      type: 'catering_dominant',
      icon: '🍽️',
      message: `Katering diperkirakan ${formatRupiah(allocation.catering.estimatedAmount)} — pengeluaran terbesar dalam plan ini.`,
    })
  }

  if (allocation.emergencyFund.percentage < 10) {
    insights.push({
      type: 'low_emergency_fund',
      icon: '⚠️',
      message: `Dana darurat wedding hanya ${formatRupiah(allocation.emergencyFund.estimatedAmount)} — idealnya minimal 10% dari total budget untuk perubahan mendadak.`,
    })
  }

  if (weddingStyle === 'luxury' && totalBudget < 100_000_000) {
    insights.push({
      type: 'luxury_budget_mismatch',
      icon: '💎',
      message: `Style luxury dengan budget ${formatRupiah(totalBudget)} kemungkinan akan memberi tekanan cukup besar.`,
    })
  }

  if (guestCount > 700) {
    insights.push({
      type: 'high_guest_count',
      icon: '👥',
      message: `${guestCount} tamu dapat meningkatkan tekanan budget secara signifikan — pertimbangkan untuk memperketat daftar tamu.`,
    })
  }

  if (budgetPerGuest > 0 && budgetPerGuest < 150_000) {
    insights.push({
      type: 'budget_per_tamu',
      icon: '🧮',
      message: `Budget per tamu ${formatRupiah(budgetPerGuest)} — idealnya minimal Rp 120.000 untuk katering yang layak.`,
    })
  }

  if (score >= 70) {
    const months = monthsUntilDate(weddingDate || null)
    const monthly = calculateMonthlySavings(totalBudget, 0, months)
    insights.push({
      type: 'positive_outlook',
      icon: '✨',
      message: `Rencana ini terlihat realistis. Sisihkan ${formatRupiah(monthly)}/bulan selama ${months} bulan untuk tetap on track.`,
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
