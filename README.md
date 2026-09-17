# Aussie Cloud Vape

Next.js storefront for **Aussie Cloud Vape** (domain: [cloudsourceau.com](https://cloudsourceau.com)).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Supabase (products, storage, orders, visits)
- Client cart (Zustand + localStorage)
- WhatsApp / Telegram checkout (no card payments on-site)
- Optional Tawk.to live chat on the storefront

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in Supabase + WhatsApp values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Cloudflare Workers

The app runs on Cloudflare via [OpenNext](https://opennext.js.org/cloudflare) — plain
`next build` output is not deployable there. Config lives in `wrangler.jsonc` and
`open-next.config.ts`.

1. In the Worker's **Settings → Build**, set:
   - Build command: `npm run cf:build`
   - Deploy command: `npx opennextjs-cloudflare deploy`
2. Add every `NEXT_PUBLIC_*` value from `.env.example` under **Settings → Build →
   build variables** — they are inlined at build time, so runtime variables are not
   enough. Server-only values (`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_S3_*`,
   `OWNER_*`) belong in **Settings → Variables and Secrets** as *Secret*.

   The two lists are separate: a value added only as a build variable is **not**
   readable by the running Worker. `SUPABASE_SERVICE_ROLE_KEY` is the common
   miss — without it `/admin` falls back to read-only mode (and shows a banner
   saying so), and `/api/orders` cannot record orders.

   Runtime values must be added as **Secret**, not Variable. `wrangler deploy`
   (which every Workers build runs) deletes all plaintext vars and re-applies
   only those in `wrangler.jsonc`, so a dashboard Variable disappears on the
   next deploy. Secrets are never removed by a deployment. This repo sets
   `keep_vars: true` so plaintext dashboard Variables survive builds too.

   After adding or editing a Secret, click **Deploy** on the Variables and
   Secrets page — saving alone does not activate it. The name must be exactly
   `SUPABASE_SERVICE_ROLE_KEY`.
3. Point **cloudsourceau.com** at the Worker under **Domains → Add custom domain**,
   then update the Hostinger DNS records Cloudflare shows.

Deploy from a local machine with `npm run cf:deploy`, or preview the built worker
with `npm run cf:preview`.

### Publishing catalogue changes

The storefront is fully prerendered at build time and the Cloudflare cache is
read-only, so **edits made in `/admin` do not appear on the live site until the
Worker is rebuilt**. Trigger a new deployment from the Cloudflare dashboard (or
run `npm run cf:deploy`) after changing products.

Enabling R2 on the account removes this limitation — see the comment at the top
of `open-next.config.ts` for the two-line switch back to on-demand revalidation.

Note: `src/middleware.ts` stays on the deprecated Next 16 `middleware` convention
on purpose. `proxy.ts` forces the Node.js runtime, which OpenNext Cloudflare
rejects — the deprecation warning in the build log is expected.

## Store settings

Minimum order, shipping options, WhatsApp/Telegram links, and the announcement
banner are edited at `/admin/settings` and stored in Supabase. Run
`supabase/schema-settings.sql` once to create the table.

These are the only values that change **without** a redeploy: the storefront
reads them from `/api/settings` at runtime, so a save is live within a minute.
Until the table exists (or if the read fails) the site falls back to the
compiled defaults in `src/lib/settings.ts`, which in turn fall back to the
`NEXT_PUBLIC_WHATSAPP_NUMBER` / `NEXT_PUBLIC_TELEGRAM_URL` env vars.

## Checkout

Orders open WhatsApp and are saved to Supabase (`orders`). Run `supabase/schema-orders-visits.sql` once.

```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=61468292610
```

### Live chat (Tawk.to)

1. Create a free property at [tawk.to](https://www.tawk.to/).
2. Open **Administration → Channels → Chat Widget** and copy the embed URL path:
   `https://embed.tawk.to/{PROPERTY_ID}/{WIDGET_ID}`
3. Add both IDs to `.env.local` and the Cloudflare build variables (rebuild after changing):

```bash
NEXT_PUBLIC_TAWK_PROPERTY_ID=6a669992f72ee51d4882401d
NEXT_PUBLIC_TAWK_WIDGET_ID=1jugcfpk6
```

The widget only loads on storefront pages (not `/admin`). Answer chats in the Tawk dashboard or mobile app.

### Owner visit alerts

Logged once per browser session. Optional phone/webhook alerts:

```bash
OWNER_NTFY_TOPIC=aussie-cloud-vape-alerts
OWNER_NOTIFY_WEBHOOK_URL=https://...
OWNER_CALLMEBOT_APIKEY=...
OWNER_WHATSAPP_NUMBER=61468292610
```

## Product import

```bash
npm run products:normalize
npm run products:import
npm run products:migrate-images
npm run products:strip-dashes
npm run products:import-pouches   # ZYN / VELO / XQS / PABLO / KILLA → /nicotine-pouches
```

Nicotine pouches use category `Nicotine Pouches` and are excluded from `/shop`. Browse them at `/nicotine-pouches`.

## Admin CMS

```bash
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='your-strong-password' npm run admin:create
```

Open `/admin/login`.

If a dashboard page fails it now renders the underlying message (plus a Worker
log reference) instead of a bare 500, so the cause is visible in the browser.

## SEO

Technical SEO (sitemap, robots, metadata, JSON-LD) is documented in [`docs/SEO.md`](docs/SEO.md).

After deploy, submit `https://cloudsourceau.com/sitemap.xml` in Google Search Console.
