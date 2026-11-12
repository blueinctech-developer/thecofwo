import type { CollectionConfig } from 'payload'

import { staff } from '../access'

/** Newsletter signups from the website footer. */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Newsletter signup', plural: 'Newsletter signups' },
  admin: {
    useAsTitle: 'email',
    group: 'Inbox',
    defaultColumns: ['email', 'name', 'status', 'createdAt'],
    description: 'People who signed up for news. Use Export to download the list.',
  },
  access: {
    read: staff,
    create: staff,
    update: staff,
    delete: staff,
  },
  defaultSort: '-createdAt',
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'name', type: 'text' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'subscribed',
      options: [
        { label: 'Subscribed', value: 'subscribed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
    },
    { name: 'source', type: 'text', admin: { readOnly: true, hidden: true } },
  ],
}
