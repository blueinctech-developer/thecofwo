import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PhotoGrid } from '@/components/Lightbox'
import { PageBanner } from '@/components/PageBanner'
import { buildMetadata } from '@/lib/meta'
import { getPayloadClient, isPreview, publishedWhere } from '@/lib/payload'
import { toPhotos } from '@/lib/photos'
import { mediaList } from '@/lib/utils'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const getAlbum = async (slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'albums',
    where: { and: [{ slug: { equals: slug } }, await publishedWhere()] },
    draft: await isPreview(),
    limit: 1,
    depth: 1,
  })
  return res.docs[0]
}

export async function generateMetadata({ params }: Props) {
  const a = await getAlbum((await params).slug)
  if (!a) return {}
  return buildMetadata({ title: a.title, description: a.description, image: a.cover ?? mediaList(a.photos)[0], path: `/gallery/${a.slug}` })
}

export default async function AlbumPage({ params }: Props) {
  const a = await getAlbum((await params).slug)
  if (!a) notFound()
  return (
    <>
      <PageBanner title={a.title} intro={a.description} image={a.cover ?? mediaList(a.photos)[0]} compact>
        <Link href="/gallery" className="mt-8 inline-flex items-center gap-2 text-sm text-fg/80 hover:text-fg">
          <ArrowLeft size={16} aria-hidden /> All albums
        </Link>
      </PageBanner>
      <section className="container-x py-16 md:py-24">
        <PhotoGrid photos={toPhotos(mediaList(a.photos))} />
      </section>
    </>
  )
}
