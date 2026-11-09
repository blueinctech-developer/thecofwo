import { Pillars } from '@/components/home/sections'
import { Button } from '@/components/Button'
import { Media } from '@/components/Media'
import { PageBanner } from '@/components/PageBanner'
import { RichText } from '@/components/RichText'
import { buildMetadata } from '@/lib/meta'
import { getGlobal, getSettings } from '@/lib/payload'
import { mediaList } from '@/lib/utils'

export const revalidate = 3600

export async function generateMetadata() {
  const p = await getGlobal('about-page')
  return buildMetadata({ title: p.banner.title, description: p.banner.intro, image: p.banner.image, path: '/about-us', meta: p.meta })
}

export default async function AboutPage() {
  const [p, settings] = await Promise.all([getGlobal('about-page'), getSettings()])
  const storyImgs = mediaList(p.story?.images)
  const strip = mediaList(p.gallery?.images)

  return (
    <>
      <PageBanner title={p.banner.title} eyebrow={p.banner.eyebrow} intro={p.banner.intro} image={p.banner.image} />

      {/* Story: text with a stacked pair of photos */}
      <section className="container-x py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7" data-reveal>
            {p.story?.eyebrow && <p className="eyebrow">{p.story.eyebrow}</p>}
            {p.story?.heading && <h2 className="display mt-4 text-4xl md:text-6xl">{p.story.heading}</h2>}
            <RichText data={p.story?.body} className="prose-cofwo mt-8 max-w-[62ch]" />
          </div>
          <div className="grid grid-cols-2 gap-4 self-start lg:col-span-5 lg:mt-16" data-reveal style={{ '--d': 2 } as React.CSSProperties}>
            {storyImgs.map((img, i) => (
              <div key={img.id} className={`overflow-hidden rounded-[var(--radius-xl)] ${i === 0 ? 'col-span-2 aspect-[4/3]' : 'col-span-2 aspect-[16/9]'}`}>
                <Media media={img} sizes="(min-width: 1024px) 38vw, 100vw" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Passion: full-width photo band with overlaid statement */}
      {p.passion?.heading && (
        <section className="container-x">
          <div className="relative isolate overflow-hidden rounded-[28px]">
            <Media media={p.passion.image} sizes="100vw" className="absolute inset-0 -z-20 h-full w-full object-cover" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(15_13_14/0.95)_0%,rgb(15_13_14/0.6)_55%,rgb(15_13_14/0.3)_100%)]" />
            <div className="max-w-3xl px-6 pb-14 pt-56 md:px-14 md:pb-20 md:pt-80" data-reveal>
              <h2 className="display text-4xl md:text-6xl">{p.passion.heading}</h2>
              <RichText data={p.passion.body} className="prose-cofwo mt-6 text-fg/90" />
              {p.passion.link?.url && (
                <div className="mt-8">
                  <Button link={p.passion.link} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="mt-24">
        <Pillars settings={settings} />
      </div>

      {!!p.beliefs?.length && (
        <section className="container-x py-24 md:py-32">
          <h2 className="display text-4xl md:text-5xl" data-reveal>
            What we believe
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2">
            {p.beliefs.map((b, i) => (
              <div key={b.id ?? i} className="border-t border-line-strong pt-6" data-reveal style={{ '--d': i % 2 } as React.CSSProperties}>
                <h3 className="text-xl font-semibold">{b.title}</h3>
                {b.body && <p className="mt-3 text-muted">{b.body}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {!!p.leaders?.length && (
        <section className="container-x py-24 md:py-32">
          <h2 className="display text-4xl md:text-5xl" data-reveal>
            Leadership
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {p.leaders.map((l, i) => (
              <article key={l.id ?? i} data-reveal style={{ '--d': i } as React.CSSProperties}>
                <div className="aspect-[4/5] overflow-hidden rounded-[var(--radius-xl)] bg-ink-3">
                  <Media media={l.photo} sizes="(min-width: 1024px) 30vw, 50vw" className="h-full w-full object-cover" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{l.name}</h3>
                {l.role && <p className="text-fire-soft">{l.role}</p>}
                {l.bio && <p className="mt-3 text-muted">{l.bio}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {!!strip.length && (
        <section className="py-24 md:py-28">
          <div className="container-x">
            <h2 className="display text-4xl md:text-5xl">{p.gallery?.heading || 'Moments of ministry'}</h2>
          </div>
          <div className="mt-12 flex snap-x gap-4 overflow-x-auto px-5 pb-4 md:px-8">
            {strip.map((img) => (
              <div key={img.id} className="h-72 shrink-0 snap-start overflow-hidden rounded-[var(--radius-xl)] md:h-96">
                <Media media={img} sizes="(min-width: 768px) 30vw, 70vw" className="h-full w-auto object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
