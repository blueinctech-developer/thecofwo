import Link from 'next/link'

import { PhotoGrid } from '@/components/Lightbox'
import { Media } from '@/components/Media'
import { PageBanner } from '@/components/PageBanner'
import { buildMetadata } from '@/lib/meta'
import { getPayloadClient, publishedWhere } from '@/lib/payload'
import { toPhotos } from '@/lib/photos'
import { formatDate, mediaList } from '@/lib/utils'

export const revalidate = 3600

export async function generateMetadata() {
  return buildMetadata({
    title: 'Gallery',
    description: 'Photos from services, outreaches and The Gathering at The Chariot of Fire World Outreach.',
    path: '/gallery',
  })
}

export default async function GalleryPage() {
  const payload = await getPayloadClient()
  const albums = await payload.find({ collection: 'albums', where: await publishedWhere(), sort: 'order', limit: 50, depth: 1 })
  const docs = albums.docs

  // With a single album, show its photos straight away.
  if (docs.length === 1) {
    const a = docs[0]
    return (
      <>
        <PageBanner title="Gallery" intro={a.description} image={a.cover ?? mediaList(a.photos)[0]} compact />
        <section className="container-x py-16 md:py-24">
          <PhotoGrid photos={toPhotos(mediaList(a.photos))} />
        </section>
      </>
    )
  }

  return (
    <>
      <PageBanner title="Gallery" intro="Moments of worship, prayer and fellowship from across the ministry." compact />
      <section className="container-x py-16 md:py-24">
        {docs.length === 0 ? (
          <p className="text-lg text-muted">Photos are coming soon.</p>
        ) : (
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {docs.map((a, i) => {
              const photos = mediaList(a.photos)
              const cover = typeof a.cover === 'object' && a.cover ? a.cover : photos[0]
              return (
                <article key={a.id} className="group relative" data-reveal style={{ '--d': i % 3 } as React.CSSProperties}>
                  <div className="aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)] bg-ink-3">
                    <Media media={cover} sizes="(min-width: 1024px) 30vw, 50vw" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold">
                    <Link href={`/gallery/${a.slug}`} className="after:absolute after:inset-0">
                      {a.title}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {[a.date && formatDate(a.date), `${photos.length} photos`].filter(Boolean).join(', ')}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
