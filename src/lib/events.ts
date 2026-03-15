import { supabase } from './supabase'
import type { Event, StyleFilter, TypeFilter } from './types'

export async function getUpcomingEvents(
  styleFilter: StyleFilter = 'all',
  typeFilter: TypeFilter = 'all'
): Promise<Event[]> {
  let query = supabase
    .from('events')
    .select('*')
    .gte('starts_at', new Date().toISOString())
    .order('is_featured', { ascending: false })
    .order('starts_at', { ascending: true })

  if (styleFilter !== 'all') {
    query = query.contains('styles', [styleFilter])
  }

  if (typeFilter !== 'all') {
    query = query.eq('event_type', typeFilter)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to fetch events:', error.message)
    return []
  }
  return data ?? []
}
