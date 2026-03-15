import type { Event } from './types'

export interface EventGroup {
  label: string
  events: Event[]
}

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfWeek(date: Date): Date {
  const d = startOfDay(date)
  d.setDate(d.getDate() - d.getDay() + 1) // Monday
  return d
}

export function groupEventsByPeriod(events: Event[]): EventGroup[] {
  const now = new Date()
  const todayStart = startOfDay(now)
  const thisWeekEnd = new Date(startOfWeek(now))
  thisWeekEnd.setDate(thisWeekEnd.getDate() + 7)
  const nextWeekEnd = new Date(thisWeekEnd)
  nextWeekEnd.setDate(nextWeekEnd.getDate() + 7)
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const groups: Record<string, Event[]> = {
    'This week': [],
    'Next week': [],
    'This month': [],
    'Later': [],
  }

  for (const event of events) {
    const date = new Date(event.starts_at)
    if (date < todayStart) continue // skip past events

    if (date < thisWeekEnd) {
      groups['This week'].push(event)
    } else if (date < nextWeekEnd) {
      groups['Next week'].push(event)
    } else if (date < thisMonthEnd) {
      groups['This month'].push(event)
    } else {
      groups['Later'].push(event)
    }
  }

  return Object.entries(groups)
    .filter(([, evs]) => evs.length > 0)
    .map(([label, evs]) => ({ label, events: evs }))
}
