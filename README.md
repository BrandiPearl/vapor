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

1. Enable **R2 Object Storage** on the Cloudflare account (dashboard → R2). The
   `vapor-opennext-cache` bucket is then created automatically on first deploy.
2. In the Worker's **Settings → Build**, set:
   - Build command: `npm run cf:build`
   - Deploy command: `npx opennextjs-cloudflare deploy` — it uploads the ISR cache
     to R2 before running `wrangler deploy`; plain `wrangler deploy` skips that.
3. Add every `NEXT_PUBLIC_*` value from `.env.example` under **Settings → Build →
   build variables** — they are inlined at build time, so runtime variables are not
   enough. Server-only values (`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_S3_*`,
   `OWNER_*`) belong in **Settings → Variables and Secrets** as *Secret*.
4. Point **cloudsourceau.com** at the Worker under **Domains → Add custom domain**,
   then update the Hostinger DNS records Cloudflare shows.

Deploy from a local machine with `npm run cf:deploy`, or preview the built worker
with `npm run cf:preview`.

Note: `src/middleware.ts` stays on the deprecated Next 16 `middleware` convention
on purpose. `proxy.ts` forces the Node.js runtime, which OpenNext Cloudflare
rejects — the deprecation warning in the build log is expected.

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
```

## Admin CMS

```bash
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='your-strong-password' npm run admin:create
```

Open `/admin/login`.

## SEO

Technical SEO (sitemap, robots, metadata, JSON-LD) is documented in [`docs/SEO.md`](docs/SEO.md).

After deploy, submit `https://cloudsourceau.com/sitemap.xml` in Google Search Console.
