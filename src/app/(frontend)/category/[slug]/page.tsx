import { notFound } from 'next/navigation'

import { PageBanner } from '@/components/PageBanner'
import { PostCard } from '@/components/PostCard'
import { buildMetadata } from '@/lib/meta'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const getCategory = async (slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  return res.docs[0]
}

export async function generateMetadata({ params }: Props) {
  const cat = await getCategory((await params).slug)
  if (!cat) return {}
  return buildMetadata({ title: `${cat.title} articles`, description: cat.description, path: `/category/${cat.slug}` })
}

export default async function CategoryPage({ params }: Props) {
  const cat = await getCategory((await params).slug)
  if (!cat) notFound()
  const payload = await getPayloadClient()
  const posts = await payload.find({
    collection: 'posts',
    where: { and: [{ categories: { contains: cat.id } }, { _status: { equals: 'published' } }] },
    sort: '-publishedAt',
    limit: 50,
    depth: 1,
  })

  return (
    <>
      <PageBanner title={cat.title} eyebrow="Category" intro={cat.description} compact />
      <section className="container-x py-16 md:py-24">
        {posts.docs.length ? (
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {posts.docs.map((p, i) => (
              <div key={p.id} data-reveal style={{ '--d': i % 3 } as React.CSSProperties}>
                <PostCard post={p} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-muted">No articles in this category yet.</p>
        )}
      </section>
    </>
  )
}
