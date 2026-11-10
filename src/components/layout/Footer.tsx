import Link from 'next/link'

import type { Navigation, SiteSetting } from '@/payload-types'

import { NewsletterForm } from '../forms/NewsletterForm'
import { SmartLink } from '../SmartLink'
import { socialIcon } from '../socialIcons'
import { whatsappLink } from '../WhatsAppButton'

type Props = {
  settings: SiteSetting
  nav: Navigation
  logo: string
  extraLinks: { label: string; url: string }[]
}

const WORDMARK = 'THECOFWO'

const colTitle = 'text-[0.72rem] font-bold uppercase tracking-[0.16em] text-fg'
const colList = 'mt-6 space-y-3.5 text-[0.95rem] leading-snug text-muted'
const linkCls = 'transition-colors hover:text-fg'

/** One footer column: a small title over a list of links or details. */
function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className={colTitle}>{title}</h3>
      <ul className={colList}>{children}</ul>
    </div>
  )
}

export function Footer({ settings, nav, extraLinks }: Props) {
  const year = new Date().getFullYear()
  const times = settings.serviceTimes ?? []
  const wa = settings.whatsappEnabled === false ? null : whatsappLink(settings.whatsappNumber, settings.whatsappMessage)
  // Profiles from Site settings, plus WhatsApp when a chat number is set (and not already listed).
  const socials = (settings.socials ?? []).map((s) => ({
    platform: s.platform,
    url: s.url,
    label: s.platform === 'x' ? 'X' : s.platform[0].toUpperCase() + s.platform.slice(1),
  }))
  if (wa && !socials.some((s) => s.platform === 'whatsapp')) socials.push({ platform: 'whatsapp', url: wa, label: 'WhatsApp' })

  return (
    <footer className="theme-dark relative mt-24 overflow-hidden bg-ink">
      <div className="container-x pt-20 md:pt-28">
        {/* Top: invitation and social icons on the left, three equal columns on the right */}
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className="display text-4xl md:text-[2.9rem]">{settings.newsletterHeading || 'Stay connected'}</h2>
            <p className="mt-4 max-w-[42ch] text-muted">
              {settings.newsletterText || 'News, upcoming gatherings and words of encouragement, straight to your inbox.'}
            </p>
            <div className="mt-8 max-w-md">
              <NewsletterForm />
            </div>
            {socials.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-3" aria-label="Social media">
                {socials.map((s) => {
                  const Icon = socialIcon(s.platform)
                  return (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        title={s.label}
                        className="grid h-12 w-12 place-items-center rounded-full border border-line-strong text-fg transition-colors hover:border-fire hover:bg-fire hover:text-white"
                      >
                        {Icon && <Icon size={22} weight="fill" aria-hidden />}
                      </a>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {(nav.footerGroups ?? []).map((g) => (
              <Col key={g.id ?? g.title} title={g.title || 'Explore'}>
                {(g.links ?? []).map((l) =>
                  l.url && l.label ? (
                    <li key={l.id ?? l.url}>
                      <SmartLink href={l.url} newTab={l.newTab} className={linkCls}>
                        {l.label}
                      </SmartLink>
                    </li>
                  ) : null,
                )}
              </Col>
            ))}

            <Col title="Visit us">
              {times.map((t) => (
                <li key={t.id ?? t.label}>
                  <span className="text-fg">{t.label}</span>
                  <br />
                  {[t.day, t.time].filter(Boolean).join(', ')}
                </li>
              ))}
              {settings.address && (
                <li>
                  <a
                    href={settings.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkCls} whitespace-pre-line`}
                  >
                    {settings.address}
                  </a>
                </li>
              )}
              {!times.length && (
                <li>
                  <Link href="/contact-us" className={linkCls}>
                    Plan a visit
                  </Link>
                </li>
              )}
              <li>
                <Link href="/contact-us" className={linkCls}>
                  Prayer request
                </Link>
              </li>
              {settings.livestreamUrl && (
                <li>
                  <a href={settings.livestreamUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>
                    Watch online
                  </a>
                </li>
              )}
            </Col>

            <Col title="Contact">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className={`${linkCls} break-all`}>
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`} className={linkCls}>
                    {settings.phone}
                  </a>
                </li>
              )}
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className={linkCls}>
                    Chat on WhatsApp
                  </a>
                </li>
              )}
              <li>
                <Link href="/contact-us" className={linkCls}>
                  Send a message
                </Link>
              </li>
            </Col>
          </div>
        </div>

        {/* Bottom row: copyright left, small links right */}
        <div className="mt-20 flex flex-col gap-4 border-t border-line py-7 text-sm text-subtle md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {settings.copyrightName || settings.siteName}. All rights reserved.
          </span>
          {extraLinks.length > 0 && (
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {extraLinks.map((l) => (
                <li key={l.url}>
                  <Link href={l.url} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Giant wordmark, stretched edge to edge and cropped at the bottom */}
      <div aria-hidden className="pointer-events-none select-none px-3 md:px-5">
        <svg viewBox="0 0 1000 150" className="-mb-[2.2%] block h-auto w-full" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="footer-wordmark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c8101c" />
              <stop offset="100%" stopColor="#c8101c" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="150"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#footer-wordmark)"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 196, letterSpacing: '-0.02em' }}
          >
            {WORDMARK}
          </text>
        </svg>
      </div>
    </footer>
  )
}
