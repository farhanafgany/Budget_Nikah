import type { CustomChecklistInput, VendorPaymentInput } from './dashboardActions'
import type { VendorReminderSummary } from './dashboardReminders'
import { CHECKLIST_ITEMS } from './checklistItems'
import type { ReadinessLabel } from './scoring'
import { formatRupiahExact } from './utils'

export interface DashboardAllocationEntry {
  percentage: number
  estimatedAmount: number
}

export type DashboardFinanceStatus = 'neutral' | 'good' | 'attention' | 'warning' | 'critical'

export interface DashboardFinance {
  vendorCommitted: number
  vendorPaid: number
  vendorOutstanding: number
  budgetRoom: number
  savingsGap: number
  savingsSurplus: number
  commitmentPercent: number
  status: DashboardFinanceStatus
}

export interface DashboardInsight {
  kind: 'good' | 'info' | 'warning' | 'critical'
  title: string
  body: string
  actionLabel: string
  href: string
}

export interface DashboardGuidanceInput {
  totalBudget: number
  savingsCollected: number
  vendorPayments: VendorPaymentInput[]
  allocation: Record<string, DashboardAllocationEntry> | null
  weddingDate: string | null
}

export interface DashboardStatusCopy {
  countdownNote: string | null
  readinessTitle: string
  readinessCopy: string
  mobileReadinessCopy: string
}

export interface DashboardChecklistProgress {
  completed: number
  total: number
  percentage: number
}

export interface DashboardReadinessAdjustment {
  label: string
  points: number
}

export interface DashboardReadiness {
  score: number
  label: ReadinessLabel
  baseScore: number
  delta: number
  checklistProgress: DashboardChecklistProgress
  adjustments: DashboardReadinessAdjustment[]
}

const CATEGORY_LABELS: Record<string, string> = {
  catering: 'Catering',
  venue: 'Venue',
  decoration: 'Dekorasi',
  documentation: 'Dokumentasi',
  mua: 'MUA dan Busana',
  souvenir: 'Souvenir',
  entertainment: 'Hiburan',
}

function getAllocationKey(category: string) {
  const normalized = category.toLowerCase()
  if (normalized.includes('catering') || normalized.includes('katering')) return 'catering'
  if (normalized.includes('venue') || normalized.includes('gedung')) return 'venue'
  if (normalized.includes('dekor')) return 'decoration'
  if (normalized.includes('dokument') || normalized.includes('foto') || normalized.includes('video')) return 'documentation'
  if (normalized.includes('mua') || normalized.includes('busana')) return 'mua'
  if (normalized.includes('souvenir')) return 'souvenir'
  if (normalized.includes('hiburan') || normalized.includes('entertain')) return 'entertainment'
  return null
}

export function calculateDashboardFinance({
  totalBudget,
  savingsCollected,
  vendorPayments,
}: Pick<DashboardGuidanceInput, 'totalBudget' | 'savingsCollected' | 'vendorPayments'>): DashboardFinance {
  const vendorCommitted = vendorPayments.reduce((sum, item) => sum + item.totalAmount, 0)
  const vendorPaid = vendorPayments.reduce((sum, item) => sum + item.paidAmount, 0)
  const vendorOutstanding = Math.max(0, vendorCommitted - vendorPaid)
  const budgetRoom = totalBudget - vendorCommitted
  const savingsGap = Math.max(0, vendorOutstanding - savingsCollected)
  const savingsSurplus = Math.max(0, savingsCollected - vendorOutstanding)
  const commitmentPercent = totalBudget > 0 ? Math.round((vendorCommitted / totalBudget) * 100) : 0

  let status: DashboardFinanceStatus = 'good'
  if (totalBudget <= 0 || vendorPayments.length === 0) {
    status = 'neutral'
  } else if (budgetRoom < 0) {
    status = 'critical'
  } else if (vendorCommitted >= totalBudget * 0.9) {
    status = 'warning'
  } else if (savingsGap > 0) {
    status = 'attention'
  }

  return {
    vendorCommitted,
    vendorPaid,
    vendorOutstanding,
    budgetRoom,
    savingsGap,
    savingsSurplus,
    commitmentPercent,
    status,
  }
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)))
}

function getReadinessLabel(score: number): ReadinessLabel {
  if (score >= 70) return 'Healthy'
  if (score >= 40) return 'Moderate'
  return 'High Risk'
}

export function calculateDashboardChecklistProgress({
  checkedIds,
  customChecklistItems,
  hiddenChecklistItemIds,
}: {
  checkedIds: string[]
  customChecklistItems: CustomChecklistInput[]
  hiddenChecklistItemIds: string[]
}): DashboardChecklistProgress {
  const checkedSet = new Set(checkedIds)
  const hiddenSet = new Set(hiddenChecklistItemIds)
  const visibleDefaultIds = CHECKLIST_ITEMS
    .filter(item => !hiddenSet.has(item.id))
    .map(item => item.id)
  const customIds = customChecklistItems.map(item => item.id)
  const total = visibleDefaultIds.length + customIds.length
  const completed = [...visibleDefaultIds, ...customIds]
    .filter(id => checkedSet.has(id)).length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return { completed, total, percentage }
}

export function calculateDashboardReadiness({
  baseScore,
  finance,
  reminders,
  checklist,
  days,
}: {
  baseScore: number
  finance: DashboardFinance
  reminders: VendorReminderSummary
  checklist: DashboardChecklistProgress
  days: number | null
}): DashboardReadiness {
  const adjustments: DashboardReadinessAdjustment[] = []
  const addAdjustment = (label: string, points: number) => {
    if (points !== 0) adjustments.push({ label, points })
  }

  if (finance.status === 'critical') {
    addAdjustment('Komitmen vendor melewati budget', -25)
  } else if (finance.status === 'warning') {
    addAdjustment('Ruang budget mulai tipis', -12)
  } else if (finance.status === 'attention') {
    addAdjustment('Tabungan belum menutup tagihan vendor', -10)
  } else if (finance.status === 'neutral') {
    addAdjustment('Data vendor belum lengkap', -6)
  } else if (finance.vendorOutstanding === 0 && finance.vendorCommitted > 0) {
    addAdjustment('Vendor tercatat sudah lunas', 4)
  }

  if (reminders.overdueCount > 0) {
    addAdjustment('Ada pembayaran terlambat', -15)
  } else if (reminders.dueSoonCount > 0) {
    addAdjustment('Ada pembayaran dalam 7 hari', -8)
  }

  if (reminders.unscheduledCount > 0) {
    addAdjustment('Ada vendor tanpa deadline', -4)
  }

  if (checklist.total > 0) {
    if (checklist.percentage >= 80) {
      addAdjustment('Checklist persiapan kuat', 5)
    } else if (checklist.percentage >= 55) {
      addAdjustment('Checklist mulai rapi', 2)
    } else if (days !== null && days <= 30) {
      addAdjustment('Checklist masih perlu dikejar', -8)
    } else if (checklist.percentage < 25) {
      addAdjustment('Checklist baru sedikit selesai', -6)
    } else if (checklist.percentage < 45) {
      addAdjustment('Checklist masih perlu dilengkapi', -4)
    }
  }

  const rawScore = clampScore(
    baseScore + adjustments.reduce((sum, item) => sum + item.points, 0),
  )
  const cappedScore = finance.status === 'critical'
    ? Math.min(rawScore, 39)
    : reminders.overdueCount > 0 || (finance.savingsGap > 0 && reminders.dueSoonCount > 0)
      ? Math.min(rawScore, 69)
      : finance.status === 'warning'
        ? Math.min(rawScore, 69)
        : rawScore

  const score = clampScore(cappedScore)

  return {
    score,
    label: getReadinessLabel(score),
    baseScore: clampScore(baseScore),
    delta: score - clampScore(baseScore),
    checklistProgress: checklist,
    adjustments,
  }
}

export function buildDashboardStatusCopy({
  score,
  days,
  finance,
  reminders,
}: {
  score: number
  days: number | null
  finance: DashboardFinance
  reminders: VendorReminderSummary
}): DashboardStatusCopy {
  const needsFunds = finance.savingsGap > 0
  const hasUrgentPayment = reminders.overdueCount > 0 || reminders.dueSoonCount > 0

  let countdownNote: string | null = null
  if (days !== null && days > 0) {
    if (reminders.overdueCount > 0) {
      countdownNote = `${reminders.overdueCount} pembayaran terlambat perlu dibereskan lebih dulu.`
    } else if (reminders.dueSoonCount > 0) {
      countdownNote = 'Ada pembayaran jatuh tempo dalam 7 hari. Siapkan dari sekarang.'
    } else if (needsFunds) {
      countdownNote = 'Lengkapi dana untuk tagihan vendor agar rencana tetap terkendali.'
    } else if (days <= 7) {
      countdownNote = 'Hampir tiba - cek detail terakhir agar hari H terasa lebih tenang.'
    } else if (days <= 30) {
      countdownNote = 'Satu bulan lagi - ini saatnya fokus ke detail terakhir.'
    } else if (days <= 90) {
      countdownNote = 'Tiga bulan ke depan jadi momen paling penting.'
    } else if (days <= 180) {
      countdownNote = 'Masih ada waktu - satu langkah hari ini selalu membantu.'
    } else {
      countdownNote = 'Persiapan yang dimulai lebih awal terasa jauh lebih tenang.'
    }
  }

  if (finance.status === 'critical') {
    return {
      countdownNote,
      readinessTitle: 'Komitmen vendor sudah melewati budget.',
      readinessCopy: 'Score dashboard turun karena biaya vendor melampaui rencana awal. Tinjau vendor terbesar sebelum menambah kebutuhan baru.',
      mobileReadinessCopy: 'Biaya vendor sudah melebihi budget. Tinjau vendor terbesar dulu.',
    }
  }

  if (score >= 70 && (hasUrgentPayment || needsFunds)) {
    return {
      countdownNote,
      readinessTitle: 'Rencana budget kalian baik, tapi pembayaran terdekat perlu perhatian.',
      readinessCopy: needsFunds
        ? `Score ini menilai rencana budget. Tambahkan ${formatRupiahExact(finance.savingsGap)} agar tagihan vendor terdekat tertutup.`
        : 'Score ini menilai rencana budget. Siapkan pembayaran terdekat agar progres tetap aman.',
      mobileReadinessCopy: needsFunds
        ? `Budget terencana baik, tapi tagihan masih kurang ${formatRupiahExact(finance.savingsGap)}.`
        : 'Budget terencana baik, tapi ada pembayaran dekat yang perlu disiapkan.',
    }
  }

  if (score >= 70) {
    return {
      countdownNote,
      readinessTitle: 'Rencana budget kalian sudah berada di jalur yang baik.',
      readinessCopy: 'Pertahankan ritme tabungan dan lanjutkan checklist terdekat agar persiapan tetap terkendali.',
      mobileReadinessCopy: 'Rencana budget terlihat baik. Pertahankan ritme tabungan.',
    }
  }

  if (score >= 40) {
    return {
      countdownNote,
      readinessTitle: hasUrgentPayment || needsFunds
        ? 'Pembayaran terdekat perlu jadi fokus utama.'
        : 'Rencana kalian cukup baik, tinggal dirapikan pelan-pelan.',
      readinessCopy: needsFunds
        ? `Score dashboard ikut turun karena tabungan masih kurang ${formatRupiahExact(finance.savingsGap)} untuk tagihan vendor.`
        : hasUrgentPayment
          ? 'Score dashboard ikut memperhitungkan pembayaran vendor yang sudah dekat.'
          : 'Mulai dari prioritas minggu ini dulu, lalu rapikan bagian budget dan vendor yang paling dekat.',
      mobileReadinessCopy: needsFunds
        ? `Tagihan vendor masih kurang ${formatRupiahExact(finance.savingsGap)} dari tabungan.`
        : hasUrgentPayment
          ? 'Ada pembayaran dekat yang memengaruhi score dashboard.'
          : 'Ada beberapa hal yang bisa dirapikan pelan-pelan.',
    }
  }

  return {
    countdownNote,
    readinessTitle: 'Rencana kalian masih bisa ditata dari hal yang paling dekat.',
    readinessCopy: 'Tidak semua perlu selesai sekaligus. Ambil satu langkah kecil yang paling membantu minggu ini.',
    mobileReadinessCopy: 'Mulai dari satu langkah kecil yang paling dekat.',
  }
}

export function buildDashboardGuidance(input: DashboardGuidanceInput) {
  const finance = calculateDashboardFinance(input)
  const insights: DashboardInsight[] = []
  const hasComfortableBudgetRoom =
    input.totalBudget > 0 &&
    input.vendorPayments.length > 0 &&
    finance.budgetRoom >= input.totalBudget * 0.1
  const add = (insight: DashboardInsight) => {
    if (insights.length < 3) insights.push(insight)
  }

  if (input.totalBudget <= 0) {
    add({
      kind: 'info',
      title: 'Total budget belum tersedia.',
      body: 'Lengkapi rencana budget agar dashboard bisa menghitung ruang aman dan risiko pengeluaran.',
      actionLabel: 'Atur ulang data',
      href: '#dashboard-actions',
    })
  } else if (input.vendorPayments.length === 0) {
    add({
      kind: 'info',
      title: 'Belum ada biaya vendor yang dicatat.',
      body: `Total budget kamu ${formatRupiahExact(input.totalBudget)}. Catat vendor pertama agar sisa ruang budget bisa dipantau.`,
      actionLabel: 'Tambah vendor',
      href: '#vendor-payments',
    })
  } else if (finance.budgetRoom < 0) {
    add({
      kind: 'critical',
      title: `Komitmen vendor melewati budget ${formatRupiahExact(Math.abs(finance.budgetRoom))}.`,
      body: 'Cek vendor dengan biaya terbesar sebelum menambah pembayaran atau kebutuhan baru.',
      actionLabel: 'Cek pembayaran vendor',
      href: '#vendor-payments',
    })
  } else if (finance.vendorCommitted >= input.totalBudget * 0.9) {
    add({
      kind: 'warning',
      title: `Ruang budget tersisa ${formatRupiahExact(finance.budgetRoom)}.`,
      body: 'Komitmen vendor sudah mendekati batas rencana. Sisakan ruang untuk kebutuhan tidak terduga.',
      actionLabel: 'Tinjau vendor',
      href: '#vendor-payments',
    })
  }

  if (finance.vendorOutstanding > 0 && finance.savingsGap > 0) {
    add({
      kind: 'warning',
      title: `Tabungan masih kurang ${formatRupiahExact(finance.savingsGap)} untuk tagihan vendor.`,
      body: 'Tambahkan tabungan atau sesuaikan jadwal pembayaran yang paling dekat lebih dulu.',
      actionLabel: 'Perbarui tabungan',
      href: '#savings',
    })
  }

  if (hasComfortableBudgetRoom) {
    add({
      kind: 'good',
      title: `Kamu masih punya ruang budget ${formatRupiahExact(finance.budgetRoom)}.`,
      body: 'Pertahankan ruang ini sambil melengkapi vendor dan kebutuhan yang belum dicatat.',
      actionLabel: 'Lihat vendor',
      href: '#vendor-payments',
    })
  }

  const committedByCategory = input.vendorPayments.reduce<Record<string, number>>((result, item) => {
    const key = getAllocationKey(item.category)
    if (key) result[key] = (result[key] ?? 0) + item.totalAmount
    return result
  }, {})
  const exceededReference = Object.entries(committedByCategory)
    .map(([key, amount]) => {
      const reference = input.allocation?.[key]?.estimatedAmount ?? 0
      return { key, exceededBy: amount - reference, reference }
    })
    .filter(item => item.reference > 0 && item.exceededBy > 0)
    .sort((a, b) => b.exceededBy - a.exceededBy)[0]

  if (exceededReference) {
    add({
      kind: 'warning',
      title: `${CATEGORY_LABELS[exceededReference.key] ?? exceededReference.key} melewati referensi ${formatRupiahExact(exceededReference.exceededBy)}.`,
      body: 'Bandingkan kembali paket vendor dengan alokasi awal sebelum mengunci kebutuhan tambahan.',
      actionLabel: 'Cek alokasi',
      href: '#allocation',
    })
  } else if (
    input.vendorPayments.length > 0 &&
    (input.allocation?.documentation?.estimatedAmount ?? 0) > 0 &&
    committedByCategory.documentation === undefined
  ) {
    add({
      kind: 'info',
      title: 'Dokumentasi belum dicatat sebagai vendor.',
      body: 'Pastikan foto atau video hari H masuk perhitungan sebelum ruang budget terpakai untuk kebutuhan lain.',
      actionLabel: 'Tambah dokumentasi',
      href: '#vendor-payments',
    })
  }

  if (!input.weddingDate) {
    add({
      kind: 'info',
      title: 'Tanggal rencana belum dilengkapi.',
      body: 'Tanggal membantu dashboard menyusun target tabungan dan checklist berdasarkan waktu yang tersedia.',
      actionLabel: 'Atur ulang data',
      href: '#dashboard-actions',
    })
  }

  return {
    finance,
    insights,
    primaryAction: insights[0],
  }
}
