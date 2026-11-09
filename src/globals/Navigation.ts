import type { GlobalConfig } from 'payload'

import { anyone, staff } from '../access'
import { linkFields, linkGroup } from '../fields/link'
import { revalidateGlobal } from '../hooks/revalidate'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Menus',
  admin: { group: 'Settings', description: 'The links in the top menu and the footer.' },
  access: { read: anyone, update: staff },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'header',
      type: 'array',
      label: 'Top menu links',
      maxRows: 8,
      fields: linkFields,
    },
    linkGroup('headerCta', 'Top menu button'),
    {
      name: 'footerGroups',
      type: 'array',
      label: 'Footer link columns',
      maxRows: 3,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'links', type: 'array', fields: linkFields },
      ],
    },
  ],
}
