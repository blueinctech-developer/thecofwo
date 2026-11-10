import type { GlobalConfig } from 'payload'

import { anyone, staff } from '../access'
import { linkGroup } from '../fields/link'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    group: 'Settings',
    description: 'Ministry details used across the whole website.',
  },
  access: { read: anyone, update: staff },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'siteName', type: 'text', required: true, defaultValue: 'The Chariot of Fire World Outreach' },
            { name: 'shortName', type: 'text', defaultValue: 'COFWO' },
            {
              name: 'tagline',
              type: 'text',
              defaultValue: 'Setting captives free by the Spirit of Prophecy',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'logoLight',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo for dark backgrounds',
                  admin: { width: '50%', description: 'Usually the white version of the logo.' },
                },
                {
                  name: 'logoDark',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo for light backgrounds',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Contact & services',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', defaultValue: 'info@thecofwo.org', admin: { width: '50%' } },
                { name: 'phone', type: 'text', admin: { width: '50%', description: 'Leave empty to hide.' } },
              ],
            },
            {
              name: 'address',
              type: 'textarea',
              label: 'Where we meet',
              admin: { description: 'Venue name and address. Shown on the homepage, Contact page and footer. Leave empty to hide.' },
            },
            { name: 'mapUrl', type: 'text', label: 'Map link', admin: { description: 'A Google Maps link (optional).' } },
            {
              type: 'collapsible',
              label: 'WhatsApp chat button',
              admin: { initCollapsed: false, description: 'A green WhatsApp button floats in the corner of every page once a number is entered.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'whatsappNumber',
                      type: 'text',
                      label: 'WhatsApp number',
                      admin: {
                        width: '50%',
                        placeholder: '+234 801 234 5678',
                        description: 'Include the country code. Leave empty to hide the button.',
                      },
                      validate: (v: string | null | undefined) => {
                        if (!v) return true
                        const digits = v.replace(/\D/g, '')
                        return digits.length >= 8 && digits.length <= 15 && /^[+\d\s()-]+$/.test(v.trim())
                          ? true
                          : 'Please enter the full number with country code, e.g. +234 801 234 5678'
                      },
                    },
                    {
                      name: 'whatsappEnabled',
                      type: 'checkbox',
                      label: 'Show the WhatsApp button',
                      defaultValue: true,
                      admin: { width: '50%', style: { alignSelf: 'flex-end', paddingBottom: '0.6rem' } },
                    },
                  ],
                },
                {
                  name: 'whatsappMessage',
                  type: 'text',
                  label: 'Pre-filled message (optional)',
                  defaultValue: 'Hello COFWO, I would like to know more.',
                  admin: { description: 'The text that appears in the chat when someone taps the button. They can change it before sending.' },
                },
              ],
            },
            {
              name: 'serviceTimes',
              type: 'array',
              label: 'Service times',
              admin: { description: 'Shown on the homepage, the Contact page and the footer. Leave empty to hide.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '40%', placeholder: 'Sunday Service' } },
                    { name: 'day', type: 'text', admin: { width: '30%', placeholder: 'Sundays' } },
                    { name: 'time', type: 'text', admin: { width: '30%', placeholder: '10:00 AM' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Watch online',
          description: 'Links for people who join online.',
          fields: [
            {
              name: 'livestreamUrl',
              type: 'text',
              label: 'Livestream link',
              admin: { description: 'Where services are streamed live (YouTube channel live page, Facebook page, etc.).' },
            },
            {
              name: 'videoChannelUrl',
              type: 'text',
              label: 'Video channel link',
              admin: { description: 'Your YouTube channel or Facebook videos page, for older messages.' },
            },
          ],
        },
        {
          label: 'Social media',
          fields: [
            {
              name: 'socials',
              type: 'array',
              labels: { singular: 'Profile', plural: 'Profiles' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      admin: { width: '35%' },
                      options: ['facebook', 'instagram', 'youtube', 'x', 'tiktok', 'whatsapp', 'telegram', 'linkedin'].map(
                        (v) => ({ label: v === 'x' ? 'X (Twitter)' : v[0].toUpperCase() + v.slice(1), value: v }),
                      ),
                    },
                    { name: 'url', type: 'text', required: true, admin: { width: '65%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Mission & vision',
          description: 'Shown on the homepage and the About page.',
          fields: [
            { name: 'pillarsHeading', type: 'text', defaultValue: 'Our Mission, Goal & Vision' },
            {
              name: 'pillars',
              type: 'array',
              maxRows: 6,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'statement', type: 'text', label: 'Statement (in one line)' },
                { name: 'body', type: 'textarea' },
              ],
            },
            { name: 'ticker', type: 'text', defaultValue: 'Jesus is Lord', admin: { hidden: true } },
          ],
        },
        {
          label: 'Announcement bar',
          fields: [
            { name: 'announcementOn', type: 'checkbox', label: 'Show announcement bar' },
            { name: 'announcementText', type: 'text', label: 'Message' },
            linkGroup('announcementLink', 'Link'),
          ],
        },
        {
          label: 'Forms & email',
          fields: [
            {
              name: 'notifyEmail',
              type: 'email',
              label: 'Send form notifications to',
              defaultValue: 'info@thecofwo.org',
              admin: { description: 'New contact messages and signups are emailed here (needs email set up on Vercel).' },
            },
            { name: 'newsletterHeading', type: 'text', defaultValue: 'Stay connected' },
            {
              name: 'newsletterText',
              type: 'textarea',
              defaultValue: 'Join our newsletter for church news, upcoming gatherings and words of encouragement.',
            },
            {
              name: 'contactSuccess',
              type: 'textarea',
              label: 'Message shown after the contact form is sent',
              defaultValue: 'Thank you. Your message has reached our ministry team and we will reply soon.',
            },
          ],
        },
        {
          label: 'Search & sharing',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              label: 'Homepage title (search results)',
              defaultValue: 'The Chariot of Fire World Outreach | Setting Captives Free by the Spirit of Prophecy',
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              label: 'Default description',
              defaultValue:
                'COFWO is a Spirit-led ministry carrying the fire of God’s love, power and salvation to the nations. Discover our mission, The Gathering, testimonies and teaching.',
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Default sharing image',
              admin: { description: 'Shown when a page is shared on social media. 1200×630 works best.' },
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerBlurb',
              type: 'textarea',
              defaultValue:
                'A Spirit-led ministry carrying the fire of God’s love, power and salvation to the ends of the earth.',
            },
            { name: 'copyrightName', type: 'text', defaultValue: 'The Chariot of Fire World Outreach (COFWO)' },
          ],
        },
      ],
    },
  ],
}
