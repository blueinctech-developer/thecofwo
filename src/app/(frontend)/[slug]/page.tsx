import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PageBanner } from '@/components/PageBanner'
import { PostCard } from '@/components/PostCard'
import { RichText } from '@/components/RichText'
import { buildMetadata } from '@/lib/meta'
import { getPayloadClient, getSettings, isPreview, publishedWhere } from '@/lib/payload'
import { formatDate, mediaUrl, readingTime, siteUrl } from '@/lib/utils'
import type { Category, Page, Post } from '@/payload-types'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

/**
 * One URL pattern serves both "Other pages" and blog posts, which keeps the
 * blog addresses the old site used (e.g. /its-your-time-to-shine).
 */
const findDoc = async (slug: string): Promise<{ kind: 'page'; doc: Page } | { kind: 'post'; doc: Post } | null> => {
  const payload = await getPayloadClient()
  const draft = await isPreview()
  const where = { and: [{ slug: { equals: slug } }, await publishedWhere()] }
  const page = await payload.find({ collection: 'pages', where, limit: 1, depth: 2, draft })
  if (page.docs[0]) return { kind: 'page', doc: page.docs[0] }
  const post = await payload.find({ collection: 'posts', where, limit: 1, depth: 2, draft })
  if (post.docs[0]) return { kind: 'post', doc: post.docs[0] }
  return null
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const opts = { where: { _status: { equals: 'published' as const } }, limit: 500, depth: 0, select: { slug: true } }
  const [pages, posts] = await Promise.all([
    payload.find({ collection: 'pages', ...opts }),
    payload.find({ collection: 'posts', ...opts }),
  ])
  return [...pages.docs, ...posts.docs].filter((d) => d.slug).map((d) => ({ slug: d.slug! }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const found = await findDoc(slug)
  if (!found) return {}
  const { doc } = found
  return buildMetadata({
    title: doc.title,
    description: found.kind === 'post' ? found.doc.excerpt : found.doc.intro,
    image: doc.heroImage,
    path: `/${slug}`,
    meta: doc.meta,
    type: found.kind === 'post' ? 'article' : 'website',
    publishedTime: found.kind === 'post' ? found.doc.publishedAt : undefined,
  })
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  const found = await findDoc(slug)
  if (!found) notFound()

  if (found.kind === 'page') {
    const p = found.doc
    return (
      <>
        <PageBanner title={p.title} eyebrow={p.eyebrow} intro={p.intro} image={p.heroImage} compact />
        <section className="container-x py-16 md:py-24">
          <RichText data={p.content} className="prose-cofwo mx-auto max-w-[72ch]" />
        </section>
      </>
    )
  }

  const post = found.doc
  const cats = (post.categories ?? []).filter((c): c is Category => typeof c === 'object')
  const payload = await getPayloadClient()
  const [related, settings] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { and: [{ id: { not_equals: post.id } }, { _status: { equals: 'published' } }] },
      sort: '-publishedAt',
      limit: 3,
      depth: 1,
    }),
    getSettings(),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || undefined,
    image: mediaUrl(post.heroImage, 'large') ? `${siteUrl()}${mediaUrl(post.heroImage, 'large')}` : undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt,
    author: { '@type': 'Organization', name: post.authorName || settings.siteName },
    publisher: { '@type': 'Organization', name: settings.siteName, logo: { '@type': 'ImageObject', url: `${siteUrl()}/cofwo-logo.png` } },
    mainEntityOfPage: `${siteUrl()}/${post.slug}`,
  }

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageBanner title={post.title} image={post.heroImage} compact>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-fg/85">
          {cats.map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="font-semibold text-fire-soft hover:underline">
              {c.title}
            </Link>
          ))}
          <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
          <span>{readingTime(post.content)} min read</span>
          {post.authorName && <span>By {post.authorName}</span>}
        </div>
      </PageBanner>
      <div className="container-x pt-10">
        <Link href="/cofwo-blog" className="mx-auto flex max-w-[70ch] items-center gap-2 text-sm font-medium text-muted hover:text-fg">
          <ArrowLeft size={16} aria-hidden /> All articles
        </Link>
        {post.excerpt && <p className="lead mx-auto mt-8 max-w-[70ch] !text-[1.3rem] !text-fg">{post.excerpt}</p>}
      </div>
      <div className="container-x pb-16 pt-8 md:pb-24">
        <RichText data={post.content} className="prose-cofwo mx-auto max-w-[70ch]" />
      </div>

      {related.docs.length > 0 && (
        <section className="bg-ink-2">
          <div className="container-x py-20 md:py-24">
            <h2 className="display text-3xl md:text-4xl">Keep reading</h2>
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.docs.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
