# Site audit: thecofwo.org (as found on 3 November 2026)

The audit was done in a real Chrome browser. Command-line crawling of the live site was not used.
Nothing on the live site was changed.

## 1. Organisation

| Item | Finding | Source |
|---|---|---|
| Name | The Chariot of Fire World Outreach (COFWO); also written "THECOFWO" / "TheCofwo" | Logo, homepage "Who we are", About page |
| Purpose | A Spirit-led Christian ministry: "carrying the fire of God's love, power, and salvation to the ends of the earth" | Homepage, About |
| Motto | "Setting captives free by the Spirit of Prophecy" (spelled "Prophesy" in places on the old site) | Site title, footer, Mission |
| Audience | Believers and seekers. Photos show congregations in Africa and Europe, Spanish-language outreaches and Holy Land trips. | Gallery |
| Tone | Fervent, Pentecostal or charismatic, prophetic, revival-focused | All copy |
| Annual event | "The Gathering", which has its own site at https://thegatheringcof.org/ | Header menu, homepage |
| Email | info@thecofwo.org | Footer and Contact page |
| Brand colour | Red #CC0513 on near-black and white | Computed style of the Give button |
| Fonts (old) | Headings: halyard-display (Adobe); body: DM Sans | Computed styles |

## 2. Platform

- **WordPress 6.8.12** (from the generator meta tag) running an **AncoraThemes** event-conference theme ("Ticket" style) with Elementor.
- Plugins seen: **Gravity Forms** (contact and newsletter), **WooCommerce** (shop, cart, checkout, demo products), **The Events Calendar** (`tribe_events`), and the theme's custom post types (layouts, portfolio, services, team, testimonials).
- No analytics, Tag Manager, Facebook Pixel or Search Console verification tags were found in the page `<head>`.

## 3. Key finding: most of the site is leftover theme demo content

The theme's demo import was never cleaned up. Of roughly 150 URLs in the sitemap, **only about 11 are COFWO content**. The rest are AncoraThemes placeholders:

| Demo content | Count | Example |
|---|---|---|
| Shop products | 8 | /product/yellow-hoodie/ |
| Layout fragments | 34 | /layouts/mailchimp-popup/ |
| Portfolio items | 24 | /portfolio/watercolor-texture/ |
| Services | 14 | /services/cooking-classes/ |
| Team members (fake people) | 23 | /team/jennifer-hudson/ |
| Events | 1 (+3 linked) | /event/women-in-business-conference/ |
| Demo pages | 26 | /pricing/, /speakers/, /faqs/ (lorem ipsum, verified), /concert/ |
| Testimonial groups | 5 | /testimonials_group/clients/ |

Demo content also appears on COFWO's own pages:

- **Homepage**: a business-conference schedule ("Women in business conference", New York, Manhattan Club), an "Our Team" carousel of fake people linking to AncoraThemes' social accounts, and "Our packages for the event" pricing ($50 / $90 / $30, with lorem ipsum).
- **Contact page**: phone "+1 (234) 567 890" and address "120 Park Avenue, New York, NY 10044", both theme placeholders, plus a matching demo map.
- **Privacy Policy**: this is **AncoraThemes' own company privacy policy** (Cyprus company, Envato purchase codes). It does not describe COFWO.
- **Footer social icons** (Facebook, Twitter, Instagram) link to `#`, so they go nowhere.
- **Homepage and About video**: a Vimeo video (ID 290900024). Its owner could not be verified, and it is very likely the theme's demo video.

## 4. COFWO's own pages

| URL | Content |
|---|---|
| / | Hero slider (2 slides), Who we are, Mission/Goal/Vision, "JESUS IS LORD" ticker, The Gathering highlights, 3 testimonies, latest 3 blog posts, newsletter signup |
| /about-us/ | About text (3 paragraphs), "Connect With Us" button, Mission/Goal/Vision, video button, 12-photo gallery |
| /contact-us/ (and the duplicate /contact-us-2/) | Intro, Gravity Forms contact form (first and last name, email, subject, message), email address |
| /cofwo-blog/ | Blog listing (3 posts) |
| /its-your-time-to-shine/ | Post, 28 Mar 2026, category Faith, author "THE COFWO" |
| /faith-vision-and-victory-living-a-victorious-christian-life/ | Post, 28 Mar 2026 |
| /understanding-gods-purpose-for-your-life-a-guide-to-divine-direction/ | Post, 28 Mar 2026 |
| /category/faith-2/ | Category archive (the same 3 posts) |
| /author/the-cofwo/ | Author archive (the same 3 posts) |
| /gallery/ | "View Our Gallery": about 60 background-image photos |
| /give/ | **Empty page.** Every "Give" button links to `#`. |
| /privacy-policy/ | AncoraThemes' policy (see section 3) |

## 5. Navigation

- **Header**: The Gathering 2026 (external link), About Us, Contact Us, COFWO Blog, Gallery, a Give button (links to `#`), and a slide-out "panel" icon.
- **Footer**: motto, newsletter signup (Gravity Forms, email only), Socials (all `#`), Menu (About Us, Contact Us, The Gathering), "Say Hello: info@thecofwo.org", "TheCofwo © 2026. All rights reserved."

## 6. Forms

| Form | Plugin | Fields | Where |
|---|---|---|---|
| Contact | Gravity Forms #2 | Name (first, last), Email, Subject (stored as an email-type field, a configuration error), Message | /contact-us/, /contact-us-2/ |
| Newsletter | Gravity Forms #1 | Email | Footer of every page |

Where Gravity Forms sends submissions could not be verified without admin access.

## 7. Giving

No giving method exists on the current site. The Give page is empty and the buttons link nowhere. **Needs input from the ministry.**

## 8. Mobile

The live site uses the theme's responsive layout. Mobile layout was not audited in detail because the new design replaces it entirely.

## 9. Not verified

- Who receives Gravity Forms submissions, and whether the newsletter list is stored or exported anywhere
- Whether the three testimonies (Sandra Phillips, Oliver Brooks, Janet Morrison) are real people or theme sample names. The wording is church-specific, but the names and US cities follow the theme's pattern.
- Ownership of Vimeo video 290900024
- The real social media accounts
- Whether "The Gathering Day #1 – Aug 08 2026" (a label on the demo schedule tab) was a real date
- Whether `/what-we-offer/` has COFWO content. Its title sits among the demo pages and it was not opened because the browser connection was unstable. Treated as demo.
