# Deploying Med Shop to Vercel

The app was built for a persistent server; these are the changes + steps that make
it run on Vercel's serverless platform. Three external pieces are involved:

| Piece | Why | Provider |
|---|---|---|
| **PostgreSQL** | Vercel has no persistent disk — SQLite can't live there | Neon (free tier) |
| **Object storage** | Product/category media can't be written to the local filesystem | Cloudflare R2 (10 GB free) |
| **Direct browser uploads** | Vercel functions cap request bodies at ~4.5 MB | handled in code (`/api/upload` → presigned R2 PUT) |

> **Note on cost:** Vercel's free **Hobby** plan is *non-commercial* per their ToS.
> Fine for the owner's evaluation; a permanently-live shop should be on **Pro ($20/mo)**.

---

## 1. Database — Neon

1. Sign up at **neon.tech**, create a project. Pick region **EU (Frankfurt / eu-central-1)**.
2. In the project you get two connection strings (Dashboard → *Connection Details*):
   - **Pooled** (host contains `-pooler`) → this is `DATABASE_URL`
   - **Direct** (no `-pooler`) → this is `DIRECT_URL`
   Both should end with `?sslmode=require`.
3. Optional but recommended: create a second **branch** called `development` and use *its*
   connection strings in your local `.env`, keeping `main` for production.

The schema is already switched to `provider = "postgresql"`. Tables are created
automatically on the first deploy (`vercel-build` runs `prisma db push`).

---

## 2. Media storage — Cloudflare R2

1. In the Cloudflare dashboard → **R2** → *Create bucket*, name it `medshop-media`.
2. **Make it publicly readable:** bucket → *Settings* → *Public access* → either
   - enable the **`r2.dev` subdomain** (quick; gives you `https://pub-xxxx.r2.dev`), or
   - connect a **custom domain** like `media.medshop.com` (better for production).
   Whichever you choose is your `R2_PUBLIC_BASE_URL` (no trailing slash).
3. **CORS** — bucket → *Settings* → *CORS policy* → add:
   ```json
   [
     {
       "AllowedOrigins": ["https://YOUR-DOMAIN.com", "https://*.vercel.app", "http://localhost:3000"],
       "AllowedMethods": ["PUT"],
       "AllowedHeaders": ["content-type"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```
4. **API token** — R2 → *Manage R2 API Tokens* → *Create API token* → permission
   **Object Read & Write**, scoped to this bucket. You get:
   - Account ID → `R2_ACCOUNT_ID`
   - Access Key ID → `R2_ACCESS_KEY_ID`
   - Secret Access Key → `R2_SECRET_ACCESS_KEY`

---

## 3. Vercel project

1. Push this repo to GitHub (private is fine).
2. **vercel.com** → *Add New → Project* → import the repo. Framework auto-detects as Next.js.
   `vercel.json` already sets the build command and region (`fra1`).
3. **Environment Variables** (Project → Settings → Environment Variables) — add all of:

   ```
   DATABASE_URL           = <Neon pooled string>
   DIRECT_URL             = <Neon direct string>
   R2_ACCOUNT_ID          = ...
   R2_ACCESS_KEY_ID       = ...
   R2_SECRET_ACCESS_KEY   = ...
   R2_BUCKET              = medshop-media
   R2_PUBLIC_BASE_URL     = https://pub-xxxx.r2.dev   (or your custom domain)
   SITE_URL               = https://your-vercel-domain.vercel.app
   ADMIN_URL              = https://your-vercel-domain.vercel.app
   ADMIN_PASSWORD         = <a strong password>
   ADMIN_SESSION_SECRET   = <output of: openssl rand -base64 32>
   RESEND_API_KEY         = <from your local .env>   (optional)
   ORDER_NOTIFY_EMAIL_FROM= onboarding@resend.dev    (optional)
   ORDER_NOTIFY_EMAIL_TO  = <owner inbox>            (optional)
   ```

4. **Deploy.** The build runs `prisma db push` (creates tables in Neon) then `next build`.
5. Open the deployed URL, go to **/admin**, log in with `ADMIN_PASSWORD`, and start adding
   categories and products. Uploads go straight to R2.

---

## 4. Custom domain

1. Buy the domain, add it in Vercel → Project → *Domains*.
2. Point DNS as Vercel instructs (A/CNAME).
3. Update `SITE_URL` and `ADMIN_URL` env vars to `https://your-domain.com`, and add the
   domain to the R2 **CORS `AllowedOrigins`** list. Redeploy.

---

## Local development after this change

Local dev now needs Postgres too (the schema is `postgresql`). In your local `.env`:

```
DATABASE_URL="<Neon *development* branch pooled string>"
DIRECT_URL="<Neon *development* branch direct string>"
R2_ACCOUNT_ID=...          # same R2 bucket is fine for dev
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET="medshop-media"
R2_PUBLIC_BASE_URL="https://pub-xxxx.r2.dev"
```

Then `npm run db:push` once, and `npm run dev` as usual. (`npm run db:seed` still works if
you want demo data locally — never run it against production.)

---

## What changed in the code

- `prisma/schema.prisma` — `provider = "postgresql"`, added `directUrl`.
- `src/lib/storage.ts` (was `uploads.ts`) — R2 presign + delete instead of local `fs`.
- `src/app/api/upload/route.ts` — new; admin-only endpoint that mints presigned R2 URLs.
- `src/lib/upload-client.ts` — new; browser helper that uploads a file to R2.
- `src/components/admin/product-form.tsx`, `category-form.tsx` — upload on file-select,
  submit URLs (hidden fields) instead of file blobs.
- `src/app/admin/(dashboard)/products/actions.ts`, `categories/actions.ts` — read media
  URLs from the form; delete from R2 on replace/remove.
- `next.config.ts` — dropped the 64 MB `serverActions.bodySizeLimit`; added
  `images.remotePatterns` for the R2 host.
- `package.json` — `postinstall: prisma generate`, `vercel-build`.
- `vercel.json` — build command + `fra1` region.
