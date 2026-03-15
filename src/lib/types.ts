export type DanceStyle = 'bachata' | 'salsa' | 'kizomba' | 'zouk' | 'other'
export type EventType = 'party' | 'workshop' | 'festival' | 'practice'

export interface Event {
  id: string
  title: string
  starts_at: string
  ends_at: string | null
  venue_name: string
  venue_address: string | null
  styles: DanceStyle[]
  event_type: EventType
  price_eur: number | null
  source_url: string | null
  organizer_name: string | null
  organizer_instagram: string | null
  description: string | null
  image_url: string | null
  is_featured: boolean
  created_at: string
  updated_at: string
}

export type StyleFilter = 'all' | DanceStyle
export type TypeFilter = 'all' | EventType
