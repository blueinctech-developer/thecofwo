'use client'

import React, { useEffect } from 'react'

/**
 * Adds a "Show" / "Hide" button to every password box in the admin
 * (sign in, first account, reset and change password), so people can check what they typed.
 */
export function PasswordReveal({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    const enhance = () => {
      document.querySelectorAll<HTMLInputElement>('input[type="password"]:not([data-reveal])').forEach((input) => {
        input.dataset.reveal = 'on'
        const holder = input.parentElement
        if (!holder) return
        if (getComputedStyle(holder).position === 'static') holder.style.position = 'relative'
        input.style.paddingRight = '4.5rem'

        const button = document.createElement('button')
        button.type = 'button'
        button.textContent = 'Show'
        button.setAttribute('aria-label', 'Show password')
        button.setAttribute('aria-pressed', 'false')
        Object.assign(button.style, {
          position: 'absolute',
          right: '0.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          padding: '0.35rem 0.6rem',
          border: '0',
          borderRadius: '4px',
          background: 'var(--theme-elevation-100)',
          color: 'var(--theme-text)',
          font: 'inherit',
          fontSize: '0.8rem',
          fontWeight: '600',
          cursor: 'pointer',
        })
        button.addEventListener('click', () => {
          const show = input.type === 'password'
          input.type = show ? 'text' : 'password'
          button.textContent = show ? 'Hide' : 'Show'
          button.setAttribute('aria-label', show ? 'Hide password' : 'Show password')
          button.setAttribute('aria-pressed', String(show))
          input.focus()
        })
        holder.appendChild(button)
      })
    }

    enhance()
    // The admin swaps screens without reloading, so watch for new password boxes.
    const observer = new MutationObserver(enhance)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return <>{children}</>
}
