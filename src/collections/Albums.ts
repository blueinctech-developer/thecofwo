import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staff } from '../access'
import { slugField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

export const Albums: CollectionConfig = {
  slug: 'albums',
  labels: { singular: 'Gallery album', plural: 'Gallery albums' },
  admin: {
    useAsTitle: 'title',
    group: 'Ministry',
    defaultColumns: ['title', 'date', 'order', '_status'],
    description: 'Photo albums on the Gallery page. Drag photos to change their order.',
    preview: (doc) => (doc?.slug ? `/next/preview?path=/gallery/${doc.slug}` : null),
  },
  access: { read: publishedOrStaff, create: staff, update: staff, delete: staff },
  versions: { drafts: true },
  defaultSort: 'order',
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'date', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Shown on the gallery page. Leave empty to use the first photo.' },
    },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      admin: { isSortable: true },
    },
    slugField(),
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
  ],
}
