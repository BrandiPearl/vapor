import { createClient } from "@supabase/supabase-js";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createPublicClient } from "@/lib/catalog";

/**
 * Cloudflare only exposes values added under "Variables and Secrets" to the
 * running Worker — build variables are inlined at build time and are gone at
 * runtime, which is why the admin can 500 while the storefront keeps working.
 *
 * After adding a Secret you must click Deploy on that page. The name must be
 * exactly SUPABASE_SERVICE_ROLE_KEY (Secrets survive deploys; plaintext Vars
 * do not unless keep_vars is on).
 */
export const SERVICE_ROLE_HELP =
  "SUPABASE_SERVICE_ROLE_KEY is missing at runtime. In Cloudflare → Worker → Settings → Variables and Secrets, add it as a Secret named exactly SUPABASE_SERVICE_ROLE_KEY, then click Deploy on that page (saving alone is not enough).";

const WATCHED_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_WHATSAPP_NUMBER",
  "NEXT_PUBLIC_ORDER_EMAIL",
  "OWNER_NTFY_TOPIC",
] as const;

/**
 * Read a binding from process.env or, on Cloudflare, from the Worker env
 * object. OpenNext copies string bindings into process.env on the first
 * request, but Object.keys(process.env) is unreliable in workerd — always
 * probe known names, and fall back to getCloudflareContext().env.
 */
export function readEnv(name: string): string | undefined {
  const fromProcess = process.env[name];
  if (typeof fromProcess === "string" && fromProcess.length > 0) {
    return fromProcess;
  }

  try {
    const { env } = getCloudflareContext();
    const value = (env as Record<string, unknown>)[name];
    if (typeof value === "string" && value.length > 0) {
      process.env[name] = value;
      return value;
    }
  } catch {
    // Outside a Cloudflare request (e.g. some local tooling).
  }

  return undefined;
}

export function hasServiceRoleKey() {
  return Boolean(
    readEnv("NEXT_PUBLIC_SUPABASE_URL") && readEnv("SUPABASE_SERVICE_ROLE_KEY"),
  );
}

/**
 * Names only — never values. Probes known keys directly because enumerating
 * process.env on Cloudflare Workers often returns an empty list.
 */
export function describeRuntimeEnv() {
  const present: string[] = [];
  const missing: string[] = [];

  for (const key of WATCHED_ENV_KEYS) {
    if (readEnv(key)) present.push(key);
    else missing.push(key);
  }

  const parts = [
    present.length ? `present: ${present.join(", ")}` : "present: (none)",
    missing.length ? `missing: ${missing.join(", ")}` : null,
  ].filter(Boolean);

  return parts.join(" · ");
}

/** Server-only admin client. Never import this into client components. */
export function createAdminClient() {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = readEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !key) {
    throw new Error(`${SERVICE_ROLE_HELP} (${describeRuntimeEnv()})`);
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
