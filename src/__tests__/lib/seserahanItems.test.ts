import { SESERAHAN_ITEMS, type SeserahanItem } from '@/lib/seserahanItems'

describe('SESERAHAN_ITEMS', () => {
  it('has exactly 15 items', () => {
    expect(SESERAHAN_ITEMS.length).toBe(15)
  })

  it('every item has required fields', () => {
    SESERAHAN_ITEMS.forEach((item: SeserahanItem) => {
      expect(typeof item.id).toBe('string')
      expect(item.id.length).toBeGreaterThan(0)
      expect(typeof item.label).toBe('string')
      expect(typeof item.icon).toBe('string')
    })
  })

  it('has no duplicate IDs', () => {
    const ids = SESERAHAN_ITEMS.map(i => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
