import { getUpcomingEvents } from '@/lib/events'
import { EventsClient } from '@/components/EventsClient'

export const revalidate = 300 // refresh every 5 minutes

export default async function HomePage() {
  const events = await getUpcomingEvents()

  return (
    <main className="mx-auto max-w-lg px-4 pb-12 pt-6">
      <EventsClient events={events} />

      <footer className="mt-10 text-center text-xs text-gray-300">
        Know an event that&apos;s missing?{' '}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-500"
        >
          DM us
        </a>
      </footer>
    </main>
  )
}
