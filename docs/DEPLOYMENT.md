# Deploying to Vercel

The whole site, including the admin, runs as one Vercel project. You need a Vercel account with access to the GitHub repository `blueinctech-developer/thecofwo`.

## 1. Create the project

1. In Vercel, choose **Add New → Project** and import `blueinctech-developer/thecofwo`.
2. Framework: **Next.js** (detected). Leave the build command empty: Vercel runs `npm run vercel-build`, which applies database migrations and then builds.
3. Don't deploy yet. Add the storage and settings below first.

## 2. Neon database and photo bucket

Both live in the **COFWO** project on Neon (region AWS US East 2), created directly in the Neon Console:

- **Database:** Neon Console → COFWO → **Connect** → Postgres. Copy the *pooled* connection string.
- **Photos:** the public bucket `cofwo` under **Object storage**. **Connect → Storage → .env** shows the endpoint. Create a credential (**Settings → Credentials**, scope `storage:write`) for the key ID and secret. The secret is shown once.

## 3. Environment variables

In **Settings → Environment Variables**, add (all environments unless noted):

| Name | Value |
|---|---|
| `DATABASE_URL` | The pooled Neon connection string. |
| `PAYLOAD_SECRET` | A long random string (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`). Use a different one from local. |
| `S3_ENDPOINT` | `https://br-lively-sound-bebangbn.storage.c-9.us-east-2.aws.neon.tech` |
| `S3_REGION` | `us-east-2` |
| `S3_BUCKET` | `cofwo` |
| `S3_ACCESS_KEY_ID` | The credential's key ID (starts `nak_live_`). |
| `S3_SECRET_ACCESS_KEY` | The credential's secret (starts `nsk_live_`). |
| `SITE_TIMEZONE` | The ministry's timezone, e.g. `Africa/Lagos` (the default) or `Europe/London`. Dates and event times are shown in this zone. |
| `NEXT_PUBLIC_SERVER_URL` | `https://thecofwo.org` for Production once the domain is connected. Until then leave it unset (the Vercel URL is used). |
| `RESEND_API_KEY` | Optional. Enables email alerts for new messages and signups. |
| `EMAIL_FROM_ADDRESS` | Optional. A sender on a domain verified in Resend, e.g. `no-reply@thecofwo.org`. |

Vercel reserves the `AWS_*` names, which is why the bucket settings use `S3_*`.

Photos are limited to about 4 MB per upload on Vercel (its request size limit). Resize larger photos before uploading.

Then **Deploy**. The first build creates all database tables.

## 4. Import the existing content

The live database starts empty. Import the old site's text and photos once, from your computer:

```bash
npm i -g vercel
vercel link                       # choose the thecofwo project
vercel env pull .env.production.local
npx dotenv-cli -e .env.production.local -- npm run seed
```

This uploads the old site's photos to the Neon bucket and fills the pages, blog posts and gallery. It only runs on an empty site.

## 5. Create the first admin account

Open `https://<your-vercel-url>/admin`. The first visit shows **Create first user**, and that account is always an admin. Add other staff under **Team members** (choose *Editor* for people who only manage content).

## 6. Work through "Before launch"

The admin dashboard shows a **Before launch** checklist: service times, where you meet, leadership, ways to give, social links, a sermon or livestream link, and confirmed testimonies. Each item links to the right screen and ticks itself off when filled in. When the essentials are done, the site is ready to show the congregation.

## 7. Connect the domain

When the site has been reviewed on the Vercel URL:

1. **Settings → Domains → Add** `thecofwo.org` and `www.thecofwo.org` (the app redirects `www` to the main domain).
2. Update DNS at the domain registrar as Vercel instructs.
3. Make sure `NEXT_PUBLIC_SERVER_URL` is `https://thecofwo.org` and redeploy.

Preview deployments tell search engines not to index them (see `src/app/robots.ts`).

## Changing the content model later

After changing anything in `src/collections` or `src/globals`:

```bash
npm run generate:types
npm run migrate:create -- describe-the-change
```

Commit the new file in `src/migrations/`. Vercel applies it on the next deploy.

## Optional extras

- **Email alerts:** add `RESEND_API_KEY`, then set the recipient in *Admin → Site settings → Forms & email*.
- **Analytics:** enable Vercel Web Analytics in the project dashboard (no cookie banner needed).
- **Backups:** Neon keeps point-in-time history for the database; bucket files are kept until deleted in the admin.
