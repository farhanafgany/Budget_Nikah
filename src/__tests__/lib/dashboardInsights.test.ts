import { buildDashboardGuidance, calculateDashboardFinance } from '@/lib/dashboardInsights'
import type { VendorPaymentInput } from '@/lib/dashboardActions'

function payment(overrides: Partial<VendorPaymentInput> = {}): VendorPaymentInput {
  return {
    id: 'vendor-1',
    name: 'Venue Mawar',
    category: 'Venue',
    totalAmount: 40_000_000,
    paidAmount: 10_000_000,
    dueDate: '',
    ...overrides,
  }
}

describe('calculateDashboardFinance', () => {
  it('separates remaining budget room from unpaid vendor bills', () => {
    const finance = calculateDashboardFinance({
      totalBudget: 100_000_000,
      savingsCollected: 20_000_000,
      vendorPayments: [payment()],
    })

    expect(finance.vendorCommitted).toBe(40_000_000)
    expect(finance.budgetRoom).toBe(60_000_000)
    expect(finance.vendorOutstanding).toBe(30_000_000)
    expect(finance.savingsGap).toBe(10_000_000)
    expect(finance.status).toBe('attention')
  })

  it('marks vendor commitments above the plan as critical', () => {
    const finance = calculateDashboardFinance({
      totalBudget: 100_000_000,
      savingsCollected: 120_000_000,
      vendorPayments: [payment({ totalAmount: 110_000_000, paidAmount: 110_000_000 })],
    })

    expect(finance.budgetRoom).toBe(-10_000_000)
    expect(finance.status).toBe('critical')
  })
})

describe('buildDashboardGuidance', () => {
  it('prompts an empty dashboard to record its first vendor', () => {
    const guidance = buildDashboardGuidance({
      totalBudget: 100_000_000,
      savingsCollected: 0,
      vendorPayments: [],
      allocation: null,
      weddingDate: '2027-05-01',
    })

    expect(guidance.primaryAction.href).toBe('#vendor-payments')
    expect(guidance.insights[0].title).toContain('Belum ada biaya vendor')
  })

  it('puts an overbudget warning first and states the exact amount', () => {
    const guidance = buildDashboardGuidance({
      totalBudget: 100_000_000,
      savingsCollected: 0,
      vendorPayments: [payment({ totalAmount: 108_500_000 })],
      allocation: null,
      weddingDate: '2027-05-01',
    })

    expect(guidance.insights[0].kind).toBe('critical')
    expect(guidance.insights[0].title).toContain('Rp 8.500.000')
    expect(guidance.primaryAction.href).toBe('#vendor-payments')
  })

  it('flags documentation when planned but no documentation vendor is recorded', () => {
    const guidance = buildDashboardGuidance({
      totalBudget: 100_000_000,
      savingsCollected: 50_000_000,
      vendorPayments: [payment({ totalAmount: 30_000_000, paidAmount: 30_000_000 })],
      allocation: {
        documentation: { percentage: 8, estimatedAmount: 8_000_000 },
      },
      weddingDate: '2027-05-01',
    })

    expect(guidance.insights.some(item => item.title.includes('Dokumentasi belum dicatat'))).toBe(true)
  })

  it('prioritizes an unpaid bill not covered by savings over available budget room', () => {
    const guidance = buildDashboardGuidance({
      totalBudget: 100_000_000,
      savingsCollected: 40_000,
      vendorPayments: [payment({ totalAmount: 1_000_000, paidAmount: 0 })],
      allocation: null,
      weddingDate: '2027-05-01',
    })

    expect(guidance.insights[0].title).toContain('Tabungan masih kurang')
    expect(guidance.primaryAction.href).toBe('#savings')
  })
})
