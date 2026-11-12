import type { LightboxPhoto } from '@/components/Lightbox'
import type { Media } from '@/payload-types'

import { mediaUrl } from './utils'

export const toPhotos = (list: Media[]): LightboxPhoto[] =>
  list
    .filter((m) => m.url)
    .map((m) => ({
      id: m.id,
      thumb: mediaUrl(m, 'card') || mediaUrl(m)!,
      full: mediaUrl(m, 'large') || mediaUrl(m)!,
      srcSet: [
        m.sizes?.large?.url && `${mediaUrl(m, 'large')} ${m.sizes.large.width}w`,
        m.sizes?.hero?.url && `${mediaUrl(m, 'hero')} ${m.sizes.hero.width}w`,
      ]
        .filter(Boolean)
        .join(', ') || undefined,
      alt: m.alt || '',
      width: m.sizes?.card?.width ?? m.width,
      height: m.sizes?.card?.height ?? m.height,
    }))
