import { WhatsappLogo } from '@phosphor-icons/react/dist/ssr'

type Props = { number?: string | null; message?: string | null; enabled?: boolean | null }

/** Turns "+234 (801) 234-5678" into the digits-only form wa.me expects. */
export const whatsappLink = (number?: string | null, message?: string | null) => {
  const digits = (number ?? '').replace(/\D/g, '')
  if (digits.length < 8) return null
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

/** Green chat button fixed to the bottom-right corner of every page. Set in Site settings → Contact & services. */
export function WhatsAppButton({ number, message, enabled }: Props) {
  const href = enabled === false ? null : whatsappLink(number, message)
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 flex items-center gap-3 md:bottom-7 md:right-7"
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#121212] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
        Chat with us
      </span>
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgb(0_0_0/0.45)] transition-transform duration-300 group-hover:scale-105 group-active:scale-95 md:h-16 md:w-16">
        <span aria-hidden className="wa-ping absolute inset-0 rounded-full bg-[#25D366]" />
        <WhatsappLogo size={32} weight="fill" className="relative" aria-hidden />
      </span>
    </a>
  )
}
