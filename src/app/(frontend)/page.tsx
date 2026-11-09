import type { Metadata } from 'next'

import {
  Closing,
  GalleryStrip,
  Gathering,
  Hero,
  LatestPosts,
  Marquee,
  Pillars,
  Testimonies,
  UpcomingEvents,
  Welcome,
} from '@/components/home/sections'
import { getGlobal, getPayloadClient, getSettings, publishedWhere } from '@/lib/payload'
import { mediaUrl } from '@/lib/utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [home, s] = await Promise.all([getGlobal('home-page'), getSettings()])
  const title = home.meta?.title || s.seoTitle || s.siteName
  const og = mediaUrl(home.meta?.image) || mediaUrl(s.ogImage)
  return {
    title: { absolute: title },
    description: home.meta?.description || s.seoDescription || undefined,
    openGraph: { title, images: og ? [{ url: og }] : undefined },
    alternates: { canonical: '/' },
  }
}

export default async function HomePage() {
  const payload = await getPayloadClient()
  const published = await publishedWhere()
  const now = new Date().toISOString()

  const [home, settings, posts, events, testimonies] = await Promise.all([
    getGlobal('home-page'),
    getSettings(),
    payload.find({ collection: 'posts', where: published, sort: '-publishedAt', limit: 3, depth: 1 }),
    payload.find({
      collection: 'events',
      where: { and: [published, { or: [{ endDate: { greater_than_equal: now } }, { startDate: { greater_than_equal: now } }] }] },
      sort: 'startDate',
      limit: 3,
      depth: 0,
    }),
    payload.find({ collection: 'testimonies', where: { show: { equals: true } }, sort: 'order', limit: 8, depth: 0 }),
  ])

  return (
    <>
      <Hero hero={home.hero} />
      <Marquee text={settings.ticker} />
      <Welcome welcome={home.welcome} stats={home.stats} />
      <Pillars settings={settings} />
      <Gathering gathering={home.gathering} />
      <UpcomingEvents section={home.eventsSection} events={events.docs} />
      <Testimonies section={home.testimoniesSection} items={testimonies.docs} />
      <LatestPosts section={home.blogSection} posts={posts.docs} />
      <GalleryStrip section={home.gallerySection} />
      <Closing closing={home.closing} />
    </>
  )
}
