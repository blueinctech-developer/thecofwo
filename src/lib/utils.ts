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

/**
 * The ministry's timezone. Dates typed in the admin are shown in this zone on the website,
 * so "1 November, 10:00 AM" stays exactly that for every visitor.
 */
export const SITE_TIMEZONE = process.env.SITE_TIMEZONE || 'Africa/Lagos'

const safeZone = (tz?: string | null) => {
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone: tz || SITE_TIMEZONE })
    return tz || SITE_TIMEZONE
  } catch {
    return SITE_TIMEZONE
  }
}

export const formatDate = (
  iso?: string | null,
  opts: Intl.DateTimeFormatOptions = { dateStyle: 'long' },
  tz?: string | null,
) => (iso ? new Intl.DateTimeFormat('en-GB', { ...opts, timeZone: safeZone(tz) }).format(new Date(iso)) : '')

export const formatTime = (iso?: string | null, tz?: string | null) =>
  iso ? new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: safeZone(tz) }).format(new Date(iso)) : ''

/** Day of month and short month name, for date badges. */
export const dateParts = (iso: string, tz?: string | null) => ({
  day: formatDate(iso, { day: 'numeric' }, tz),
  month: formatDate(iso, { month: 'short' }, tz),
})

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
