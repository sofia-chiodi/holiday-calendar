import type { Holiday } from '../types/holiday'

const HOLIDAY_ICONS: Array<[RegExp, string]> = [
  [/año nuevo|new year/i, '✨'],
  [/carnaval/i, '🎭'],
  [/memoria por la verdad|verdad y la justicia/i, '🕯️'],
  [/viernes santo|holy friday|pascuas/i, '🌿'],
  [/malvinas|veteranos/i, '🕊️'],
  [/trabajador/i, '⚒️'],
  [/revolución de mayo/i, '🇦🇷'],
  [/güemes|guemes/i, '⛰️'],
  [/belgrano/i, '💛'],
  [/independencia/i, '🎆'],
  [/san martín|san martin/i, '🏇'],
  [/diversidad cultural/i, '🌍'],
  [/soberanía|soberania/i, '💙'],
  [/inmaculada|concepción|concepcion/i, '🤍'],
  [/navidad|christmas/i, '🎄'],
]

export function holidayIcon(holiday: Holiday): string {
  return (
    HOLIDAY_ICONS.find(([pattern]) => pattern.test(holiday.localName))?.[1] ??
    '📅'
  )
}

export function holidayKey(holiday: Holiday): string {
  return `${holiday.date}-${holiday.localName}`
}

export function typeLabel(type: string): string {
  const labels: Record<string, string> = {
    Public: 'Feriado nacional',
    Bank: 'Bancario',
    School: 'Escolar',
    Authorities: 'Administrativo',
    Optional: 'Optativo',
  }
  return labels[type] ?? type
}
