'use client'

import { useState, useMemo } from 'react'
import type { Event, StyleFilter, TypeFilter } from '@/lib/types'
import { EventCard } from './EventCard'
import { FilterBar } from './FilterBar'

interface EventsClientProps {
  events: Event[]
}

export function EventsClient({ events }: EventsClientProps) {
  const [styleFilter, setStyleFilter] = useState<StyleFilter>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')

  const filtered = useMemo(() => {
    return events.filter(event => {
      const styleMatch = styleFilter === 'all' || event.styles.includes(styleFilter)
      const typeMatch = typeFilter === 'all' || event.event_type === typeFilter
      return styleMatch && typeMatch
    })
  }, [events, styleFilter, typeFilter])

  return (
    <>
      <FilterBar
        styleFilter={styleFilter}
        typeFilter={typeFilter}
        onStyleChange={setStyleFilter}
        onTypeChange={setTypeFilter}
      />

      <div className="mt-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-4xl">🕺</p>
            <p className="mt-2 text-sm">No events found for these filters.</p>
          </div>
        ) : (
          filtered.map(event => <EventCard key={event.id} event={event} />)
        )}
      </div>
    </>
  )
}
