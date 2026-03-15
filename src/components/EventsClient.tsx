'use client'

import { useState, useMemo } from 'react'
import type { Event, StyleFilter, TypeFilter } from '@/lib/types'
import { groupEventsByPeriod } from '@/lib/groupEvents'
import { EventCard } from './EventCard'
import { FilterBar } from './FilterBar'

export function EventsClient({ events }: { events: Event[] }) {
  const [styleFilter, setStyleFilter] = useState<StyleFilter>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')

  const groups = useMemo(() => {
    const filtered = events.filter(event => {
      const styleMatch = styleFilter === 'all' || event.styles.includes(styleFilter)
      const typeMatch = typeFilter === 'all' || event.event_type === typeFilter
      return styleMatch && typeMatch
    })
    return groupEventsByPeriod(filtered)
  }, [events, styleFilter, typeFilter])

  const total = groups.reduce((sum, g) => sum + g.events.length, 0)

  return (
    <>
      <FilterBar
        styleFilter={styleFilter}
        typeFilter={typeFilter}
        onStyleChange={setStyleFilter}
        onTypeChange={setTypeFilter}
      />

      <div className="mt-5">
        {total === 0 ? (
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
      </div>
    </>
  )
}
