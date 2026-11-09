/* eslint-disable @next/next/no-img-element */
import {
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  MapPin,
  Phone,
  TelegramLogo,
  TiktokLogo,
  WhatsappLogo,
  XLogo,
  YoutubeLogo,
} from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import type { Navigation, SiteSetting } from '@/payload-types'

import { NewsletterForm } from '../forms/NewsletterForm'
import { SmartLink } from '../SmartLink'

const socialIcons = {
  facebook: FacebookLogo,
  instagram: InstagramLogo,
  youtube: YoutubeLogo,
  x: XLogo,
  tiktok: TiktokLogo,
  whatsapp: WhatsappLogo,
  telegram: TelegramLogo,
  linkedin: LinkedinLogo,
} as const

type Props = {
  settings: SiteSetting
  nav: Navigation
  logo: string
  extraLinks: { label: string; url: string }[]
}

export function Footer({ settings, nav, logo, extraLinks }: Props) {
  const year = new Date().getFullYear()
  return (
    <footer className="theme-dark relative mt-24 bg-ink">
      <div className="container-x grid gap-12 py-16 md:py-20 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <h2 className="display text-3xl md:text-4xl">{settings.newsletterHeading || 'Stay connected'}</h2>
          {settings.newsletterText && <p className="mt-4 max-w-[52ch] text-muted">{settings.newsletterText}</p>}
          <div className="mt-8 max-w-xl">
            <NewsletterForm />
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          {(nav.footerGroups ?? []).map((g) => (
            <div key={g.id ?? g.title}>
              <h3 className="text-sm font-semibold text-fg">{g.title}</h3>
              <ul className="mt-4 space-y-3">
                {(g.links ?? []).map((l) =>
                  l.url && l.label ? (
                    <li key={l.id ?? l.url}>
                      <SmartLink href={l.url} newTab={l.newTab} className="link-underline text-muted hover:text-fg">
                        {l.label}
                      </SmartLink>
                    </li>
                  ) : null,
                )}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-sm font-semibold text-fg">Reach us</h3>
            <ul className="mt-4 space-y-3 text-muted">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 hover:text-fg">
                    <EnvelopeSimple size={18} aria-hidden /> {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`} className="inline-flex items-center gap-2 hover:text-fg">
                    <Phone size={18} aria-hidden /> {settings.phone}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex gap-2">
                  <MapPin size={18} className="mt-0.5 shrink-0" aria-hidden />
                  <span className="whitespace-pre-line">{settings.address}</span>
                </li>
              )}
            </ul>
            {!!settings.serviceTimes?.length && (
              <ul className="mt-6 space-y-1.5 text-sm text-muted">
                {settings.serviceTimes.map((s) => (
                  <li key={s.id ?? s.label}>
                    <span className="text-fg">{s.label}</span> {[s.day, s.time].filter(Boolean).join(', ')}
                  </li>
                ))}
              </ul>
            )}
            {!!settings.socials?.length && (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social media">
                {settings.socials.map((s) => {
                  const Icon = socialIcons[s.platform as keyof typeof socialIcons]
                  return (
                    <li key={s.id ?? s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.platform}
                        className="grid h-10 w-10 place-items-center rounded-full border border-line-strong text-muted transition-colors hover:border-fg hover:text-fg"
                      >
                        {Icon && <Icon size={18} aria-hidden />}
                      </a>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="" width={585} height={138} className="h-8 w-auto opacity-90" />
            {settings.tagline && <p className="hidden max-w-xs text-sm text-muted lg:block">{settings.tagline}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-subtle">
            <span>
              © {year} {settings.copyrightName || settings.siteName}
            </span>
            {extraLinks.map((l) => (
              <Link key={l.url} href={l.url} className="hover:text-fg">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
