'use client'

/* eslint-disable @next/next/no-img-element */
import { CaretLeft, CaretRight, X } from '@phosphor-icons/react'
import { useCallback, useEffect, useRef, useState } from 'react'

export type LightboxPhoto = {
  id: number
  thumb: string
  full: string
  srcSet?: string
  alt: string
  width?: number | null
  height?: number | null
}

/** Masonry photo grid with a full-screen viewer (keyboard, swipe and Esc supported). */
export function PhotoGrid({ photos }: { photos: LightboxPhoto[] }) {
  const [index, setIndex] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const touchX = useRef<number | null>(null)

  const open = (i: number) => {
    setIndex(i)
    dialog.current?.showModal()
  }
  const close = useCallback(() => {
    dialog.current?.close()
    setIndex(null)
  }, [])
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  )

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, step])

  const current = index !== null ? photos[index] : null

  return (
    <>
      <ul className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4 [&>li]:mb-3 md:[&>li]:mb-4">
        {photos.map((p, i) => (
          <li key={p.id} className="break-inside-avoid" data-reveal style={{ '--d': i % 4 } as React.CSSProperties}>
            <a
              href={p.full}
              onClick={(e) => {
                e.preventDefault()
                open(i)
              }}
              className="group block overflow-hidden rounded-[var(--radius-xl)] bg-ink-3"
              aria-label={`View photo: ${p.alt}`}
            >
              <img
                src={p.thumb}
                alt={p.alt}
                width={p.width ?? undefined}
                height={p.height ?? undefined}
                loading="lazy"
                decoding="async"
                className="w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
              />
            </a>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === dialog.current && close()}
        className="theme-dark m-0 h-[100dvh] max-h-none w-screen max-w-none bg-ink/95 p-0 text-fg backdrop:bg-black/80"
        aria-label="Photo viewer"
      >
        {current && (
          <div
            className="relative flex h-full w-full items-center justify-center p-4 md:p-16"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return
              const dx = e.changedTouches[0].clientX - touchX.current
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
              touchX.current = null
            }}
          >
            <img
              key={current.id}
              src={current.full}
              srcSet={current.srcSet}
              sizes="100vw"
              alt={current.alt}
              className="max-h-full max-w-full rounded-xl object-contain"
            />
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-muted" aria-live="polite">
              {index! + 1} of {photos.length}
            </p>
            <button onClick={close} className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-ink-3 hover:bg-ink-4" aria-label="Close">
              <X size={22} />
            </button>
            {photos.length > 1 && (
              <>
                <button onClick={() => step(-1)} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-ink-3 hover:bg-ink-4 md:left-6" aria-label="Previous photo">
                  <CaretLeft size={22} />
                </button>
                <button onClick={() => step(1)} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-ink-3 hover:bg-ink-4 md:right-6" aria-label="Next photo">
                  <CaretRight size={22} />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  )
}
