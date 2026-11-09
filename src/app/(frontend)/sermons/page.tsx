import Link from 'next/link'

import { Button } from '@/components/Button'
import { PageBanner } from '@/components/PageBanner'
import { SermonCard } from '@/components/SermonCard'
import { buildMetadata } from '@/lib/meta'
import { getPayloadClient, getSettings, publishedWhere } from '@/lib/payload'

export const revalidate = 3600

const PER_PAGE = 12

export async function generateMetadata() {
  return buildMetadata({
    title: 'Sermons',
    description: 'Watch and listen to messages from The Chariot of Fire World Outreach.',
    path: '/sermons',
  })
}

type Props = { searchParams: Promise<{ page?: string }> }

export default async function SermonsPage({ searchParams }: Props) {
  const page = Math.max(1, Number((await searchParams).page) || 1)
  const payload = await getPayloadClient()
  const [sermons, settings] = await Promise.all([
    payload.find({ collection: 'sermons', where: await publishedWhere(), sort: '-date', limit: PER_PAGE, page, depth: 1 }),
    getSettings(),
  ])

  return (
    <>
      <PageBanner title="Sermons" intro="Watch and listen to recent messages, or join us live.">
        {(settings.livestreamUrl || settings.videoChannelUrl) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {settings.livestreamUrl && <Button link={{ label: 'Watch live', url: settings.livestreamUrl, newTab: true }} />}
            {settings.videoChannelUrl && (
              <Button link={{ label: 'Video channel', url: settings.videoChannelUrl, newTab: true }} variant="ghost" />
            )}
          </div>
        )}
      </PageBanner>

      <section className="container-x py-16 md:py-24">
        {sermons.docs.length === 0 ? (
          <div className="card max-w-2xl p-8 md:p-10">
            <h2 className="text-2xl font-semibold">Messages are coming soon</h2>
            <p className="mt-3 text-muted">
              We are preparing recordings of recent services. In the meantime,{' '}
              <Link href="/contact-us" className="font-semibold text-fire-soft underline underline-offset-4">
                contact us
              </Link>{' '}
              to ask how to join a service.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {sermons.docs.map((s, i) => (
                <div key={s.id} data-reveal style={{ '--d': i % 3 } as React.CSSProperties}>
                  <SermonCard sermon={s} />
                </div>
              ))}
            </div>
            {sermons.totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-20 flex items-center justify-center gap-3">
                {sermons.hasPrevPage && (
                  <Link href={`/sermons?page=${page - 1}`} className="btn btn-ghost">
                    Newer
                  </Link>
                )}
                <span className="px-3 text-sm text-muted">
                  Page {page} of {sermons.totalPages}
                </span>
                {sermons.hasNextPage && (
                  <Link href={`/sermons?page=${page + 1}`} className="btn btn-ghost">
                    Older
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </section>
    </>
  )
}
