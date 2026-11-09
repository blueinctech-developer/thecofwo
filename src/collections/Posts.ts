import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staff } from '../access'
import { slugField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Blog post', plural: 'Blog posts' },
  admin: {
    useAsTitle: 'title',
    group: 'Blog',
    defaultColumns: ['title', 'categories', 'publishedAt', '_status'],
    description: 'Articles on the COFWO Blog. Save a draft to keep working; publish to put it live.',
    preview: (doc) => (doc?.slug ? `/next/preview?path=/${doc.slug}` : null),
  },
  access: { read: publishedOrStaff, create: staff, update: staff, delete: staff },
  versions: { drafts: { autosave: { interval: 2000 } }, maxPerDoc: 25 },
  hooks: {
    ...revalidateHooks,
    beforeChange: [
      ({ data }) => {
        if (data._status === 'published' && !data.publishedAt) data.publishedAt = new Date().toISOString()
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Article',
          fields: [
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Summary',
              admin: { description: 'One or two sentences shown on blog cards and in search results.' },
            },
            { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Cover photo' },
            { name: 'content', type: 'richText', required: true },
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publish date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'authorName',
      type: 'text',
      label: 'Author',
      defaultValue: 'The COFWO Team',
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Feature on homepage',
      admin: { position: 'sidebar' },
    },
  ],
}
