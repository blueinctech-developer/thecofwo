import type { Media as MediaDoc } from '@/payload-types'

import { Media } from './Media'

type Props = {
  title: string
  eyebrow?: string | null
  intro?: string | null
  image?: MediaDoc | number | null
  compact?: boolean
  children?: React.ReactNode
}

/** The photo banner at the top of inner pages. */
export function PageBanner({ title, eyebrow, intro, image, compact, children }: Props) {
  const hasImage = image && typeof image === 'object'
  return (
    <section
      className={`relative isolate flex items-end overflow-hidden ${
        compact ? 'min-h-[52dvh] md:min-h-[56dvh]' : 'min-h-[64dvh] md:min-h-[70dvh]'
      }`}
    >
      {hasImage && (
        <Media media={image} priority sizes="100vw" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      )}
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 ${
          hasImage
            ? 'bg-[linear-gradient(180deg,rgb(15_13_14/0.55)_0%,rgb(15_13_14/0.35)_40%,rgb(15_13_14/0.92)_85%,#0f0d0e_100%)]'
            : 'bg-[radial-gradient(80%_70%_at_20%_0%,rgb(209_18_31/0.25),transparent_70%)]'
        }`}
      />
      <div className="container-x pb-12 pt-36 md:pb-16">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="display max-w-[18ch] text-[2.6rem] sm:text-6xl lg:text-7xl">{title}</h1>
        {intro && <p className="mt-6 max-w-[56ch] text-lg text-fg/80 md:text-xl">{intro}</p>}
        {children}
      </div>
    </section>
  )
}
