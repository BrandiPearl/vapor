import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "products";

async function main() {
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase URL or service role key in .env.local");
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("Connecting to", url);

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  const exists = buckets?.some((b) => b.name === bucket);
  if (exists) {
    console.log(`Bucket "${bucket}" already exists`);
  } else {
    const { error } = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
    });
    if (error) throw error;
    console.log(`Created public bucket "${bucket}"`);
  }

  const { error: pingError } = await supabase.from("products").select("id").limit(1);
  if (pingError) {
    console.log(
      "\nTables not ready yet. Run supabase/schema.sql in the Supabase SQL Editor, then re-run this script.",
    );
    console.log("DB check:", pingError.message);
  } else {
    console.log("Products table OK");
  }

  console.log("\nSupabase setup check complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
