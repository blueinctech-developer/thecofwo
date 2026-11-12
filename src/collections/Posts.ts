import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staff } from '../access'
import { slugField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Blog post', plural: 'Blog posts' },
  admin: {
    useAsTitle: 'title',
    group: 'Church content',
    defaultColumns: ['title', 'categories', 'publishedAt', '_status'],
    description: 'Articles on the blog. Your work saves as a draft; press Publish to put it on the website.',
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
    { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Cover photo' },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Short summary (optional)',
      admin: { description: 'One or two sentences shown on the blog page.' },
    },
    { name: 'content', type: 'richText', required: true, label: 'Article' },
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publish date',
      // Filled in automatically when the post is first published.
      admin: { hidden: true },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Categories (optional)',
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
