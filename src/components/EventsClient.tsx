'use client'

import { useState, useMemo } from 'react'
import type { Event, StyleFilter, TypeFilter } from '@/lib/types'
import { groupEventsByPeriod } from '@/lib/groupEvents'
import { EventCard } from './EventCard'
import { FilterBar } from './FilterBar'
import { CalendarView } from './CalendarView'

type ViewMode = 'list' | 'calendar'

export function EventsClient({ events }: { events: Event[] }) {
  const [view, setView] = useState<ViewMode>('list')
  const [styleFilter, setStyleFilter] = useState<StyleFilter>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')

  const filtered = useMemo(() => {
    return events.filter(event => {
      const styleMatch = styleFilter === 'all' || event.styles.includes(styleFilter)
      const typeMatch = typeFilter === 'all' || event.event_type === typeFilter
      return styleMatch && typeMatch
    })
  }, [events, styleFilter, typeFilter])

  const groups = useMemo(() => groupEventsByPeriod(filtered), [filtered])

  return (
    <>
      {/* Header: title + view toggle */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">bcn.dance 💃</h1>
          <p className="mt-0.5 text-sm text-gray-500">Social dance events in Barcelona</p>
        </div>
        <div className="flex shrink-0 rounded-xl bg-gray-100 p-0.5">
          <button
            onClick={() => setView('list')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              view === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            Cal
          </button>
        </div>
      </div>

      {/* Filters — full width */}
      <div className="mb-5">
        <FilterBar
          styleFilter={styleFilter}
          typeFilter={typeFilter}
          onStyleChange={setStyleFilter}
          onTypeChange={setTypeFilter}
        />
      </div>

      {/* Calendar view */}
      {view === 'calendar' && <CalendarView events={filtered} />}

      {/* List view */}
      {view === 'list' && (
        <>
          {groups.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <p className="text-4xl">🕺</p>
              <p className="mt-2 text-sm">No events found for these filters.</p>
            </div>
          ) : (
            groups.map(group => (
              <div key={group.label} className="mb-6">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                  {group.label}
                </h2>
                <div className="flex flex-col gap-3">
                  {group.events.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </>
  )
}
