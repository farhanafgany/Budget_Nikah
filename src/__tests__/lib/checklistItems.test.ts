import { CHECKLIST_ITEMS, type ChecklistItem } from '@/lib/checklistItems'

describe('CHECKLIST_ITEMS', () => {
  it('has at least 50 items', () => {
    expect(CHECKLIST_ITEMS.length).toBeGreaterThanOrEqual(50)
  })

  it('every item has required fields', () => {
    CHECKLIST_ITEMS.forEach((item: ChecklistItem) => {
      expect(typeof item.id).toBe('string')
      expect(item.id.length).toBeGreaterThan(0)
      expect(typeof item.label).toBe('string')
      expect(item.label.length).toBeGreaterThan(0)
      expect(typeof item.category).toBe('string')
      expect([12, 6, 3, 1, 0]).toContain(item.monthsBefore)
    })
  })

  it('has no duplicate IDs', () => {
    const ids = CHECKLIST_ITEMS.map(i => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has items for each timeline group', () => {
    const timelines = new Set(CHECKLIST_ITEMS.map(i => i.monthsBefore))
    expect(timelines).toContain(12)
    expect(timelines).toContain(6)
    expect(timelines).toContain(3)
    expect(timelines).toContain(1)
    expect(timelines).toContain(0)
  })
})
