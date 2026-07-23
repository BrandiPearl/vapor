import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";

const MARKETING_TAGS = new Set([
  "BEST SELLING PRODUCTS",
  "BULK",
  "NEWEST PRODUCTS",
  "VAPES",
  "FEATURED",
  "SALE",
]);

type RawProduct = {
  id: number;
  name: string;
  url: string;
  sku: string;
  description: string;
  short_description: string;
  on_sale: boolean;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_minor_unit: number;
  };
  stock_status: boolean;
  images: string[];
  categories: string[];
  variations: unknown[];
};

export type NormalizedProduct = {
  slug: string;
  name: string;
  brand: string | null;
  category_name: string | null;
  tags: string[];
  description: string;
  short_description: string;
  sku: string | null;
  price: number;
  compare_at_price: number | null;
  on_sale: boolean;
  best_seller: boolean;
  featured: boolean;
  in_stock: boolean;
  puffs: number | null;
  source_url: string;
  source_images: string[];
  variations: unknown[];
  source_id: number;
};

function decodeEntities(text: string) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCharCode(parseInt(n, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

function slugFromUrl(url: string, fallbackName: string) {
  try {
    const path = new URL(url).pathname.replace(/\/+$/, "");
    const part = path.split("/").filter(Boolean).pop();
    if (part) return slugify(decodeURIComponent(part));
  } catch {
    // ignore
  }
  return slugify(fallbackName);
}

function toAud(minor: string | null | undefined, minorUnit = 2) {
  if (minor == null || minor === "") return null;
  const n = Number(minor);
  if (!Number.isFinite(n)) return null;
  return Number((n / 10 ** minorUnit).toFixed(2));
}

function parsePuffs(name: string) {
  const m = name.match(/(\d[\d,]*)\s*PUFFS?/i);
  if (!m) return null;
  return Number(m[1].replace(/,/g, ""));
}

function deriveBrand(category: string | null, name: string) {
  const source = category || name;
  const known = [
    "ALIBARBAR",
    "ALFAKHER",
    "IGET",
    "HQD",
    "WAKA",
    "GUNNPOD",
    "MR FOG",
    "MRFOG",
    "KUZ",
    "BRISK",
    "MOOODAN",
    "VAPEHUB",
    "VAPORASSO",
    "VAPORESSO",
  ];
  const upper = source.toUpperCase();
  for (const brand of known) {
    if (upper.includes(brand)) {
      return brand === "MRFOG" ? "MR FOG" : brand;
    }
  }
  const first = source.split(/\s+/)[0];
  return first ? first.toUpperCase() : null;
}

function uniqueSlug(base: string, used: Map<string, number>) {
  const count = used.get(base) ?? 0;
  used.set(base, count + 1);
  if (count === 0) return base;
  return `${base}-${count + 1}`;
}

export function normalizeProducts(raw: RawProduct[]): NormalizedProduct[] {
  const usedSlugs = new Map<string, number>();

  return raw.map((item) => {
    const name = decodeEntities(item.name);
    const categories = (item.categories || []).map(decodeEntities);
    const tags = categories.filter((c) => MARKETING_TAGS.has(c.toUpperCase()));
    const productCats = categories.filter(
      (c) => !MARKETING_TAGS.has(c.toUpperCase()),
    );
    const category_name = productCats[0] ?? null;
    const minorUnit = item.prices?.currency_minor_unit ?? 2;
    const price =
      toAud(item.prices?.sale_price || item.prices?.price, minorUnit) ?? 0;
    const regular = toAud(item.prices?.regular_price, minorUnit);
    const compare_at_price =
      regular != null && regular > price ? regular : null;

    const baseSlug = slugFromUrl(item.url, name);

    return {
      slug: uniqueSlug(baseSlug, usedSlugs),
      name,
      brand: deriveBrand(category_name, name),
      category_name,
      tags,
      description: decodeEntities(item.description || ""),
      short_description: decodeEntities(item.short_description || ""),
      sku: item.sku?.trim() ? item.sku.trim() : null,
      price,
      compare_at_price,
      on_sale: Boolean(item.on_sale),
      best_seller: tags.some((t) => t.toUpperCase() === "BEST SELLING PRODUCTS"),
      featured: tags.some((t) => t.toUpperCase() === "NEWEST PRODUCTS"),
      in_stock: Boolean(item.stock_status),
      puffs: parsePuffs(name),
      source_url: item.url,
      source_images: (item.images || []).filter(Boolean),
      variations: item.variations || [],
      source_id: item.id,
    };
  });
}

function main() {
  const inputPath = resolve(process.cwd(), "products.json");
  const outDir = resolve(process.cwd(), "data");
  const outPath = resolve(outDir, "products.normalized.json");

  const raw = JSON.parse(readFileSync(inputPath, "utf8")) as RawProduct[];
  const normalized = normalizeProducts(raw);

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, JSON.stringify(normalized, null, 2));

  const withImages = normalized.filter((p) => p.source_images.length > 0);
  const uniqueImages = new Set(normalized.flatMap((p) => p.source_images));
  const categories = new Set(
    normalized.map((p) => p.category_name).filter(Boolean),
  );

  console.log(`Normalized ${normalized.length} products`);
  console.log(`With images: ${withImages.length}`);
  console.log(`Unique source images: ${uniqueImages.size}`);
  console.log(`Categories: ${categories.size}`);
  console.log(`Wrote ${outPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
