import type { CollectionConfig } from 'payload'

import { staff } from '../access'

/** Messages sent through the website contact form. Created by the site's server action only. */
export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Contact message', plural: 'Contact messages' },
  admin: {
    useAsTitle: 'subject',
    group: 'Inbox',
    defaultColumns: ['subject', 'name', 'email', 'status', 'createdAt'],
    description: 'Messages from the contact form. Mark them as replied once someone has answered.',
  },
  access: {
    read: staff,
    create: () => false,
    update: staff,
    delete: staff,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { readOnly: true, width: '50%' } },
        { name: 'email', type: 'email', required: true, admin: { readOnly: true, width: '50%' } },
      ],
    },
    { name: 'phone', type: 'text', admin: { readOnly: true } },
    { name: 'subject', type: 'text', required: true, admin: { readOnly: true } },
    { name: 'message', type: 'textarea', required: true, admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Replied', value: 'replied' },
        { label: 'Spam', value: 'spam' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'notes', type: 'textarea', label: 'Team notes', admin: { position: 'sidebar' } },
  ],
}
