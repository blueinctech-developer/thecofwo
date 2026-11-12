import type { ServerProps } from 'payload'
import React from 'react'

type Item = { done: boolean; title: string; why: string; href: string; optional?: boolean }

/**
 * Shows staff which real ministry details are still missing before launch.
 * Every item is worked out from the content itself, so it ticks off as they fill things in.
 */
export const LaunchChecklist = async ({ payload }: ServerProps) => {
  let items: Item[] = []
  try {
    const [s, about, give, shownTestimonies, sermons, events] = await Promise.all([
      payload.findGlobal({ slug: 'site-settings', depth: 0 }),
      payload.findGlobal({ slug: 'about-page', depth: 0 }),
      payload.findGlobal({ slug: 'give-page', depth: 0 }),
      payload.count({ collection: 'testimonies', where: { show: { equals: true } } }),
      payload.count({ collection: 'sermons', where: { _status: { equals: 'published' } } }),
      payload.count({ collection: 'events', where: { startDate: { greater_than_equal: new Date().toISOString() } } }),
    ])
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

    items = [
      {
        done: Boolean(s.serviceTimes?.length),
        title: 'Add service times',
        why: 'The first thing visitors look for. Shown on the homepage, Contact page and footer.',
        href: '/admin/globals/site-settings',
      },
      {
        done: Boolean(s.address),
        title: 'Add where you meet',
        why: 'Venue name and address, plus a Google Maps link for directions.',
        href: '/admin/globals/site-settings',
      },
      {
        done: Boolean(about.leaders?.length),
        title: 'Introduce your leadership',
        why: 'Name, role, photo and a short bio for the pastor(s). Shown on the About page.',
        href: '/admin/globals/about-page',
      },
      {
        done: Boolean(give.methods?.length),
        title: 'Add ways to give',
        why: 'An online giving link and/or bank details. Until then the Give page asks people to contact you.',
        href: '/admin/globals/give-page',
      },
      {
        done: Boolean(s.socials?.length),
        title: 'Add social media links',
        why: 'Facebook, YouTube, Instagram, etc. Shown in the footer.',
        href: '/admin/globals/site-settings',
      },
      {
        done: sermons.totalDocs > 0 || Boolean(s.livestreamUrl || s.videoChannelUrl),
        title: 'Add a sermon or livestream link',
        why: 'Lets people watch online. Add a sermon (a YouTube or Facebook link is enough), or a livestream link in Site settings.',
        href: sermons.totalDocs > 0 ? '/admin/collections/sermons' : '/admin/collections/sermons/create',
      },
      {
        done: shownTestimonies.totalDocs > 0,
        title: 'Confirm testimonies',
        why: 'The testimonies from the old site are hidden until you confirm they are real. Tick "Show on website".',
        href: '/admin/collections/testimonies',
      },
      {
        done: events.totalDocs > 0,
        title: 'Add an upcoming event',
        why: 'Upcoming events appear on the homepage automatically.',
        href: '/admin/collections/events/create',
        optional: true,
      },
      {
        done: Boolean(process.env.SES_ACCESS_KEY_ID && process.env.SES_SECRET_ACCESS_KEY),
        title: 'Turn on email alerts',
        why: 'Get an email for each new contact message. Needs the Amazon SES access keys added on Vercel (see docs/DEPLOYMENT.md).',
        href: '/admin/globals/site-settings',
        optional: true,
      },
      {
        done: /^https:\/\/(www\.)?thecofwo\.org/.test(serverUrl),
        title: 'Connect thecofwo.org',
        why: 'Point the domain at Vercel and set NEXT_PUBLIC_SERVER_URL (see docs/DEPLOYMENT.md).',
        href: '/admin',
        optional: true,
      },
    ]
  } catch {
    return null
  }

  const required = items.filter((i) => !i.optional)
  const doneCount = items.filter((i) => i.done).length
  if (doneCount === items.length) return null

  return (
    <div
      style={{
        marginBottom: 32,
        padding: '20px 22px',
        borderRadius: 10,
        border: '1px solid var(--theme-elevation-150)',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0 }}>Before launch</h3>
        <span style={{ fontSize: 13, opacity: 0.75 }}>
          {required.filter((i) => i.done).length} of {required.length} essentials done
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 6, background: 'var(--theme-elevation-150)', margin: '12px 0 16px' }}>
        <div
          style={{
            width: `${Math.round((doneCount / items.length) * 100)}%`,
            height: '100%',
            borderRadius: 6,
            background: '#c8101c',
          }}
        />
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 2 }}>
        {items
          .filter((i) => !i.done)
          .map((i) => (
            <li key={i.title}>
              <a
                href={i.href}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '20px 1fr',
                  gap: 10,
                  padding: '10px 6px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 16,
                    height: 16,
                    marginTop: 3,
                    borderRadius: 4,
                    border: `2px solid ${i.optional ? 'var(--theme-elevation-400)' : '#c8101c'}`,
                  }}
                />
                <span>
                  <strong>{i.title}</strong>
                  {i.optional && <span style={{ fontSize: 12, opacity: 0.6 }}> (optional)</span>}
                  <span style={{ display: 'block', fontSize: 13, opacity: 0.75, marginTop: 2 }}>{i.why}</span>
                </span>
              </a>
            </li>
          ))}
      </ul>
    </div>
  )
}
