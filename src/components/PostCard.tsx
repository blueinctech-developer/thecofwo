import Link from 'next/link'

import type { Category, Post } from '@/payload-types'
import { formatDate } from '@/lib/utils'

import { Media } from './Media'

type Props = { post: Post; size?: 'large' | 'default' | 'compact'; priority?: boolean }

export function PostCard({ post, size = 'default', priority }: Props) {
  const cats = (post.categories ?? []).filter((c): c is Category => typeof c === 'object')
  const large = size === 'large'
  const compact = size === 'compact'

  const meta = (
    <div className="flex items-center gap-3 text-sm text-muted">
      {cats[0] && <span className="font-medium text-fire-soft">{cats[0].title}</span>}
      <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
    </div>
  )

  if (compact) {
    return (
      <article className="group relative grid grid-cols-[38%_1fr] items-center gap-5">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-ink-3">
          <Media
            media={post.heroImage}
            sizes="(min-width: 1024px) 15vw, 38vw"
            className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
        </div>
        <div>
          {meta}
          <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight">
            <Link href={`/${post.slug}`} className="after:absolute after:inset-0">
              {post.title}
            </Link>
          </h3>
        </div>
      </article>
    )
  }

  return (
    <article className="group relative">
      <div className={`overflow-hidden rounded-[var(--radius-xl)] bg-ink-3 ${large ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
        <Media
          media={post.heroImage}
          priority={priority}
          sizes={large ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw'}
          className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-5">{meta}</div>
      <h3 className={`mt-2 font-semibold leading-snug tracking-tight ${large ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
        <Link href={`/${post.slug}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h3>
      {post.excerpt && (
        <p className={`mt-3 text-muted ${large ? 'max-w-[60ch] text-lg' : 'line-clamp-3'}`}>{post.excerpt}</p>
      )}
    </article>
  )
}
