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

## Deploy on Netlify

1. Connect the GitHub repo `BrandiPearl/vapor` in Netlify.
2. Build settings are in `netlify.toml` (Next.js plugin).
3. Add environment variables from `.env.example` in **Site settings → Environment variables** (never commit `.env.local`).
4. Point **cloudsourceau.com** DNS at Netlify:
   - In Hostinger DNS, add Netlify’s nameservers **or**
   - `A` / `CNAME` records Netlify shows for the custom domain
5. In Netlify: **Domain management → Add domain → cloudsourceau.com** and follow HTTPS setup.

## Checkout

Orders open WhatsApp and are saved to Supabase (`orders`). Run `supabase/schema-orders-visits.sql` once.

```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=61468292610
```

### Live chat (Tawk.to)

1. Create a free property at [tawk.to](https://www.tawk.to/).
2. Open **Administration → Channels → Chat Widget** and copy the embed URL path:
   `https://embed.tawk.to/{PROPERTY_ID}/{WIDGET_ID}`
3. Add both IDs to `.env.local` and Netlify (rebuild after changing):

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
