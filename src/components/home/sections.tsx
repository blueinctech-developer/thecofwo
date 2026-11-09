import { ArrowCircleRight, ArrowRight, ArrowUpRight, Quotes } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import type { AboutPage, Event, GivePage, HomePage, Post, Sermon, SiteSetting, Testimony } from '@/payload-types'
import { dateParts, formatDate, mediaList, mediaUrl, splitHighlight } from '@/lib/utils'
import { parseVideo } from '@/lib/video'

import { Button } from '../Button'
import { Media } from '../Media'
import { PostCard } from '../PostCard'
import { RichText } from '../RichText'
import { socialIcon } from '../socialIcons'
import { VideoEmbed } from '../VideoEmbed'

const delay = (n: number) => ({ '--d': n }) as React.CSSProperties
const rise = (n: number) => ({ '--i': n }) as React.CSSProperties

type Time = NonNullable<SiteSetting['serviceTimes']>[number]
const timeLine = (t: Time) => [t.day, t.time].filter(Boolean).join(' at ')

/* ---------- Hero: full-bleed photo, one big statement and a "when we meet" chip ---------- */
export function Hero({ hero: maybeHero, settings }: { hero?: HomePage['hero'] | null; settings: SiteSetting }) {
  // Before any content is entered (e.g. the very first deploy) fall back to the ministry name.
  const hero = maybeHero ?? ({} as HomePage['hero'])
  const { before, match, after } = splitHighlight(hero.heading || settings.siteName, hero.highlight)
  const times = settings.serviceTimes ?? []

  // With service times entered the chip says when we meet; otherwise it carries the subheading and main button.
  const chip = times.length
    ? { top: times.slice(0, 2).map(timeLine).join('  &  '), bottom: settings.address?.split('\n')[0] || 'Plan your visit', href: '#visit' }
    : { top: hero.subheading || hero.eyebrow, bottom: hero.primary?.label || 'Plan your visit', href: hero.primary?.url || '#visit' }
  const socials = settings.socials ?? []

  return (
    <section className="theme-dark relative isolate flex min-h-[100dvh] items-center overflow-hidden bg-ink">
      {hero.videoUrl ? (
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          src={hero.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          poster={mediaUrl(hero.image, 'hero')}
        />
      ) : (
        <Media media={hero.image} priority sizes="100vw" className="hero-zoom absolute inset-0 -z-20 h-full w-full object-cover" />
      )}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(0_0_0/0.45)_0%,rgb(0_0_0/0.3)_35%,rgb(0_0_0/0.45)_70%,rgb(0_0_0/0.75)_100%)]"
      />

      <div className="container-x pb-32 pt-36">
        <div className="mx-auto max-w-5xl lg:pl-10">
          {hero.eyebrow && times.length > 0 && (
            <p className="hero-in mb-6 text-xs font-bold uppercase tracking-[0.18em] text-white/80" style={rise(0)}>
              {hero.eyebrow}
            </p>
          )}
          <h1
            className="display hero-in text-[3.4rem] leading-[0.95] sm:text-7xl lg:text-[7.25rem]"
            style={rise(1)}
          >
            {before}
            {match && <em>{match}</em>}
            {after}
          </h1>

          {chip.top && (
            <Link
              href={chip.href}
              {...(/^https?:\/\//.test(chip.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="hero-in group mt-10 inline-flex items-center gap-8 bg-black/70 px-5 py-4 backdrop-blur-md transition-colors hover:bg-black/85"
              style={rise(2)}
            >
              <span className="text-[0.82rem] font-bold uppercase leading-snug tracking-[0.04em] text-white">
                {chip.top}
                <br />
                <span className="text-white/75">{chip.bottom}</span>
              </span>
              <ArrowCircleRight size={30} weight="light" className="shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <div className="container-x flex items-center justify-between gap-6 pb-8">
          {hero.secondary?.url && hero.secondary.label ? (
            <Link
              href={hero.secondary.url}
              {...(hero.secondary.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/85 hover:text-white"
            >
              {hero.secondary.label}
              <ArrowUpRight size={14} weight="bold" aria-hidden />
            </Link>
          ) : (
            <span />
          )}
          {socials.length > 0 && (
            <ul className="flex items-center gap-5" aria-label="Social media">
              {socials.map((s) => {
                const Icon = socialIcon(s.platform)
                return Icon ? (
                  <li key={s.id ?? s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform ?? 'Social'} className="text-white/85 hover:text-white">
                      <Icon size={30} aria-hidden />
                    </a>
                  </li>
                ) : null
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------- Two photo cards: "Join us" (service times) and a second invitation ---------- */
function PhotoCard({
  heading,
  image,
  imageSizes,
  big,
  action,
  aside,
  style,
}: {
  heading: string
  image: Parameters<typeof Media>[0]['media']
  imageSizes: string
  big?: React.ReactNode
  action: React.ReactNode
  aside?: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <article data-reveal style={style}>
      <h2 className="display text-[2.6rem] md:text-[3.4rem]">{heading}</h2>
      <div className="mt-7 aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)] bg-ink-3">
        <Media media={image} sizes={imageSizes} className="h-full w-full object-cover" />
      </div>
      {big}
      <div className="mt-7 grid items-start gap-5 sm:grid-cols-[auto_1fr] sm:gap-8">
        <div>{action}</div>
        {aside && <div className="text-[0.95rem] leading-relaxed text-muted">{aside}</div>}
      </div>
    </article>
  )
}

export function VisitCards({
  visit,
  connect,
  fallbackImage,
  settings,
}: {
  visit: HomePage['visit']
  connect: HomePage['connect']
  fallbackImage?: Parameters<typeof Media>[0]['media']
  settings: SiteSetting
}) {
  const times = settings.serviceTimes ?? []
  const visitLink = visit?.link?.url
    ? visit.link
    : { label: times.length || settings.address ? 'Plan a visit' : 'Ask for service details', url: '/contact-us' }
  const connectLink = connect?.link?.url ? connect.link : { label: 'Send a prayer request', url: '/contact-us' }
  const sizes = '(min-width: 768px) 45vw, 100vw'

  return (
    <section id="visit" className="container-x scroll-mt-24 py-24 md:py-36">
      <div className="grid gap-20 md:grid-cols-2 md:gap-10 lg:gap-20">
        <PhotoCard
          heading={visit?.heading || 'Join us'}
          image={visit?.image}
          imageSizes={sizes}
          big={
            times.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                {times.map((t) => (
                  <li key={t.id ?? t.label}>
                    <p className="display text-[2rem] md:text-[2.4rem]">{t.time}</p>
                    <p className="mt-1 text-sm font-semibold text-muted">{[t.day, t.label].filter(Boolean).join(' · ')}</p>
                  </li>
                ))}
              </ul>
            )
          }
          action={<Button link={visitLink} />}
          aside={
            settings.address ? (
              <a
                href={settings.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-pre-line font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fire"
              >
                {settings.address}
              </a>
            ) : (
              visit?.body ||
              'Come as you are. Whether it is your first time or you have walked with God for years, there is a place for you here.'
            )
          }
        />
        <PhotoCard
          heading={connect?.heading || 'Need prayer?'}
          image={connect?.image || fallbackImage}
          imageSizes={sizes}
          action={<Button link={connectLink} />}
          aside={connect?.body || 'Tell us what you are facing. Our prayer team will stand with you in faith and keep your request private.'}
          style={delay(2)}
        />
      </div>
    </section>
  )
}

/* ---------- Who we are: oversized scrolling statement with a photo collage, then mission / goal / vision ---------- */
export function Statement({ welcome, settings }: { welcome: HomePage['welcome']; settings: SiteSetting }) {
  const text = settings.tagline || welcome?.heading || settings.siteName
  const imgs = mediaList(welcome?.images)
  const pillars = settings.pillars ?? []
  const row = (
    <span className="flex shrink-0 items-center">
      {[0, 1].map((i) => (
        <span key={i} className="flex items-center">
          {text}
          <span className="mx-[0.3em] inline-block h-[0.16em] w-[0.16em] rounded-full bg-fire" />
        </span>
      ))}
    </span>
  )

  return (
    <section className="overflow-hidden pb-24 pt-4 md:pb-36">
      <h2 className="sr-only">{text}</h2>
      <div aria-hidden className="pointer-events-none select-none">
        <div className="mega animate-marquee-slow flex w-max">
          {row}
          {row}
        </div>
        <div className="mega animate-marquee-rev flex w-max text-transparent [-webkit-text-stroke:2px_var(--color-fg)]">
          {row}
          {row}
        </div>
      </div>

      <div className="container-x relative z-10 -mt-[4.5vw] grid gap-10 md:grid-cols-12 md:gap-6">
        {imgs[0] && (
          <div className="md:col-span-5 md:mt-[9vw]" data-reveal>
            <div className="aspect-[4/5] overflow-hidden rounded-[var(--radius-xl)] bg-ink-3 shadow-[0_30px_60px_-30px_rgb(60_40_20/0.45)]">
              <Media media={imgs[0]} sizes="(min-width: 768px) 40vw, 100vw" className="h-full w-full object-cover" />
            </div>
            {welcome?.link?.url && (
              <div className="relative -mt-7 flex justify-center">
                <Button link={welcome.link} className="shadow-lg" />
              </div>
            )}
          </div>
        )}
        <div className={imgs[0] ? 'md:col-span-6 md:col-start-7' : 'md:col-span-8'} data-reveal style={delay(2)}>
          {imgs[1] && (
            <div className="aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)] bg-ink-3 shadow-[0_30px_60px_-30px_rgb(60_40_20/0.45)]">
              <Media media={imgs[1]} sizes="(min-width: 768px) 48vw, 100vw" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="mt-10 md:pl-6">
            {welcome?.heading && <h3 className="display text-3xl md:text-[2.6rem]">{welcome.heading}</h3>}
            <RichText data={welcome?.body} className="prose-cofwo mt-5 !text-[1.05rem] md:!text-lg" />
            {!imgs[0] && welcome?.link?.url && (
              <div className="mt-8">
                <Button link={welcome.link} />
              </div>
            )}
          </div>
        </div>
      </div>

      {pillars.length > 0 && (
        <div className="container-x mt-24 md:mt-32">
          <h3 className="sr-only">{settings.pillarsHeading || 'Our Mission, Goal & Vision'}</h3>
          <PillarRow settings={settings} />
        </div>
      )}
    </section>
  )
}

/* ---------- Mission, goal and vision as three plain columns ---------- */
function PillarRow({ settings }: { settings: SiteSetting }) {
  const pillars = settings.pillars ?? []
  return (
    <>
      <div className="grid gap-12 border-t border-line-strong pt-12 md:grid-cols-3 md:gap-10">
        {pillars.map((p, i) => (
          <div key={p.id ?? i} data-reveal style={delay(i)}>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-fire-soft">{p.title}</p>
            {p.statement && <p className="display mt-4 text-[1.6rem] leading-[1.1] md:text-[1.85rem]">{p.statement}</p>}
            {p.body && <p className="mt-4 text-muted">{p.body}</p>}
          </div>
        ))}
      </div>
    </>
  )
}

/** Mission, goal and vision with a visible heading (used on the About page). */
export function Pillars({ settings }: { settings: SiteSetting }) {
  if (!settings.pillars?.length) return null
  return (
    <section className="container-x py-24 md:py-32">
      <h2 className="display mb-12 text-5xl md:text-6xl">{settings.pillarsHeading || 'Our Mission, Goal & Vision'}</h2>
      <PillarRow settings={settings} />
    </section>
  )
}

/* ---------- The Gathering: dark band, big photo with the story beside it ---------- */
export function GatheringBand({ gathering }: { gathering: HomePage['gathering'] }) {
  if (!gathering?.heading) return null
  const imgs = mediaList(gathering.images).slice(0, 3)
  return (
    <section className="theme-dark bg-ink py-24 md:py-32">
      <div className="container-x">
        {gathering.eyebrow && <p className="text-xs font-bold uppercase tracking-[0.16em] text-fire-soft">{gathering.eyebrow}</p>}
        <h2 className="display mt-4 text-5xl md:text-7xl">{gathering.heading}</h2>
        <div className="mt-12 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {imgs[0] && (
            <div className="aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)] bg-ink-3 lg:col-span-7" data-reveal>
              <Media media={imgs[0]} sizes="(min-width: 1024px) 55vw, 100vw" className="h-full w-full object-cover" />
            </div>
          )}
          <div className={imgs[0] ? 'lg:col-span-5' : 'lg:col-span-8'} data-reveal style={delay(2)}>
            <RichText data={gathering.body} className="prose-cofwo !text-[1.05rem] md:!text-lg" />
            {gathering.link?.url && (
              <div className="mt-9">
                <Button link={gathering.link} />
              </div>
            )}
            {imgs.length > 1 && (
              <div className="mt-12 grid grid-cols-2 gap-4">
                {imgs.slice(1).map((img) => (
                  <div key={img.id} className="aspect-[4/3] overflow-hidden rounded-2xl bg-ink-3">
                    <Media media={img} sizes="(min-width: 1024px) 18vw, 50vw" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Latest message: a sermon video, or links to watch online ---------- */
export function LatestMessage({
  section,
  sermon,
  settings,
}: {
  section: HomePage['sermonsSection']
  sermon?: Sermon | null
  settings: SiteSetting
}) {
  if (section?.show === false) return null
  const video = parseVideo(sermon?.videoUrl)
  const watchUrl = settings.livestreamUrl || settings.videoChannelUrl

  if (!sermon) {
    if (!watchUrl) return null
    return (
      <section className="container-x py-24 text-center md:py-32" data-reveal>
        <h2 className="display text-5xl md:text-6xl">{section?.heading || 'Watch online'}</h2>
        <p className="lead mx-auto mt-5 max-w-[46ch]">Join our services live or catch up on recent messages.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {settings.livestreamUrl && <Button link={{ label: 'Watch live', url: settings.livestreamUrl, newTab: true }} />}
          {settings.videoChannelUrl && (
            <Button link={{ label: 'Past messages', url: settings.videoChannelUrl, newTab: true }} variant="ghost" />
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="container-x py-24 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="display text-5xl md:text-6xl">{section?.heading || 'Latest message'}</h2>
        <Link href="/sermons" className="text-xs font-bold uppercase tracking-[0.14em] hover:text-fire">
          All sermons <ArrowRight size={14} weight="bold" className="ml-1 inline" aria-hidden />
        </Link>
      </div>
      <div className="mt-12 grid items-end gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8" data-reveal>
          {video ? (
            <VideoEmbed video={video} title={sermon.title} poster={mediaUrl(sermon.thumbnail, 'large')} />
          ) : (
            <div className="aspect-video overflow-hidden rounded-[var(--radius-xl)] bg-ink-3">
              <Media media={sermon.thumbnail} sizes="(min-width: 1024px) 65vw, 100vw" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
        <div className="lg:col-span-4" data-reveal style={delay(2)}>
          <p className="text-sm font-semibold text-muted">{[sermon.speaker, formatDate(sermon.date)].filter(Boolean).join('  ·  ')}</p>
          <h3 className="display mt-3 text-3xl md:text-4xl">
            <Link href={`/sermons/${sermon.slug}`} className="hover:text-fire">
              {sermon.title}
            </Link>
          </h3>
          {sermon.scripture && <p className="mt-2 font-semibold text-fire-soft">{sermon.scripture}</p>}
          {sermon.summary && <p className="mt-5 text-muted">{sermon.summary}</p>}
          {settings.livestreamUrl && (
            <div className="mt-8">
              <Button link={{ label: 'Watch live', url: settings.livestreamUrl, newTab: true }} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------- Upcoming events: poster cards ---------- */
export function UpcomingEvents({ section, events }: { section: HomePage['eventsSection']; events: Event[] }) {
  if (!section?.show || !events.length) return null
  return (
    <section className="container-x py-24 md:py-32">
      <h2 className="display text-center text-5xl md:text-6xl">{section.heading || 'Upcoming events'}</h2>
      <ul className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {events.map((e, i) => {
          const d = dateParts(e.startDate, e.startDate_tz)
          return (
            <li key={e.id} data-reveal style={delay(i)}>
              <Link href={`/events/${e.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)] bg-fire">
                  {e.image && typeof e.image === 'object' ? (
                    <Media
                      media={e.image}
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                      className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full flex-col justify-end p-7 text-white">
                      <span className="text-sm font-bold uppercase tracking-[0.18em] text-white/80">{d.month}</span>
                      <span className="display text-[6rem] leading-[0.85]">{d.day}</span>
                    </div>
                  )}
                </div>
                <h3 className="mt-6 text-2xl font-bold tracking-tight">{e.title}</h3>
                <p className="mt-1.5 text-sm font-semibold text-muted">
                  {[formatDate(e.startDate, { weekday: 'long', month: 'long', day: 'numeric' }, e.startDate_tz), e.location]
                    .filter(Boolean)
                    .join('  ·  ')}
                </p>
                {e.summary && <p className="mt-3 line-clamp-3 text-muted">{e.summary}</p>}
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] group-hover:text-fire">
                  Learn more <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="mt-14 text-center">
        <Button link={{ label: 'All events', url: '/events' }} variant="ghost" />
      </div>
    </section>
  )
}

/* ---------- Big red scrolling banner ---------- */
export function Ticker({ text }: { text?: string | null }) {
  if (!text) return null
  const items = Array.from({ length: 6 })
  return (
    <div className="relative overflow-hidden bg-fire py-6 text-white md:py-8" role="img" aria-label={text}>
      <div className="animate-marquee flex w-max" aria-hidden>
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0">
            {items.map((_, i) => (
              <span key={i} className="display flex items-center gap-[0.45em] pr-[0.45em] text-5xl uppercase md:text-7xl">
                {text}
                <span className="inline-block h-[0.18em] w-[0.18em] rounded-full bg-white" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Leadership: dark band, shown once leaders are added on the About page ---------- */
export function Leaders({ leaders }: { leaders?: AboutPage['leaders'] }) {
  if (!leaders?.length) return null
  const [lead, ...others] = leaders
  return (
    <section className="theme-dark bg-ink py-24 md:py-32">
      <div className="container-x">
        <h2 className="display text-5xl md:text-7xl">{leaders.length > 1 ? 'Our leadership' : 'Our pastor'}</h2>
        <div className="mt-12 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="aspect-[4/5] overflow-hidden rounded-[var(--radius-xl)] bg-ink-3 lg:col-span-5" data-reveal>
            <Media media={lead.photo} sizes="(min-width: 1024px) 40vw, 100vw" className="h-full w-full object-cover" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7" data-reveal style={delay(2)}>
            {lead.role && <p className="text-xs font-bold uppercase tracking-[0.16em] text-fire-soft">{lead.role}</p>}
            <h3 className="display mt-4 text-4xl md:text-6xl">{lead.name}</h3>
            {lead.bio && <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-prose">{lead.bio}</p>}
            {others.length > 0 && (
              <ul className="mt-12 grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
                {others.map((l) => (
                  <li key={l.id ?? l.name} className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-ink-3">
                      <Media media={l.photo} sizes="64px" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold">{l.name}</p>
                      {l.role && <p className="text-sm text-muted">{l.role}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-10">
              <Button link={{ label: 'About us', url: '/about-us' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Testimonies: horizontal scroll of large quotes ---------- */
export function Testimonies({ section, items }: { section: HomePage['testimoniesSection']; items: Testimony[] }) {
  if (!section?.show || !items.length) return null
  return (
    <section className="overflow-hidden bg-ink-2 py-24 md:py-32">
      <div className="container-x">
        {section.eyebrow && <p className="text-xs font-bold uppercase tracking-[0.16em] text-fire-soft">{section.eyebrow}</p>}
        <h2 className="display mt-4 max-w-[18ch] text-5xl md:text-6xl">{section.heading || 'Testimonies'}</h2>
      </div>
      <div className="container-x mt-12">
        <ul className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:thin] md:-mx-8 md:px-8">
          {items.map((t, i) => (
            <li key={t.id} data-reveal style={delay(i)} className="card flex w-[85vw] max-w-[460px] shrink-0 snap-start flex-col p-8 md:p-10">
              <Quotes size={34} weight="fill" className="text-fire" aria-hidden />
              {t.type && <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-fire-soft">{t.type}</p>}
              <blockquote className="mt-3 flex-1 text-lg leading-relaxed">“{t.quote}”</blockquote>
              <footer className="mt-8 border-t border-line pt-5">
                <p className="font-semibold">{t.name}</p>
                {t.location && <p className="text-sm text-muted">{t.location}</p>}
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Partner with us: a short, centred invitation to give ---------- */
export function Partner({ give }: { give: GivePage }) {
  return (
    <section className="container-x py-24 text-center md:py-32" data-reveal>
      <h2 className="display text-5xl md:text-6xl">{give.intro?.heading || 'Partner with us'}</h2>
      {give.banner?.intro && <p className="lead mx-auto mt-6 max-w-[54ch]">{give.banner.intro}</p>}
      {give.scripture?.text && (
        <p className="mx-auto mt-6 max-w-[60ch] text-sm italic text-subtle">
          “{give.scripture.text}”{give.scripture.reference && <span className="not-italic"> {give.scripture.reference}</span>}
        </p>
      )}
      <div className="mt-10">
        <Button link={{ label: 'Give now', url: '/give' }} />
      </div>
    </section>
  )
}

/* ---------- Blog: one large feature plus a list ---------- */
export function LatestPosts({ section, posts }: { section: HomePage['blogSection']; posts: Post[] }) {
  if (!posts.length) return null
  const [first, ...rest] = posts
  return (
    <section className="border-t border-line">
      <div className="container-x py-24 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display max-w-[18ch] text-5xl md:text-6xl">{section?.heading || 'From the blog'}</h2>
          <Link href="/cofwo-blog" className="text-xs font-bold uppercase tracking-[0.14em] hover:text-fire">
            Read the blog <ArrowRight size={14} weight="bold" className="ml-1 inline" aria-hidden />
          </Link>
        </div>
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7" data-reveal>
            <PostCard post={first} size="large" />
          </div>
          <div className="grid content-start gap-8 lg:col-span-5 lg:border-l lg:border-line lg:pl-12">
            {rest.slice(0, 3).map((p, i) => (
              <div key={p.id} data-reveal style={delay(i + 1)}>
                <PostCard post={p} size="compact" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Gallery: a single scrolling row of photos ---------- */
export function GalleryStrip({ section }: { section: HomePage['gallerySection'] }) {
  const imgs = mediaList(section?.images)
  if (!imgs.length) return null
  return (
    <section className="pb-24 md:pb-32">
      <div className="container-x flex flex-wrap items-end justify-between gap-6">
        <h2 className="display text-5xl md:text-6xl">{section?.heading || 'Gallery'}</h2>
        <Link href="/gallery" className="text-xs font-bold uppercase tracking-[0.14em] hover:text-fire">
          See all photos <ArrowRight size={14} weight="bold" className="ml-1 inline" aria-hidden />
        </Link>
      </div>
      <ul className="mt-12 flex gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:thin] md:gap-5 md:px-8 xl:px-[max(2rem,calc((100vw_-_1280px)/2_+_2rem))]">
        {imgs.map((img, i) => (
          <li key={img.id} className="shrink-0" data-reveal style={delay(i % 4)}>
            <Link href="/gallery" className="block h-72 overflow-hidden rounded-[var(--radius-xl)] bg-ink-3 md:h-96" aria-label={`Gallery: ${img.alt}`}>
              <Media
                media={img}
                sizes="(min-width: 768px) 40vw, 80vw"
                className="h-full w-auto max-w-none object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] hover:scale-[1.04]"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------- Closing invitation: full-bleed dark band that runs into the footer ---------- */
export function Closing({ closing }: { closing: HomePage['closing'] }) {
  if (!closing?.heading) return null
  return (
    <section className="flush-footer theme-dark relative isolate overflow-hidden bg-ink">
      <Media media={closing.image} sizes="100vw" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(16_16_16/0.92)_15%,rgb(16_16_16/0.55)_65%,rgb(16_16_16/0.35)_100%),linear-gradient(180deg,transparent_60%,#101010_100%)]" />
      <div className="container-x py-28 md:py-40">
        <div className="max-w-2xl" data-reveal>
          <h2 className="display text-5xl md:text-7xl">{closing.heading}</h2>
          {closing.body && <p className="mt-6 max-w-[48ch] text-lg text-fg/90">{closing.body}</p>}
          <div className="mt-10 flex flex-wrap gap-3">
            <Button link={closing.primary} />
            <Button link={closing.secondary} variant="ghost" />
          </div>
        </div>
      </div>
    </section>
  )
}
