import { CHECKLIST_ITEMS, type ChecklistItem, type ChecklistTimeline } from './checklistItems'

interface SummaryChecklistOptions {
  daysUntilWedding: number | null
  checkedIds: string[]
  hiddenIds: string[]
  limit?: number
}

function getFocusWindow(days: number): ChecklistTimeline {
  if (days <= 7) return 0
  if (days <= 45) return 1
  if (days <= 120) return 3
  if (days <= 240) return 6
  return 12
}

export function buildSummaryChecklistPriorities({
  daysUntilWedding,
  checkedIds,
  hiddenIds,
  limit = 5,
}: SummaryChecklistOptions): ChecklistItem[] {
  if (daysUntilWedding === null) return []

  const pendingItems = CHECKLIST_ITEMS.filter(item =>
    !checkedIds.includes(item.id) && !hiddenIds.includes(item.id))
  const focusWindow = getFocusWindow(daysUntilWedding)
  const currentItems = pendingItems.filter(item => item.monthsBefore === focusWindow)

  return (currentItems.length > 0 ? currentItems : pendingItems).slice(0, limit)
}
