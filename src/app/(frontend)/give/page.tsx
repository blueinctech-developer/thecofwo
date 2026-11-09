import { EnvelopeSimple } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import { Button } from '@/components/Button'
import { CopyBox } from '@/components/CopyBox'
import { PageBanner } from '@/components/PageBanner'
import { RichText } from '@/components/RichText'
import { buildMetadata } from '@/lib/meta'
import { getGlobal, getSettings } from '@/lib/payload'

export const revalidate = 3600

export async function generateMetadata() {
  const p = await getGlobal('give-page')
  return buildMetadata({ title: p.banner.title, description: p.banner.intro, image: p.banner.image, path: '/give', meta: p.meta })
}

export default async function GivePage() {
  const [p, s] = await Promise.all([getGlobal('give-page'), getSettings()])
  const methods = p.methods ?? []

  return (
    <>
      <PageBanner title={p.banner.title} eyebrow={p.banner.eyebrow} intro={p.banner.intro} image={p.banner.image} compact />

      <section className="container-x py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            {p.intro?.heading && <h2 className="display text-4xl md:text-5xl">{p.intro.heading}</h2>}
            <RichText data={p.intro?.body} className="prose-cofwo mt-6" />
            {p.scripture?.text && (
              <figure className="mt-10 border-l-2 border-fire pl-6">
                <blockquote className="text-xl italic leading-relaxed text-fg/90">“{p.scripture.text}”</blockquote>
                {p.scripture.reference && <figcaption className="mt-3 text-sm text-muted">{p.scripture.reference}</figcaption>}
              </figure>
            )}
          </div>

          <div className="lg:col-span-7">
            {methods.length ? (
              <div className="grid gap-5">
                {methods.map((m, i) => (
                  <article
                    key={m.id ?? i}
                    data-reveal
                    style={{ '--d': i } as React.CSSProperties}
                    className="rounded-[var(--radius-xl)] border border-line bg-ink-2 p-7 md:p-9"
                  >
                    <h3 className="text-2xl font-semibold">{m.title}</h3>
                    {m.description && <p className="mt-3 text-muted">{m.description}</p>}
                    {m.details && <CopyBox text={m.details} />}
                    {m.link?.url && (
                      <div className="mt-6">
                        <Button link={m.link} />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div data-reveal className="rounded-[var(--radius-xl)] border border-line bg-ink-2 p-8 md:p-10">
                <h3 className="text-2xl font-semibold">How to give</h3>
                <p className="mt-4 max-w-[56ch] text-lg text-muted">{p.fallback}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {s.email && (
                    <a href={`mailto:${s.email}?subject=Giving%20to%20COFWO`} className="btn btn-primary">
                      <EnvelopeSimple size={18} weight="bold" aria-hidden /> Email {s.email}
                    </a>
                  )}
                  <Link href="/contact-us" className="btn btn-ghost">
                    Send a message
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
