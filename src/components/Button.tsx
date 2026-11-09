import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react/dist/ssr'

import { SmartLink } from './SmartLink'

type Props = {
  link?: { label?: string | null; url?: string | null; newTab?: boolean | null } | null
  variant?: 'primary' | 'ghost'
  className?: string
}

export function Button({ link, variant = 'primary', className = '' }: Props) {
  if (!link?.label || !link?.url) return null
  const external = link.newTab || /^https?:\/\//.test(link.url)
  const Icon = external ? ArrowUpRight : ArrowRight
  return (
    <SmartLink href={link.url} newTab={link.newTab} className={`btn btn-${variant} ${className}`}>
      {link.label}
      <Icon className="arrow" size={18} weight="bold" aria-hidden />
    </SmartLink>
  )
}
