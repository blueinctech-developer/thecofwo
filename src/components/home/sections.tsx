import { ArrowRight, ArrowUpRight, CalendarBlank, Clock, MapPin, PlayCircle, Quotes } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import type { Event, HomePage, Post, Sermon, SiteSetting, Testimony } from '@/payload-types'
import { dateParts, formatDate, mediaList, mediaUrl, splitHighlight } from '@/lib/utils'
import { parseVideo } from '@/lib/video'

import { Button } from '../Button'
import { Media } from '../Media'
import { PostCard } from '../PostCard'
import { RichText } from '../RichText'
import { VideoEmbed } from '../VideoEmbed'

const delay = (n: number) => ({ '--d': n }) as React.CSSProperties

/* ---------- Hero: full-bleed photo, content anchored bottom-left ---------- */
export function Hero({ hero: maybeHero }: { hero?: HomePage['hero'] | null }) {
  // Before any content is entered (e.g. the very first deploy) fall back to the ministry name.
  const hero = maybeHero ?? ({} as HomePage['hero'])
  const { before, match, after } = splitHighlight(hero.heading || 'The Chariot of Fire World Outreach', hero.highlight)
  return (
    <section className="theme-dark relative isolate flex min-h-[92dvh] items-end overflow-hidden bg-ink md:min-h-[100dvh]">
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
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(17_17_19/0.82)_0%,rgb(17_17_19/0.45)_55%,rgb(17_17_19/0.1)_100%),linear-gradient(180deg,rgb(17_17_19/0.35)_0%,transparent_30%,transparent_60%,rgb(17_17_19/0.7)_100%)]"
      />
      <div className="container-x pb-16 pt-32 md:pb-24">
        <div className="max-w-3xl">
          {hero.eyebrow && (
            <p className="eyebrow hero-in" style={{ '--i': 0 } as React.CSSProperties}>
              {hero.eyebrow}
            </p>
          )}
          <h1 className="display hero-in mt-5 text-[2.9rem] sm:text-6xl lg:text-[4.75rem]" style={{ '--i': 1 } as React.CSSProperties}>
            {before}
            {match && <span className="text-fire-soft">{match}</span>}
            {after}
          </h1>
          {hero.subheading && (
            <p className="hero-in mt-6 max-w-[44ch] text-lg text-fg/90 md:text-xl" style={{ '--i': 2 } as React.CSSProperties}>
              {hero.subheading}
            </p>
          )}
          <div className="hero-in mt-9 flex flex-wrap gap-3" style={{ '--i': 3 } as React.CSSProperties}>
            <Button link={hero.primary} />
            <Button link={hero.secondary} variant="ghost" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- The one marquee on the page ---------- */
export function Marquee({ text }: { text?: string | null }) {
  if (!text) return null
  const items = Array.from({ length: 8 })
  return (
    <div className="relative overflow-hidden bg-fire py-4 text-white" role="img" aria-label={text}>
      <div className="animate-marquee flex w-max" aria-hidden>
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0">
            {items.map((_, i) => (
              <span key={i} className="display flex items-center gap-10 pr-10 text-2xl md:text-[1.75rem]">
                {text}
                <span className="h-2 w-2 rotate-45 bg-white/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Welcome: text left, overlapping photos right ---------- */
export function Welcome({ welcome, stats }: { welcome: HomePage['welcome']; stats: HomePage['stats'] }) {
  const imgs = mediaList(welcome?.images)
  return (
    <section className="container-x py-24 md:py-32">
      <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6" data-reveal>
          {welcome?.heading && <h2 className="display text-4xl md:text-5xl lg:text-[3.4rem]">{welcome.heading}</h2>}
          <RichText data={welcome?.body} className="prose-cofwo mt-7 max-w-[58ch]" />
          {welcome?.link?.url && (
            <div className="mt-9">
              <Button link={welcome.link} variant="ghost" />
            </div>
          )}
        </div>
        <div className="relative pb-10 lg:col-span-6 lg:pl-6" data-reveal style={delay(2)}>
          {imgs[0] && (
            <div className="aspect-[4/5] w-[80%] overflow-hidden rounded-[var(--radius-xl)] bg-ink-3">
              <Media media={imgs[0]} sizes="(min-width: 1024px) 38vw, 80vw" className="h-full w-full object-cover" />
            </div>
          )}
          {imgs[1] && (
            <div className="absolute bottom-0 right-0 aspect-square w-[46%] overflow-hidden rounded-[var(--radius-xl)] border-[6px] border-ink bg-ink-3 shadow-xl">
              <Media media={imgs[1]} sizes="(min-width: 1024px) 22vw, 46vw" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </div>
      {!!stats?.length && (
        <dl className="mt-24 grid grid-cols-2 gap-8 border-t border-line pt-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.id ?? i} className="flex flex-col-reverse" data-reveal style={delay(i)}>
              <dt className="mt-2 text-sm text-muted">{s.label}</dt>
              <dd className="display text-5xl text-fire">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}

/* ---------- Join us: service times and where we meet ---------- */
export function JoinUs({ visit, settings }: { visit: HomePage['visit']; settings: SiteSetting }) {
  const times = settings.serviceTimes ?? []
  const hasInfo = times.length > 0 || Boolean(settings.address)
  const link = visit?.link?.url ? visit.link : { label: hasInfo ? 'Plan your visit' : 'Ask for service details', url: '/contact-us' }
  return (
    <section className="container-x pb-24 md:pb-32">
      <div className="card grid overflow-hidden md:grid-cols-12" data-reveal>
        <div className="relative min-h-64 bg-ink-3 md:col-span-5">
          <Media media={visit?.image} sizes="(min-width: 768px) 40vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="p-8 md:col-span-7 md:p-12 lg:p-14">
          <h2 className="display text-4xl md:text-5xl">{visit?.heading || 'Join us'}</h2>
          <p className="lead mt-4 max-w-[52ch]">
            {visit?.body ||
              'Come as you are. Whether it is your first time or you have walked with God for years, there is a place for you here.'}
          </p>

          {hasInfo ? (
            <div className="mt-9 grid gap-8 sm:grid-cols-2">
              {times.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted">
                    <Clock size={18} aria-hidden className="text-fire" /> Service times
                  </h3>
                  <ul className="mt-3 space-y-3">
                    {times.map((t) => (
                      <li key={t.id ?? t.label}>
                        <p className="font-semibold">{t.label}</p>
                        <p className="text-muted">{[t.day, t.time].filter(Boolean).join(' at ')}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {settings.address && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted">
                    <MapPin size={18} aria-hidden className="text-fire" /> Where we meet
                  </h3>
                  <p className="mt-3 whitespace-pre-line font-medium">{settings.address}</p>
                  {settings.mapUrl && (
                    <a
                      href={settings.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline mt-3 inline-flex items-center gap-1 text-sm font-semibold text-fire-soft"
                    >
                      Get directions <ArrowUpRight size={14} weight="bold" aria-hidden />
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap gap-3">
            <Button link={link} />
            {settings.livestreamUrl && (
              <Button link={{ label: 'Watch online', url: settings.livestreamUrl, newTab: true }} variant="ghost" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Mission, goal, vision: sticky heading + stacked statements ---------- */
export function Pillars({ settings }: { settings: SiteSetting }) {
  const pillars = settings.pillars ?? []
  if (!pillars.length) return null
  return (
    <section className="bg-ink-2">
      <div className="container-x grid gap-12 py-24 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <h2 className="display text-4xl md:text-5xl" data-reveal>
              {settings.pillarsHeading || 'Our Mission, Goal & Vision'}
            </h2>
          </div>
        </div>
        <div className="space-y-5 lg:col-span-8">
          {pillars.map((p, i) => (
            <article key={p.id ?? i} data-reveal className="card p-8 md:p-10">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-fire-soft">{p.title}</h3>
              {p.statement && (
                <p className="display mt-4 text-[1.65rem] leading-tight md:text-[2.1rem]">{p.statement}</p>
              )}
              {p.body && <p className="mt-5 max-w-[62ch] text-muted md:text-lg">{p.body}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- The Gathering: text tile with a three-photo grid ---------- */
export function Gathering({ gathering }: { gathering: HomePage['gathering'] }) {
  const imgs = mediaList(gathering?.images).slice(0, 3)
  if (!gathering?.heading) return null
  const tile = [
    'aspect-[16/10] md:col-span-2 md:aspect-auto',
    'aspect-[4/3] md:aspect-auto',
    'aspect-[4/3] md:aspect-auto',
  ]
  return (
    <section className="container-x py-24 md:py-32">
      <div className={`grid gap-4 md:grid-cols-4 md:gap-5 ${imgs.length ? 'md:grid-rows-[minmax(260px,1fr)_minmax(260px,1fr)]' : ''}`}>
        <div
          data-reveal
          className="theme-dark relative flex flex-col justify-end overflow-hidden rounded-[var(--radius-xl)] bg-[radial-gradient(110%_90%_at_0%_100%,rgb(200_16_28/0.6),transparent_62%),linear-gradient(160deg,#26262a,#111113)] p-8 md:col-span-2 md:row-span-2 md:p-12"
        >
          {gathering.eyebrow && <p className="eyebrow">{gathering.eyebrow}</p>}
          <h2 className="display mt-4 text-4xl md:text-5xl">{gathering.heading}</h2>
          <RichText data={gathering.body} className="prose-cofwo mt-6 !text-base md:!text-[1.05rem]" />
          {gathering.link?.url && (
            <div className="mt-8">
              <Button link={gathering.link} />
            </div>
          )}
        </div>
        {imgs.map((img, i) => (
          <div key={img.id} data-reveal style={delay(i + 1)} className={`overflow-hidden rounded-[var(--radius-xl)] bg-ink-3 ${tile[i]}`}>
            <Media
              media={img}
              sizes={i === 0 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 100vw'}
              className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] hover:scale-[1.04]"
            />
          </div>
        ))}
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
      <section className="container-x pb-24 md:pb-32">
        <div className="card flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12" data-reveal>
          <div className="flex items-center gap-5">
            <PlayCircle size={56} weight="fill" className="shrink-0 text-fire" aria-hidden />
            <div>
              <h2 className="display text-3xl md:text-4xl">{section?.heading || 'Watch online'}</h2>
              <p className="mt-2 text-muted">Join our services live or catch up on recent messages.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {settings.livestreamUrl && <Button link={{ label: 'Watch live', url: settings.livestreamUrl, newTab: true }} />}
            {settings.videoChannelUrl && (
              <Button link={{ label: 'Past messages', url: settings.videoChannelUrl, newTab: true }} variant="ghost" />
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-ink-2">
      <div className="container-x grid items-center gap-12 py-24 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-7" data-reveal>
          {video ? (
            <VideoEmbed video={video} title={sermon.title} poster={mediaUrl(sermon.thumbnail, 'large')} />
          ) : (
            <div className="aspect-video overflow-hidden rounded-[var(--radius-xl)] bg-ink-3">
              <Media media={sermon.thumbnail} sizes="(min-width: 1024px) 55vw, 100vw" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
        <div className="lg:col-span-5" data-reveal style={delay(2)}>
          <p className="eyebrow">{section?.heading || 'Latest message'}</p>
          <h2 className="display mt-4 text-3xl md:text-[2.6rem]">
            <Link href={`/sermons/${sermon.slug}`} className="hover:text-fire">
              {sermon.title}
            </Link>
          </h2>
          <p className="mt-4 text-muted">{[sermon.speaker, formatDate(sermon.date), sermon.scripture].filter(Boolean).join('  |  ')}</p>
          {sermon.summary && <p className="mt-5 max-w-[48ch] text-lg">{sermon.summary}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button link={{ label: 'All sermons', url: '/sermons' }} variant="ghost" />
            {settings.livestreamUrl && <Button link={{ label: 'Watch live', url: settings.livestreamUrl, newTab: true }} />}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Upcoming events: dated list rows ---------- */
export function UpcomingEvents({ section, events }: { section: HomePage['eventsSection']; events: Event[] }) {
  if (!section?.show || !events.length) return null
  return (
    <section className="container-x py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="display text-4xl md:text-5xl">{section.heading || 'Upcoming events'}</h2>
        <Link href="/events" className="link-underline inline-flex items-center gap-2 font-semibold">
          All events <ArrowRight size={16} weight="bold" aria-hidden />
        </Link>
      </div>
      <ul className="mt-12 grid gap-4">
        {events.map((e, i) => {
          const d = dateParts(e.startDate, e.startDate_tz)
          return (
            <li key={e.id} data-reveal style={delay(i)}>
              <Link
                href={`/events/${e.slug}`}
                className="card group grid items-center gap-6 p-5 transition-colors hover:border-line-strong sm:grid-cols-[auto_1fr_auto] md:p-6"
              >
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-fire text-white">
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    {d.month}
                  </span>
                  <span className="display text-3xl">{d.day}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold md:text-2xl">{e.title}</h3>
                  <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarBlank size={16} aria-hidden />
                      {formatDate(e.startDate, { dateStyle: 'full' }, e.startDate_tz)}
                    </span>
                    {e.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={16} aria-hidden />
                        {e.location}
                      </span>
                    )}
                  </p>
                </div>
                <ArrowRight size={22} className="hidden text-muted transition-transform group-hover:translate-x-1 group-hover:text-fg sm:block" aria-hidden />
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/* ---------- Testimonies: horizontal scroll-snap cards ---------- */
export function Testimonies({ section, items }: { section: HomePage['testimoniesSection']; items: Testimony[] }) {
  if (!section?.show || !items.length) return null
  return (
    <section className="overflow-hidden bg-ink-2 py-24 md:py-32">
      <div className="container-x">
        {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
        <h2 className="display mt-4 max-w-[18ch] text-4xl md:text-5xl">{section.heading || 'Testimonies'}</h2>
      </div>
      <div className="container-x mt-12">
        <ul className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:thin] md:-mx-8 md:px-8">
          {items.map((t, i) => (
            <li key={t.id} data-reveal style={delay(i)} className="card flex w-[85vw] max-w-[440px] shrink-0 snap-start flex-col p-8">
              <Quotes size={34} weight="fill" className="text-fire" aria-hidden />
              {t.type && <p className="mt-5 text-sm font-semibold text-fire-soft">{t.type}</p>}
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

/* ---------- Blog: one large feature plus a list ---------- */
export function LatestPosts({ section, posts }: { section: HomePage['blogSection']; posts: Post[] }) {
  if (!posts.length) return null
  const [first, ...rest] = posts
  return (
    <section className="container-x py-24 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="display max-w-[18ch] text-4xl md:text-5xl">{section?.heading || 'From the blog'}</h2>
        <Link href="/cofwo-blog" className="link-underline inline-flex items-center gap-2 font-semibold">
          Read the blog <ArrowRight size={16} weight="bold" aria-hidden />
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
    </section>
  )
}

/* ---------- Gallery: masonry columns ---------- */
export function GalleryStrip({ section }: { section: HomePage['gallerySection'] }) {
  const imgs = mediaList(section?.images)
  if (!imgs.length) return null
  return (
    <section className="pb-12 md:pb-20">
      <div className="container-x flex flex-wrap items-end justify-between gap-6">
        <h2 className="display text-4xl md:text-5xl">{section?.heading || 'Gallery'}</h2>
        <Link href="/gallery" className="link-underline inline-flex items-center gap-2 font-semibold">
          See all photos <ArrowRight size={16} weight="bold" aria-hidden />
        </Link>
      </div>
      <div className="container-x mt-12 columns-2 gap-4 md:columns-4 md:gap-5 [&>*]:mb-4 md:[&>*]:mb-5">
        {imgs.map((img, i) => (
          <Link
            key={img.id}
            href="/gallery"
            data-reveal
            style={delay(i % 4)}
            className="block break-inside-avoid overflow-hidden rounded-[var(--radius-xl)] bg-ink-3"
            aria-label={`Gallery: ${img.alt}`}
          >
            <Media
              media={img}
              sizes="(min-width: 768px) 25vw, 50vw"
              className="w-full transition-transform duration-700 ease-[var(--ease-out-expo)] hover:scale-[1.04]"
            />
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ---------- Closing invitation: full-bleed photo band ---------- */
export function Closing({ closing }: { closing: HomePage['closing'] }) {
  if (!closing?.heading) return null
  return (
    <section className="container-x pt-12">
      <div className="theme-dark relative isolate overflow-hidden rounded-[28px] bg-ink px-6 py-20 md:px-16 md:py-28">
        <Media media={closing.image} sizes="100vw" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(17_17_19/0.92)_10%,rgb(17_17_19/0.6)_60%,rgb(200_16_28/0.4)_100%)]" />
        <div className="max-w-2xl" data-reveal>
          <h2 className="display text-4xl md:text-6xl">{closing.heading}</h2>
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
