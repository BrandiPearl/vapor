/**
 * Scrape full ZYN / VELO / XQS / PABLO / KILLA catalogues from snusdownunder.com
 * into scripts/data/nicotine-pouches.normalized.json
 *
 * Usage: npx tsx scripts/scrape-nicotine-pouches.ts
 */
import { writeFileSync } from "fs";
import { resolve } from "path";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

const COLLECTIONS: Record<string, string> = {
  ZYN: "https://www.snusdownunder.com/collections/zyn-nicotine-pouches/",
  VELO: "https://www.snusdownunder.com/collections/velo-nicotine-pouches/",
  XQS: "https://www.snusdownunder.com/collections/xqs-nicotine-pouches/",
  PABLO: "https://www.snusdownunder.com/collections/pablo-nicotine-pouches/",
  KILLA: "https://www.snusdownunder.com/collections/killa-nicotine-pouches/",
};

function pageUrl(base: string, page: number) {
  return page <= 1 ? base : `${base.replace(/\/$/, "")}/page/${page}/`;
}

async function get(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-AU,en;q=0.9",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

function decode(s: string) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCharCode(parseInt(n, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .trim();
}

function parsePrices(block: string) {
  const cur = block.match(/Current price is:\s*\$?\s*([\d.]+)/i);
  const orig = block.match(/Original price was:\s*\$?\s*([\d.]+)/i);
  if (cur) {
    const price = Number(cur[1]);
    const compare = orig ? Number(orig[1]) : null;
    return { price, compare };
  }
  const bdis = [...block.matchAll(/<bdi[^>]*>.*?([\d]+\.[\d]{2})/gs)].map((m) =>
    Number(m[1]),
  );
  if (bdis.length >= 2) {
    return { price: Math.min(bdis[0], bdis[1]), compare: Math.max(bdis[0], bdis[1]) };
  }
  if (bdis.length === 1) return { price: bdis[0], compare: null };
  return { price: null, compare: null };
}

function parseProducts(html: string, brand: string) {
  const items: Record<string, unknown>[] = [];
  for (const match of html.matchAll(/<li class="product[^"]*"[^>]*>.*?<\/li>/gs)) {
    const b = match[0];
    const href = b.match(
      /href="(https:\/\/www\.snusdownunder\.com\/products\/[^"]+)"/,
    );
    if (!href) continue;
    const sourceUrl = href[1].split("?")[0];

    let name = "";
    for (const pat of [/alt="([^"]+)"/, /title="([^"]+)"/]) {
      const m = b.match(pat);
      if (m) {
        const cand = decode(m[1]);
        if (
          cand &&
          !["sale!", "sold out", "brand new", "popular"].includes(
            cand.toLowerCase(),
          )
        ) {
          name = cand;
          break;
        }
      }
    }
    if (!name) {
      name = sourceUrl.split("/").filter(Boolean).pop()!.replace(/-/g, " ").toUpperCase();
    }
    if (name.startsWith("QS ")) name = name.replace(/^QS /, "XQS ");

    let img: string | null = null;
    const lazy = b.match(
      /data-lazy-src="(https:\/\/[^"]+\.(?:webp|jpg|jpeg|png)[^"]*)"/i,
    );
    if (lazy) img = lazy[1].replace(/&amp;/g, "&");

    const { price, compare } = parsePrices(b);
    if (price == null) continue;

    const mgMatch = name.match(/(\d+(?:\.\d+)?)\s*MG/i);
    const mg = mgMatch
      ? mgMatch[1].includes(".")
        ? Number(mgMatch[1])
        : Number(mgMatch[1])
      : null;

    let slug = sourceUrl.replace(/\/$/, "").split("/").pop()!;
    if (slug.startsWith("qs-")) slug = `xqs-${slug.slice(3)}`;

    items.push({
      slug,
      name,
      brand,
      category_name: "Nicotine Pouches",
      tags: ["nicotine-pouches", brand.toLowerCase()],
      description:
        `${brand} tobacco-free nicotine pouches` +
        (mg != null ? ` · ${mg}mg per pouch.` : "."),
      short_description:
        `${brand} nicotine pouches` + (mg != null ? ` · ${mg}mg` : ""),
      sku: null,
      price: Math.round(price * 100) / 100,
      compare_at_price:
        compare && compare > price ? Math.round(compare * 100) / 100 : null,
      on_sale: Boolean(compare && compare > price),
      best_seller: false,
      featured: false,
      in_stock: true,
      puffs: null,
      source_url: sourceUrl.includes("/qs-")
        ? sourceUrl.replace("/qs-", "/xqs-")
        : sourceUrl,
      source_images: img ? [img] : [],
      variations: [],
      source_id: Math.abs(
        [...slug].reduce((a, c) => (Math.imul(31, a) + c.charCodeAt(0)) | 0, 0),
      ),
      metadata_extra: {
        nicotine_mg: mg,
        product_type: "nicotine_pouch",
        collection_brand: brand,
      },
    });
  }
  return items;
}

async function main() {
  const all: Record<string, unknown>[] = [];
  const seen = new Set<string>();
  const counts: Record<string, number> = {};

  for (const [brand, base] of Object.entries(COLLECTIONS)) {
    let page = 1;
    let brandCount = 0;
    while (page <= 30) {
      const url = pageUrl(base, page);
      console.log(`fetch ${brand} p${page}`);
      let html: string;
      try {
        html = await get(url);
      } catch (err) {
        console.log("  stop", err instanceof Error ? err.message : err);
        break;
      }
      const items = parseProducts(html, brand);
      console.log(`  ${items.length} items`);
      if (!items.length) break;
      for (const item of items) {
        const slug = String(item.slug);
        if (seen.has(slug)) continue;
        seen.add(slug);
        all.push(item);
        brandCount++;
      }
      if (items.length < 12) break;
      page++;
      await new Promise((r) => setTimeout(r, 700));
    }
    counts[brand] = brandCount;
    await new Promise((r) => setTimeout(r, 800));
  }

  const out = resolve(process.cwd(), "scripts/data/nicotine-pouches.normalized.json");
  writeFileSync(out, JSON.stringify(all, null, 2));
  console.log("TOTAL", all.length, counts);
  console.log("wrote", out);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
