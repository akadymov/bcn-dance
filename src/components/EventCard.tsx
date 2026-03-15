import type { Event } from '@/lib/types'
import { StyleBadge } from './StyleBadge'

const EVENT_TYPE_LABEL: Record<string, string> = {
  party:    'Party',
  workshop: 'Workshop',
  festival: 'Festival',
  practice: 'Practice',
}

const EVENT_TYPE_EMOJI: Record<string, string> = {
  party:    '🎉',
  workshop: '🎓',
  festival: '🌟',
  practice: '🕺',
}

function formatDayNum(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric' })
}

function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()
}

function formatWeekday(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short' })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function formatPrice(price: number | null): string {
  if (price === null) return 'Free'
  return `from €${price % 1 === 0 ? price.toFixed(0) : price.toFixed(2)}`
}

export function EventCard({ event }: { event: Event }) {
  const Wrapper = event.source_url ? 'a' : 'div'
  const wrapperProps = event.source_url
    ? { href: event.source_url, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md active:scale-[0.99]"
    >
      {/* Date column */}
      <div className="flex w-12 shrink-0 flex-col items-center justify-start rounded-xl bg-gray-50 py-2">
        <span className="text-xs font-semibold text-gray-400">{formatWeekday(event.starts_at)}</span>
        <span className="text-2xl font-bold leading-tight text-gray-900">{formatDayNum(event.starts_at)}</span>
        <span className="text-xs font-semibold text-rose-500">{formatMonth(event.starts_at)}</span>
      </div>

      {/* Content */}
      <div className="flex flex-1 min-w-0 flex-col gap-1">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-900 leading-snug">
            {event.is_featured && <span className="mr-1 text-amber-400">★</span>}
            {event.title}
          </h2>
          <span className="shrink-0 text-base">{EVENT_TYPE_EMOJI[event.event_type]}</span>
        </div>

        {/* Venue & time */}
        <p className="text-xs text-gray-500 truncate">
          {formatTime(event.starts_at)} · {event.venue_name}
        </p>

        {/* Styles & price */}
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {event.styles.map(style => (
              <StyleBadge key={style} style={style} />
            ))}
          </div>
          <span className={`shrink-0 text-xs font-semibold ${event.price_eur === null ? 'text-green-600' : 'text-gray-500'}`}>
            {formatPrice(event.price_eur)}
          </span>
        </div>
      </div>
    </Wrapper>
  )
}
