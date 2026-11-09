import { EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react/dist/ssr'

import { ContactForm } from '@/components/forms/ContactForm'
import { PageBanner } from '@/components/PageBanner'
import { SmartLink } from '@/components/SmartLink'
import { buildMetadata } from '@/lib/meta'
import { getGlobal, getSettings } from '@/lib/payload'

export const revalidate = 3600

export async function generateMetadata() {
  const p = await getGlobal('contact-page')
  return buildMetadata({ title: p.banner.title, description: p.banner.intro, image: p.banner.image, path: '/contact-us', meta: p.meta })
}

export default async function ContactPage() {
  const [p, s] = await Promise.all([getGlobal('contact-page'), getSettings()])

  return (
    <>
      <PageBanner title={p.banner.title} eyebrow={p.banner.eyebrow} intro={p.banner.intro} image={p.banner.image} compact />

      <section className="container-x py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7" data-reveal>
            <h2 className="display text-3xl md:text-4xl">{p.formHeading || 'Send a message'}</h2>
            {p.formIntro && <p className="mt-4 max-w-[56ch] text-muted">{p.formIntro}</p>}
            <div className="mt-10">
              <ContactForm subjects={(p.subjects ?? []).map((x) => x.label)} successMessage={s.contactSuccess} />
            </div>
          </div>

          <aside className="space-y-5 lg:col-span-5" aria-label="Other ways to reach us">
            <div className="rounded-[var(--radius-xl)] bg-fire p-8 text-white" data-reveal>
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/80">Write to us</h3>
              {s.email && (
                <a href={`mailto:${s.email}`} className="mt-3 flex items-center gap-3 text-2xl font-semibold break-all hover:underline">
                  <EnvelopeSimple size={26} aria-hidden className="shrink-0" />
                  {s.email}
                </a>
              )}
              {s.phone && (
                <a href={`tel:${s.phone.replace(/[^+\d]/g, '')}`} className="mt-3 flex items-center gap-3 text-lg hover:underline">
                  <Phone size={22} aria-hidden /> {s.phone}
                </a>
              )}
              {s.address && (
                <p className="mt-3 flex gap-3 text-white/90">
                  <MapPin size={22} aria-hidden className="mt-0.5 shrink-0" />
                  <span className="whitespace-pre-line">{s.address}</span>
                </p>
              )}
            </div>
            {(p.cards ?? []).map((c, i) => (
              <div
                key={c.id ?? i}
                data-reveal
                style={{ '--d': i + 1 } as React.CSSProperties}
                className="rounded-[var(--radius-xl)] border border-line bg-ink-2 p-8"
              >
                <h3 className="text-xl font-semibold">{c.title}</h3>
                {c.body && <p className="mt-3 text-muted">{c.body}</p>}
                {c.link?.url && c.link.label && (
                  <SmartLink href={c.link.url} newTab={c.link.newTab} className="link-underline mt-4 inline-block font-medium text-fire-soft">
                    {c.link.label}
                  </SmartLink>
                )}
              </div>
            ))}
            {!!s.serviceTimes?.length && (
              <div className="rounded-[var(--radius-xl)] border border-line bg-ink-2 p-8">
                <h3 className="text-xl font-semibold">Service times</h3>
                <ul className="mt-4 space-y-2 text-muted">
                  {s.serviceTimes.map((t) => (
                    <li key={t.id ?? t.label}>
                      <span className="text-fg">{t.label}</span> {[t.day, t.time].filter(Boolean).join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  )
}
