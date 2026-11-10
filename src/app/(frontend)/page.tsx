import type { Metadata } from 'next'

import {
  Closing,
  GalleryStrip,
  GatheringBand,
  Hero,
  LatestMessage,
  LatestPosts,
  Leaders,
  Partner,
  Statement,
  Testimonies,
  UpcomingEvents,
  VisitCards,
} from '@/components/home/sections'
import { getGlobal, getPayloadClient, getSettings, publishedWhere } from '@/lib/payload'
import { mediaList, mediaUrl } from '@/lib/utils'

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

  const [home, settings, about, give, posts, events, testimonies, sermons] = await Promise.all([
    getGlobal('home-page'),
    getSettings(),
    getGlobal('about-page'),
    getGlobal('give-page'),
    payload.find({ collection: 'posts', where: published, sort: '-publishedAt', limit: 3, depth: 1 }),
    payload.find({
      collection: 'events',
      where: { and: [published, { or: [{ endDate: { greater_than_equal: now } }, { startDate: { greater_than_equal: now } }] }] },
      sort: 'startDate',
      limit: 3,
      depth: 1,
    }),
    payload.find({ collection: 'testimonies', where: { show: { equals: true } }, sort: 'order', limit: 8, depth: 0 }),
    payload.find({ collection: 'sermons', where: published, sort: '-date', limit: 1, depth: 1 }),
  ])

  return (
    <>
      <Hero hero={home.hero} settings={settings} />
      <VisitCards
        visit={home.visit}
        connect={home.connect}
        fallbackImage={mediaList(home.gathering?.images)[1]}
        settings={settings}
      />
      <Statement welcome={home.welcome} settings={settings} />
      <GatheringBand gathering={home.gathering} />
      <LatestMessage section={home.sermonsSection} sermon={sermons.docs[0]} settings={settings} />
      <UpcomingEvents section={home.eventsSection} events={events.docs} />
      <Leaders leaders={about.leaders} />
      <Testimonies section={home.testimoniesSection} items={testimonies.docs} />
      <Partner give={give} />
      <LatestPosts section={home.blogSection} posts={posts.docs} />
      <GalleryStrip section={home.gallerySection} />
      <Closing closing={home.closing} />
    </>
  )
}
