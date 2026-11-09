'use client'

import { ArrowRight, CheckCircle } from '@phosphor-icons/react'
import { useActionState } from 'react'

import { type FormState, subscribe } from '@/app/(frontend)/actions'

export function NewsletterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribe, { ok: false })

  if (state.ok) {
    return (
      <p role="status" className="flex items-center gap-3 text-lg">
        <CheckCircle size={26} weight="fill" className="text-fire-soft" aria-hidden />
        You are subscribed. Thank you for staying connected.
      </p>
    )
  }

  const err = state.errors?.email
  return (
    <form action={action} noValidate className="w-full">
      <label htmlFor="nl-email" className="field-label">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="nl-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? 'nl-error' : undefined}
          placeholder="you@example.com"
          className="field sm:flex-1"
        />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <input type="hidden" name="source" value="footer" />
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? 'Subscribing…' : 'Subscribe'}
          <ArrowRight className="arrow" size={18} weight="bold" aria-hidden />
        </button>
      </div>
      {(err || state.message) && (
        <p id="nl-error" role="alert" className="mt-2 text-sm text-fire-soft">
          {err || state.message}
        </p>
      )}
    </form>
  )
}
