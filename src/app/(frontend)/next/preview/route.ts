import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

/** Lets signed-in editors see drafts on the real site. Used by the admin's Preview button. */
export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path') || '/'
  const safePath = path.startsWith('/') && !path.startsWith('//') ? path : '/'

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return new Response('Please sign in to the admin to preview drafts.', { status: 403 })

  ;(await draftMode()).enable()
  redirect(safePath)
}
