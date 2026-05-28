import type { SavingsHistoryInput, VendorPaymentInput } from './dashboardActions'
import type { DashboardChecklistProgress } from './dashboardInsights'
import { formatRupiahExact } from './utils'
import { getVendorPaymentStatus } from './vendorPayments'

export type DashboardActivityTone = 'good' | 'info' | 'warning' | 'critical'

export interface DashboardActivityItem {
  id: string
  title: string
  body: string
  meta: string
  tone: DashboardActivityTone
  href: string
  sortTime: number
}

export interface DashboardActivityInput {
  savingsHistory: SavingsHistoryInput[]
  vendorPayments: VendorPaymentInput[]
  checklistProgress: DashboardChecklistProgress
  now?: Date
  limit?: number
}

function parseTime(value: string) {
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? 0 : time
}

function formatDateLabel(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Tanggal belum valid'
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  })
}

export function buildDashboardActivities({
  savingsHistory,
  vendorPayments,
  checklistProgress,
  now = new Date(),
  limit = 5,
}: DashboardActivityInput): DashboardActivityItem[] {
  const activities: DashboardActivityItem[] = []

  savingsHistory.forEach(item => {
    activities.push({
      id: `savings-${item.id}`,
      title: item.type === 'add'
        ? `Tabungan bertambah ${formatRupiahExact(item.amount)}`
        : `Saldo dikoreksi ${formatRupiahExact(item.amount)}`,
      body: `Saldo tabungan menjadi ${formatRupiahExact(item.balanceAfter)}.`,
      meta: formatDateLabel(item.date),
      tone: item.type === 'add' ? 'good' : 'warning',
      href: '#savings',
      sortTime: parseTime(item.date),
    })
  })

  vendorPayments.forEach(vendor => {
    const installments = vendor.installments ?? []
    const latestInstallmentTime = installments.reduce((latest, installment) => (
      Math.max(latest, parseTime(installment.date))
    ), 0)

    installments.forEach(installment => {
      activities.push({
        id: `vendor-installment-${vendor.id}-${installment.id}`,
        title: `Pembayaran ${vendor.name} dicatat`,
        body: `${formatRupiahExact(installment.amount)} untuk ${vendor.category}.`,
        meta: vendor.paidAmount >= vendor.totalAmount && parseTime(installment.date) === latestInstallmentTime
          ? 'Vendor lunas'
          : formatDateLabel(installment.date),
        tone: vendor.paidAmount >= vendor.totalAmount ? 'good' : 'info',
        href: '#vendor-payments',
        sortTime: parseTime(installment.date),
      })
    })

    const status = getVendorPaymentStatus(vendor, now)
    const remaining = Math.max(0, vendor.totalAmount - vendor.paidAmount)
    if (remaining > 0 && (status.status === 'overdue' || status.status === 'dueSoon')) {
      activities.push({
        id: `vendor-deadline-${vendor.id}`,
        title: status.status === 'overdue'
          ? `Pembayaran ${vendor.name} terlambat`
          : `Pembayaran ${vendor.name} segera jatuh tempo`,
        body: `${formatRupiahExact(remaining)} masih perlu disiapkan.`,
        meta: status.label,
        tone: status.status === 'overdue' ? 'critical' : 'warning',
        href: '#vendor-payments',
        sortTime: now.getTime() + 1,
      })
    }
  })

  if (checklistProgress.total > 0 && checklistProgress.completed > 0) {
    activities.push({
      id: 'checklist-progress',
      title: `Checklist ${checklistProgress.percentage}% selesai`,
      body: `${checklistProgress.completed} dari ${checklistProgress.total} item persiapan sudah ditandai selesai.`,
      meta: 'Status sekarang',
      tone: checklistProgress.percentage >= 70 ? 'good' : 'info',
      href: '#checklist',
      sortTime: 1,
    })
  }

  return activities
    .sort((a, b) => b.sortTime - a.sortTime)
    .slice(0, limit)
}
