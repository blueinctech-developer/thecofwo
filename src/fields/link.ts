import type { Field } from 'payload'

/** A menu or button link: a label plus a web address. */
export const linkFields: Field[] = [
  {
    type: 'row',
    fields: [
      { name: 'label', type: 'text', admin: { width: '40%' } },
      {
        name: 'url',
        type: 'text',
        label: 'Link',
        admin: { width: '40%', description: 'A page on this site such as /about-us, or a full web address.' },
      },
      {
        name: 'newTab',
        type: 'checkbox',
        label: 'Open in new tab',
        admin: { width: '20%', style: { alignSelf: 'flex-end' } },
      },
    ],
  },
]

export const linkGroup = (name: string, label: string): Field => ({
  name,
  label,
  type: 'group',
  fields: linkFields,
})
