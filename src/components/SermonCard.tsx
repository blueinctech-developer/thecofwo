/* eslint-disable @next/next/no-img-element */
import { Play } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import { formatDate, mediaUrl } from '@/lib/utils'
import { parseVideo } from '@/lib/video'
import type { Sermon } from '@/payload-types'

export function SermonCard({ sermon }: { sermon: Sermon }) {
  const thumb = mediaUrl(sermon.thumbnail, 'card') || parseVideo(sermon.videoUrl)?.thumbnail
  return (
    <article className="group relative">
      <div className="relative aspect-video overflow-hidden rounded-[var(--radius-xl)] bg-ink-3">
        {thumb && (
          <img
            src={thumb}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
        )}
        {sermon.videoUrl && (
          <span className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-full bg-fire text-white shadow-lg">
            <Play size={18} weight="fill" className="translate-x-px" aria-hidden />
          </span>
        )}
      </div>
      <p className="mt-4 text-sm text-muted">{[sermon.speaker, formatDate(sermon.date)].filter(Boolean).join('  |  ')}</p>
      <h3 className="mt-1.5 text-xl font-semibold leading-snug tracking-tight">
        <Link href={`/sermons/${sermon.slug}`} className="after:absolute after:inset-0">
          {sermon.title}
        </Link>
      </h3>
      {sermon.scripture && <p className="mt-1 text-sm font-medium text-fire-soft">{sermon.scripture}</p>}
    </article>
  )
}
