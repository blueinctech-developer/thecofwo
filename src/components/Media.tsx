/* eslint-disable @next/next/no-img-element */
import type { Media as MediaDoc } from '@/payload-types'

type Props = {
  media?: MediaDoc | number | null
  className?: string
  /** Hint for the browser about how wide the image is shown, e.g. "(min-width: 768px) 50vw, 100vw" */
  sizes?: string
  priority?: boolean
  alt?: string
}

/** Turns absolute URLs that point at this site back into relative ones. */
const clean = (url?: string | null) => {
  if (!url) return undefined
  const base = process.env.NEXT_PUBLIC_SERVER_URL
  return base && url.startsWith(base) ? url.slice(base.length) : url
}

/**
 * Shows a photo from the media library with responsive sizes.
 * Payload has already made WebP copies at several widths, so the browser picks the best one.
 */
export function Media({ media, className, sizes = '100vw', priority, alt }: Props) {
  if (!media || typeof media !== 'object' || !media.url) return null

  const candidates = [
    media.sizes?.card,
    media.sizes?.large,
    media.sizes?.hero,
    { url: media.url, width: media.width },
  ].filter((s): s is { url: string; width: number } => Boolean(s?.url && s?.width))

  const seen = new Set<number>()
  const srcSet = candidates
    .filter((s) => (seen.has(s.width) ? false : (seen.add(s.width), true)))
    .map((s) => `${clean(s.url)} ${s.width}w`)
    .join(', ')

  const focal =
    media.focalX != null && media.focalY != null ? `${media.focalX}% ${media.focalY}%` : undefined

  return (
    <img
      src={clean(media.sizes?.large?.url || media.url)}
      srcSet={srcSet || undefined}
      sizes={sizes}
      alt={alt ?? media.alt ?? ''}
      width={media.width ?? undefined}
      height={media.height ?? undefined}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={className}
      style={focal ? { objectPosition: focal } : undefined}
    />
  )
}
