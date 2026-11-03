# Feature inventory: old WordPress features and how they work in the static site

| # | Feature on the old site | How it worked | In the new static site | Status |
|---|---|---|---|---|
| 1 | Main menu and mobile menu | Theme PHP and JS | Plain HTML `<nav>` in every page; `main.js` adds a mobile toggle (Esc closes it). Without JavaScript the menu wraps and still works. | Done |
| 2 | Header "panel" slide-out (grid icon) | Theme layout showing more demo content | Removed. It only held theme content. | Removed |
| 3 | Hero slider (2 slides) | Theme slider | A single static hero with the slide 1 headline and the slide 2 line. Faster, and no carousel accessibility problems. | Changed |
| 4 | "JESUS IS LORD" ticker | Theme animation | CSS-only ticker; stops for users who prefer reduced motion; screen readers hear it once. | Done |
| 5 | Contact form | Gravity Forms (WordPress database plus email) | Posts to **Web3Forms**, which emails info@thecofwo.org. Client-side validation, honeypot field, and a success message only after Web3Forms confirms. Without JavaScript the form still posts and lands on /thank-you/. | **Needs the Web3Forms access key** |
| 6 | Newsletter signup | Gravity Forms (stored in WordPress) | Same Web3Forms setup, subject "New newsletter signup". Each signup arrives as an email; there is no mailing-list software. | **Needs the key.** Optional later: Mailchimp or MailerLite. |
| 7 | Old newsletter subscribers | Stored in Gravity Forms entries | Not migrated (no admin access). | **Export them from WP Admin → Forms → Entries before retiring WordPress** |
| 8 | Blog, categories, author archive | WordPress posts | Hand-written HTML pages, a category page, and an RSS feed at /feed.xml. The author archive redirects to the blog. | Done |
| 9 | Blog comments | Not enabled (comment count was 0, no form shown) | Not included | n/a |
| 10 | Gallery with lightbox | Elementor gallery | CSS masonry grid plus `gallery.js` viewer (keyboard, swipe, Esc). Without JavaScript each photo opens full size. | Done |
| 11 | Video popup ("PLAY") | Vimeo 290900024 | Not included: the owner could not be verified and it is likely the theme demo video. If COFWO has its own video, it can be added as a click-to-load embed. | Needs input |
| 12 | Events ("The Gathering 2026" schedule) | The Events Calendar, filled with demo events | The demo schedule was removed. The Gathering has its own site, linked from the header, homepage, contact page and footer. | Done. Real events can be added (see EDITING_GUIDE.md). |
| 13 | Online giving | None: the Give page was empty and the buttons linked to `#` | Give page explains how to give by contacting the ministry | **Needs the giving method** (PayPal, Stripe, Tithe.ly or bank details) |
| 14 | Shop, cart, checkout, wishlist | WooCommerce demo | Removed (410 Gone) | Removed |
| 15 | Tickets and pricing | Theme demo | Removed (410 Gone) | Removed |
| 16 | Search | Theme search icon | Not needed for 13 pages | Removed |
| 17 | Social links | All linked to `#` | Not shown | Needs the real profile links |
| 18 | Map | Demo Google map of the placeholder address | Not shown (no real address published) | Needs the address if one should be public |
| 19 | Cookie and consent | None | The new site sets no cookies and uses no tracking, so no banner is needed | Done |
| 20 | Analytics | None found | None added. Privacy-friendly analytics such as Plausible or Cloudflare Web Analytics can be added on request. | Optional |
