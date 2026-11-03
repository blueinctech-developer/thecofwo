# Editing guide (no CMS needed)

Every page is a normal file you can open in a text editor (VS Code or Notepad++ are good free choices).
**Tip:** VS Code's "Find in Files" (Ctrl+Shift+F) and "Replace in Files" (Ctrl+Shift+H) change something on every page at once.

## Where things live
| Page | File |
|---|---|
| Home | `index.html` |
| About Us | `about-us/index.html` |
| Contact Us | `contact-us/index.html` |
| Blog list | `cofwo-blog/index.html` |
| Blog posts | `<post-name>/index.html` |
| Gallery | `gallery/index.html` |
| Give | `give/index.html` |
| Privacy Policy | `privacy-policy/index.html` |
| Styles (colours, fonts, spacing) | `assets/css/main.css` (brand colours are at the top) |
| Photos | `assets/images/` and `assets/images/gallery/` |

## Preview your changes on your computer
In the project folder, run `python -m http.server 8000`, then open http://localhost:8000. Opening the files directly by double-clicking won't load styles, because links start with `/`.

## Change text
Open the page file, find the sentence (Ctrl+F), edit the words between the tags, and save. Don't remove the `<…>` tags around it.

## Replace or add an image
1. Resize the photo to about 1600px wide and save it as `.jpg` in `assets/images/` (or `assets/images/gallery/`). Free tools: https://squoosh.app (it can also make a `.webp` copy).
2. In the page, find the `<picture>` you want to change. The simplest replacement is:
   ```html
   <img src="/assets/images/my-photo.jpg" alt="Describe what is in the photo" width="1600" height="1067" loading="lazy">
   ```
   Put the photo's real width and height in `width` and `height`; this stops the page jumping while it loads.
3. **Always write alt text** describing the photo for people who can't see it.

## Add a gallery photo
In `gallery/index.html`, copy one `<figure>…</figure>` line inside `gallery-grid`, change both file names (in `href` and `src`) and the `alt` text.

## Add a blog post
1. Copy the folder `its-your-time-to-shine/` and rename the copy (for example `walking-in-faith/`). The folder name becomes the web address.
2. In the new `index.html` change: `<title>`, `meta name="description"`, the `canonical` and `og:url` addresses, `og:title`, `og:description`, `og:image`, the JSON-LD (headline, description, dates, URLs), the breadcrumb, the `<h1>`, the date, the photo, and the article text inside `<div class="prose">`.
3. Update the "Previous / Next" links at the bottom of the newest posts.
4. Add a card for it at the top of the post grid in `cofwo-blog/index.html`, `category/faith-2/index.html`, and the "Insights from God's Word" section of `index.html` (keep 3 there and remove the oldest).
5. Add it to `sitemap.xml` and `feed.xml` (see below).

## Add a new page
Copy a similar page's folder (for example `give/`), rename it, update the same head items as for a blog post, then replace the content inside `<main>`.

## Update the menu or footer on every page
The header and footer are written into every page (so they work without JavaScript and search engines can read them). Use **Replace in Files** to change a link everywhere, for example to add a menu item, find:
```html
<li><a href="/gallery/">Gallery</a></li>
```
and replace it with:
```html
<li><a href="/gallery/">Gallery</a></li>
        <li><a href="/events/">Events</a></li>
```
The current page is marked with `aria-current="page"`; on a new page, add that to its own menu link.

## Add an event
There is no events page yet (the old one held only theme demo events). To list upcoming events, create an `events/` page as above, with one block per event:
```html
<article class="callout">
  <h2>The Gathering 2026</h2>
  <p class="meta"><time datetime="2026-08-08">8 August 2026</time> · Venue name, City</p>
  <p>Short description.</p>
  <a class="link-arrow" href="https://thegatheringcof.org/">Details and registration</a>
</article>
```
When an event has passed, move it under a "Past events" heading or delete it.

## Connect the forms (Web3Forms)
1. Get a free access key at https://web3forms.com using `info@thecofwo.org`.
2. Replace in Files: `YOUR_WEB3FORMS_ACCESS_KEY` → your key. It appears on every page (newsletter) and on the contact page. The key is designed to be public, so it's safe in the HTML.
3. Submit each form once to test.

## Set up giving
Edit `give/index.html`. Replace the box marked `EDIT ME` with your giving button, for example:
```html
<a class="btn" href="https://YOUR-GIVING-LINK">Give online</a>
```

## Update the sitemap
In `sitemap.xml`, copy one `<url>` line, change the address, and set `<lastmod>` to today's date (YYYY-MM-DD). For blog posts, also add an `<item>` to `feed.xml`.
