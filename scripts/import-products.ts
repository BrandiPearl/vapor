import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import type { NormalizedProduct } from "./normalize-products";

config({ path: resolve(process.cwd(), ".env.local") });

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("Missing Supabase credentials");

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const products = JSON.parse(
    readFileSync(resolve(process.cwd(), "data/products.normalized.json"), "utf8"),
  ) as NormalizedProduct[];

  const categoryNames = [
    ...new Set(
      products
        .map((p) => p.category_name)
        .filter((n): n is string => Boolean(n)),
    ),
  ];

  const categoryRows = categoryNames.map((name) => ({
    name,
    slug: slugify(name),
  }));

  console.log(`Upserting ${categoryRows.length} categories...`);
  for (const batch of chunk(categoryRows, 100)) {
    const { error } = await supabase
      .from("categories")
      .upsert(batch, { onConflict: "slug" });
    if (error) throw error;
  }

  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .select("id, name, slug");
  if (catErr) throw catErr;

  const categoryIdByName = new Map(cats!.map((c) => [c.name, c.id]));

  const rows = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category_id: p.category_name
      ? categoryIdByName.get(p.category_name) ?? null
      : null,
    category_name: p.category_name,
    description: p.description || null,
    price: p.price,
    compare_at_price: p.compare_at_price,
    image_path: null,
    // Keep source URL temporarily so the storefront has images before migration
    image_url: p.source_images[0] ?? null,
    puffs: p.puffs,
    on_sale: p.on_sale,
    featured: p.featured,
    best_seller: p.best_seller,
    in_stock: p.in_stock,
    stock_quantity: p.in_stock ? 100 : 0,
    metadata: {
      sku: p.sku,
      short_description: p.short_description,
      source_url: p.source_url,
      source_id: p.source_id,
      tags: p.tags,
      source_images: p.source_images,
      variations: p.variations,
    },
  }));

  console.log(`Upserting ${rows.length} products...`);
  let done = 0;
  for (const batch of chunk(rows, 100)) {
    const { error } = await supabase
      .from("products")
      .upsert(batch, { onConflict: "slug" });
    if (error) throw error;
    done += batch.length;
    console.log(`  ${done}/${rows.length}`);
  }

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  console.log(`Import complete. products count = ${count}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
