import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Serves the pages prerendered at build time straight from Workers static
// assets. This cache is read-only, so nothing revalidates at runtime and the
// catalogue only changes when the site is rebuilt — see README.
//
// To restore on-demand revalidation, enable R2 on the account and swap this for
// `@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache`,
// re-adding the NEXT_INC_CACHE_R2_BUCKET binding in wrangler.jsonc.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
