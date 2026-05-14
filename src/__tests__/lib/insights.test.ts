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

  it('shows katering warn when catering > 45%', () => {
    const input = { ...base, weddingStyle: 'traditional' }
    const allocation = calculateAllocation(input)
    const insights = generateInsights({ ...input, allocation, score: 60 })
    expect(insights.some(i => i.kind === 'warn' && i.title.toLowerCase().includes('katering'))).toBe(true)
  })

  it('shows luxury warn when luxury + low budget', () => {
    const input = { ...base, weddingStyle: 'luxury', totalBudget: 50_000_000 }
    const allocation = calculateAllocation(input)
    const insights = generateInsights({ ...input, allocation, score: 30 })
    expect(insights.some(i => i.kind === 'warn' && i.title.toLowerCase().includes('luxury'))).toBe(true)
  })

  it('each insight has kind, title, and body', () => {
    const allocation = calculateAllocation(base)
    const insights = generateInsights({ ...base, allocation, score: 65 })
    insights.forEach(i => {
      expect(i).toHaveProperty('kind')
      expect(i).toHaveProperty('title')
      expect(i).toHaveProperty('body')
    })
  })
})
