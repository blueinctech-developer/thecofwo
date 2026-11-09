# Deployment guide

The site is plain files. Upload the **whole project folder** except `docs/` (keeping `docs/` online does no harm, but it isn't needed). Do **not** change the domain until the preview has been approved.

## Before you start
1. Get a free **Web3Forms access key**: go to https://web3forms.com, enter `info@thecofwo.org`, and copy the key from the email. Replace `YOUR_WEB3FORMS_ACCESS_KEY` in every `.html` file (see EDITING_GUIDE.md, "Connect the forms").
2. **Back up the WordPress site** (see ROLLBACK_PLAN.md).
3. Export the newsletter subscribers from WordPress (Forms → Entries → Export).

## Step 1: preview (no risk to the live site)
**Easiest: Netlify Drop**
1. Go to https://app.netlify.com/drop and drag the project folder onto the page.
2. You get a preview address like `https://something.netlify.app`. Netlify reads `_redirects` and `_headers` automatically.
3. Check the pages, submit both forms once, and test a few rows from REDIRECT_MAP.csv.

**Or on Hostinger or cPanel**: create a subdomain such as `new.thecofwo.org`, upload the files into its folder with File Manager or FTP, and check that `.htaccess` was uploaded (it is a hidden file). For the preview, temporarily change the `https://thecofwo.org/` targets in `.htaccess` to the subdomain, or test with the domain rules commented out.

## Step 2: go live (only after approval)
**If staying on the current Apache host (likely Hostinger or cPanel):**
1. Take a full backup of `public_html` and the database.
2. Move the WordPress files out of `public_html` into a folder such as `/wp-backup-2026-11/` (don't delete them).
3. Upload the new site files into `public_html`, including `.htaccess`.
4. Visit https://thecofwo.org and run the checks below.

**If moving to Netlify or Cloudflare Pages:** add the custom domain `thecofwo.org` in the dashboard, then update the DNS records at the domain registrar as instructed. The old host keeps serving the old site until DNS switches over (usually 1–24 hours).

## Step 3: after launch
- Open the Home, About, Contact, Blog, a post, Gallery, Give and Privacy pages
- Submit both forms and confirm both emails arrive at info@thecofwo.org
- Test 5–10 rows of REDIRECT_MAP.csv (for example `/contact-us-2/`, `/blog-list/`, `/shop/` should return 410)
- Open `/sitemap.xml` and `/robots.txt`
- In **Google Search Console** (set it up if it doesn't exist): submit `https://thecofwo.org/sitemap.xml` and inspect the homepage
- Re-run Lighthouse on the live URL and update QA_REPORT.md
