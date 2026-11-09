import { getPayloadClient, getSettings } from '@/lib/payload'
import { siteUrl } from '@/lib/utils'

export const revalidate = 3600

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!)

/** RSS feed of blog posts (kept at the same address as the old site). */
export async function GET() {
  const base = siteUrl()
  const payload = await getPayloadClient()
  const [settings, posts] = await Promise.all([
    getSettings(),
    payload.find({ collection: 'posts', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 30, depth: 0 }),
  ])

  const items = posts.docs
    .map(
      (p) => `<item>
  <title>${esc(p.title)}</title>
  <link>${base}/${p.slug}</link>
  <guid isPermaLink="true">${base}/${p.slug}</guid>
  ${p.publishedAt ? `<pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>` : ''}
  ${p.excerpt ? `<description>${esc(p.excerpt)}</description>` : ''}
</item>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(settings.siteName)} Blog</title>
  <link>${base}/cofwo-blog</link>
  <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
  <description>${esc(settings.seoDescription || settings.tagline || '')}</description>
  <language>en</language>
${items}
</channel>
</rss>`

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
