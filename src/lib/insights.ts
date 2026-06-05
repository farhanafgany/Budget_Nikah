import type { AllocationResult } from './allocation'
import { getAdjustedBudgetPerGuest } from './cityTiers'
import { calculateMonthlySavings, monthsUntilDate } from './savings'
import { formatRupiah } from './utils'

export interface Insight {
  kind: 'good' | 'warn' | 'info'
  title: string
  body: string
  /** Stable id of the underlying topic, dipakai untuk dedupe antar-daftar insight. */
  topic?: string
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
      topic: 'catering',
      title: 'Katering mendominasi.',
      body: `Estimasi ${formatRupiah(allocation.catering.estimatedAmount)} — pengeluaran terbesar dalam plan ini.`,
    })
  }

  if (allocation.emergencyFund.percentage < 10) {
    insights.push({
      kind: 'warn',
      topic: 'emergency',
      title: 'Dana darurat terlalu kecil.',
      body: `Hanya ${formatRupiah(allocation.emergencyFund.estimatedAmount)} — idealnya minimal 10% dari total budget.`,
    })
  }

  if (weddingStyle === 'luxury' && totalBudget < 100_000_000) {
    insights.push({
      kind: 'warn',
      topic: 'luxury',
      title: 'Style luxury, budget terbatas.',
      body: `Budget ${formatRupiah(totalBudget)} kemungkinan akan memberi tekanan yang cukup besar.`,
    })
  }

  if (guestCount > 800) {
    insights.push({
      kind: 'warn',
      topic: 'guests',
      title: 'Jumlah tamu sangat banyak.',
      body: `${guestCount} tamu meningkatkan tekanan budget secara signifikan — pertimbangkan perketat daftar tamu.`,
    })
  }

  if (budgetPerGuest > 0 && budgetPerGuest < 120_000) {
    insights.push({
      kind: 'warn',
      topic: 'per-guest',
      title: 'Budget per tamu terlalu tipis.',
      body: `${formatRupiah(budgetPerGuest)}/tamu setelah faktor kota — idealnya minimal Rp 120.000 untuk katering yang layak.`,
    })
  }

  if (score >= 70) {
    const months = monthsUntilDate(weddingDate || null)
    const monthly = calculateMonthlySavings(totalBudget, 0, months)
    insights.push({
      kind: 'good',
      topic: 'realistic',
      title: 'Rencana terlihat realistis.',
      body: `Sisihkan ${formatRupiah(monthly)}/bulan selama ${months} bulan untuk tetap on track.`,
    })
  }

  while (insights.length < 3) {
    insights.push({
      kind: 'info',
      topic: 'monitor',
      title: 'Pantau budget secara berkala.',
      body: 'Review rutin setiap bulan agar rencana tetap on track menjelang hari H.',
    })
  }

  return insights.slice(0, 5)
}

export function generatePrimaryInsights(input: InsightInput): Insight[] {
  const { allocation, totalBudget, guestCount, score, weddingDate } = input
  const months = monthsUntilDate(weddingDate || null)
  const monthlySaving = calculateMonthlySavings(totalBudget, 0, months)
  const insights: Insight[] = []

  if (allocation.emergencyFund.percentage < 10) {
    insights.push({
      kind: 'warn',
      topic: 'emergency',
      title: 'Dana darurat masih terlalu kecil.',
      body: 'Idealnya minimal 10% dari total budget disisihkan agar rencana tidak mudah terganggu.',
    })
  }

  if (months <= 3) {
    insights.push({
      kind: 'warn',
      topic: 'timeline',
      title: 'Waktu persiapan cukup mepet.',
      body: 'Prioritaskan keputusan besar seperti venue, catering, dan MUA lebih awal.',
    })
  }

  if (guestCount > 600) {
    insights.push({
      kind: 'info',
      topic: 'guests',
      title: 'Jumlah tamu menjadi faktor terbesar.',
      body: 'Sedikit perubahan jumlah tamu bisa berdampak besar ke catering dan venue.',
    })
  }

  if (score >= 70) {
    insights.push({
      kind: 'good',
      topic: 'realistic',
      title: 'Rencana kalian cukup realistis.',
      body: `Dengan tabungan sekitar ${formatRupiah(monthlySaving)}/bulan selama ${months} bulan, target masih masuk akal.`,
    })
  }

  if (insights.length === 0) {
    insights.push({
      kind: 'info',
      topic: 'monitor',
      title: 'Fokus utama kalian adalah menjaga ritme.',
      body: 'Pantau budget dan keputusan vendor setiap bulan agar rencana tetap terasa terkendali.',
    })
  }

  return insights.slice(0, 2)
}
