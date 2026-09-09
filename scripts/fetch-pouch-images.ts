/**
 * Fetch og:image from snusdownunder product pages for Nicotine Pouches,
 * download into Supabase Storage, and set image_url.
 *
 * Usage: npm run products:fetch-pouch-images
 */
import { config } from "dotenv";
import { resolve, extname } from "path";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

config({ path: resolve(process.cwd(), ".env.local") });

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "products";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  image_url: string | null;
  metadata: Record<string, unknown> | null;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function extFromUrl(url: string) {
  try {
    const ext = extname(new URL(url).pathname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) return ext;
  } catch {
    // ignore
  }
  return ".webp";
}

function contentType(ext: string) {
  switch (ext) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return "image/jpeg";
  }
}

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-AU,en;q=0.9",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function extractOgImage(html: string) {
  const patterns = [
    /property=["']og:image["']\s+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["']\s+property=["']og:image["']/i,
    /og:image["']\s+content=["']([^"']+)["']/i,
  ];
  for (const pat of patterns) {
    const m = html.match(pat);
    if (m?.[1]) return m[1].replace(/&amp;/g, "&");
  }
  return null;
}

async function download(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Download ${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("Missing Supabase credentials");

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: products, error } = await supabase
    .from("products")
    .select("id, slug, name, image_url, metadata")
    .eq("category_name", "Nicotine Pouches")
    .order("brand")
    .order("name");
  if (error) throw error;

  console.log(`Found ${products!.length} nicotine pouches`);

  let ok = 0;
  let fail = 0;

  for (const product of products as ProductRow[]) {
    const meta = (product.metadata || {}) as Record<string, unknown>;
    const sourceUrl =
      (typeof meta.source_url === "string" && meta.source_url) ||
      `https://www.snusdownunder.com/product/${product.slug}/`;

    try {
      process.stdout.write(`→ ${product.slug} ... `);
      const html = await fetchHtml(sourceUrl);
      const imageUrl = extractOgImage(html);
      if (!imageUrl) {
        console.log("no og:image");
        fail++;
        await sleep(400);
        continue;
      }

      const bytes = await download(imageUrl);
      const ext = extFromUrl(imageUrl);
      const hash = createHash("sha1").update(imageUrl).digest("hex").slice(0, 10);
      const path = `pouches/${product.slug}/0-${hash}${ext}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, bytes, {
          contentType: contentType(ext),
          upsert: true,
        });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const publicUrl = pub.publicUrl;

      const nextMeta = {
        ...meta,
        source_images: [imageUrl],
        image_urls: [publicUrl],
        product_type: "nicotine_pouch",
      };

      const { error: updErr } = await supabase
        .from("products")
        .update({
          image_url: publicUrl,
          image_path: path,
          metadata: nextMeta,
        })
        .eq("id", product.id);
      if (updErr) throw updErr;

      console.log("ok");
      ok++;
      await sleep(500);
    } catch (err) {
      console.log("FAIL", err instanceof Error ? err.message : err);
      fail++;
      await sleep(800);
    }
  }

  console.log(`Done. ok=${ok} fail=${fail}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
