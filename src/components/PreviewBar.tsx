'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

export function PreviewBar() {
  const router = useRouter()
  const serverURL = typeof window !== 'undefined' ? window.location.origin : ''
  return (
    <>
      {/* Reloads the page whenever the editor saves, so the admin's Live Preview stays current. */}
      {serverURL && <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />}
      <div className="theme-dark fixed bottom-4 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-4 whitespace-nowrap rounded-full border border-line-strong bg-ink-3/95 px-5 py-3 text-sm shadow-2xl backdrop-blur">
        <span>Previewing unpublished changes</span>
        {/* A full page load is needed so the server can clear the preview cookie. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/next/exit-preview" className="font-semibold text-fire-soft hover:underline">
          Exit preview
        </a>
      </div>
    </>
  )
}
