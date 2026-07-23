/**
 * Download product images from source URLs and upload to Supabase Storage.
 * Resumable: skips products already pointing at our bucket.
 *
 * Usage:
 *   npm run products:migrate-images
 *   npm run products:migrate-images -- --limit=20
 */
import { config } from "dotenv";
import { resolve, extname } from "path";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

config({ path: resolve(process.cwd(), ".env.local") });

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "products";
const CONCURRENCY = Number(process.env.MIGRATE_CONCURRENCY || 2);
const MAX_RETRIES = 3;

type ProductRow = {
  id: string;
  slug: string;
  image_url: string | null;
  image_path: string | null;
  metadata: {
    source_images?: string[];
    image_urls?: string[];
  } | null;
};

function parseArgs() {
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  return {
    limit: limitArg ? Number(limitArg.split("=")[1]) : null,
  };
}

function extFromUrl(url: string) {
  try {
    const pathname = new URL(url).pathname;
    const ext = extname(pathname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(ext)) {
      return ext;
    }
  } catch {
    // ignore
  }
  return ".jpg";
}

function contentType(ext: string) {
  switch (ext) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "image/jpeg";
  }
}

function objectKey(slug: string, sourceUrl: string, index: number) {
  const hash = createHash("sha1").update(sourceUrl).digest("hex").slice(0, 10);
  const ext = extFromUrl(sourceUrl);
  return `${slug}/${index}-${hash}${ext}`;
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function download(url: string): Promise<Buffer> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(45_000),
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; AussieCloudVapeImporter/1.0)",
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
          Referer: "https://vapesshopaustralia.com/",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      lastError = err;
      await sleep(500 * attempt * attempt);
    }
  }
  throw lastError;
}

async function mapPool<T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>,
) {
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      await fn(items[i]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
}

async function fetchAllProducts(
  supabase: ReturnType<typeof createClient>,
  limit: number | null,
) {
  if (limit) {
    const { data, error } = await supabase
      .from("products")
      .select("id, slug, image_url, image_path, metadata")
      .order("slug")
      .limit(limit);
    if (error) throw error;
    return (data || []) as ProductRow[];
  }

  const pageSize = 1000;
  const all: ProductRow[] = [];
  for (let from = 0; ; from += pageSize) {
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from("products")
      .select("id, slug, image_url, image_path, metadata")
      .order("slug")
      .range(from, to);
    if (error) throw error;
    if (!data?.length) break;
    all.push(...(data as ProductRow[]));
    if (data.length < pageSize) break;
  }
  return all;
}

async function main() {
  const { limit } = parseArgs();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const products = await fetchAllProducts(supabase, limit);
  console.log(`Loaded ${products.length} products`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  let done = 0;

  await mapPool(products, CONCURRENCY, async (product) => {
    done++;
    const sources = product.metadata?.source_images?.filter(Boolean) ?? [];
    if (!sources.length) {
      skipped++;
      return;
    }

    if (product.image_url?.includes(".supabase.co/storage/")) {
      skipped++;
      return;
    }

    const uploadedUrls: string[] = [];
    let primaryPath: string | null = null;

    for (let i = 0; i < sources.length; i++) {
      const sourceUrl = sources[i];
      const path = objectKey(product.slug, sourceUrl, i);

      try {
        const buf = await download(sourceUrl);
        const ext = extFromUrl(sourceUrl);
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, buf, {
            contentType: contentType(ext),
            upsert: true,
          });
        if (upErr) throw upErr;
        uploaded++;
      } catch (err) {
        failed++;
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`FAIL ${product.slug} [${i}] ${msg}`);
        continue;
      }

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      uploadedUrls.push(pub.publicUrl);
      if (i === 0) primaryPath = path;
    }

    if (!uploadedUrls.length) return;

    const { error: updateErr } = await supabase
      .from("products")
      .update({
        image_path: primaryPath,
        image_url: uploadedUrls[0],
        metadata: {
          ...(product.metadata || {}),
          source_images: sources,
          image_urls: uploadedUrls,
        },
      })
      .eq("id", product.id);

    if (updateErr) {
      failed++;
      console.error(`DB update fail ${product.slug}`, updateErr.message);
      return;
    }

    console.log(
      `[${done}/${products.length}] OK ${product.slug} (${uploadedUrls.length})`,
    );
  });

  console.log(
    `\nDone. uploaded=${uploaded} skipped=${skipped} failed=${failed}`,
  );
  if (failed > 0) {
    console.log(
      "Tip: source host may be blocking this network. Re-run later; script is resumable.",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
