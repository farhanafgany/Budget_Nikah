import type { VendorPaymentInput } from './dashboardActions'
import { getVendorPaymentStatus } from './vendorPayments'

export interface VendorReminderSummary {
  overdueCount: number
  dueSoonCount: number
  unscheduledCount: number
  urgentOutstanding: number
}

export function buildVendorReminderSummary(
  payments: VendorPaymentInput[],
  now = new Date(),
): VendorReminderSummary {
  const summary: VendorReminderSummary = {
    overdueCount: 0,
    dueSoonCount: 0,
    unscheduledCount: 0,
    urgentOutstanding: 0,
  }

  payments.forEach(payment => {
    const remaining = Math.max(0, payment.totalAmount - payment.paidAmount)
    if (remaining <= 0) return

    const status = getVendorPaymentStatus(payment, now).status
    if (status === 'overdue') {
      summary.overdueCount += 1
      summary.urgentOutstanding += remaining
    } else if (status === 'dueSoon') {
      summary.dueSoonCount += 1
      summary.urgentOutstanding += remaining
    } else if (status === 'unscheduled') {
      summary.unscheduledCount += 1
    }
  })

  return summary
}

export function updateVendorDueDate(
  payments: VendorPaymentInput[],
  vendorId: string,
  dueDate: string,
): VendorPaymentInput[] {
  return payments.map(payment => payment.id === vendorId
    ? { ...payment, dueDate }
    : payment)
}
