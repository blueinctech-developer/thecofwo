# Rollback plan

## Before launch: take these backups
1. **Files**: in the hosting panel, download a full backup of `public_html` (or use the host's "Backups" tool).
2. **Database**: export the WordPress database (phpMyAdmin → Export, or the host's backup tool).
3. **Gravity Forms entries**: export the contact and newsletter entries as CSV.
4. Keep all three somewhere safe, off the server as well.

## If something goes wrong after launch
**Same Apache host (WordPress moved to `/wp-backup-2026-11/`):**
1. Move the new static files out of `public_html` into a folder such as `/static-site/`.
2. Move the WordPress files back from `/wp-backup-2026-11/` into `public_html` (including WordPress's original `.htaccess`).
3. The old site is back immediately. The database was never touched.

**Moved to Netlify or Cloudflare:** change the DNS records back to the old host's values (note them down before switching). The old site comes back once DNS updates.

## Retiring the old site
Keep the WordPress backup and the old hosting until you confirm in writing that it can go. We suggest at least 30 days after launch, after checking Search Console for crawl errors.
