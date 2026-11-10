import { CLOSING_MINUTES, isOpenDate, parseISODate, timeToMinutes } from '../shared/services'

export { formatDuration } from '../shared/services'

const MONTHS_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const WEEKDAYS_SHORT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function isoDate(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayISO(): string {
  return isoDate()
}

export function dateFromISO(iso: string): Date {
  return parseISODate(iso) ?? new Date()
}

export function addDays(iso: string, days: number): string {
  const date = dateFromISO(iso)
  date.setDate(date.getDate() + days)
  return isoDate(date)
}

export function isToday(iso: string): boolean {
  return iso === todayISO()
}

export function isTomorrow(iso: string): boolean {
  return iso === addDays(todayISO(), 1)
}

export function weekdayShort(iso: string): string {
  return WEEKDAYS_SHORT[dateFromISO(iso).getDay()] ?? ''
}

export function dayNumber(iso: string): string {
  return String(dateFromISO(iso).getDate()).padStart(2, '0')
}

export function monthShort(iso: string): string {
  return MONTHS_SHORT[dateFromISO(iso).getMonth()] ?? ''
}

export function monthLong(iso: string): string {
  return new Intl.DateTimeFormat('pt-PT', { month: 'long' }).format(dateFromISO(iso))
}

export function formatLongDate(iso: string, withYear = false): string {
  const options: Intl.DateTimeFormatOptions = withYear
    ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    : { weekday: 'long', day: 'numeric', month: 'long' }
  return capitalize(new Intl.DateTimeFormat('pt-PT', options).format(dateFromISO(iso)))
}

export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'short' }).format(dateFromISO(iso))
}

export function relativeDay(iso: string): string {
  if (isToday(iso)) return 'Hoje'
  if (isTomorrow(iso)) return 'Amanhã'
  return formatLongDate(iso)
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatDateTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatTimeOfDay(date = new Date()): string {
  return new Intl.DateTimeFormat('pt-PT', { hour: '2-digit', minute: '2-digit' }).format(date)
}

export function memberSince(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('pt-PT', { month: 'long', year: 'numeric' }).format(date)
}

export function isPastSlot(dateISO: string, time: string): boolean {
  const today = todayISO()
  if (dateISO < today) return true
  if (dateISO > today) return false
  const now = new Date()
  return timeToMinutes(time) <= now.getHours() * 60 + now.getMinutes()
}

export function isPastAppointment(dateISO: string, time: string): boolean {
  return isPastSlot(dateISO, time)
}

export function nextOpenDays(count: number, from = new Date()): string[] {
  const days: string[] = []
  const minutesNow = from.getHours() * 60 + from.getMinutes()
  const cursor = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate() + (minutesNow >= CLOSING_MINUTES ? 1 : 0),
  )
  let guard = 0
  while (days.length < count && guard < count * 3 + 14) {
    const iso = isoDate(cursor)
    if (isOpenDate(iso)) days.push(iso)
    cursor.setDate(cursor.getDate() + 1)
    guard += 1
  }
  return days
}

export function todayLabel(): string {
  return capitalize(
    new Intl.DateTimeFormat('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(
      new Date(),
    ),
  )
}

export function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 19) return 'Boa tarde'
  return 'Boa noite'
}
