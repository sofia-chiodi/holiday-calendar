export const MONTHS_SHORT = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
] as const

export function parseHolidayDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function daysUntil(isoDate: string, from = new Date()): number {
  const start = startOfDay(from).getTime()
  const target = startOfDay(parseHolidayDate(isoDate)).getTime()
  return Math.round((target - start) / (1000 * 60 * 60 * 24))
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatLongDate(isoDate: string): string {
  return capitalize(
    parseHolidayDate(isoDate).toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }),
  )
}

export function formatMonthYear(month: number, year: number): string {
  return capitalize(
    new Date(year, month, 1).toLocaleDateString('es-AR', {
      month: 'long',
      year: 'numeric',
    }),
  )
}

export function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}
