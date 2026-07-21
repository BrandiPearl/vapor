# Aussie Cloud Vape

Next.js storefront cloned from the Vapes Shop Australia layout, branded as **Aussie Cloud Vape**.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Client cart (Zustand + localStorage) — ready to swap for Supabase later
- Mock product catalogue in `src/lib/products.ts`

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's included (UI phase)

- Home (hero, SEO sections, product carousels, category banners, trust strip, FAQs)
- Shop with brand filter + sorting
- Product detail pages
- Cart, Contact, About, Account, FAQ, policy pages
- 18+ age gate

## Next phases

1. Wire Supabase (products, auth, orders) + S3 product images
2. JSON import scripts for catalogue upload
3. Admin CMS for products
