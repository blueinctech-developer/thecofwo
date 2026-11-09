import type { Metadata } from 'next'

import type { Media } from '@/payload-types'

import { getSettings } from './payload'
import { mediaUrl } from './utils'

type MetaInput = {
  title: string
  description?: string | null
  image?: Media | number | null
  path: string
  meta?: { title?: string | null; description?: string | null; image?: Media | number | null } | null
  type?: 'website' | 'article'
  publishedTime?: string | null
}

/** Builds page metadata, falling back to the defaults in Site settings. */
export async function buildMetadata({ title, description, image, path, meta, type = 'website', publishedTime }: MetaInput): Promise<Metadata> {
  const s = await getSettings()
  const t = meta?.title || title
  const d = meta?.description || description || s.seoDescription || undefined
  const img = mediaUrl(meta?.image, 'large') || mediaUrl(image, 'large') || mediaUrl(s.ogImage)
  return {
    title: meta?.title ? { absolute: meta.title } : title,
    description: d,
    alternates: { canonical: path },
    openGraph: {
      title: t,
      description: d,
      url: path,
      type,
      publishedTime: publishedTime ?? undefined,
      images: img ? [{ url: img }] : undefined,
    },
  }
}
