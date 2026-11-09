import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staff } from '../access'
import { slugField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

/**
 * Simple text pages (privacy policy, statement of faith, ministries, etc.).
 * The homepage, About, Give and Contact pages have their own editors under "Website pages".
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Other pages' },
  admin: {
    useAsTitle: 'title',
    group: 'Website pages',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description: 'Extra pages such as the privacy policy. Each page is shown at thecofwo.org/<web address>.',
    preview: (doc) => (doc?.slug ? `/next/preview?path=/${doc.slug}` : null),
  },
  access: { read: publishedOrStaff, create: staff, update: staff, delete: staff },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'eyebrow', type: 'text', label: 'Small heading above title' },
    { name: 'intro', type: 'textarea', label: 'Introduction' },
    { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Banner photo' },
    { name: 'content', type: 'richText' },
    slugField(),
    {
      name: 'showInFooter',
      type: 'checkbox',
      label: 'Link in footer',
      admin: { position: 'sidebar' },
    },
  ],
}
