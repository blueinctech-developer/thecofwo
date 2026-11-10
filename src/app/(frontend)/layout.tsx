import type { Metadata, Viewport } from 'next'
import { Archivo, Geist } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { PreviewBar } from '@/components/PreviewBar'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { RevealObserver } from '@/components/Reveal'
import { getNavigation, getPayloadClient, getSettings, isPreview } from '@/lib/payload'
import { mediaUrl, siteUrl } from '@/lib/utils'

import './styles.css'

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], style: ['normal', 'italic'], variable: '--font-archivo', display: 'swap' })
const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })

export const viewport: Viewport = { themeColor: '#f9f7f3', colorScheme: 'light' }

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  const og = mediaUrl(s.ogImage)
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: s.seoTitle || s.siteName, template: `%s | ${s.shortName || 'COFWO'}` },
    description: s.seoDescription || undefined,
    openGraph: {
      siteName: s.siteName,
      type: 'website',
      locale: 'en',
      images: og ? [{ url: og }] : undefined,
    },
    twitter: { card: 'summary_large_image' },
    icons: {
      icon: [
        { url: '/favicon-32x32.png', sizes: '32x32' },
        { url: '/favicon-192x192.png', sizes: '192x192' },
      ],
      apple: '/favicon-180x180.png',
    },
    alternates: { types: { 'application/rss+xml': '/feed.xml' } },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, nav, preview] = await Promise.all([getSettings(), getNavigation(), isPreview()])
  const payload = await getPayloadClient()
  const footerPages = await payload.find({
    collection: 'pages',
    where: { showInFooter: { equals: true }, _status: { equals: 'published' } },
    select: { title: true, slug: true },
    limit: 6,
    depth: 0,
  })

  const logo = mediaUrl(settings.logoLight) || '/cofwo-logo-white.png'
  const logoOnLight = mediaUrl(settings.logoDark) || '/cofwo-logo.png'
  const links = (nav.header ?? [])
    .filter((l) => l.label && l.url)
    .map((l) => ({ label: l.label!, url: l.url!, newTab: l.newTab }))
  // Once the first sermon is published, "Sermons" joins the menu automatically (unless staff already added it).
  const sermonCount = await payload.count({ collection: 'sermons', where: { _status: { equals: 'published' } } })
  if (sermonCount.totalDocs > 0 && !links.some((l) => l.url.startsWith('/sermons'))) {
    const at = Math.max(0, links.findIndex((l) => l.url === '/cofwo-blog'))
    links.splice(at, 0, { label: 'Sermons', url: '/sermons', newTab: false })
  }
  const cta = nav.headerCta?.label && nav.headerCta?.url ? { label: nav.headerCta.label, url: nav.headerCta.url } : null
  const announcement =
    settings.announcementOn && settings.announcementText
      ? {
          text: settings.announcementText,
          link: settings.announcementLink?.url
            ? { label: '', url: settings.announcementLink.url, newTab: settings.announcementLink.newTab }
            : null,
        }
      : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: settings.siteName,
    alternateName: settings.shortName,
    url: siteUrl(),
    logo: `${siteUrl()}/cofwo-logo.png`,
    email: settings.email || undefined,
    telephone: settings.phone || undefined,
    address: settings.address || undefined,
    sameAs: (settings.socials ?? []).map((s) => s.url),
  }

  return (
    <html lang="en" className={`${archivo.variable} ${geist.variable}`}>
      <body className="min-h-[100dvh] overflow-x-hidden">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header logo={logo} logoOnLight={logoOnLight} siteName={settings.siteName} links={links} cta={cta} announcement={announcement} />
        <main id="main">{children}</main>
        <Footer
          settings={settings}
          nav={nav}
          logo={logo}
          extraLinks={footerPages.docs.map((p) => ({ label: p.title, url: `/${p.slug}` }))}
        />
        <WhatsAppButton number={settings.whatsappNumber} message={settings.whatsappMessage} enabled={settings.whatsappEnabled} />
        <RevealObserver />
        {preview && <PreviewBar />}
      </body>
    </html>
  )
}
