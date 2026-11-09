# Migration report

**Summary:** All 11 COFWO pages and all of COFWO's own photos were migrated. Theme demo content was deliberately left out. A few items need your input (section 5). This is **not** a 100% copy of the old site, because most of the old site was placeholder content.

## 1. Pages migrated
Home, About Us, Contact Us, COFWO Blog, 3 blog posts, Faith category, Gallery, Give, Privacy Policy. New: Thank-you, 404, RSS feed.
Text was copied faithfully. Only the fixes in section 4 were made.

## 2. Media migrated (all now hosted locally)
- 79 files downloaded from `/wp-content/uploads/` and saved in `/assets/images/` (gallery photos in `/assets/images/gallery/`)
- Each photo is compressed, with WebP copies at 2 sizes, a JPEG fallback, and width and height set. Images below the fold load lazily.
- Total image weight: about 15 MB across 64 photos (the old originals plus WordPress copies were much larger)
- Favicons were rebuilt from `cropped-cofwo-logo-white-*.png`
- Every image has written alt text. The old site had none on its gallery and background photos. Alt text describes what is visible; **people are not named**, because their names weren't on the site.

## 3. Skipped, and why
| Item | Reason |
|---|---|
| ~125 theme demo URLs (shop, team, portfolio, services, layouts, demo events, demo pages) | Not COFWO content (AncoraThemes sample data) |
| Homepage demo schedule, fake "Our Team", ticket pricing | Theme sample data |
| Contact phone "+1 (234) 567 890", address "120 Park Avenue, New York", map | Theme placeholders |
| AncoraThemes privacy policy | Belongs to another company; replaced with a draft |
| `Gemini_Generated_Image_7rlw…png`, `…h42b…png`, `crowded.png`, `slide1cofwo.jpg` | AI-generated images; not presented as real ministry photos |
| `2023/09/popup.webp`, `2024/*` team and decoration images | Theme images |
| Decorative theme graphics (`uppart22.webp`, `h1-gradient-texture-*.webp`, `anim-text-iconred.webp`) | Replaced by the new design (files downloaded but not used) |
| Vimeo video 290900024 | Owner unverified, likely the theme demo |
| `2026/04/slide-1.jpg`, `slide-11.jpg` | Missing on the old server (404) |
| Newsletter subscribers in Gravity Forms | No admin access; **please export them** |

## 4. Text fixes (logged)
| Where | Old | New |
|---|---|---|
| Site title | "Seting" | "Setting" |
| Motto (footer, mission) | "Spirit of Prophesy" (verb) | "Spirit of Prophecy" (noun, as in the site title) |
| Mission/Goal/Vision heading | "Our Vission" | "Our Vision" |
| Goal statement | "nations touch by the fire" | "nations touched by the fire" |
| Testimony heading | "Direction and Prophetic Testimony" | "Direction & prophetic testimony" (styling only) |

Left as written but **worth reviewing**: in "It’s Your Time to Shine", the section "You Are the Light of the World" repeats the two opening paragraphs word for word. This looks like a copy-paste slip on the old site.

## 5. Items needing your review or input
1. **Web3Forms access key**: forms won't send until it's added (see EDITING_GUIDE.md)
2. **Giving method**: link or bank details for the Give page
3. **Testimonies**: confirm Sandra Phillips, Oliver Brooks and Janet Morrison are real, or send real testimonies. Otherwise remove the section.
4. **Privacy policy**: review the draft
5. **Social media links**: Facebook, Instagram, YouTube, etc.
6. **Phone or address**: only if they should be public
7. **The Gathering 2026**: dates or details to show on this site, if you'd like more than a link
8. **`cofwopst.jpg`** (About page portrait) looks heavily edited, possibly AI-enhanced. Confirm it's suitable.
9. **Newsletter subscriber export** from WordPress
10. `/what-we-offer/` was not opened (assumed demo). Confirm before launch.
