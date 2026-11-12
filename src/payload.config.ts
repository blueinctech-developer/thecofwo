import { postgresAdapter } from '@payloadcms/db-postgres'
import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import nodemailer from 'nodemailer'
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
import { Sermons } from './collections/Sermons'
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
// Photos live in a Neon Object Storage bucket (S3-compatible). Vercel reserves the AWS_* names,
// so the S3_* names come first; AWS_* still works locally (e.g. from `neon env pull`).
const s3 = {
  endpoint: process.env.S3_ENDPOINT || process.env.AWS_ENDPOINT_URL_S3 || '',
  region: process.env.S3_REGION || process.env.AWS_REGION || 'us-east-2',
  bucket: process.env.S3_BUCKET || '',
  accessKeyId: process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '',
}
const s3Enabled = Boolean(s3.endpoint && s3.bucket && s3.accessKeyId && s3.secretAccessKey)
// Email goes through Amazon SES with an IAM access key (needs the ses:SendEmail permission).
// Vercel reserves the AWS_* names, so these use SES_*.
const ses = {
  region: process.env.SES_REGION || 'us-east-1',
  accessKeyId: process.env.SES_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.SES_SECRET_ACCESS_KEY || '',
}
const sesEnabled = Boolean(ses.accessKeyId && ses.secretAccessKey)
const serverUrl =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  'http://localhost:3000'

export default buildConfig({
  serverURL: serverUrl,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    timezones: {
      defaultTimezone: process.env.SITE_TIMEZONE || 'Africa/Lagos',
      supportedTimezones: [
        { label: 'West Africa (Lagos)', value: 'Africa/Lagos' },
        { label: 'Ghana (Accra)', value: 'Africa/Accra' },
        { label: 'East Africa (Nairobi)', value: 'Africa/Nairobi' },
        { label: 'South Africa (Johannesburg)', value: 'Africa/Johannesburg' },
        { label: 'UK (London)', value: 'Europe/London' },
        { label: 'Central Europe (Berlin)', value: 'Europe/Berlin' },
        { label: 'US Eastern (New York)', value: 'America/New_York' },
        { label: 'US Central (Chicago)', value: 'America/Chicago' },
        { label: 'US Pacific (Los Angeles)', value: 'America/Los_Angeles' },
        { label: 'UTC', value: 'UTC' },
      ],
    },
    meta: {
      titleSuffix: ' · COFWO Admin',
      icons: [{ rel: 'icon', type: 'image/png', url: '/favicon-32x32.png' }],
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo#Logo',
        Icon: '@/components/admin/Icon#Icon',
      },
      beforeDashboard: ['@/components/admin/Welcome#Welcome', '@/components/admin/LaunchChecklist#LaunchChecklist'],
    },
    livePreview: {
      url: ({ data, collectionConfig, globalConfig }) => {
        const path = (() => {
          if (globalConfig?.slug === 'about-page') return '/about-us'
          if (globalConfig?.slug === 'give-page') return '/give'
          if (globalConfig?.slug === 'contact-page') return '/contact-us'
          if (collectionConfig?.slug === 'posts' || collectionConfig?.slug === 'pages') return `/${data?.slug ?? ''}`
          if (collectionConfig?.slug === 'events') return `/events/${data?.slug ?? ''}`
          if (collectionConfig?.slug === 'sermons') return `/sermons/${data?.slug ?? ''}`
          return '/'
        })()
        return `/next/preview?path=${encodeURIComponent(path)}`
      },
      globals: ['home-page', 'about-page', 'give-page', 'contact-page'],
      collections: ['posts', 'pages', 'events', 'sermons'],
      breakpoints: [
        { label: 'Phone', name: 'phone', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Posts, Categories, Pages, Sermons, Events, Testimonies, Albums, Media, Messages, Subscribers, Users],
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
  // Without the SES keys no email is sent (Payload logs it to the console instead).
  email: sesEnabled
    ? nodemailerAdapter({
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'no-reply@thecofwo.org',
        defaultFromName: process.env.EMAIL_FROM_NAME || 'COFWO Website',
        skipVerify: true,
        transport: nodemailer.createTransport({
          SES: {
            sesClient: new SESv2Client({
              region: ses.region,
              credentials: { accessKeyId: ses.accessKeyId, secretAccessKey: ses.secretAccessKey },
            }),
            SendEmailCommand,
          },
        }),
      })
    : undefined,
  plugins: [
    // Without bucket details (local development) photos are saved to ./media instead.
    s3Storage({
      enabled: s3Enabled,
      // Keep the plugin's columns in the schema even when it is off locally, so migrations match production.
      alwaysInsertFields: true,
      bucket: s3.bucket,
      // The bucket is public, so photo links point straight at it: <endpoint>/<bucket>/<file>.
      collections: { media: { disablePayloadAccessControl: true } },
      config: {
        endpoint: s3.endpoint,
        region: s3.region,
        forcePathStyle: true,
        credentials: { accessKeyId: s3.accessKeyId, secretAccessKey: s3.secretAccessKey },
      },
    }),
    seoPlugin({
      collections: ['posts', 'pages', 'events', 'sermons'],
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
