import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import type { NormalizedProduct } from "./normalize-products";

config({ path: resolve(process.cwd(), ".env.local") });

type PouchRow = NormalizedProduct & {
  metadata_extra?: Record<string, unknown>;
};

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
    readFileSync(
      resolve(process.cwd(), "scripts/data/nicotine-pouches.normalized.json"),
      "utf8",
    ),
  ) as PouchRow[];

  const category = {
    name: "Nicotine Pouches",
    slug: "nicotine-pouches",
    description:
      "Tobacco-free nicotine pouches from ZYN, VELO, XQS, PABLO and KILLA.",
  };

  console.log("Upserting Nicotine Pouches category...");
  const { error: catUpsertErr } = await supabase
    .from("categories")
    .upsert(category, { onConflict: "slug" });
  if (catUpsertErr) throw catUpsertErr;

  const { data: cat, error: catErr } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("slug", "nicotine-pouches")
    .single();
  if (catErr) throw catErr;

  const rows = products.map((p) => ({
    slug: p.slug || slugify(p.name),
    name: p.name,
    brand: p.brand,
    category_id: cat.id,
    category_name: "Nicotine Pouches",
    description: p.description || null,
    price: p.price,
    compare_at_price: p.compare_at_price,
    image_path: null,
    image_url: p.source_images[0] ?? "/products/placeholder.svg",
    puffs: null,
    on_sale: p.on_sale,
    featured: p.featured,
    best_seller: p.best_seller,
    in_stock: p.in_stock,
    stock_quantity: p.in_stock ? 50 : 0,
    metadata: {
      sku: p.sku,
      short_description: p.short_description,
      source_url: p.source_url,
      source_id: p.source_id,
      tags: p.tags,
      source_images: p.source_images,
      variations: p.variations,
      product_type: "nicotine_pouch",
      ...(p.metadata_extra || {}),
    },
  }));

  console.log(`Upserting ${rows.length} nicotine pouch products...`);
  let done = 0;
  for (const batch of chunk(rows, 50)) {
    const { error } = await supabase
      .from("products")
      .upsert(batch, { onConflict: "slug" });
    if (error) throw error;
    done += batch.length;
    console.log(`  ${done}/${rows.length}`);
  }

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_name", "Nicotine Pouches");

  console.log(`Import complete. Nicotine Pouches count = ${count}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
