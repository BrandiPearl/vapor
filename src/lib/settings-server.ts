import { createPublicClient } from "@/lib/catalog";
import {
  DEFAULT_SETTINGS,
  normalizeSettings,
  type SiteSettings,
} from "@/lib/settings";

/**
 * Reads the editable storefront settings with the anon key. Any failure —
 * including the table not existing before `supabase/schema-settings.sql` is
 * applied — falls back to the compiled defaults rather than breaking checkout.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  return (await readSiteSettings()).settings;
}

/** Same read, but tells the admin why it fell back to defaults. */
export async function readSiteSettings(): Promise<{
  settings: SiteSettings;
  error: string | null;
}> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("data")
      .eq("id", "default")
      .maybeSingle();

    if (error) {
      return {
        settings: DEFAULT_SETTINGS,
        error:
          error.code === "42P01"
            ? "Settings table missing. Run supabase/schema-settings.sql in the Supabase SQL Editor."
            : error.message,
      };
    }

    if (!data) return { settings: DEFAULT_SETTINGS, error: null };
    return { settings: normalizeSettings(data.data), error: null };
  } catch (err) {
    return {
      settings: DEFAULT_SETTINGS,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
