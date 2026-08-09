import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// R2 backs the ISR cache so `revalidate` and the admin panel's revalidatePath()
// calls actually reach the storefront. Requires the NEXT_INC_CACHE_R2_BUCKET
// binding in wrangler.jsonc.
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
