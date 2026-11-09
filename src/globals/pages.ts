import type { Field, GlobalConfig } from 'payload'

import { anyone, staff } from '../access'
import { linkGroup } from '../fields/link'
import { revalidateGlobal } from '../hooks/revalidate'

const pageGlobal = (slug: string, label: string, description: string, fields: Field[]): GlobalConfig => ({
  slug,
  label,
  admin: { group: 'Website pages', description },
  access: { read: anyone, update: staff },
  hooks: { afterChange: [revalidateGlobal] },
  versions: { max: 20 },
  fields,
})

/** Page banner used at the top of inner pages. */
const banner = (defaults: { title: string; intro?: string }): Field => ({
  name: 'banner',
  type: 'group',
  label: 'Page banner',
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Small heading' },
    { name: 'title', type: 'text', required: true, defaultValue: defaults.title },
    { name: 'intro', type: 'textarea', defaultValue: defaults.intro },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Background photo' },
  ],
})

const section = (name: string, label: string, extra: Field[] = []): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Small heading' },
    { name: 'heading', type: 'text' },
    ...extra,
  ],
})

const seo: Field = {
  name: 'meta',
  label: 'Search & sharing',
  type: 'group',
  admin: { description: 'Optional. Leave empty to use the defaults from Site settings.' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

export const HomePage = pageGlobal('home-page', 'Homepage', 'The sections of the homepage, top to bottom.', [
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Hero',
        fields: [
          {
            name: 'hero',
            type: 'group',
            label: false,
            fields: [
              { name: 'eyebrow', type: 'text', label: 'Small heading' },
              { name: 'heading', type: 'text', required: true },
              {
                name: 'highlight',
                type: 'text',
                label: 'Words to highlight',
                admin: { description: 'Part of the heading to show in the accent style, e.g. "Spirit of Prophecy".' },
              },
              { name: 'subheading', type: 'textarea' },
              { name: 'image', type: 'upload', relationTo: 'media', label: 'Background photo' },
              {
                name: 'videoUrl',
                type: 'text',
                label: 'Background video (optional)',
                admin: { description: 'A direct link to a short .mp4 clip. It plays muted behind the heading.' },
              },
              linkGroup('primary', 'Main button'),
              linkGroup('secondary', 'Second button'),
            ],
          },
        ],
      },
      {
        label: 'Welcome',
        fields: [
          section('welcome', 'Who we are', [
            { name: 'body', type: 'richText' },
            { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, maxRows: 2 },
            linkGroup('link', 'Button'),
          ]),
          {
            name: 'stats',
            type: 'array',
            label: 'Figures (optional)',
            maxRows: 4,
            admin: { description: 'e.g. "12" + "Nations reached". Leave empty to hide.' },
            fields: [
              {
                type: 'row',
                fields: [
                  { name: 'value', type: 'text', required: true, admin: { width: '30%' } },
                  { name: 'label', type: 'text', required: true, admin: { width: '70%' } },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'The Gathering',
        fields: [
          section('gathering', 'Annual event', [
            { name: 'body', type: 'richText' },
            {
              name: 'images',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              maxRows: 3,
              admin: { description: 'Three photos. Landscape photos at least 1600px wide look best.' },
            },
            linkGroup('link', 'Button'),
          ]),
        ],
      },
      {
        label: 'Join us',
        description: 'Service times and the address come from Site settings → Contact & services.',
        fields: [
          section('visit', 'Join us', [
            { name: 'body', type: 'textarea' },
            { name: 'image', type: 'upload', relationTo: 'media' },
            linkGroup('link', 'Button'),
          ]),
        ],
      },
      {
        label: 'Other sections',
        fields: [
          section('sermonsSection', 'Latest message', [
            {
              name: 'show',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show this section (when a sermon or livestream link exists)',
            },
          ]),
          section('testimoniesSection', 'Testimonies', [
            { name: 'show', type: 'checkbox', defaultValue: true, label: 'Show this section' },
          ]),
          section('eventsSection', 'Upcoming events', [
            { name: 'show', type: 'checkbox', defaultValue: true, label: 'Show this section (only when events exist)' },
          ]),
          section('blogSection', 'Blog'),
          section('gallerySection', 'Gallery', [
            { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, maxRows: 8 },
          ]),
          section('closing', 'Closing invitation', [
            { name: 'body', type: 'textarea' },
            { name: 'image', type: 'upload', relationTo: 'media' },
            linkGroup('primary', 'Main button'),
            linkGroup('secondary', 'Second button'),
          ]),
        ],
      },
      { label: 'Search & sharing', fields: [seo] },
    ],
  },
])

export const AboutPage = pageGlobal('about-page', 'About page', 'The About Us page.', [
  banner({ title: 'About Us' }),
  section('story', 'Our story', [
    { name: 'body', type: 'richText' },
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, maxRows: 2 },
  ]),
  section('passion', 'Our passion', [
    { name: 'body', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    linkGroup('link', 'Button'),
  ]),
  {
    name: 'beliefs',
    type: 'array',
    label: 'What we believe (optional)',
    admin: { description: 'Short statements of faith. Leave empty to hide.' },
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'body', type: 'textarea' },
    ],
  },
  {
    name: 'leaders',
    type: 'array',
    label: 'Leadership (optional)',
    admin: { description: 'Leave empty to hide.' },
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'role', type: 'text' },
      { name: 'photo', type: 'upload', relationTo: 'media' },
      { name: 'bio', type: 'textarea' },
    ],
  },
  section('gallery', 'Photo strip', [{ name: 'images', type: 'upload', relationTo: 'media', hasMany: true }]),
  seo,
])

export const GivePage = pageGlobal('give-page', 'Give page', 'How people can give to the ministry.', [
  banner({ title: 'Give', intro: 'Partner with us as we carry the fire of God’s love, power and salvation to the ends of the earth.' }),
  section('intro', 'Introduction', [{ name: 'body', type: 'richText' }]),
  {
    name: 'methods',
    type: 'array',
    label: 'Ways to give',
    admin: { description: 'e.g. Give online, Bank transfer. Leave empty to show the "contact us" message.' },
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'description', type: 'textarea' },
      {
        name: 'details',
        type: 'textarea',
        label: 'Account details',
        admin: { description: 'Bank name, account number, etc. Shown in a copyable box.' },
      },
      linkGroup('link', 'Button'),
    ],
  },
  { name: 'fallback', type: 'textarea', label: 'Message when no ways to give are listed', defaultValue: 'Online giving details will be published here soon. To give or partner with the ministry today, please contact us and we will share how.' },
  {
    name: 'scripture',
    type: 'group',
    fields: [
      { name: 'text', type: 'textarea' },
      { name: 'reference', type: 'text' },
    ],
  },
  seo,
])

export const ContactPage = pageGlobal('contact-page', 'Contact page', 'The Contact Us page.', [
  banner({ title: 'Contact Us' }),
  { name: 'formHeading', type: 'text', defaultValue: 'Send a message' },
  { name: 'formIntro', type: 'textarea' },
  {
    name: 'subjects',
    type: 'array',
    label: 'Subject choices',
    admin: { description: 'Options in the "What is this about?" list. Leave empty for a free-text subject.' },
    fields: [{ name: 'label', type: 'text', required: true }],
  },
  {
    name: 'cards',
    type: 'array',
    label: 'Information cards',
    maxRows: 4,
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'body', type: 'textarea' },
      linkGroup('link', 'Link'),
    ],
  },
  seo,
])
