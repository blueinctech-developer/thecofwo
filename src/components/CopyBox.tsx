'use client'

import { Check, Copy } from '@phosphor-icons/react'
import { useState } from 'react'

/** Shows account details with a one-click copy button. */
export function CopyBox({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="relative mt-5 rounded-xl border border-line bg-ink p-4 pr-14">
      <pre className="whitespace-pre-wrap font-sans text-[0.95rem] leading-relaxed text-fg">{text}</pre>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          } catch {
            /* clipboard blocked; the text can still be selected */
          }
        }}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-line-strong text-muted hover:text-fg"
        aria-label={copied ? 'Copied' : 'Copy details'}
      >
        {copied ? <Check size={16} weight="bold" /> : <Copy size={16} />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </div>
  )
}
