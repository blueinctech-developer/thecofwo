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

/** The dark photo band at the top of every inner page (the header sits over it). */
export function PageBanner({ title, eyebrow, intro, image, compact, children }: Props) {
  const hasImage = Boolean(image && typeof image === 'object')
  return (
    <section
      className={`theme-dark relative isolate flex items-end overflow-hidden bg-ink ${
        hasImage ? (compact ? 'min-h-[50dvh] md:min-h-[56dvh]' : 'min-h-[60dvh] md:min-h-[66dvh]') : 'min-h-[40dvh] md:min-h-[44dvh]'
      }`}
    >
      {hasImage && <Media media={image} priority sizes="100vw" className="absolute inset-0 -z-20 h-full w-full object-cover" />}
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 ${
          hasImage
            ? 'bg-[linear-gradient(180deg,rgb(17_17_19/0.6)_0%,rgb(17_17_19/0.35)_40%,rgb(17_17_19/0.85)_100%)]'
            : 'bg-[radial-gradient(70%_120%_at_10%_110%,rgb(200_16_28/0.45),transparent_60%),linear-gradient(160deg,#1d1d21,#111113)]'
        }`}
      />
      <div className="container-x pb-12 pt-36 md:pb-16">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="display max-w-[20ch] text-[2.6rem] sm:text-6xl lg:text-[4.25rem]">{title}</h1>
        {intro && <p className="mt-5 max-w-[56ch] text-lg text-fg/90 md:text-xl">{intro}</p>}
        {children}
      </div>
    </section>
  )
}
