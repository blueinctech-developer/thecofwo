import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staff } from '../access'
import { slugField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

export const Albums: CollectionConfig = {
  slug: 'albums',
  labels: { singular: 'Photo album', plural: 'Photo albums' },
  admin: {
    useAsTitle: 'title',
    group: 'Church content',
    defaultColumns: ['title', 'date', 'order', '_status'],
    description: 'Albums on the Gallery page. Add a title and some photos; drag photos to change their order.',
    preview: (doc) => (doc?.slug ? `/next/preview?path=/gallery/${doc.slug}` : null),
  },
  access: { read: publishedOrStaff, create: staff, update: staff, delete: staff },
  versions: { drafts: true },
  defaultSort: 'order',
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      admin: { isSortable: true },
    },
    {
      type: 'collapsible',
      label: 'More details (optional)',
      admin: { initCollapsed: true },
      fields: [
        { name: 'description', type: 'textarea' },
        { name: 'date', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
        {
          name: 'cover',
          type: 'upload',
          relationTo: 'media',
          label: 'Cover photo',
          admin: { description: 'Leave empty to use the first photo.' },
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          label: 'Position',
          admin: { description: 'Albums with lower numbers show first.' },
        },
      ],
    },
    slugField(),
  ],
}
