'use client'

import { useEffect } from 'react'

/**
 * Fades sections in as they scroll into view. Uses one IntersectionObserver for the
 * whole page (no scroll listeners). Without JavaScript, everything is simply visible.
 */
export function RevealObserver() {
  useEffect(() => {
    document.documentElement.classList.add('js')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute('data-shown', '')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    const observe = () =>
      document.querySelectorAll('[data-reveal]:not([data-shown])').forEach((el) => io.observe(el))
    observe()
    // Pick up content added after client-side navigation.
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
  return null
}
