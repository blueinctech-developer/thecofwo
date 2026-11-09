import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80dvh] flex-col justify-center pb-16 pt-36">
      <p className="eyebrow">Page not found</p>
      <h1 className="display mt-4 max-w-[16ch] text-5xl md:text-7xl">This page could not be found</h1>
      <p className="mt-6 max-w-[50ch] text-lg text-muted">
        It may have moved when we rebuilt the website. Try the homepage, or tell us what you were looking for.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Go to the homepage
        </Link>
        <Link href="/contact-us" className="btn btn-ghost">
          Contact us
        </Link>
      </div>
    </section>
  )
}
