import Link from 'next/link'

import { PageBanner } from '@/components/PageBanner'

export default function NotFound() {
  return (
    <>
      <PageBanner
        title="This page could not be found"
        eyebrow="Page not found"
        intro="It may have moved when we rebuilt the website. Try the homepage, or tell us what you were looking for."
      />
      <section className="container-x py-16">
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Go to the homepage
          </Link>
          <Link href="/contact-us" className="btn btn-ghost">
            Contact us
          </Link>
        </div>
      </section>
    </>
  )
}
