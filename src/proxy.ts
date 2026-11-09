import { NextResponse } from 'next/server'

/**
 * The old WordPress theme published ~125 demo pages (shop, tickets, fake team, etc.).
 * Search engines still know them, so answer "410 Gone" to have them dropped quickly.
 */
export function proxy() {
  return new NextResponse(
    '<!doctype html><meta charset="utf-8"><title>Page removed</title><meta name="robots" content="noindex"><body style="font-family:system-ui;background:#0f0d0e;color:#f5f0ea;display:grid;place-items:center;min-height:100vh;margin:0"><div style="text-align:center;padding:2rem"><h1>This page has been removed</h1><p><a style="color:#ff5a4c" href="/">Go to the homepage</a></p></div>',
    { status: 410, headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex' } },
  )
}

export const config = {
  matcher: [
    '/(typography|cart|checkout|my-account|wishlist-page|shop|online-conference|creative-conference|multi-event|online-tickets|gaming-comics|fashion-event|faqs|pricing|newsletter-popups|service-plus|food-festival|education-conference|music-conference|concert|art-event|what-we-offer|speakers|tickets-checkout|tickets-order|city-events|business-forum-2)',
    '/(product|layouts|portfolio|services|team|event|testimonials_group|tribe_events_cat|events-category)/:path*',
  ],
}
