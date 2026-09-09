# Aussie Cloud Vape SEO Playbook

Living reference for organic search on [cloudsourceau.com](https://cloudsourceau.com).

## Brand and domain

| Field | Value |
|-------|-------|
| Brand | Aussie Cloud Vape |
| Primary domain | `https://cloudsourceau.com` |
| Locale | `en-AU` |
| Location signal | Brisbane, Australia |

## Primary keywords (use naturally)

- buy disposable vapes online Australia
- vape shop Australia / online vape store Australia
- vape delivery Australia
- nicotine vapes Australia (only where accurate and compliant)
- Brand + product names (IGET, HQD, Al Fakher, etc.)

Do not keyword-stuff titles, headings, or FAQ answers. One clear intent per page.

## Technical checklist (implemented)

- [x] `metadataBase` and default Open Graph / Twitter cards
- [x] `robots.ts` and dynamic `sitemap.xml` (static pages + product slugs)
- [x] Per-route titles and descriptions
- [x] `noindex` on cart, checkout, account, admin
- [x] Product `generateMetadata` with OG image and canonical
- [x] JSON-LD: Organization, WebSite, Product, FAQPage, BreadcrumbList
- [x] Shop canonical always `/shop` (filter URLs not indexed separately)

## Phase B (content and growth)

- Indexable brand/category landing pages (`/brand/iget`, `/category/disposables`)
- Nicotine pouch product photography (currently placeholders until images are uploaded)
- Expanded shipping, authenticity, and how-to-order pages
- Guides/blog only when substantive (thin posts hurt rankings)
- Image pipeline: optimize remote product images for LCP
- Privacy copy aligned with WhatsApp/Telegram checkout (no card processors)

## Content calendar outline

| Priority | Page / topic | Goal |
|----------|--------------|------|
| 1 | Homepage + shop | Category and trust keywords |
| 2 | Top 20 product PDPs | Long-tail product + brand queries |
| 3 | FAQ expansion | Shipping times, authenticity, minimum order |
| 4 | Brand hubs | IGET, HQD, Al Fakher collection pages |
| 5 | Shipping Australia | State delivery expectations |

## Compliance and E-E-A-T

- 18+ age gate stays visible; no youth-oriented language or imagery
- Accurate stock, pricing (AUD), and nicotine claims
- Paid ads for vape products may be restricted; organic search is a primary channel
- Support via WhatsApp, Telegram, and Tawk.to must be responsive

## Measurement

1. **Google Search Console** — add property for `cloudsourceau.com`, submit sitemap `https://cloudsourceau.com/sitemap.xml`
2. **Bing Webmaster Tools** — same domain and sitemap
3. After major deploys: inspect homepage URL, request indexing if needed
4. Test rich results: [Google Rich Results Test](https://search.google.com/test/rich-results) on a product URL and `/faq`
5. Test social previews: share a product link in WhatsApp or Slack

## Success metrics

- Sitemap indexed with product URLs in coverage report
- Distinct SERP titles for home, shop, and top products
- Product rich results eligible (Product + Offer in AUD)
- FAQ rich results eligible on `/faq`
- OG images appear when sharing PDP links

## Owner ops (post-deploy)

1. Confirm the Cloudflare custom domain and HTTPS
2. Add env vars if domain changes (`NEXT_PUBLIC_SITE_URL`)
3. Submit sitemap in Search Console
4. Monitor Coverage and Core Web Vitals monthly
5. Refresh product metadata when catalogue bulk-imports run

## Code map

| File | Role |
|------|------|
| `src/lib/seo.ts` | URLs, JSON-LD builders, metadata helpers |
| `src/components/JsonLd.tsx` | Renders schema scripts |
| `src/app/robots.ts` | Crawl rules |
| `src/app/sitemap.ts` | URL inventory |
| `src/app/layout.tsx` | Root metadata defaults |
