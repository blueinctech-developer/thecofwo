/* Admin links are plain anchors: the admin is its own app. */
/* eslint-disable @next/next/no-html-link-for-pages */
import type { ServerProps } from 'payload'
import React from 'react'

const links = [
  { href: '/admin/globals/home-page', title: 'Edit the homepage', text: 'Hero, welcome text, The Gathering and more' },
  { href: '/admin/collections/posts/create', title: 'Write a blog post', text: 'Save drafts, then publish when ready' },
  { href: '/admin/collections/events/create', title: 'Add an event', text: 'Services, conferences and gatherings' },
  { href: '/admin/collections/albums', title: 'Upload photos', text: 'Create or update gallery albums' },
  { href: '/admin/globals/site-settings', title: 'Site settings', text: 'Contact details, social links, giving' },
]

export const Welcome = async ({ payload, user }: ServerProps) => {
  let unread = 0
  try {
    const res = await payload.count({ collection: 'messages', where: { status: { equals: 'new' } } })
    unread = res.totalDocs
  } catch {
    // Collection may not exist yet during first setup.
  }
  const firstName = (user as { name?: string } | undefined)?.name?.split(' ')[0]

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ margin: '0 0 4px' }}>Welcome{firstName ? `, ${firstName}` : ''}</h2>
      <p style={{ margin: '0 0 20px', opacity: 0.75 }}>
        Changes you publish here appear on thecofwo.org straight away.{' '}
        <a href="/" target="_blank" rel="noreferrer">
          View the website ↗
        </a>
      </p>
      {unread > 0 && (
        <a
          href="/admin/collections/messages?where[status][equals]=new"
          style={{
            display: 'block',
            padding: '14px 18px',
            marginBottom: 20,
            borderRadius: 8,
            background: 'rgba(204,5,19,0.1)',
            border: '1px solid rgba(204,5,19,0.35)',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <strong>
            {unread} new contact message{unread === 1 ? '' : 's'}
          </strong>{' '}
          waiting in the inbox →
        </a>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            style={{
              display: 'block',
              padding: '16px 18px',
              borderRadius: 8,
              border: '1px solid var(--theme-elevation-150)',
              background: 'var(--theme-elevation-50)',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <strong style={{ display: 'block', marginBottom: 4 }}>{l.title}</strong>
            <span style={{ fontSize: 13, opacity: 0.7 }}>{l.text}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
