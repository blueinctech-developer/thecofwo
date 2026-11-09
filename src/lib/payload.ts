import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

import type { Config } from '@/payload-types'

export const getPayloadClient = () => getPayload({ config: configPromise })

/** True when a signed-in editor is previewing unpublished changes. */
export const isPreview = async () => {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}

type GlobalSlug = keyof Config['globals']

export const getGlobal = cache(async <S extends GlobalSlug>(slug: S): Promise<Config['globals'][S]> => {
  const payload = await getPayloadClient()
  const draft = await isPreview()
  return payload.findGlobal({ slug, depth: 2, draft }) as Promise<Config['globals'][S]>
})

export const getSettings = () => getGlobal('site-settings')
export const getNavigation = () => getGlobal('navigation')

/** Published-only filter, unless an editor is previewing. */
export const publishedWhere = async (): Promise<Where> =>
  (await isPreview()) ? {} : { _status: { equals: 'published' } }
