import type { CollectionConfig } from 'payload'

import { staff, visibleOrStaff } from '../access'
import { revalidateHooks } from '../hooks/revalidate'

export const Testimonies: CollectionConfig = {
  slug: 'testimonies',
  admin: {
    useAsTitle: 'name',
    group: 'Church content',
    defaultColumns: ['name', 'type', 'show', 'order'],
    description: 'Testimonies shown on the homepage. Only those with "Show on website" ticked appear.',
  },
  access: { read: visibleOrStaff('show'), create: staff, update: staff, delete: staff },
  defaultSort: 'order',
  hooks: revalidateHooks,
  fields: [
    { name: 'quote', type: 'textarea', required: true, label: 'Testimony' },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'location', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'type',
      type: 'text',
      label: 'Kind of testimony',
      admin: { description: 'e.g. Salvation, Healing, Direction' },
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'show',
      type: 'checkbox',
      label: 'Show on website',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Position',
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
  ],
}
