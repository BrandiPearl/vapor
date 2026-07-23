import { createClient } from "@supabase/supabase-js";
import type { DbProduct, Product } from "./types";

const PLACEHOLDER = "/products/placeholder.svg";

const PRODUCT_COLUMNS =
  "id, slug, name, brand, category_name, description, price, compare_at_price, image_url, puffs, on_sale, featured, best_seller, in_stock, metadata";

export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(url, key);
}

function toNumber(value: number | string | null | undefined) {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function mapDbProduct(row: DbProduct): Product {
  const price = toNumber(row.price) ?? 0;
  const compare = toNumber(row.compare_at_price);
  const metaUrls = row.metadata?.image_urls?.filter(Boolean) ?? [];
  const image =
    row.image_url ||
    metaUrls[0] ||
    row.metadata?.source_images?.[0] ||
    PLACEHOLDER;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category_name || row.brand || "Uncategorised",
    brand: row.brand || "Other",
    price,
    compareAtPrice:
      compare != null && compare > price ? compare : undefined,
    image,
    description: row.description || row.metadata?.short_description || "",
    shortDescription: row.metadata?.short_description || "",
    puffs: row.puffs ?? undefined,
    onSale: row.on_sale,
    featured: row.featured,
    bestSeller: row.best_seller,
    inStock: row.in_stock,
    tags: row.metadata?.tags || [],
    imageUrls: metaUrls.length
      ? metaUrls
      : image !== PLACEHOLDER
        ? [image]
        : [],
  };
}

export async function getAllProducts() {
  const supabase = createPublicClient();
  const pageSize = 1000;
  const all: DbProduct[] = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .order("name")
      .range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data?.length) break;
    all.push(...(data as DbProduct[]));
    if (data.length < pageSize) break;
  }

  return all.map(mapDbProduct);
}

export async function getProductBySlug(slug: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapDbProduct(data as DbProduct) : null;
}

export async function getFeaturedProducts(limit = 12) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("on_sale", true)
    .not("image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as DbProduct[]).map(mapDbProduct);
}

export async function getBestSellers(limit = 12) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("best_seller", true)
    .order("name")
    .limit(limit);
  if (error) throw error;

  if (data?.length) return (data as DbProduct[]).map(mapDbProduct);

  const { data: fallback, error: fbErr } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("on_sale", true)
    .not("image_url", "is", null)
    .order("price")
    .limit(limit);
  if (fbErr) throw fbErr;
  return (fallback as DbProduct[]).map(mapDbProduct);
}

export async function getProductsByBrand(brand: string, limit = 12) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .ilike("brand", brand)
    .order("name")
    .limit(limit);
  if (error) throw error;
  return (data as DbProduct[]).map(mapDbProduct);
}

export async function getRelatedProducts(
  brand: string,
  excludeId: string,
  limit = 8,
) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .ilike("brand", brand)
    .neq("id", excludeId)
    .order("name")
    .limit(limit);
  if (error) throw error;
  return (data as DbProduct[]).map(mapDbProduct);
}

export async function getProductSlugs() {
  const supabase = createPublicClient();
  const pageSize = 1000;
  const slugs: string[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("products")
      .select("slug")
      .order("slug")
      .range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data?.length) break;
    slugs.push(...data.map((r) => r.slug as string));
    if (data.length < pageSize) break;
  }
  return slugs;
}

export { formatPrice } from "./site";
