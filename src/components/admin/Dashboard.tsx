/* Admin links are plain anchors: the admin is its own app. */
/* eslint-disable @next/next/no-html-link-for-pages */
import { Gutter } from '@payloadcms/ui'
import type { Payload, TypedUser } from 'payload'
import React from 'react'

type Props = { payload: Payload; user?: TypedUser | null }

const RED = '#c8101c'

const tasks = [
  { href: '/admin/collections/posts/create', title: 'Write a blog post', text: 'Saves as a draft until you press Publish' },
  { href: '/admin/collections/sermons/create', title: 'Add a sermon', text: 'Paste a YouTube or Facebook link' },
  { href: '/admin/collections/events/create', title: 'Add an event', text: 'Shows on the homepage until it is over' },
  { href: '/admin/collections/albums', title: 'Add photos', text: 'Create or add to a gallery album' },
  { href: '/admin/globals/home-page', title: 'Edit the homepage', text: 'Slides, welcome text, The Gathering' },
  { href: '/admin/globals/site-settings', title: 'Church details', text: 'Service times, address, phone, social links' },
]

type Todo = { done: boolean; title: string; href: string }

async function getTodos(payload: Payload): Promise<Todo[]> {
  try {
    const [s, about, give, testimonies, sermons] = await Promise.all([
      payload.findGlobal({ slug: 'site-settings', depth: 0 }),
      payload.findGlobal({ slug: 'about-page', depth: 0 }),
      payload.findGlobal({ slug: 'give-page', depth: 0 }),
      payload.count({ collection: 'testimonies', where: { show: { equals: true } } }),
      payload.count({ collection: 'sermons', where: { _status: { equals: 'published' } } }),
    ])
    return [
      { done: Boolean(s.serviceTimes?.length), title: 'Add your service times', href: '/admin/globals/site-settings' },
      { done: Boolean(s.address), title: 'Add where you meet', href: '/admin/globals/site-settings' },
      { done: Boolean(s.socials?.length), title: 'Add your social media links', href: '/admin/globals/site-settings' },
      { done: Boolean(about.leaders?.length), title: 'Add your pastors and leaders', href: '/admin/globals/about-page' },
      { done: Boolean(give.methods?.length), title: 'Add how people can give', href: '/admin/globals/give-page' },
      {
        done: sermons.totalDocs > 0 || Boolean(s.livestreamUrl),
        title: 'Add a sermon or your livestream link',
        href: '/admin/collections/sermons/create',
      },
      {
        done: testimonies.totalDocs > 0,
        title: 'Check the testimonies and tick "Show on website"',
        href: '/admin/collections/testimonies',
      },
    ]
  } catch {
    return []
  }
}

export async function Dashboard({ payload, user }: Props) {
  const [unread, todos] = await Promise.all([
    payload
      .count({ collection: 'messages', where: { status: { equals: 'new' } } })
      .then((r) => r.totalDocs)
      .catch(() => 0),
    getTodos(payload),
  ])
  const firstName = (user as { name?: string } | null | undefined)?.name?.split(' ')[0]
  const left = todos.filter((t) => !t.done)

  const card: React.CSSProperties = {
    display: 'block',
    padding: '20px 22px',
    borderRadius: 10,
    border: '1px solid var(--theme-elevation-150)',
    background: 'var(--theme-elevation-50)',
    textDecoration: 'none',
    color: 'inherit',
  }

  return (
    <Gutter>
      <div style={{ maxWidth: 960, padding: '32px 0 64px' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 32 }}>Welcome{firstName ? `, ${firstName}` : ''}</h1>
        <p style={{ margin: '0 0 28px', opacity: 0.75 }}>
          What you publish here shows on the website straight away.{' '}
          <a href="/" target="_blank" rel="noreferrer" style={{ color: RED }}>
            Open the website ↗
          </a>
        </p>

        {unread > 0 && (
          <a
            href="/admin/collections/messages?where[status][equals]=new"
            style={{ ...card, marginBottom: 28, background: 'rgba(200,16,28,0.08)', borderColor: 'rgba(200,16,28,0.35)' }}
          >
            <strong>
              You have {unread} new message{unread === 1 ? '' : 's'}
            </strong>{' '}
            → read {unread === 1 ? 'it' : 'them'}
          </a>
        )}

        <h2 style={{ margin: '0 0 14px', fontSize: 18 }}>What would you like to do?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {tasks.map((t) => (
            <a key={t.href} href={t.href} style={card}>
              <strong style={{ display: 'block', fontSize: 17, marginBottom: 6 }}>{t.title}</strong>
              <span style={{ fontSize: 14, opacity: 0.7 }}>{t.text}</span>
            </a>
          ))}
        </div>

        {left.length > 0 && (
          <div style={{ ...card, marginTop: 36 }}>
            <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>Still to fill in</h2>
            <p style={{ margin: '0 0 12px', fontSize: 14, opacity: 0.7 }}>
              These disappear from the list as you complete them.
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {left.map((t) => (
                <li key={t.title}>
                  <a
                    href={t.href}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', textDecoration: 'none', color: 'inherit' }}
                  >
                    <span
                      aria-hidden
                      style={{ width: 16, height: 16, flex: 'none', borderRadius: 4, border: `2px solid ${RED}` }}
                    />
                    {t.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p style={{ marginTop: 36, fontSize: 14, opacity: 0.6 }}>Everything else is in the menu on the left.</p>
      </div>
    </Gutter>
  )
}
