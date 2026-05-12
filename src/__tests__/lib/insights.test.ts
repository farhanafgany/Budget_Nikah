import { generateInsights } from '@/lib/insights'
import { calculateAllocation } from '@/lib/allocation'

const base = {
  totalBudget: 100_000_000,
  guestCount: 300,
  weddingStyle: 'elegant',
  planningPriority: 'balanced',
  weddingCity: 'Jakarta',
}

describe('generateInsights', () => {
  it('returns between 3 and 5 insights', () => {
    const allocation = calculateAllocation(base)
    const insights = generateInsights({ ...base, allocation, score: 65 })
    expect(insights.length).toBeGreaterThanOrEqual(3)
    expect(insights.length).toBeLessThanOrEqual(5)
  })

  it('shows catering_dominant insight when catering > 45%', () => {
    const input = { ...base, weddingStyle: 'traditional' }
    const allocation = calculateAllocation(input)
    const insights = generateInsights({ ...input, allocation, score: 60 })
    expect(insights.some(i => i.type === 'catering_dominant')).toBe(true)
  })

  it('shows luxury_budget_mismatch when luxury + low budget', () => {
    const input = { ...base, weddingStyle: 'luxury', totalBudget: 50_000_000 }
    const allocation = calculateAllocation(input)
    const insights = generateInsights({ ...input, allocation, score: 30 })
    expect(insights.some(i => i.type === 'luxury_budget_mismatch')).toBe(true)
  })

  it('each insight has message, type, and icon', () => {
    const allocation = calculateAllocation(base)
    const insights = generateInsights({ ...base, allocation, score: 65 })
    insights.forEach(i => {
      expect(i).toHaveProperty('message')
      expect(i).toHaveProperty('type')
      expect(i).toHaveProperty('icon')
    })
  })
})
