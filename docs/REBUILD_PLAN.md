# Rebuild plan and decisions

## Scope
Rebuild the 11 real COFWO pages as a static HTML, CSS and vanilla JavaScript site. Drop the theme demo content and point its URLs at the right place (redirects and 410s).

## Decisions made (all can be changed)

| Decision | Choice | Why |
|---|---|---|
| Hosting | Host-agnostic: `.htaccess` for Apache (Hostinger or cPanel, the likely current host) **and** `_redirects` / `_headers` for Netlify or Cloudflare Pages | The host wasn't specified |
| Forms | **Web3Forms** (free tier, public access key, emails info@thecofwo.org) | No account or server needed; works with JavaScript off; the key is meant to be public |
| Canonical URL | `https://thecofwo.org/path/` (no www, trailing slash) | Matches the old site |
| URLs | Kept exactly, using `folder/index.html` | Preserves search rankings |
| Hero | Single static hero instead of the slider | Speed, accessibility and clarity |
| Fonts | Archivo (condensed, bold headings, close to the old Halyard look) and DM Sans (body, as before). Self-hosted, Latin subset only. | Brand continuity; no third-party requests; scored better in testing |
| Colours | Brand red #CC0513, ink #121011, warm cream #FAF6F0, gold accent | Keeps the brand while making it warmer and more premium |
| Images | Only real COFWO photos. Two AI-generated ("Gemini") images and theme images excluded. | Honesty and credibility |
| Demo content | Removed. Placeholder phone and address are not published. | It isn't COFWO's information |
| Testimonies | Kept, as published on the old site, and **flagged for confirmation** | Wording is church-specific; the names are unverified |
| Privacy policy | Rewritten as a short, accurate draft | The old one was AncoraThemes' own policy |
| Giving | Honest "contact us to give" notice | No giving method existed |

## Phases
- A. Audit and plan: done
- B. Design system and templates: done (`assets/css/main.css`)
- C. Build all pages: done (13 HTML files)
- D. Migrate content and media: done (see MIGRATION_REPORT.md)
- E. Forms, SEO and redirects: done; forms need the access key
- F. Testing: done locally (see QA_REPORT.md)
- G. Preview, your approval, launch: **waiting on you** (see DEPLOYMENT.md)
