import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staff } from '../access'
import { slugField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

export const Sermons: CollectionConfig = {
  slug: 'sermons',
  labels: { singular: 'Sermon', plural: 'Sermons' },
  admin: {
    useAsTitle: 'title',
    group: 'Ministry',
    defaultColumns: ['title', 'speaker', 'date', '_status'],
    description:
      'Messages people can watch or listen to on the Sermons page. Paste a YouTube, Facebook or Vimeo link; the video plays on the website.',
    preview: (doc) => (doc?.slug ? `/next/preview?path=/sermons/${doc.slug}` : null),
  },
  access: { read: publishedOrStaff, create: staff, update: staff, delete: staff },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: '-date',
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'speaker', type: 'text', admin: { width: '50%' } },
        {
          name: 'date',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video link',
      admin: { description: 'A YouTube, Facebook or Vimeo address, e.g. https://www.youtube.com/watch?v=...' },
      validate: (v: string | null | undefined) =>
        !v || /^https?:\/\//.test(v) ? true : 'Please paste the full link, starting with https://',
    },
    {
      name: 'audioUrl',
      type: 'text',
      label: 'Audio link (optional)',
      admin: { description: 'A direct link to an MP3, if you have one.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'series', type: 'text', admin: { width: '50%' } },
        { name: 'scripture', type: 'text', label: 'Bible passage', admin: { width: '50%', placeholder: 'e.g. Isaiah 60:1-3' } },
      ],
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional. YouTube videos use their own thumbnail when this is empty.' },
    },
    { name: 'summary', type: 'textarea', admin: { description: 'One or two sentences about the message.' } },
    { name: 'notes', type: 'richText', label: 'Notes or outline (optional)' },
    slugField(),
  ],
}
