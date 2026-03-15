-- Dance styles enum
create type dance_style as enum ('bachata', 'salsa', 'kizomba', 'zouk', 'other');

-- Event types enum
create type event_type as enum ('party', 'workshop', 'festival', 'practice');

-- Events table
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue_name text not null,
  venue_address text,
  styles dance_style[] not null default '{}',
  event_type event_type not null,
  price_eur numeric(6,2),         -- null = free
  source_url text,                -- link to original post / ticket page
  organizer_name text,
  organizer_instagram text,
  description text,
  image_url text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for the main query: upcoming published events ordered by date
create index events_starts_at_idx on events (starts_at)
  where is_published = true;

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger events_updated_at
  before update on events
  for each row execute procedure set_updated_at();

-- Public read access (no auth needed for iteration 1)
alter table events enable row level security;

create policy "Public can read published events"
  on events for select
  using (is_published = true);
