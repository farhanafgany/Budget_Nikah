import type { VendorPaymentInput } from '@/app/dashboard/actions'

export type VendorPaymentStatus = 'paid' | 'overdue' | 'dueSoon' | 'safe' | 'unscheduled'

export interface VendorPaymentStatusInfo {
  status: VendorPaymentStatus
  label: string
  color: string
  background: string
  daysUntilDue: number | null
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function getVendorPaymentStatus(payment: VendorPaymentInput, now = new Date()): VendorPaymentStatusInfo {
  if (payment.totalAmount > 0 && payment.paidAmount >= payment.totalAmount) {
    return {
      status: 'paid',
      label: 'Lunas',
      color: '#2F7A3F',
      background: '#DFF3E2',
      daysUntilDue: null,
    }
  }

  if (!payment.dueDate) {
    return {
      status: 'unscheduled',
      label: 'Belum ada deadline',
      color: 'var(--nikah-muted)',
      background: 'var(--nikah-bg)',
      daysUntilDue: null,
    }
  }

  const due = startOfDay(new Date(payment.dueDate))
  if (Number.isNaN(due.getTime())) {
    return {
      status: 'unscheduled',
      label: 'Belum ada deadline',
      color: 'var(--nikah-muted)',
      background: 'var(--nikah-bg)',
      daysUntilDue: null,
    }
  }

  const today = startOfDay(now)
  const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilDue < 0) {
    return {
      status: 'overdue',
      label: `Lewat ${Math.abs(daysUntilDue)} hari`,
      color: '#B42318',
      background: '#FEE4E2',
      daysUntilDue,
    }
  }

  if (daysUntilDue <= 7) {
    return {
      status: 'dueSoon',
      label: daysUntilDue === 0 ? 'Jatuh tempo hari ini' : `${daysUntilDue} hari lagi`,
      color: '#9A5B00',
      background: '#FEF0C7',
      daysUntilDue,
    }
  }

  return {
    status: 'safe',
    label: 'Aman',
    color: '#2F7A3F',
    background: '#DFF3E2',
    daysUntilDue,
  }
}
