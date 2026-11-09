import { ArrowLeft, CalendarBlank, CalendarPlus, Clock, Globe, MapPin } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/Button'
import { PageBanner } from '@/components/PageBanner'
import { hasText, RichText } from '@/components/RichText'
import { buildMetadata } from '@/lib/meta'
import { getPayloadClient, isPreview, publishedWhere } from '@/lib/payload'
import { formatDate, formatTime, siteUrl } from '@/lib/utils'

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
  const tz = e.startDate_tz
  const gcal = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '')
  const end = e.endDate || new Date(new Date(e.startDate).getTime() + 2 * 3600 * 1000).toISOString()
  const calendarUrl = `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: 'TEMPLATE',
    text: e.title,
    dates: `${gcal(e.startDate)}/${gcal(end)}`,
    details: `${e.summary ?? ''}

${siteUrl()}/events/${e.slug}`.trim(),
    location: e.location ?? '',
  })}`
  const time = (iso: string) => formatTime(iso, tz)

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
            <dl className="card space-y-5 p-7">
              <div className="flex gap-3">
                <CalendarBlank size={22} className="shrink-0 text-fire-soft" aria-hidden />
                <div>
                  <dt className="sr-only">Date</dt>
                  <dd>
                    {formatDate(e.startDate, { dateStyle: 'full' }, tz)}
                    {e.endDate && formatDate(e.endDate, undefined, tz) !== formatDate(e.startDate, undefined, tz) && (
                      <> to {formatDate(e.endDate, { dateStyle: 'full' }, tz)}</>
                    )}
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
            {hasText(e.details) ? (
              <RichText data={e.details} className="prose-cofwo max-w-[68ch]" />
            ) : (
              e.summary && <p className="lead max-w-[60ch] !text-fg">{e.summary}</p>
            )}
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <CalendarPlus size={18} aria-hidden /> Add to Google Calendar
              </a>
              <Link href="/contact-us" className="btn btn-ghost">
                Ask a question
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
