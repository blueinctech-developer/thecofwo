'use client'

/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight, List, X } from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type NavLink = { label: string; url: string; newTab?: boolean | null }

type Props = {
  /** White logo, shown over the dark photo band at the top of every page */
  logo: string
  /** Colour logo, shown once the header turns solid */
  logoOnLight: string
  siteName: string
  links: NavLink[]
  cta?: NavLink | null
  announcement?: { text: string; link?: NavLink | null } | null
}

export function Header({ logo, logoOnLight, siteName, links, cta, announcement }: Props) {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const sentinel = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Solid header once the top of the page has scrolled out of view (no scroll listener needed).
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const isActive = (url: string) => url !== '/' && pathname?.startsWith(url)
  const light = solid || open

  return (
    <>
      <div ref={sentinel} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24" />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-fire focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50">
        {announcement?.text && (
          <div className="bg-fire text-center text-sm font-medium text-white">
            <div className="container-x py-2">
              {announcement.link?.url ? (
                <a
                  href={announcement.link.url}
                  target={announcement.link.newTab ? '_blank' : undefined}
                  rel={announcement.link.newTab ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
                >
                  {announcement.text}
                  <ArrowUpRight size={14} weight="bold" aria-hidden />
                </a>
              ) : (
                announcement.text
              )}
            </div>
          </div>
        )}
        <div
          className={`transition-[background-color,border-color,box-shadow] duration-500 ${
            light
              ? 'border-b border-line bg-ink/90 shadow-[0_6px_24px_-16px_rgb(24_24_27/0.35)] backdrop-blur-xl'
              : 'theme-dark border-b border-transparent bg-gradient-to-b from-black/45 to-transparent'
          }`}
        >
          <div className="container-x flex h-[72px] items-center justify-between gap-6">
            <Link href="/" className="relative z-10 shrink-0" aria-label={`${siteName}, home`}>
              <img
                src={light ? logoOnLight : logo}
                alt={siteName}
                width={585}
                height={138}
                className="h-9 w-auto md:h-10"
              />
            </Link>

            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {links.map((l) => (
                  <li key={l.url + l.label}>
                    <Link
                      href={l.url}
                      target={l.newTab ? '_blank' : undefined}
                      rel={l.newTab ? 'noopener noreferrer' : undefined}
                      aria-current={isActive(l.url) ? 'page' : undefined}
                      className={`rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition-colors hover:text-fg ${
                        isActive(l.url) ? 'text-fg underline decoration-fire decoration-2 underline-offset-[10px]' : 'text-fg/80'
                      }`}
                    >
                      {l.label}
                      {l.newTab && <ArrowUpRight size={12} weight="bold" className="ml-0.5 inline -translate-y-px opacity-70" aria-hidden />}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              {cta?.url && cta.label && (
                <Link href={cta.url} className="btn btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
                  {cta.label}
                </Link>
              )}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-line-strong lg:hidden"
              >
                {open ? <X size={20} /> : <List size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div
          id="mobile-menu"
          hidden={!open}
          className="fixed inset-0 top-0 -z-10 overflow-y-auto bg-ink px-5 pb-10 pt-28 lg:hidden"
        >
          <nav aria-label="Mobile">
            <ul className="space-y-1">
              {links.map((l) => (
                <li key={l.url + l.label}>
                  <Link
                    href={l.url}
                    target={l.newTab ? '_blank' : undefined}
                    onClick={() => setOpen(false)}
                    className="display block border-b border-line py-4 text-[1.9rem]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {cta?.url && cta.label && (
              <Link href={cta.url} onClick={() => setOpen(false)} className="btn btn-primary mt-8 w-full">
                {cta.label}
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  )
}
