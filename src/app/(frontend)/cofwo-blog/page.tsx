import Link from 'next/link'

import { PageBanner } from '@/components/PageBanner'
import { PostCard } from '@/components/PostCard'
import { buildMetadata } from '@/lib/meta'
import { getPayloadClient, publishedWhere } from '@/lib/payload'

export const revalidate = 3600

const PER_PAGE = 12

export async function generateMetadata() {
  return buildMetadata({
    title: 'COFWO Blog',
    description: 'Teaching and encouragement from the Word of God by The Chariot of Fire World Outreach.',
    path: '/cofwo-blog',
  })
}

type Props = { searchParams: Promise<{ page?: string }> }

export default async function BlogPage({ searchParams }: Props) {
  const page = Math.max(1, Number((await searchParams).page) || 1)
  const payload = await getPayloadClient()
  const [posts, categories] = await Promise.all([
    payload.find({ collection: 'posts', where: await publishedWhere(), sort: '-publishedAt', limit: PER_PAGE, page, depth: 1 }),
    payload.find({ collection: 'categories', limit: 20, depth: 0, sort: 'title' }),
  ])
  const [first, ...rest] = posts.docs

  return (
    <>
      <PageBanner title="Insights from God’s Word" eyebrow="The COFWO Blog" compact>
        {categories.docs.length > 1 && (
          <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2">
            {categories.docs.map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} className="btn btn-ghost !py-2 !text-sm">
                {c.title}
              </Link>
            ))}
          </nav>
        )}
      </PageBanner>

      <section className="container-x py-16 md:py-24">
        {!first ? (
          <p className="text-lg text-muted">No articles have been published yet. Please check back soon.</p>
        ) : (
          <>
            {page === 1 ? (
              <div data-reveal>
                <PostCard post={first} size="large" priority />
              </div>
            ) : null}
            <div className="mt-20 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {(page === 1 ? rest : posts.docs).map((p, i) => (
                <div key={p.id} data-reveal style={{ '--d': i % 3 } as React.CSSProperties}>
                  <PostCard post={p} />
                </div>
              ))}
            </div>
            {posts.totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-20 flex items-center justify-center gap-3">
                {posts.hasPrevPage && (
                  <Link href={`/cofwo-blog?page=${page - 1}`} className="btn btn-ghost">
                    Newer articles
                  </Link>
                )}
                <span className="px-3 text-sm text-muted">
                  Page {page} of {posts.totalPages}
                </span>
                {posts.hasNextPage && (
                  <Link href={`/cofwo-blog?page=${page + 1}`} className="btn btn-ghost">
                    Older articles
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
