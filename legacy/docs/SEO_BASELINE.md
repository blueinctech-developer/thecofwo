# SEO baseline (old site, recorded 3 November 2026) and the new values

## Old site technical SEO

- **robots.txt**: allows everything except WooCommerce and wp-admin paths; `Sitemap: https://thecofwo.org/wp-sitemap.xml`
- **Sitemap**: WordPress core sitemap index listing about 150 URLs, most of them theme demo (see SITE_AUDIT.md)
- **Canonical style**: `https://thecofwo.org/…/` (https, no www, trailing slash)
- **Meta descriptions**: none on any page
- **Open Graph and Twitter tags**: none found
- **Structured data (JSON-LD)**: none
- **Analytics and Search Console verification tags**: none found in `<head>`
- **H1 problems**: the homepage had 4 H1s (two empty, plus "Our packages for the event" from the demo). Contact had none.

## Page by page

| URL | Old title | Old H1 | New title | New H1 | New meta description |
|---|---|---|---|---|---|
| / | THECOFWO – Seting Captives Free By The Spirit Of Prophecy | (several) | THECOFWO – Setting Captives Free by the Spirit of Prophecy | Set free by the Spirit of Prophecy | The Chariot of Fire World Outreach (COFWO) is a Spirit-led ministry carrying the fire of God's love, power and salvation to the ends of the earth. |
| /about-us/ | About Us – THECOFWO | About Us | About Us – THECOFWO | About Us | Chariot of Fire World Outreach (COFWO) is a Spirit-led Christian ministry spreading the message of Jesus Christ and raising believers who carry God’s fire. |
| /contact-us/ | Contact Us – THECOFWO | (none) | Contact Us – THECOFWO | Contact Us | Get in touch with The Chariot of Fire World Outreach (COFWO)… |
| /cofwo-blog/ | THECOFWO (no canonical) | Insights from God's Word | COFWO Blog – Insights from God's Word – THECOFWO | The COFWO Blog | Read the COFWO Blog: insights from God's Word on faith, purpose, vision and living a victorious Christian life. |
| /its-your-time-to-shine/ | It’s Your Time to Shine – THECOFWO | It’s Your Time to Shine | unchanged | unchanged | You were created with intention and called to shine… |
| /faith-vision-and-victory-…/ | Faith, Vision, and Victory \| Living a Victorious Christian Life – THECOFWO | same | unchanged | unchanged | Faith is the foundation of the Christian life, and vision directs it… |
| /understanding-gods-purpose-…/ | Understanding God’s Purpose for Your Life \| A Guide to Divine Direction – THECOFWO | same | unchanged | unchanged | Why am I here? Your life has meaning because God designed it with intention… |
| /category/faith-2/ | Faith – THECOFWO (no canonical) | Faith | Faith – THECOFWO | Faith | Posts about faith from the COFWO Blog… |
| /gallery/ | Gallery – THECOFWO | View Our Gallery (H2) | Gallery – THECOFWO | View Our Gallery | Photos of worship, prayer, outreach and fellowship… |
| /give/ | Give – THECOFWO | (none, empty page) | Give – THECOFWO | Give | Give to and partner with The Chariot of Fire World Outreach… |
| /privacy-policy/ | Privacy Policy – THECOFWO | (none) | Privacy Policy – THECOFWO | Privacy Policy | How The Chariot of Fire World Outreach (COFWO) collects, uses and protects personal information… |

## What the new site adds

- A unique title, meta description, canonical link, and Open Graph and Twitter tags on every page
- JSON-LD on every page: `Organization` (name, alternate names, logo, email, slogan). Plus `WebSite` (home), `BreadcrumbList` (inner pages), `BlogPosting` (posts, datePublished 2026-03-28), `Blog`, `AboutPage`, `ContactPage` and `CollectionPage`. Only verified facts are used. There is no address, phone or social profiles because none are verified.
- A clean `sitemap.xml` listing only the 11 real pages; `robots.txt` points to it
- 301 redirects for moved URLs, old sitemap addresses and old image addresses; 410 for theme demo URLs (see REDIRECT_MAP.csv)
- `/feed.xml` RSS feed
