import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
    remotePatterns: [{ protocol: 'https', hostname: '*.storage.*.aws.neon.tech' }],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  async redirects() {
    // Old WordPress / static-site addresses that should keep working.
    const permanent = (source: string, destination: string) => ({ source, destination, permanent: true })
    return [
      { source: '/:path*', has: [{ type: 'host', value: 'www.thecofwo.org' }], destination: 'https://thecofwo.org/:path*', permanent: true },
      permanent('/contact-us-2', '/contact-us'),
      permanent('/blog-standard', '/cofwo-blog'),
      permanent('/blog-list', '/cofwo-blog'),
      permanent('/blog', '/cofwo-blog'),
      permanent('/author/:name', '/cofwo-blog'),
      permanent('/feed', '/feed.xml'),
      permanent('/category/:slug/feed', '/feed.xml'),
      permanent('/wp-sitemap.xml', '/sitemap.xml'),
      permanent('/sitemap_index.xml', '/sitemap.xml'),
      permanent('/thank-you', '/contact-us'),
      permanent('/wp-admin', '/admin'),
      permanent('/wp-login.php', '/admin'),
      permanent('/index.html', '/'),
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: { root: path.resolve(dirname) },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
