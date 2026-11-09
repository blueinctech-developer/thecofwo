import { UpcomingEvents } from '@/components/home/sections'
import { PageBanner } from '@/components/PageBanner'
import { buildMetadata } from '@/lib/meta'
import { getPayloadClient, publishedWhere } from '@/lib/payload'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export const revalidate = 600

export async function generateMetadata() {
  return buildMetadata({
    title: 'Events',
    description: 'Services, conferences and gatherings at The Chariot of Fire World Outreach.',
    path: '/events',
  })
}

export default async function EventsPage() {
  const payload = await getPayloadClient()
  const published = await publishedWhere()
  const now = new Date().toISOString()
  const [upcoming, past] = await Promise.all([
    payload.find({
      collection: 'events',
      where: { and: [published, { or: [{ endDate: { greater_than_equal: now } }, { startDate: { greater_than_equal: now } }] }] },
      sort: 'startDate',
      limit: 50,
      depth: 0,
    }),
    payload.find({
      collection: 'events',
      where: { and: [published, { startDate: { less_than: now } }, { or: [{ endDate: { less_than: now } }, { endDate: { exists: false } }] }] },
      sort: '-startDate',
      limit: 12,
      depth: 0,
    }),
  ])

  return (
    <>
      <PageBanner title="Events" intro="Join us in worship, prayer and fellowship." compact />
      {upcoming.docs.length ? (
        <UpcomingEvents section={{ show: true, heading: 'Coming up' }} events={upcoming.docs} />
      ) : (
        <section className="container-x py-20">
          <p className="text-lg text-muted">
            No upcoming events are listed right now.{' '}
            <Link href="/contact-us" className="text-fire-soft underline underline-offset-4">
              Contact us
            </Link>{' '}
            to hear about our next gathering.
          </p>
        </section>
      )}
      {past.docs.length > 0 && (
        <section className="container-x pb-12">
          <h2 className="text-xl font-semibold text-muted">Past events</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {past.docs.map((e) => (
              <li key={e.id}>
                <Link href={`/events/${e.slug}`} className="block rounded-xl border border-line p-5 hover:border-line-strong">
                  <span className="block font-medium">{e.title}</span>
                  <span className="text-sm text-muted">{formatDate(e.startDate)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
