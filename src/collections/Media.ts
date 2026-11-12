import type { CollectionConfig } from 'payload'

import { anyone, staff } from '../access'
import { revalidateHooks } from '../hooks/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Photo', plural: 'Photo library' },
  admin: {
    group: 'Settings',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    description: 'Every photo on the website. You can also upload photos straight from any page you are editing.',
  },
  access: {
    read: anyone,
    create: staff,
    update: staff,
    delete: staff,
  },
  hooks: revalidateHooks,
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'What is in the photo? (optional)',
      admin: {
        description: 'Helps blind visitors and search engines, e.g. "Congregation worshipping". If left empty, the file name is used.',
      },
      hooks: {
        beforeChange: [
          ({ value, data }) =>
            typeof value === 'string' && value.trim()
              ? value
              : String(data?.filename ?? '')
                  .replace(/\.[a-z0-9]+$/i, '')
                  .replace(/[-_]+/g, ' ')
                  .trim(),
        ],
      },
    },
    { name: 'caption', type: 'text', admin: { hidden: true } },
  ],
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre', formatOptions: { format: 'webp', options: { quality: 78 } } },
      { name: 'card', width: 900, withoutEnlargement: true, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'large', width: 1600, withoutEnlargement: true, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'hero', width: 2400, withoutEnlargement: true, formatOptions: { format: 'webp', options: { quality: 80 } } },
    ],
    adminThumbnail: 'thumbnail',
    formatOptions: { format: 'webp', options: { quality: 82 } },
    resizeOptions: { width: 3000, withoutEnlargement: true },
  },
}
