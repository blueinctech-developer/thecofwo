import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  // Keep Vercel preview deployments out of search results.
  const isProduction = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production'
  return {
    rules: isProduction
      ? [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/next/'] }]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  }
}
