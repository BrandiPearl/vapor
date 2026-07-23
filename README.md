# Aussie Cloud Vape

Next.js storefront for **Aussie Cloud Vape** (domain: [cloudsourceau.com](https://cloudsourceau.com)).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Supabase (products, storage, orders, visits)
- Client cart (Zustand + localStorage)
- WhatsApp checkout (no card payments on-site)

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
