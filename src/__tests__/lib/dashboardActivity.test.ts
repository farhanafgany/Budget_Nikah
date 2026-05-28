import { buildDashboardActivities } from '@/lib/dashboardActivity'
import type { SavingsHistoryInput, VendorPaymentInput } from '@/lib/dashboardActions'

function vendor(overrides: Partial<VendorPaymentInput> = {}): VendorPaymentInput {
  return {
    id: 'vendor-1',
    name: 'Venue Mawar',
    category: 'Venue',
    totalAmount: 10_000_000,
    paidAmount: 2_000_000,
    dueDate: '2026-06-01',
    installments: [],
    ...overrides,
  }
}

function saving(overrides: Partial<SavingsHistoryInput> = {}): SavingsHistoryInput {
  return {
    id: 'saving-1',
    type: 'add',
    amount: 1_000_000,
    balanceAfter: 5_000_000,
    date: '2026-05-20T08:00:00.000Z',
    ...overrides,
  }
}

describe('buildDashboardActivities', () => {
  it('sorts urgent vendor deadlines before older savings activity', () => {
    const items = buildDashboardActivities({
      savingsHistory: [saving()],
      vendorPayments: [vendor()],
      checklistProgress: { completed: 0, total: 50, percentage: 0 },
      now: new Date('2026-05-28T00:00:00.000Z'),
    })

    expect(items[0].id).toBe('vendor-deadline-vendor-1')
    expect(items[0].tone).toBe('warning')
    expect(items.map(item => item.title)).toContain('Tabungan bertambah Rp 1.000.000')
  })

  it('marks the latest installment as paid when the vendor is fully paid', () => {
    const items = buildDashboardActivities({
      savingsHistory: [],
      vendorPayments: [
        vendor({
          paidAmount: 10_000_000,
          installments: [
            { id: 'dp', amount: 2_000_000, date: '2026-05-01' },
            { id: 'final', amount: 8_000_000, date: '2026-05-25' },
          ],
        }),
      ],
      checklistProgress: { completed: 0, total: 50, percentage: 0 },
      now: new Date('2026-05-28T00:00:00.000Z'),
    })

    expect(items[0]).toMatchObject({
      id: 'vendor-installment-vendor-1-final',
      meta: 'Vendor lunas',
      tone: 'good',
    })
  })

  it('adds checklist progress as a current snapshot', () => {
    const items = buildDashboardActivities({
      savingsHistory: [],
      vendorPayments: [],
      checklistProgress: { completed: 12, total: 50, percentage: 24 },
      now: new Date('2026-05-28T00:00:00.000Z'),
    })

    expect(items).toEqual([
      expect.objectContaining({
        id: 'checklist-progress',
        title: 'Checklist 24% selesai',
        meta: 'Status sekarang',
      }),
    ])
  })
})
