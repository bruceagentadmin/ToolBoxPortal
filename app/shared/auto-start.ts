export const AUTO_START_WEEKDAYS = [1, 2, 3, 4, 5] as const

export const AUTO_START_DAY_OPTIONS = [
  { value: 0, label: '週日' },
  { value: 1, label: '週一' },
  { value: 2, label: '週二' },
  { value: 3, label: '週三' },
  { value: 4, label: '週四' },
  { value: 5, label: '週五' },
  { value: 6, label: '週六' }
] as const

export function normalizeAutoStartDays(days?: number[]): number[] {
  if (!Array.isArray(days) || days.length === 0) {
    return [...AUTO_START_WEEKDAYS]
  }

  return Array.from(
    new Set(
      days
        .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
        .sort((a, b) => a - b)
    )
  )
}

export function shouldAutoStartToday(days?: number[], currentDay = new Date().getDay()): boolean {
  return normalizeAutoStartDays(days).includes(currentDay)
}
