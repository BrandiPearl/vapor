import { createClient } from "@supabase/supabase-js";
import { createPublicClient } from "@/lib/catalog";

/**
 * Cloudflare only exposes values added under "Variables and Secrets" to the
 * running Worker — build variables are inlined at build time and are gone at
 * runtime, which is why the admin can 500 while the storefront keeps working.
 */
export const SERVICE_ROLE_HELP =
  "SUPABASE_SERVICE_ROLE_KEY is missing at runtime. In Cloudflare open the Worker → Settings → Variables and Secrets, add it as a Secret, then redeploy.";

export function hasServiceRoleKey() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/** Server-only admin client. Never import this into client components. */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(SERVICE_ROLE_HELP);
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Read-only client for admin screens. Falls back to the anon key so the
 * catalogue still lists when the service role secret is absent; writes keep
 * requiring `createAdminClient`.
 */
export function createAdminReadClient() {
  return hasServiceRoleKey() ? createAdminClient() : createPublicClient();
}
