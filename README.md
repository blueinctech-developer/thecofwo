# thecofwo.org: static website

The new website for **The Chariot of Fire World Outreach (COFWO)**. It is plain HTML, CSS and vanilla JavaScript, with no framework, no build step, no database and no PHP.

## Run it locally
```
python -m http.server 8000
```
Then open http://localhost:8000. Use a local server rather than double-clicking files, because links start with `/`.

## Structure
```
index.html, about-us/, contact-us/, cofwo-blog/, gallery/, give/, privacy-policy/,
category/faith-2/, <3 blog post folders>/, thank-you/, 404.html
assets/css/main.css     design tokens, layout and components (one file)
assets/js/main.js       mobile menu, header, fade-ins, forms
assets/js/gallery.js    gallery photo viewer (gallery page only)
assets/images/          optimised photos (WebP + JPEG)
assets/fonts/           Archivo and DM Sans (self-hosted)
sitemap.xml, robots.txt, feed.xml
.htaccess               Apache/Hostinger: redirects, security headers, caching
_redirects, _headers    the same for Netlify or Cloudflare Pages
docs/                   audit, plans, reports and guides
```

## Before launch
1. Add the Web3Forms access key (docs/EDITING_GUIDE.md → "Connect the forms")
2. Review the items in docs/MIGRATION_REPORT.md section 5
3. Follow docs/DEPLOYMENT.md (preview first, never switch the domain without approval)

## Docs
SITE_AUDIT · PAGE_INVENTORY.csv · FEATURE_INVENTORY · SEO_BASELINE · REBUILD_PLAN · MIGRATION_REPORT · REDIRECT_MAP.csv · QA_REPORT · DEPLOYMENT · EDITING_GUIDE · ROLLBACK_PLAN
