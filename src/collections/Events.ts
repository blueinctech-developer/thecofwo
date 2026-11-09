import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staff } from '../access'
import { slugField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    group: 'Ministry',
    defaultColumns: ['title', 'startDate', 'location', '_status'],
    description: 'Services, conferences and gatherings. Upcoming events appear on the homepage and the Events page.',
    preview: (doc) => (doc?.slug ? `/next/preview?path=/events/${doc.slug}` : null),
  },
  access: { read: publishedOrStaff, create: staff, update: staff, delete: staff },
  versions: { drafts: true },
  defaultSort: 'startDate',
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          label: 'Starts',
          admin: { date: { pickerAppearance: 'dayAndTime' }, width: '50%' },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'Ends',
          admin: { date: { pickerAppearance: 'dayAndTime' }, width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'location', type: 'text', admin: { width: '50%' } },
        {
          name: 'format',
          type: 'select',
          defaultValue: 'in-person',
          options: [
            { label: 'In person', value: 'in-person' },
            { label: 'Online', value: 'online' },
            { label: 'In person and online', value: 'hybrid' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'summary', type: 'textarea', admin: { description: 'Short description for event cards.' } },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'details', type: 'richText' },
    {
      type: 'row',
      fields: [
        { name: 'ctaLabel', type: 'text', label: 'Button text', defaultValue: 'Register', admin: { width: '40%' } },
        {
          name: 'ctaUrl',
          type: 'text',
          label: 'Button link',
          admin: { width: '60%', description: 'Registration or livestream link (optional).' },
        },
      ],
    },
    slugField(),
    { name: 'featured', type: 'checkbox', label: 'Highlight on homepage', admin: { position: 'sidebar' } },
  ],
}
