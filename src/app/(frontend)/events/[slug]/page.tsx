import { ArrowLeft, CalendarBlank, Clock, Globe, MapPin } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/Button'
import { PageBanner } from '@/components/PageBanner'
import { RichText } from '@/components/RichText'
import { buildMetadata } from '@/lib/meta'
import { getPayloadClient, isPreview, publishedWhere } from '@/lib/payload'
import { formatDate, siteUrl } from '@/lib/utils'

export const revalidate = 600

type Props = { params: Promise<{ slug: string }> }

const getEvent = async (slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'events',
    where: { and: [{ slug: { equals: slug } }, await publishedWhere()] },
    draft: await isPreview(),
    limit: 1,
    depth: 1,
  })
  return res.docs[0]
}

export async function generateMetadata({ params }: Props) {
  const e = await getEvent((await params).slug)
  if (!e) return {}
  return buildMetadata({ title: e.title, description: e.summary, image: e.image, path: `/events/${e.slug}`, meta: e.meta })
}

const formats = { 'in-person': 'In person', online: 'Online', hybrid: 'In person and online' } as const

export default async function EventPage({ params }: Props) {
  const e = await getEvent((await params).slug)
  if (!e) notFound()
  const time = (iso: string) =>
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }).format(new Date(iso))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    startDate: e.startDate,
    endDate: e.endDate || undefined,
    description: e.summary || undefined,
    eventAttendanceMode:
      e.format === 'online'
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : e.format === 'hybrid'
          ? 'https://schema.org/MixedEventAttendanceMode'
          : 'https://schema.org/OfflineEventAttendanceMode',
    location: e.location ? { '@type': 'Place', name: e.location, address: e.location } : undefined,
    url: `${siteUrl()}/events/${e.slug}`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageBanner title={e.title} intro={e.summary} image={e.image} compact>
        <Link href="/events" className="mt-8 inline-flex items-center gap-2 text-sm text-fg/80 hover:text-fg">
          <ArrowLeft size={16} aria-hidden /> All events
        </Link>
      </PageBanner>
      <section className="container-x py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <aside className="lg:order-2 lg:col-span-4">
            <dl className="space-y-5 rounded-[var(--radius-xl)] border border-line bg-ink-2 p-7">
              <div className="flex gap-3">
                <CalendarBlank size={22} className="shrink-0 text-fire-soft" aria-hidden />
                <div>
                  <dt className="sr-only">Date</dt>
                  <dd>
                    {formatDate(e.startDate, { dateStyle: 'full' })}
                    {e.endDate && formatDate(e.endDate) !== formatDate(e.startDate) && <> to {formatDate(e.endDate, { dateStyle: 'full' })}</>}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock size={22} className="shrink-0 text-fire-soft" aria-hidden />
                <div>
                  <dt className="sr-only">Time</dt>
                  <dd>
                    {time(e.startDate)}
                    {e.endDate && <> to {time(e.endDate)}</>}
                  </dd>
                </div>
              </div>
              {e.location && (
                <div className="flex gap-3">
                  <MapPin size={22} className="shrink-0 text-fire-soft" aria-hidden />
                  <div>
                    <dt className="sr-only">Location</dt>
                    <dd>{e.location}</dd>
                  </div>
                </div>
              )}
              {e.format && (
                <div className="flex gap-3">
                  <Globe size={22} className="shrink-0 text-fire-soft" aria-hidden />
                  <div>
                    <dt className="sr-only">Format</dt>
                    <dd>{formats[e.format]}</dd>
                  </div>
                </div>
              )}
            </dl>
            {e.ctaUrl && (
              <Button link={{ label: e.ctaLabel || 'Register', url: e.ctaUrl, newTab: /^https?:/.test(e.ctaUrl) }} className="mt-5 w-full" />
            )}
          </aside>
          <div className="lg:col-span-8">
            <RichText data={e.details} className="prose-cofwo max-w-[68ch]" />
          </div>
        </div>
      </section>
    </>
  )
}
