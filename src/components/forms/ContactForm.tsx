'use client'

import { ArrowRight, CheckCircle } from '@phosphor-icons/react'
import Link from 'next/link'
import { useActionState } from 'react'

import { type FormState, sendContactMessage } from '@/app/(frontend)/actions'

const Field = ({
  name,
  label,
  type = 'text',
  autoComplete,
  optional,
  e,
  v,
}: {
  name: string
  label: string
  type?: string
  autoComplete?: string
  optional?: boolean
  e: Record<string, string>
  v: Record<string, string>
}) => (
  <div>
    <label htmlFor={`c-${name}`} className="field-label">
      {label} {optional ? <span className="text-subtle">(optional)</span> : <span aria-hidden className="text-fire-soft">*</span>}
    </label>
    <input
      id={`c-${name}`}
      name={name}
      type={type}
      autoComplete={autoComplete}
      required={!optional}
      defaultValue={v[name]}
      aria-invalid={e[name] ? true : undefined}
      aria-describedby={e[name] ? `c-${name}-err` : undefined}
      className="field"
    />
    {e[name] && (
      <p id={`c-${name}-err`} className="mt-2 text-sm text-fire-soft">
        {e[name]}
      </p>
    )}
  </div>
)

type Props = { subjects?: string[]; successMessage?: string | null }

export function ContactForm({ subjects = [], successMessage }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(sendContactMessage, { ok: false })

  if (state.ok) {
    return (
      <div role="status" className="card p-8">
        <CheckCircle size={40} weight="fill" className="text-fire-soft" aria-hidden />
        <h3 className="mt-4 text-2xl font-semibold">Message sent</h3>
        <p className="mt-2 text-muted">{successMessage || 'Thank you. We will be in touch soon.'}</p>
      </div>
    )
  }

  const e = state.errors ?? {}
  const v = state.values ?? {}

  return (
    <form action={action} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field e={e} v={v} name="firstName" label="First name" autoComplete="given-name" />
        <Field e={e} v={v} name="lastName" label="Last name" autoComplete="family-name" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field e={e} v={v} name="email" label="Email" type="email" autoComplete="email" />
        <Field e={e} v={v} name="phone" label="Phone" type="tel" autoComplete="tel" optional />
      </div>
      {subjects.length ? (
        <div>
          <label htmlFor="c-subject" className="field-label">
            What is this about? <span aria-hidden className="text-fire-soft">*</span>
          </label>
          <select
            id="c-subject"
            name="subject"
            required
            defaultValue={v.subject ?? ''}
            aria-invalid={e.subject ? true : undefined}
            className="field appearance-none"
          >
            <option value="" disabled>
              Choose one
            </option>
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {e.subject && <p className="mt-2 text-sm text-fire-soft">{e.subject}</p>}
        </div>
      ) : (
        <Field e={e} v={v} name="subject" label="Subject" />
      )}
      <div>
        <label htmlFor="c-message" className="field-label">
          Message <span aria-hidden className="text-fire-soft">*</span>
        </label>
        <textarea
          id="c-message"
          name="message"
          rows={6}
          required
          defaultValue={v.message}
          aria-invalid={e.message ? true : undefined}
          aria-describedby={e.message ? 'c-message-err' : undefined}
          className="field resize-y"
        />
        {e.message && (
          <p id="c-message-err" className="mt-2 text-sm text-fire-soft">
            {e.message}
          </p>
        )}
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {state.message && (
        <p role="alert" className="rounded-xl border border-fire/40 bg-fire/10 px-4 py-3 text-sm">
          {state.message}
        </p>
      )}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          We only use your details to reply to you. See our{' '}
          <Link href="/privacy-policy" className="underline underline-offset-4 hover:text-fg">
            privacy policy
          </Link>
          .
        </p>
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? 'Sending…' : 'Send message'}
          <ArrowRight className="arrow" size={18} weight="bold" aria-hidden />
        </button>
      </div>
    </form>
  )
}
