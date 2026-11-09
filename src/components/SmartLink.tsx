import Link from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  href?: string | null
  newTab?: boolean | null
  className?: string
  children: ReactNode
  'aria-label'?: string
}

const isExternal = (href: string) => /^(https?:)?\/\//.test(href) || /^(mailto|tel):/.test(href)

/** A link that works for both pages on this site and outside websites. */
export function SmartLink({ href, newTab, className, children, ...rest }: Props) {
  if (!href) return null
  if (isExternal(href) || newTab) {
    return (
      <a
        href={href}
        className={className}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        {...rest}
      >
        {children}
        {newTab && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    )
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  )
}

type LinkData = { label?: string | null; url?: string | null; newTab?: boolean | null } | null | undefined

export const hasLink = (l: LinkData): l is { label: string; url: string; newTab?: boolean | null } =>
  Boolean(l?.label && l?.url)
