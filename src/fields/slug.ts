import type { CollectionSlug, Field, FieldHook } from 'payload'

export const slugify = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlug =
  (fallback: string): FieldHook =>
  async ({ value, data, originalDoc, collection, req }) => {
    // Keep an existing address so links to the page keep working when the title changes.
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const source = data?.[fallback] ?? originalDoc?.[fallback]
    if (typeof source !== 'string' || !source.trim()) return value
    const base = slugify(source) || 'page'
    if (!collection) return base

    // Add -2, -3… when another entry already uses the address.
    for (let n = 1; n < 50; n++) {
      const candidate = n === 1 ? base : `${base}-${n}`
      const { totalDocs } = await req.payload.count({
        collection: collection.slug as CollectionSlug,
        where: {
          and: [{ slug: { equals: candidate } }, ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : [])],
        },
        overrideAccess: true,
        req,
      })
      if (totalDocs === 0) return candidate
    }
    return `${base}-${Date.now()}`
  }

/** The page's web address. Made from the title automatically, so it is hidden from editors. */
export const slugField = (fallback = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  label: 'Web address',
  admin: { hidden: true },
  hooks: { beforeValidate: [formatSlug(fallback)] },
})
