import type { Media } from '@/payload-types'

export const siteUrl = () =>
  (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
    'http://localhost:3000'
  ).replace(/\/$/, '')

/** URL of a media item (or undefined), made relative when it points at this site. */
export const mediaUrl = (m?: Media | number | null, size?: 'thumbnail' | 'card' | 'large' | 'hero') => {
  if (!m || typeof m !== 'object') return undefined
  const url = (size && m.sizes?.[size]?.url) || m.url
  if (!url) return undefined
  const base = process.env.NEXT_PUBLIC_SERVER_URL
  return base && url.startsWith(base) ? url.slice(base.length) : url
}

export const asMedia = (m?: Media | number | null): Media | null => (m && typeof m === 'object' ? m : null)

export const mediaList = (list?: (Media | number)[] | null): Media[] =>
  (list ?? []).filter((m): m is Media => Boolean(m && typeof m === 'object'))

export const formatDate = (iso?: string | null, opts: Intl.DateTimeFormatOptions = { dateStyle: 'long' }) =>
  iso ? new Intl.DateTimeFormat('en-GB', { ...opts, timeZone: 'UTC' }).format(new Date(iso)) : ''

/** Splits a heading so the highlighted words can be styled. */
export const splitHighlight = (heading: string, highlight?: string | null) => {
  if (!highlight) return { before: heading, match: '', after: '' }
  const i = heading.toLowerCase().indexOf(highlight.toLowerCase())
  if (i < 0) return { before: heading, match: '', after: '' }
  return { before: heading.slice(0, i), match: heading.slice(i, i + highlight.length), after: heading.slice(i + highlight.length) }
}

export const readingTime = (content: unknown) => {
  const words = JSON.stringify(content ?? '').match(/"text":"([^"]*)"/g)?.join(' ').split(/\s+/).length ?? 0
  return Math.max(1, Math.round(words / 220))
}
