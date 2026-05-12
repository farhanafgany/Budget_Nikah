export function calculateMonthlySavings(
  target: number,
  collected: number,
  monthsLeft: number,
): number {
  const remaining = Math.max(0, target - collected)
  return monthsLeft > 0 ? Math.ceil(remaining / monthsLeft) : remaining
}

export function monthsUntilDate(dateStr: string | null | undefined, now = Date.now()): number {
  if (!dateStr) return 12
  const nowDate = new Date(now)
  const targetDate = new Date(dateStr)
  if (targetDate <= nowDate) return 12

  let months = 0
  let current = new Date(nowDate)
  while (current < targetDate) {
    current.setMonth(current.getMonth() + 1)
    months++
  }
  return Math.max(1, months)
}
