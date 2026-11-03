# QA report (local testing, 3 November 2026)

All tests ran against the site served locally (`python -m http.server`, no compression, no HTTP/2). Results on a real host should be the same or better for speed. Nothing here was tested on a live host yet.

## Passed
| Test | Method | Result |
|---|---|---|
| All 13 HTML pages load with no console errors, no failed requests, no 4xx responses | Puppeteer (headless Chrome) | Pass |
| No horizontal scrolling at 390px wide (all 13 pages) | Puppeteer | Pass |
| Visual check: desktop 1440px and mobile 390px (Home, About, Contact, Gallery, blog post, 404) | Headless Edge screenshots, reviewed by eye | Pass after fixes (photo frames filled, header solid with menu open) |
| Exactly one H1 per page; unique titles; meta descriptions 88–156 characters; canonical on all indexable pages | Script over every HTML file | Pass (404 page has a short description; it is noindex) |
| Every internal link, image and srcset file exists | Script | Pass (0 broken) |
| Every image has alt text; no duplicate IDs; no inline styles | Script | Pass |
| All JSON-LD blocks parse as valid JSON | Script | Pass (not yet run through Google's Rich Results Test, which needs a public URL) |
| sitemap.xml lists only existing pages | Script | Pass |
| Contact form: empty submit shows 5 clear errors and focuses the first field; bad email shows a specific message | Puppeteer | Pass |
| Form with the placeholder key shows an honest "not connected yet" error (no fake success) | Puppeteer | Pass |
| Mobile menu: opens, `aria-expanded` updates, Esc closes and returns focus to the button | Puppeteer | Pass |
| Gallery viewer: opens, arrow keys move, Esc closes and returns focus to the photo | Puppeteer | Pass |
| Skip link is the first Tab stop | Puppeteer | Pass |
| Reduced motion: ticker and fade-ins switch off | Puppeteer | Pass |

## Lighthouse 12.6.0 (local)
| Page | Device | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| Home | Mobile | 91 | 100 | 100 | 100 | 3.3 s | 0 | 110 ms |
| Home | Desktop | 97 | 100 | 100 | 100 | 0.7 s | 0.086* | 0 ms |
| Blog post | Mobile | 90 | 100 | 100 | 100 | 3.0 s | 0 | 190 ms |
| Blog post | Desktop | 99 | 100 | 100 | 100 | 0.7 s | 0.002 | 0 ms |
| Gallery | Mobile | 90 | 100 | 100 | 100 | 3.2 s | 0 | 170 ms |
| Gallery | Desktop | 98 | 100 | 100 | 100 | 0.9 s | 0 | 0 ms |
| Contact | Mobile | 79 | 100 | 100 | 100 | 3.7 s | 0 | 0 ms |
| Contact | Desktop | 99 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms |

*Home and blog post mobile were re-measured after switching to self-hosted fonts (home mobile went 68 → 91, CLS 0.075 → 0). The desktop rows and the gallery and contact rows are from the first run, before that change, so they should now be the same or better. Re-run on the preview host.

## Not tested yet (needs a live host or your input)
- **Real form delivery**: needs the Web3Forms access key, then one test submission per form
- **Form posting with JavaScript off** (redirect to /thank-you/): needs the key
- **Redirects and 410s** in `.htaccess` / `_redirects`: they need Apache or Netlify to run. Test on the preview host with the list in REDIRECT_MAP.csv.
- **Security headers**: check on the preview host (for example securityheaders.com)
- **W3C HTML validator**: not run. The checks above cover structure; run https://validator.w3.org/ on the preview URL.
- **Real devices** (iPhone Safari, Android Chrome) and screen readers (NVDA, VoiceOver): only emulated so far

## Known issues
- In "It’s Your Time to Shine", two paragraphs repeat (kept from the original; see MIGRATION_REPORT.md)
- The Give page has no giving method yet (none existed before)
