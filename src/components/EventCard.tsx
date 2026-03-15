import type { Event } from '@/lib/types'
import { StyleBadge } from './StyleBadge'

const EVENT_TYPE_LABEL: Record<string, string> = {
  party:    'Party',
  workshop: 'Workshop',
  festival: 'Festival',
  practice: 'Practice',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatPrice(price: number | null): string {
  if (price === null) return 'Free'
  return `€${price % 1 === 0 ? price.toFixed(0) : price.toFixed(2)}`
}

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const Wrapper = event.source_url ? 'a' : 'div'
  const wrapperProps = event.source_url
    ? { href: event.source_url, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md active:scale-[0.99]"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {event.is_featured && (
            <span className="mb-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
              ★ Featured
            </span>
          )}
          <h2 className="truncate text-base font-semibold text-gray-900 leading-snug">
            {event.title}
          </h2>
          {event.organizer_name && (
            <p className="mt-0.5 text-xs text-gray-400">{event.organizer_name}</p>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
          {EVENT_TYPE_LABEL[event.event_type]}
        </span>
      </div>

      {/* Date & time */}
      <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-700">
        <span>📅</span>
        <span className="font-medium">{formatDate(event.starts_at)}</span>
        <span className="text-gray-400">·</span>
        <span>{formatTime(event.starts_at)}</span>
        {event.ends_at && (
          <>
            <span className="text-gray-400">–</span>
            <span>{formatTime(event.ends_at)}</span>
          </>
        )}
      </div>

      {/* Venue */}
      <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
        <span>📍</span>
        <span className="truncate">{event.venue_name}</span>
      </div>

      {/* Styles & price */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {event.styles.map(style => (
            <StyleBadge key={style} style={style} />
          ))}
        </div>
        <span className={`shrink-0 text-sm font-semibold ${event.price_eur === null ? 'text-green-600' : 'text-gray-700'}`}>
          {formatPrice(event.price_eur)}
        </span>
      </div>

      {/* Description */}
      {event.description && (
        <p className="mt-2 line-clamp-2 text-xs text-gray-400 leading-relaxed">
          {event.description}
        </p>
      )}
    </Wrapper>
  )
}
