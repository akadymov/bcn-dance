'use client'

import { useState, useMemo } from 'react'
import type { Event } from '@/lib/types'
import { EventCard } from './EventCard'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const STYLE_COLORS: Record<string, string> = {
  bachata: 'bg-rose-500',
  salsa:   'bg-orange-500',
  kizomba: 'bg-purple-500',
  zouk:    'bg-blue-500',
  other:   'bg-gray-400',
}

function primaryColor(event: Event): string {
  return STYLE_COLORS[event.styles[0]] ?? 'bg-gray-400'
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function gridOffset(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

// Shorten event title to fit in a small cell
function shortTitle(title: string): string {
  const words = title.split(' ')
  // Drop common noise words from the end
  const cleaned = words.filter(w => !['Festival', 'Congress', 'Edition'].includes(w))
  const result = cleaned.join(' ')
  return result.length > 18 ? result.slice(0, 16) + '…' : result
}

export function CalendarView({ events }: { events: Event[] }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const monthLabel = new Date(year, month, 1).toLocaleDateString('en-GB', {
    month: 'long', year: 'numeric',
  })

  const totalDays = daysInMonth(year, month)
  const offset = gridOffset(year, month)

  const eventsByDay = useMemo(() => {
    const map = new Map<number, Event[]>()
    for (const event of events) {
      const d = new Date(event.starts_at)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = d.getDate()
        if (!map.has(key)) map.set(key, [])
        map.get(key)!.push(event)
      }
    }
    return map
  }, [events, year, month])

  const selectedEvents = useMemo(() => {
    if (!selectedDay) return []
    return events
      .filter(e => isSameDay(new Date(e.starts_at), selectedDay))
      .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
  }, [events, selectedDay])

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDay(null)
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDay(null)
  }

  function selectDay(day: number) {
    const d = new Date(year, month, day)
    setSelectedDay(prev => prev && isSameDay(d, prev) ? null : d)
  }

  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div>
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={prevMonth} className="rounded-full px-3 py-2 text-lg text-gray-400 hover:bg-gray-100 transition">
          ‹
        </button>
        <span className="text-sm font-semibold text-gray-800">{monthLabel}</span>
        <button onClick={nextMonth} className="rounded-full px-3 py-2 text-lg text-gray-400 hover:bg-gray-100 transition">
          ›
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1 border-b border-gray-100 pb-2">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-400">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border-l border-t border-gray-100">
        {cells.map((day, idx) => {
          if (!day) {
            return (
              <div key={`empty-${idx}`} className="border-b border-r border-gray-100 min-h-[72px] bg-gray-50/40" />
            )
          }

          const dayEvents = eventsByDay.get(day) ?? []
          const hasEvents = dayEvents.length > 0
          const isToday = isSameDay(new Date(year, month, day), today)
          const isSelected = selectedDay ? isSameDay(new Date(year, month, day), selectedDay) : false
          const overflow = dayEvents.length > 2

          return (
            <div
              key={day}
              onClick={() => hasEvents && selectDay(day)}
              className={`
                border-b border-r border-gray-100 min-h-[72px] p-1 flex flex-col gap-0.5
                ${hasEvents ? 'cursor-pointer' : ''}
                ${isSelected ? 'bg-rose-50' : 'hover:bg-gray-50'}
              `}
            >
              {/* Day number */}
              <div className="flex justify-center mb-0.5">
                <span className={`
                  text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full leading-none
                  ${isToday ? 'bg-rose-500 text-white font-bold' : isSelected ? 'text-rose-600 font-bold' : 'text-gray-700'}
                `}>
                  {day}
                </span>
              </div>

              {/* Event pills */}
              {dayEvents.slice(0, 2).map(event => (
                <div
                  key={event.id}
                  className={`${primaryColor(event)} rounded px-1 py-0.5 flex items-center gap-0.5`}
                >
                  <span className="text-white truncate leading-tight" style={{ fontSize: '9px' }}>
                    {shortTitle(event.title)}
                  </span>
                </div>
              ))}

              {overflow && (
                <div className="text-center" style={{ fontSize: '9px' }}>
                  <span className="text-gray-400">+{dayEvents.length - 2} more</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Selected day events */}
      {selectedDay && (
        <div className="mt-5">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            {selectedDay.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          <div className="flex flex-col gap-3">
            {selectedEvents.length > 0
              ? selectedEvents.map(e => <EventCard key={e.id} event={e} />)
              : <p className="text-sm text-gray-400">No events this day.</p>
            }
          </div>
        </div>
      )}

      {eventsByDay.size === 0 && (
        <p className="mt-6 text-center text-sm text-gray-400">No events this month.</p>
      )}
    </div>
  )
}
