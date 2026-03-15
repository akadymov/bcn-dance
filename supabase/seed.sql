-- Sample events for local development
insert into events (title, starts_at, ends_at, venue_name, venue_address, styles, event_type, price_eur, source_url, organizer_name, description) values
(
  'Bachata Night Barcelona',
  now() + interval '3 days' + interval '21 hours',
  now() + interval '4 days' + interval '3 hours',
  'Sala Apolo',
  'Carrer de la Nou de la Rambla, 113, Barcelona',
  array['bachata']::dance_style[],
  'party',
  12.00,
  'https://instagram.com',
  'BCN Bachata Club',
  'Weekly bachata night with DJ sets and live performances.'
),
(
  'Salsa & Bachata Open Air',
  now() + interval '5 days' + interval '19 hours',
  now() + interval '5 days' + interval '23 hours',
  'Barceloneta Beach',
  'Passeig Marítim de la Barceloneta, Barcelona',
  array['salsa', 'bachata']::dance_style[],
  'party',
  null,
  'https://instagram.com',
  'Dance Barcelona',
  'Free outdoor social dancing on the beach. All levels welcome.'
),
(
  'Kizomba Sensual Workshop',
  now() + interval '7 days' + interval '18 hours',
  now() + interval '7 days' + interval '20 hours',
  'Espacio de Danza',
  'Carrer de Provença, 98, Barcelona',
  array['kizomba']::dance_style[],
  'workshop',
  20.00,
  'https://instagram.com',
  'Kizomba BCN',
  'Beginner-friendly kizomba workshop. Pairs and singles welcome.'
),
(
  'Mediterranean Bachata Festival',
  now() + interval '45 days' + interval '18 hours',
  now() + interval '48 days' + interval '2 hours',
  'Hotel Arts Barcelona',
  'Carrer de la Marina, 19-21, Barcelona',
  array['bachata', 'salsa', 'kizomba']::dance_style[],
  'festival',
  180.00,
  'https://instagram.com',
  'MBF Official',
  '3-day international festival with world-class artists, workshops and social dancing.'
);
