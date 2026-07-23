/**
 * Replace em/en dashes in Supabase product (and category) text fields.
 *
 * Usage:
 *   npm run products:strip-dashes -- --dry-run
 *   npm run products:strip-dashes
 *   npm run products:strip-dashes -- --limit=50
 */
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const PAGE_SIZE = 200;

/** Em dash, en dash, figure dash, horizontal bar */
const DASH_RE = /[\u2014\u2013\u2012\u2015]/g;

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  category_name: string | null;
  description: string | null;
  metadata: Record<string, unknown> | null;
};

type CategoryRow = {
  id: string;
  name: string;
  description: string | null;
};

function parseArgs() {
  const dryRun = process.argv.includes("--dry-run");
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  return {
    dryRun,
    limit: limitArg ? Number(limitArg.split("=")[1]) : null,
  };
}

function cleanText(value: string): string {
  return value
    .replace(DASH_RE, " - ")
    .replace(/ {2,}/g, " ")
    .replace(/ - -/g, " -")
    .trim();
}

function cleanValue(value: unknown): unknown {
  if (typeof value === "string") return cleanText(value);
  if (Array.isArray(value)) return value.map(cleanValue);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = cleanValue(v);
    }
    return out;
  }
  return value;
}

function hasDash(value: unknown): boolean {
  if (typeof value === "string") return DASH_RE.test(value);
  if (Array.isArray(value)) return value.some(hasDash);
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some(hasDash);
  }
  return false;
}

function stableJson(value: unknown) {
  return JSON.stringify(value ?? null);
}

async function main() {
  const { dryRun, limit } = parseArgs();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("Missing Supabase credentials in .env.local");

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(
    dryRun
      ? "Dry run: no rows will be updated.\n"
      : "Updating database rows (em/en dashes → hyphen)...\n",
  );

  // Categories
  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .select("id, name, description");
  if (catErr) throw catErr;

  let catUpdated = 0;
  for (const cat of (categories || []) as CategoryRow[]) {
    if (!hasDash(cat.name) && !hasDash(cat.description)) continue;
    const patch = {
      name: cleanText(cat.name),
      description: cat.description ? cleanText(cat.description) : cat.description,
    };
    console.log(`  category: "${cat.name}" → "${patch.name}"`);
    if (!dryRun) {
      const { error } = await supabase
        .from("categories")
        .update(patch)
        .eq("id", cat.id);
      if (error) throw error;
    }
    catUpdated++;
  }

  // Products (paginated)
  let offset = 0;
  let scanned = 0;
  let prodUpdated = 0;
  let examples = 0;

  while (true) {
    if (limit != null && scanned >= limit) break;

    const pageLimit =
      limit != null ? Math.min(PAGE_SIZE, limit - scanned) : PAGE_SIZE;

    const { data, error } = await supabase
      .from("products")
      .select("id, slug, name, brand, category_name, description, metadata")
      .order("slug", { ascending: true })
      .range(offset, offset + pageLimit - 1);

    if (error) throw error;
    const rows = (data || []) as ProductRow[];
    if (!rows.length) break;

    for (const row of rows) {
      scanned++;
      const needs =
        hasDash(row.name) ||
        hasDash(row.brand) ||
        hasDash(row.category_name) ||
        hasDash(row.description) ||
        hasDash(row.metadata);

      if (!needs) continue;

      const patch = {
        name: cleanText(row.name),
        brand: row.brand ? cleanText(row.brand) : row.brand,
        category_name: row.category_name
          ? cleanText(row.category_name)
          : row.category_name,
        description: row.description
          ? cleanText(row.description)
          : row.description,
        metadata: cleanValue(row.metadata ?? {}) as Record<string, unknown>,
      };

      if (
        patch.name === row.name &&
        patch.brand === row.brand &&
        patch.category_name === row.category_name &&
        patch.description === row.description &&
        stableJson(patch.metadata) === stableJson(row.metadata)
      ) {
        continue;
      }

      if (examples < 12) {
        console.log(`  product: "${row.name}" → "${patch.name}"`);
        examples++;
      }

      if (!dryRun) {
        const { error: upErr } = await supabase
          .from("products")
          .update(patch)
          .eq("id", row.id);
        if (upErr) throw upErr;
      }
      prodUpdated++;
    }

    offset += rows.length;
    if (rows.length < pageLimit) break;
  }

  console.log("\nDone.");
  console.log(`  Categories scanned/updated: ${categories?.length ?? 0} / ${catUpdated}`);
  console.log(`  Products scanned/updated:   ${scanned} / ${prodUpdated}`);
  if (dryRun) {
    console.log("\nRe-run without --dry-run to apply changes.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
