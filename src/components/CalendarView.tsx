'use client'

import { useState, useMemo } from 'react'
import type { Event } from '@/lib/types'
import { EventCard } from './EventCard'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1)
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

// Monday-based grid offset
function gridOffset(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

interface Props {
  events: Event[]
}

export function CalendarView({ events }: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const monthLabel = new Date(year, month, 1).toLocaleDateString('en-GB', {
    month: 'long', year: 'numeric',
  })

  const totalDays = daysInMonth(year, month)
  const offset = gridOffset(year, month)

  // Map date string → events for fast lookup
  const eventsByDay = useMemo(() => {
    const map = new Map<string, Event[]>()
    for (const event of events) {
      const d = new Date(event.starts_at)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = d.getDate().toString()
        if (!map.has(key)) map.set(key, [])
        map.get(key)!.push(event)
      }
    }
    return map
  }, [events, year, month])

  const selectedEvents = useMemo(() => {
    if (!selectedDay) return []
    return events.filter(e => isSameDay(new Date(e.starts_at), selectedDay))
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
    if (selectedDay && isSameDay(d, selectedDay)) {
      setSelectedDay(null)
    } else {
      setSelectedDay(d)
    }
  }

  const cells = Array.from({ length: offset + totalDays }, (_, i) => {
    const day = i - offset + 1
    return day > 0 ? day : null
  })

  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div>
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-gray-800">{monthLabel}</span>
        <button
          onClick={nextMonth}
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition"
        >
          ›
        </button>
      </div>

      {/* Weekday headers */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-xs font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />

          const isToday = isSameDay(new Date(year, month, day), today)
          const hasEvents = eventsByDay.has(day.toString())
          const eventCount = eventsByDay.get(day.toString())?.length ?? 0
          const isSelected = selectedDay ? isSameDay(new Date(year, month, day), selectedDay) : false

          return (
            <button
              key={day}
              onClick={() => hasEvents && selectDay(day)}
              className={`
                relative flex flex-col items-center justify-start rounded-xl py-1.5 transition
                ${hasEvents ? 'cursor-pointer hover:bg-rose-50' : 'cursor-default'}
                ${isSelected ? 'bg-rose-500 text-white hover:bg-rose-500' : ''}
                ${isToday && !isSelected ? 'font-bold text-rose-500' : ''}
                ${!isToday && !isSelected ? 'text-gray-700' : ''}
              `}
            >
              <span className="text-sm leading-none">{day}</span>
              {hasEvents && (
                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: Math.min(eventCount, 3) }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-rose-400'}`}
                    />
                  ))}
                </div>
              )}
            </button>
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

      {/* No events in month hint */}
      {eventsByDay.size === 0 && (
        <p className="mt-6 text-center text-sm text-gray-400">No events this month.</p>
      )}
    </div>
  )
}
