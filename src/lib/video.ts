export type VideoInfo = {
  provider: 'youtube' | 'vimeo' | 'facebook'
  embedUrl: string
  thumbnail?: string
}

/** Works out how to embed a YouTube, Vimeo or Facebook link pasted into the admin. */
export function parseVideo(url?: string | null): VideoInfo | null {
  if (!url) return null
  let u: URL
  try {
    u = new URL(url.trim())
  } catch {
    return null
  }
  const host = u.hostname.replace(/^www\.|^m\./, '')

  if (host === 'youtu.be' || host.endsWith('youtube.com') || host === 'youtube-nocookie.com') {
    let id = ''
    if (host === 'youtu.be') id = u.pathname.slice(1)
    else if (u.searchParams.get('v')) id = u.searchParams.get('v')!
    else {
      const m = u.pathname.match(/\/(embed|live|shorts|v)\/([\w-]{6,})/)
      if (m) id = m[2]
    }
    id = id.split(/[/?&]/)[0]
    if (!/^[\w-]{6,}$/.test(id)) return null
    return {
      provider: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    }
  }

  if (host.endsWith('vimeo.com')) {
    const id = u.pathname.match(/(\d{6,})/)?.[1]
    if (!id) return null
    return { provider: 'vimeo', embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1` }
  }

  if (host.endsWith('facebook.com') || host === 'fb.watch') {
    return {
      provider: 'facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url.trim())}&show_text=false&autoplay=true`,
    }
  }

  return null
}
