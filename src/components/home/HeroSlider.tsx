'use client'

import { ArrowCircleRight } from '@phosphor-icons/react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import type { Media as MediaDoc } from '@/payload-types'

import { Media } from '../Media'

export type HeroSlide = {
  image?: MediaDoc | number | null
  videoUrl?: string | null
  poster?: string
  eyebrow?: string | null
  before: string
  match: string
  after: string
  chip?: { top: string; bottom: string; href: string } | null
}

const INTERVAL = 7000
const rise = (n: number) => ({ '--i': n }) as React.CSSProperties
const isExternal = (href: string) => /^https?:\/\//.test(href)

/**
 * Full-screen hero. With one slide it is a still photo; with more it quietly
 * crossfades between them with a slow zoom. No counters or arrows; phones can swipe.
 */
export function HeroSlider({ slides, footer }: { slides: HeroSlide[]; footer?: React.ReactNode }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const touchX = useRef<number | null>(null)
  const count = slides.length
  const multi = count > 1
  const go = (n: number) => setIndex(((n % count) + count) % count)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    // Stop the clock while the tab is in the background.
    const onVis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      mq.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  // Next slide after a fixed time; restarts whenever the slide changes (including by swipe).
  useEffect(() => {
    if (!multi || reduced || paused) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL)
    return () => window.clearTimeout(t)
  }, [index, multi, reduced, paused, count])

  const slide = slides[index]

  return (
    <section
      className="theme-dark relative isolate flex min-h-[calc(100dvh-72px)] items-center overflow-hidden bg-ink md:min-h-[calc(100dvh-84px)]"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null || !multi) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1))
        touchX.current = null
      }}
    >
      {/* Photos stacked on top of each other; the active one fades in and slowly zooms out */}
      {slides.map((s, i) => {
        const active = i === index
        return (
          <div
            key={i}
            aria-hidden={!active}
            className={`absolute inset-0 -z-20 transition-opacity duration-[1400ms] ease-out ${active ? 'opacity-100' : 'opacity-0'}`}
          >
            {s.videoUrl ? (
              <video className="h-full w-full object-cover" src={s.videoUrl} autoPlay muted loop playsInline poster={s.poster} />
            ) : (
              <Media
                media={s.image}
                priority={i === 0}
                sizes="100vw"
                className={`h-full w-full object-cover ease-out ${i === 0 && !multi ? 'hero-zoom' : ''} ${
                  multi ? `transition-transform duration-[8000ms] ${active ? 'scale-100' : 'scale-[1.12]'}` : ''
                }`}
              />
            )}
          </div>
        )
      })}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(0_0_0/0.45)_0%,rgb(0_0_0/0.3)_35%,rgb(0_0_0/0.45)_70%,rgb(0_0_0/0.8)_100%)]"
      />

      {/* Text: re-animates only when the words change, so photo-only slides keep the heading steady */}
      <div className="container-x pb-32 pt-20 md:pt-24">
        <div key={`${slide.before}${slide.match}${slide.after}|${slide.chip?.href}`} className="mx-auto max-w-5xl lg:pl-10">
          {slide.eyebrow && (
            <p className="hero-in mb-6 text-xs font-bold uppercase tracking-[0.18em] text-white/80" style={rise(0)}>
              {slide.eyebrow}
            </p>
          )}
          {/* Only the first slide's heading is the page's h1 */}
          {index === 0 ? (
            <h1 className="display hero-in text-[3.4rem] leading-[0.95] sm:text-7xl lg:text-[7.25rem]" style={rise(1)}>
              {slide.before}
              {slide.match && <em>{slide.match}</em>}
              {slide.after}
            </h1>
          ) : (
            <p className="display hero-in text-[3.4rem] leading-[0.95] sm:text-7xl lg:text-[7.25rem]" style={rise(1)}>
              {slide.before}
              {slide.match && <em>{slide.match}</em>}
              {slide.after}
            </p>
          )}

          {slide.chip?.top && (
            <Link
              href={slide.chip.href}
              {...(isExternal(slide.chip.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="hero-in group mt-10 inline-flex items-center gap-8 bg-black/70 px-5 py-4 backdrop-blur-md transition-colors hover:bg-black/85"
              style={rise(2)}
            >
              <span className="text-[0.82rem] font-bold uppercase leading-snug tracking-[0.04em] text-white">
                {slide.chip.top}
                <br />
                <span className="text-white/75">{slide.chip.bottom}</span>
              </span>
              <ArrowCircleRight size={30} weight="light" className="shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          )}
        </div>
      </div>

      {footer && (
        <div className="absolute inset-x-0 bottom-0">
          <div className="container-x pb-8 pr-20 md:pr-32">{footer}</div>
        </div>
      )}
    </section>
  )
}
