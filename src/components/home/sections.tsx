import { ArrowRight, CalendarBlank, MapPin, Quotes } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import type { Event, HomePage, Media as MediaDoc, Post, SiteSetting, Testimony } from '@/payload-types'
import { formatDate, mediaList, splitHighlight } from '@/lib/utils'

import { Button } from '../Button'
import { Media } from '../Media'
import { PostCard } from '../PostCard'
import { RichText } from '../RichText'

/* ---------- Hero: full-bleed photo, content anchored bottom-left ---------- */
export function Hero({ hero: maybeHero }: { hero?: HomePage['hero'] | null }) {
  // Before any content is entered (e.g. the very first deploy) fall back to the ministry name.
  const hero = maybeHero ?? ({} as HomePage['hero'])
  const { before, match, after } = splitHighlight(hero.heading || 'The Chariot of Fire World Outreach', hero.highlight)
  return (
    <section className="relative isolate flex min-h-[100dvh] items-end overflow-hidden">
      {hero.videoUrl ? (
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          src={hero.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          poster={typeof hero.image === 'object' ? hero.image?.url ?? undefined : undefined}
        />
      ) : (
        <Media
          media={hero.image}
          priority
          sizes="100vw"
          className="hero-zoom absolute inset-0 -z-20 h-full w-full object-cover"
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(15_13_14/0.85)_0%,rgb(15_13_14/0.45)_55%,rgb(15_13_14/0.15)_100%),linear-gradient(180deg,transparent_55%,#0f0d0e_100%)]"
      />
      <div className="container-x pb-16 pt-32 md:pb-24">
        <div className="max-w-4xl">
          {hero.eyebrow && (
            <p className="eyebrow hero-in" style={{ '--i': 0 } as React.CSSProperties}>
              {hero.eyebrow}
            </p>
          )}
          <h1
            className="display hero-in mt-5 text-[2.75rem] sm:text-6xl lg:text-[5.5rem]"
            style={{ '--i': 1 } as React.CSSProperties}
          >
            {before}
            {match && <span className="text-fire-soft">{match}</span>}
            {after}
          </h1>
          {hero.subheading && (
            <p
              className="hero-in mt-6 max-w-[46ch] text-lg text-fg/85 md:text-xl"
              style={{ '--i': 2 } as React.CSSProperties}
            >
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
    <div className="relative overflow-hidden border-y border-line bg-fire py-5 text-white" aria-label={text}>
      <div className="animate-marquee flex w-max" aria-hidden>
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0">
            {items.map((_, i) => (
              <span key={i} className="display flex items-center gap-10 pr-10 text-2xl md:text-3xl">
                {text}
                <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden className="opacity-70">
                  <path d="M11 0v22M0 11h22" stroke="currentColor" strokeWidth="3" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Welcome: asymmetric split, text left, overlapping photos right ---------- */
export function Welcome({ welcome, stats }: { welcome: HomePage['welcome']; stats: HomePage['stats'] }) {
  const imgs = mediaList(welcome?.images)
  return (
    <section className="container-x py-24 md:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6" data-reveal>
          {welcome?.heading && <h2 className="display text-4xl md:text-5xl lg:text-6xl">{welcome.heading}</h2>}
          <RichText data={welcome?.body} className="prose-cofwo mt-8 max-w-[58ch] text-lg" />
          {welcome?.link?.url && (
            <div className="mt-10">
              <Button link={welcome.link} variant="ghost" />
            </div>
          )}
        </div>
        <div className="relative lg:col-span-6 lg:pl-8" data-reveal style={{ '--d': 2 } as React.CSSProperties}>
          {imgs[0] && (
            <div className="aspect-[4/5] w-[78%] overflow-hidden rounded-[var(--radius-xl)]">
              <Media media={imgs[0]} sizes="(min-width: 1024px) 38vw, 78vw" className="h-full w-full object-cover" />
            </div>
          )}
          {imgs[1] && (
            <div className="absolute -bottom-10 right-0 aspect-square w-[46%] overflow-hidden rounded-[var(--radius-xl)] border-[6px] border-ink">
              <Media media={imgs[1]} sizes="(min-width: 1024px) 22vw, 46vw" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </div>
      {!!stats?.length && (
        <dl className="mt-24 grid grid-cols-2 gap-8 border-t border-line pt-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.id ?? i} data-reveal style={{ '--d': i } as React.CSSProperties}>
              <dt className="order-2 mt-2 text-sm text-muted">{s.label}</dt>
              <dd className="display text-5xl text-fg">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}

/* ---------- Mission, goal, vision: sticky heading + stacked statements ---------- */
export function Pillars({ settings }: { settings: SiteSetting }) {
  const pillars = settings.pillars ?? []
  if (!pillars.length) return null
  return (
    <section className="border-t border-line bg-ink-2">
      <div className="container-x grid gap-12 py-24 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <h2 className="display text-4xl md:text-5xl" data-reveal>
              {settings.pillarsHeading || 'Our Mission, Goal & Vision'}
            </h2>
          </div>
        </div>
        <div className="space-y-6 lg:col-span-8">
          {pillars.map((p, i) => (
            <article
              key={p.id ?? i}
              data-reveal
              className="group rounded-[var(--radius-xl)] border border-line bg-ink p-8 transition-colors duration-500 hover:border-fire/50 md:p-10"
            >
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-fire-soft">{p.title}</h3>
              {p.statement && (
                <p className="mt-4 text-2xl font-semibold leading-snug tracking-tight md:text-[2rem]">{p.statement}</p>
              )}
              {p.body && <p className="mt-5 max-w-[62ch] text-muted md:text-lg">{p.body}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- The Gathering: bento of photos with a text tile ---------- */
export function Gathering({ gathering }: { gathering: HomePage['gathering'] }) {
  const imgs = mediaList(gathering?.images)
  if (!gathering?.heading) return null
  return (
    <section className="container-x py-24 md:py-32">
      <div className="grid auto-rows-[minmax(220px,auto)] gap-4 md:grid-cols-4 md:gap-5">
        <div
          data-reveal
          className="relative flex flex-col justify-end overflow-hidden rounded-[var(--radius-xl)] bg-[radial-gradient(120%_90%_at_0%_100%,rgb(209_18_31/0.55),transparent_60%),linear-gradient(160deg,#211d1e,#171415)] p-8 md:col-span-2 md:row-span-2 md:p-12"
        >
          {gathering.eyebrow && <p className="eyebrow">{gathering.eyebrow}</p>}
          <h2 className="display mt-4 text-4xl md:text-5xl">{gathering.heading}</h2>
          <RichText data={gathering.body} className="prose-cofwo mt-6 text-base md:text-lg" />
          {gathering.link?.url && (
            <div className="mt-8">
              <Button link={gathering.link} />
            </div>
          )}
        </div>
        {imgs.slice(0, 4).map((img, i) => (
          <div
            key={img.id}
            data-reveal
            style={{ '--d': i + 1 } as React.CSSProperties}
            className={`overflow-hidden rounded-[var(--radius-xl)] bg-ink-3 ${
              i === 0
                ? 'aspect-[16/9] md:col-span-2 md:aspect-auto'
                : i === 3
                  ? 'aspect-[16/9] md:col-span-4 md:aspect-[21/8]'
                  : 'aspect-[4/3] md:aspect-auto'
            }`}
          >
            <Media
              media={img}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] hover:scale-[1.04]"
            />
          </div>
        ))}
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
        <Link href="/events" className="link-underline inline-flex items-center gap-2 font-medium">
          All events <ArrowRight size={16} weight="bold" aria-hidden />
        </Link>
      </div>
      <ul className="mt-12 grid gap-4">
        {events.map((e, i) => {
          const d = new Date(e.startDate)
          return (
            <li key={e.id} data-reveal style={{ '--d': i } as React.CSSProperties}>
              <Link
                href={`/events/${e.slug}`}
                className="group grid items-center gap-6 rounded-[var(--radius-xl)] border border-line bg-ink-2 p-5 transition-colors hover:border-line-strong sm:grid-cols-[auto_1fr_auto] md:p-6"
              >
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-fire text-white">
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    {d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' })}
                  </span>
                  <span className="display text-3xl">{d.getUTCDate()}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold md:text-2xl">{e.title}</h3>
                  <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarBlank size={16} aria-hidden />
                      {formatDate(e.startDate, { dateStyle: 'full' })}
                    </span>
                    {e.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={16} aria-hidden />
                        {e.location}
                      </span>
                    )}
                  </p>
                </div>
                <ArrowRight
                  size={22}
                  className="hidden text-muted transition-transform group-hover:translate-x-1 group-hover:text-fg sm:block"
                  aria-hidden
                />
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
    <section className="overflow-hidden border-y border-line bg-ink-2 py-24 md:py-32">
      <div className="container-x">
        {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
        <h2 className="display mt-4 max-w-[16ch] text-4xl md:text-5xl">{section.heading || 'Testimonies'}</h2>
      </div>
      <div className="container-x mt-14">
        <ul className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:thin] md:-mx-8 md:px-8">
          {items.map((t, i) => (
            <li
              key={t.id}
              data-reveal
              style={{ '--d': i } as React.CSSProperties}
              className="flex w-[85vw] max-w-[440px] shrink-0 snap-start flex-col rounded-[var(--radius-xl)] border border-line bg-ink p-8"
            >
              <Quotes size={36} weight="fill" className="text-fire" aria-hidden />
              {t.type && <p className="mt-6 text-sm font-semibold text-fire-soft">{t.type}</p>}
              <blockquote className="mt-3 flex-1 text-lg leading-relaxed text-fg/90">“{t.quote}”</blockquote>
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

/* ---------- Blog: one large feature plus a column of two ---------- */
export function LatestPosts({ section, posts }: { section: HomePage['blogSection']; posts: Post[] }) {
  if (!posts.length) return null
  const [first, ...rest] = posts
  return (
    <section className="container-x py-24 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="display max-w-[18ch] text-4xl md:text-5xl">{section?.heading || 'From the blog'}</h2>
        <Link href="/cofwo-blog" className="link-underline inline-flex items-center gap-2 font-medium">
          Read the blog <ArrowRight size={16} weight="bold" aria-hidden />
        </Link>
      </div>
      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7" data-reveal>
          <PostCard post={first} size="large" />
        </div>
        <div className="grid content-start gap-10 lg:col-span-5">
          {rest.slice(0, 3).map((p, i) => (
            <div key={p.id} data-reveal style={{ '--d': i + 1 } as React.CSSProperties}>
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
    <section className="py-12 md:py-20">
      <div className="container-x flex flex-wrap items-end justify-between gap-6">
        <h2 className="display text-4xl md:text-5xl">{section?.heading || 'Gallery'}</h2>
        <Link href="/gallery" className="link-underline inline-flex items-center gap-2 font-medium">
          See all photos <ArrowRight size={16} weight="bold" aria-hidden />
        </Link>
      </div>
      <div className="container-x mt-12 columns-2 gap-4 md:columns-4 md:gap-5 [&>*]:mb-4 md:[&>*]:mb-5">
        {imgs.map((img, i) => (
          <Link
            key={img.id}
            href="/gallery"
            data-reveal
            style={{ '--d': i % 4 } as React.CSSProperties}
            className="block break-inside-avoid overflow-hidden rounded-[var(--radius-xl)] bg-ink-3"
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
      <div className="relative isolate overflow-hidden rounded-[28px] px-6 py-20 md:px-16 md:py-28">
        <Media
          media={closing.image as MediaDoc | null}
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(15_13_14/0.92)_10%,rgb(15_13_14/0.55)_60%,rgb(209_18_31/0.35)_100%)]" />
        <div className="max-w-2xl" data-reveal>
          <h2 className="display text-4xl md:text-6xl">{closing.heading}</h2>
          {closing.body && <p className="mt-6 max-w-[48ch] text-lg text-fg/85">{closing.body}</p>}
          <div className="mt-10 flex flex-wrap gap-3">
            <Button link={closing.primary} />
            <Button link={closing.secondary} variant="ghost" />
          </div>
        </div>
      </div>
    </section>
  )
}
