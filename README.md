# Flora Bougainvillea

A bougainvillea collection manager and website built with **Next.js 16 + Tailwind CSS v4**, using **Google Sheets as the database**. Built to deploy on **Vercel**.

- **Public site:** home page (hero, featured varieties, about, contact), a filterable and searchable collection, variety detail pages with WhatsApp/email enquiry links, and CMS pages such as a care guide.
- **Admin (`/admin`):** password login. Manage varieties (name, type, colour, description, image upload or URL, featured/published), types, website text and images, and Markdown-lite pages.
- **Data:** each table is a tab in one Google Spreadsheet, so you can also edit data directly in the sheet. Edits made in the sheet appear on the site within about 60 seconds. Edits made in the admin appear immediately.

## Quick start (local)

```bash
npm install
cp .env.example .env.local   # optional for local dev
npm run dev
```

Open http://localhost:3000/admin and sign in with `admin` / `admin`. These dev-only defaults apply only when `ADMIN_PASSWORD` is unset. On the dashboard, tick **Add sample data** and click **Run setup & refresh**.

Without Google credentials, data is stored in `.data/db.json` and uploads go to `public/uploads/`. Both are git-ignored.

## Google Sheets setup

1. Create a Google Cloud project and enable the **Google Sheets API**.
2. Create a **Service account**, open **Keys → Add key → JSON**, and download the key file.
3. Create an empty Google Spreadsheet. **Share** it with the service account's email as an **Editor**.
4. Set these environment variables:
   - `GOOGLE_SHEET_ID`: the ID in the sheet URL (`/spreadsheets/d/<ID>/edit`)
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: the `client_email` value from the JSON key
   - `GOOGLE_PRIVATE_KEY`: the `private_key` value from the JSON key, keeping its `\n` sequences
5. Sign in to `/admin` and click **Run setup & refresh**. This creates the tabs:

| Tab | Columns |
| --- | --- |
| `Types` | id, name, description, sort |
| `Varieties` | id, name, typeId, color, description, imageUrl, featured, published, createdAt, updatedAt |
| `Pages` | id, slug, title, body, published, sort, updatedAt |
| `Content` | key, value |

Columns are matched by header name, so you can reorder them or add extra columns in the sheet.

## Deploy to Vercel

1. Push this repo to GitHub, then **Import** it in Vercel.
2. Add these environment variables: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `AUTH_SECRET` (32+ random characters), and the three `GOOGLE_*` variables.
3. **Storage → Create → Blob**, then connect it to the project. This sets `BLOB_READ_WRITE_TOKEN` and enables image uploads. Without it, admins can still paste image URLs.
4. Deploy, then run setup once from `/admin`.

In production, login is refused when `ADMIN_PASSWORD` is unset, and the app errors when `AUTH_SECRET` is missing.

## How it works

| Path | Purpose |
| --- | --- |
| `src/lib/store/sheets.ts` | Google Sheets REST client (service-account JWT): list / insert / update / upsert / delete rows by key |
| `src/lib/store/local.ts` | JSON-file fallback with the same interface |
| `src/lib/data.ts` | Typed, cached reads (`unstable_cache`, tag `sheets-data`, 60 s) |
| `src/app/admin/actions.ts` | Server Actions for every mutation. Each one checks the admin session, then calls `updateTag` |
| `src/proxy.ts` | Redirects unauthenticated `/admin/*` requests to the login page |
| `src/lib/auth.ts`, `session.ts` | Credentials from env, HS256 JWT in an httpOnly cookie (7 days) |
| `src/lib/images.ts` | Upload to Vercel Blob, or to `public/uploads` in dev |

Varieties without an image show an illustrated placeholder tinted to their bract colour.
