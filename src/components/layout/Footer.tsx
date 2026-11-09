/* eslint-disable @next/next/no-img-element */
import { EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import type { Navigation, SiteSetting } from '@/payload-types'

import { NewsletterForm } from '../forms/NewsletterForm'
import { SmartLink } from '../SmartLink'
import { socialIcon } from '../socialIcons'

type Props = {
  settings: SiteSetting
  nav: Navigation
  logo: string
  extraLinks: { label: string; url: string }[]
}

const colTitle = 'text-xs font-bold uppercase tracking-[0.14em] text-fg'

export function Footer({ settings, nav, logo, extraLinks }: Props) {
  const year = new Date().getFullYear()
  const times = settings.serviceTimes ?? []
  return (
    <footer className="theme-dark relative mt-24 bg-ink">
      <div className="container-x pb-10 pt-20 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <h2 className="display text-4xl md:text-5xl">{settings.newsletterHeading || 'Stay connected'}</h2>
            {settings.newsletterText && <p className="mt-4 max-w-[48ch] text-muted">{settings.newsletterText}</p>}
            <div className="mt-8 max-w-xl">
              <NewsletterForm />
            </div>
          </div>
          <div className="flex items-start lg:justify-end">
            <img src={logo} alt={settings.siteName} width={585} height={138} className="h-12 w-auto md:h-14" />
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-b border-line pb-8">
          {settings.tagline && <p className="max-w-md text-sm text-muted">{settings.tagline}</p>}
          {!!settings.socials?.length && (
            <ul className="flex flex-wrap gap-4" aria-label="Social media">
              {settings.socials.map((s) => {
                const Icon = socialIcon(s.platform)
                return (
                  <li key={s.id ?? s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform ?? 'Social'}
                      className="text-muted transition-colors hover:text-fg"
                    >
                      {Icon && <Icon size={24} aria-hidden />}
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {(nav.footerGroups ?? []).map((g) => (
            <div key={g.id ?? g.title}>
              <h3 className={colTitle}>{g.title}</h3>
              <ul className="mt-5 space-y-3">
                {(g.links ?? []).map((l) =>
                  l.url && l.label ? (
                    <li key={l.id ?? l.url}>
                      <SmartLink href={l.url} newTab={l.newTab} className="text-muted underline-offset-4 hover:text-fg hover:underline">
                        {l.label}
                      </SmartLink>
                    </li>
                  ) : null,
                )}
              </ul>
            </div>
          ))}

          {times.length > 0 && (
            <div>
              <h3 className={colTitle}>Service times</h3>
              <ul className="mt-5 space-y-3 text-muted">
                {times.map((s) => (
                  <li key={s.id ?? s.label}>
                    <span className="text-fg">{s.label}</span>
                    <br />
                    {[s.day, s.time].filter(Boolean).join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className={colTitle}>Connect</h3>
            <ul className="mt-5 space-y-3 text-muted">
              {settings.address && (
                <li className="flex gap-2">
                  <MapPin size={18} className="mt-0.5 shrink-0" aria-hidden />
                  <span className="whitespace-pre-line">{settings.address}</span>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`} className="inline-flex items-center gap-2 hover:text-fg">
                    <Phone size={18} aria-hidden /> {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 break-all hover:text-fg">
                    <EnvelopeSimple size={18} className="shrink-0" aria-hidden /> {settings.email}
                  </a>
                </li>
              )}
              <li>
                <Link href="/contact-us" className="underline-offset-4 hover:text-fg hover:underline">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line pt-8 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-subtle md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {settings.copyrightName || settings.siteName}. All rights reserved.
          </span>
          {extraLinks.length > 0 && (
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {extraLinks.map((l) => (
                <Link key={l.url} href={l.url} className="hover:text-fg">
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
