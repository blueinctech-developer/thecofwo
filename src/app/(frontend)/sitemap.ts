import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { siteUrl } from '@/lib/utils'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const payload = await getPayloadClient()
  const published = { _status: { equals: 'published' as const } }
  const opts = { limit: 1000, depth: 0, select: { slug: true, updatedAt: true } } as const

  const [posts, pages, events, albums, categories] = await Promise.all([
    payload.find({ collection: 'posts', where: published, ...opts }),
    payload.find({ collection: 'pages', where: published, ...opts }),
    payload.find({ collection: 'events', where: published, ...opts }),
    payload.find({ collection: 'albums', where: published, ...opts }),
    payload.find({ collection: 'categories', ...opts }),
  ])

  const fixed = ['', '/about-us', '/contact-us', '/cofwo-blog', '/gallery', '/events', '/give'].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.8,
  }))

  const entry = (prefix: string) => (d: { slug?: string | null; updatedAt: string }) => ({
    url: `${base}${prefix}${d.slug}`,
    lastModified: d.updatedAt,
  })

  return [
    ...fixed,
    ...posts.docs.map(entry('/')),
    ...pages.docs.map(entry('/')),
    ...events.docs.map(entry('/events/')),
    ...albums.docs.map(entry('/gallery/')),
    ...categories.docs.map(entry('/category/')),
  ]
}
