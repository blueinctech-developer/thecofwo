import { ArrowLeft, ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Media } from '@/components/Media'
import { PageBanner } from '@/components/PageBanner'
import { RichText } from '@/components/RichText'
import { SermonCard } from '@/components/SermonCard'
import { VideoEmbed } from '@/components/VideoEmbed'
import { buildMetadata } from '@/lib/meta'
import { getPayloadClient, isPreview, publishedWhere } from '@/lib/payload'
import { formatDate, mediaUrl, siteUrl } from '@/lib/utils'
import { parseVideo } from '@/lib/video'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const getSermon = async (slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'sermons',
    where: { and: [{ slug: { equals: slug } }, await publishedWhere()] },
    draft: await isPreview(),
    limit: 1,
    depth: 1,
  })
  return res.docs[0]
}

export async function generateMetadata({ params }: Props) {
  const s = await getSermon((await params).slug)
  if (!s) return {}
  return buildMetadata({ title: s.title, description: s.summary, image: s.thumbnail, path: `/sermons/${s.slug}`, meta: s.meta })
}

export default async function SermonPage({ params }: Props) {
  const s = await getSermon((await params).slug)
  if (!s) notFound()
  const video = parseVideo(s.videoUrl)
  const payload = await getPayloadClient()
  const more = await payload.find({
    collection: 'sermons',
    where: { and: [{ id: { not_equals: s.id } }, { _status: { equals: 'published' } }] },
    sort: '-date',
    limit: 3,
    depth: 1,
  })

  const jsonLd = video
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: s.title,
        description: s.summary || s.title,
        uploadDate: s.date,
        thumbnailUrl: mediaUrl(s.thumbnail, 'large') ? `${siteUrl()}${mediaUrl(s.thumbnail, 'large')}` : video.thumbnail,
        embedUrl: video.embedUrl,
      }
    : null

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <PageBanner title={s.title} eyebrow={s.series} compact>
        <p className="mt-5 text-fg/85">{[s.speaker, formatDate(s.date), s.scripture].filter(Boolean).join('  |  ')}</p>
      </PageBanner>

      <section className="container-x py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <Link href="/sermons" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-fg">
            <ArrowLeft size={16} aria-hidden /> All sermons
          </Link>
          <div className="mt-6">
            {video ? (
              <VideoEmbed video={video} title={s.title} poster={mediaUrl(s.thumbnail, 'hero')} />
            ) : s.thumbnail ? (
              <div className="aspect-video overflow-hidden rounded-[var(--radius-xl)] bg-ink-3">
                <Media media={s.thumbnail} sizes="(min-width: 1100px) 1024px, 100vw" className="h-full w-full object-cover" />
              </div>
            ) : null}
          </div>
          {s.audioUrl && (
            <div className="card mt-6 p-5">
              <p className="mb-3 text-sm font-semibold">Listen</p>
              <audio controls preload="none" src={s.audioUrl} className="w-full" />
            </div>
          )}
          {s.videoUrl && !video && (
            <a href={s.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">
              Watch this message <ArrowUpRight size={18} weight="bold" aria-hidden />
            </a>
          )}
          {s.summary && <p className="lead mx-auto mt-12 max-w-[70ch] !text-fg">{s.summary}</p>}
          <RichText data={s.notes} className="prose-cofwo mx-auto mt-8 max-w-[70ch]" />
        </div>
      </section>

      {more.docs.length > 0 && (
        <section className="bg-ink-2">
          <div className="container-x py-20 md:py-24">
            <h2 className="display text-3xl md:text-4xl">More messages</h2>
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {more.docs.map((m) => (
                <SermonCard key={m.id} sermon={m} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
