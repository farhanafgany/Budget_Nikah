import { buildVendorReminderSummary, updateVendorDueDate } from '@/lib/dashboardReminders'
import type { VendorPaymentInput } from '@/lib/dashboardActions'

function payment(overrides: Partial<VendorPaymentInput>): VendorPaymentInput {
  return {
    id: 'vendor-1',
    name: 'Venue Mawar',
    category: 'Venue',
    totalAmount: 10_000_000,
    paidAmount: 2_000_000,
    dueDate: '',
    ...overrides,
  }
}

describe('buildVendorReminderSummary', () => {
  const today = new Date('2026-05-27T12:00:00+07:00')

  it('counts urgent unpaid vendor bills and sums the amount needing attention', () => {
    const summary = buildVendorReminderSummary([
      payment({ id: 'late', dueDate: '2026-05-26', totalAmount: 10_000_000, paidAmount: 1_000_000 }),
      payment({ id: 'soon', dueDate: '2026-06-01', totalAmount: 8_000_000, paidAmount: 3_000_000 }),
      payment({ id: 'safe', dueDate: '2026-07-10', totalAmount: 7_000_000, paidAmount: 0 }),
      payment({ id: 'paid', dueDate: '2026-05-25', totalAmount: 2_000_000, paidAmount: 2_000_000 }),
    ], today)

    expect(summary.overdueCount).toBe(1)
    expect(summary.dueSoonCount).toBe(1)
    expect(summary.unscheduledCount).toBe(0)
    expect(summary.urgentOutstanding).toBe(14_000_000)
  })

  it('surfaces unpaid vendors without a deadline separately from urgent bills', () => {
    const summary = buildVendorReminderSummary([
      payment({ dueDate: '' }),
      payment({ id: 'invalid', dueDate: 'bukan-tanggal' }),
    ], today)

    expect(summary.unscheduledCount).toBe(2)
    expect(summary.overdueCount).toBe(0)
    expect(summary.dueSoonCount).toBe(0)
    expect(summary.urgentOutstanding).toBe(0)
  })
})

describe('updateVendorDueDate', () => {
  it('updates only the selected vendor deadline', () => {
    const original = [
      payment({ id: 'venue', dueDate: '' }),
      payment({ id: 'catering', dueDate: '2026-06-01' }),
    ]

    const updated = updateVendorDueDate(original, 'venue', '2026-06-07')

    expect(updated[0].dueDate).toBe('2026-06-07')
    expect(updated[1].dueDate).toBe('2026-06-01')
    expect(original[0].dueDate).toBe('')
  })
})
