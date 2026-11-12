'use server'

import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/payload'

export type FormState = {
  ok: boolean
  message?: string
  errors?: Record<string, string>
  values?: Record<string, string>
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const text = (fd: FormData, key: string, max = 2000) => String(fd.get(key) ?? '').trim().slice(0, max)

/** Very small in-memory rate limit per visitor (resets when the server restarts). */
const hits = new Map<string, number[]>()
const tooMany = async (bucket: string, limit: number) => {
  const h = await headers()
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'local'
  const key = `${bucket}:${ip}`
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 10 * 60 * 1000)
  recent.push(now)
  hits.set(key, recent)
  return recent.length > limit
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

async function notify(subject: string, rows: [string, string][], replyTo?: string) {
  const payload = await getPayloadClient()
  if (!process.env.SES_ACCESS_KEY_ID || !process.env.SES_SECRET_ACCESS_KEY) return
  try {
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    const to = settings.notifyEmail || settings.email
    if (!to) return
    await payload.sendEmail({
      to,
      replyTo,
      subject,
      html: `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">${rows
        .map(([k, v]) => `<tr><td style="color:#666;vertical-align:top"><b>${escape(k)}</b></td><td>${escape(v).replace(/\n/g, '<br>')}</td></tr>`)
        .join('')}</table>`,
    })
  } catch (err) {
    payload.logger.error({ err }, 'Could not send form notification email')
  }
}

export async function sendContactMessage(_prev: FormState, fd: FormData): Promise<FormState> {
  const values = {
    firstName: text(fd, 'firstName', 80),
    lastName: text(fd, 'lastName', 80),
    email: text(fd, 'email', 200),
    phone: text(fd, 'phone', 40),
    subject: text(fd, 'subject', 200),
    message: text(fd, 'message', 5000),
  }

  // Honeypot: real people never fill this hidden field.
  if (text(fd, 'website')) return { ok: true }

  const errors: Record<string, string> = {}
  if (!values.firstName) errors.firstName = 'Please enter your first name.'
  if (!values.lastName) errors.lastName = 'Please enter your last name.'
  if (!EMAIL.test(values.email)) errors.email = 'Please enter a valid email address.'
  if (!values.subject) errors.subject = 'Please tell us what this is about.'
  if (values.message.length < 10) errors.message = 'Please write a little more so we can help.'
  if (Object.keys(errors).length) return { ok: false, errors, values }

  if (await tooMany('contact', 5)) {
    return { ok: false, message: 'Too many messages in a short time. Please try again in a few minutes.', values }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'messages',
      overrideAccess: true,
      data: {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: values.phone || undefined,
        subject: values.subject,
        message: values.message,
        status: 'new',
      },
    })
    await notify(
      `New message: ${values.subject}`,
      [
        ['Name', `${values.firstName} ${values.lastName}`],
        ['Email', values.email],
        ['Phone', values.phone || '-'],
        ['Subject', values.subject],
        ['Message', values.message],
      ],
      values.email,
    )
    return { ok: true }
  } catch {
    return {
      ok: false,
      message: 'Sorry, your message could not be sent. Please try again, or email us directly.',
      values,
    }
  }
}

export async function subscribe(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = text(fd, 'email', 200).toLowerCase()
  if (text(fd, 'website')) return { ok: true }
  if (!EMAIL.test(email)) return { ok: false, errors: { email: 'Please enter a valid email address.' }, values: { email } }
  if (await tooMany('newsletter', 8)) return { ok: false, message: 'Please try again in a few minutes.' }

  try {
    const payload = await getPayloadClient()
    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs[0]) {
      if (existing.docs[0].status !== 'subscribed') {
        await payload.update({
          collection: 'subscribers',
          id: existing.docs[0].id,
          data: { status: 'subscribed' },
          overrideAccess: true,
        })
      }
    } else {
      await payload.create({
        collection: 'subscribers',
        data: { email, status: 'subscribed', source: text(fd, 'source', 100) || 'website' },
        overrideAccess: true,
      })
      await notify('New newsletter signup', [['Email', email]])
    }
    return { ok: true }
  } catch {
    return { ok: false, message: 'Sorry, something went wrong. Please try again.', values: { email } }
  }
}
