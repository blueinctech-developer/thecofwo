'use client'

/* eslint-disable @next/next/no-img-element */
import { Play } from '@phosphor-icons/react'
import { useState } from 'react'

import type { VideoInfo } from '@/lib/video'

type Props = { video: VideoInfo; title: string; poster?: string }

/**
 * Shows a poster with a play button and only loads the video player when pressed.
 * This keeps pages fast and avoids loading YouTube/Facebook trackers for every visitor.
 */
export function VideoEmbed({ video, title, poster }: Props) {
  const [playing, setPlaying] = useState(false)
  const image = poster || video.thumbnail

  return (
    <div className="relative aspect-video overflow-hidden rounded-[var(--radius-xl)] bg-[#111113]">
      {playing ? (
        <iframe
          src={video.embedUrl}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 grid h-full w-full place-items-center"
          aria-label={`Play video: ${title}`}
        >
          {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
          <span className="relative grid h-20 w-20 place-items-center rounded-full bg-fire text-white shadow-2xl transition-transform duration-300 group-hover:scale-110">
            <Play size={30} weight="fill" className="translate-x-0.5" />
          </span>
        </button>
      )}
    </div>
  )
}
