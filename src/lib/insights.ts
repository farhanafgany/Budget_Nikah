import type { AllocationResult } from './allocation'
import { getAdjustedBudgetPerGuest } from './cityTiers'
import { calculateMonthlySavings, monthsUntilDate } from './savings'
import { formatRupiah } from './utils'

export interface Insight {
  kind: 'good' | 'warn' | 'info'
  title: string
  body: string
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
  const { allocation, weddingStyle, totalBudget, guestCount, score, weddingDate, weddingCity } = input
  const insights: Insight[] = []

  const budgetPerGuest = Math.round(getAdjustedBudgetPerGuest(totalBudget, guestCount, weddingCity))

  if (allocation.catering.percentage > 45) {
    insights.push({
      kind: 'warn',
      title: 'Katering mendominasi.',
      body: `Estimasi ${formatRupiah(allocation.catering.estimatedAmount)} — pengeluaran terbesar dalam plan ini.`,
    })
  }

  if (allocation.emergencyFund.percentage < 10) {
    insights.push({
      kind: 'warn',
      title: 'Dana darurat terlalu kecil.',
      body: `Hanya ${formatRupiah(allocation.emergencyFund.estimatedAmount)} — idealnya minimal 10% dari total budget.`,
    })
  }

  if (weddingStyle === 'luxury' && totalBudget < 100_000_000) {
    insights.push({
      kind: 'warn',
      title: 'Style luxury, budget terbatas.',
      body: `Budget ${formatRupiah(totalBudget)} kemungkinan akan memberi tekanan yang cukup besar.`,
    })
  }

  if (guestCount > 800) {
    insights.push({
      kind: 'warn',
      title: 'Jumlah tamu sangat banyak.',
      body: `${guestCount} tamu meningkatkan tekanan budget secara signifikan — pertimbangkan perketat daftar tamu.`,
    })
  }

  if (budgetPerGuest > 0 && budgetPerGuest < 120_000) {
    insights.push({
      kind: 'warn',
      title: 'Budget per tamu terlalu tipis.',
      body: `${formatRupiah(budgetPerGuest)}/tamu setelah faktor kota — idealnya minimal Rp 120.000 untuk katering yang layak.`,
    })
  }

  if (score >= 70) {
    const months = monthsUntilDate(weddingDate || null)
    const monthly = calculateMonthlySavings(totalBudget, 0, months)
    insights.push({
      kind: 'good',
      title: 'Rencana terlihat realistis.',
      body: `Sisihkan ${formatRupiah(monthly)}/bulan selama ${months} bulan untuk tetap on track.`,
    })
  }

  while (insights.length < 3) {
    insights.push({
      kind: 'info',
      title: 'Pantau budget secara berkala.',
      body: 'Review rutin setiap bulan agar rencana tetap on track menjelang hari H.',
    })
  }

  return insights.slice(0, 5)
}
