import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Albums } from './collections/Albums'
import { Categories } from './collections/Categories'
import { Events } from './collections/Events'
import { Media } from './collections/Media'
import { Messages } from './collections/Messages'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Subscribers } from './collections/Subscribers'
import { Testimonies } from './collections/Testimonies'
import { Users } from './collections/Users'
import { Navigation } from './globals/Navigation'
import { AboutPage, ContactPage, GivePage, HomePage } from './globals/pages'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Vercel's Neon integration sets DATABASE_URL (and POSTGRES_URL); either works.
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
const blobToken = process.env.BLOB_READ_WRITE_TOKEN
const serverUrl =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  'http://localhost:3000'

export default buildConfig({
  serverURL: serverUrl,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · COFWO Admin',
      icons: [{ rel: 'icon', type: 'image/png', url: '/favicon-32x32.png' }],
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo#Logo',
        Icon: '@/components/admin/Icon#Icon',
      },
      beforeDashboard: ['@/components/admin/Welcome#Welcome'],
    },
    livePreview: {
      url: ({ data, collectionConfig, globalConfig }) => {
        const path = (() => {
          if (globalConfig?.slug === 'about-page') return '/about-us'
          if (globalConfig?.slug === 'give-page') return '/give'
          if (globalConfig?.slug === 'contact-page') return '/contact-us'
          if (collectionConfig?.slug === 'posts' || collectionConfig?.slug === 'pages') return `/${data?.slug ?? ''}`
          if (collectionConfig?.slug === 'events') return `/events/${data?.slug ?? ''}`
          return '/'
        })()
        return `/next/preview?path=${encodeURIComponent(path)}`
      },
      globals: ['home-page', 'about-page', 'give-page', 'contact-page'],
      collections: ['posts', 'pages', 'events'],
      breakpoints: [
        { label: 'Phone', name: 'phone', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Posts, Categories, Pages, Events, Testimonies, Albums, Media, Messages, Subscribers, Users],
  globals: [HomePage, AboutPage, GivePage, ContactPage, SiteSettings, Navigation],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: databaseUrl },
    migrationDir: path.resolve(dirname, 'migrations'),
    // Local dev keeps the schema in sync automatically; production uses migrations.
    push: process.env.NODE_ENV !== 'production' && !process.env.VERCEL,
  }),
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'no-reply@thecofwo.org',
        defaultFromName: process.env.EMAIL_FROM_NAME || 'COFWO Website',
      })
    : undefined,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(blobToken),
      collections: { media: { disablePayloadAccessControl: true } },
      token: blobToken || '',
      // Uploads go straight from the browser to Blob, avoiding Vercel's 4.5 MB request limit.
      clientUploads: true,
    }),
    seoPlugin({
      collections: ['posts', 'pages', 'events'],
      uploadsCollection: 'media',
      tabbedUI: false,
      generateTitle: ({ doc }) => `${(doc as { title?: string })?.title ?? ''} | COFWO`,
      generateDescription: ({ doc }) =>
        (doc as { excerpt?: string; intro?: string; summary?: string })?.excerpt ||
        (doc as { intro?: string })?.intro ||
        (doc as { summary?: string })?.summary ||
        '',
    }),
    importExportPlugin({
      collections: [{ slug: 'subscribers' }, { slug: 'messages' }],
    }),
  ],
})
