"use server";

import { requireAdmin } from "@/lib/admin/auth";
import {
  createAdminClient,
  hasServiceRoleKey,
  SERVICE_ROLE_HELP,
} from "@/lib/supabase/admin";
import { normalizeSettings } from "@/lib/settings";

export async function updateSettingsAction(formData: FormData) {
  await requireAdmin();
  if (!hasServiceRoleKey()) {
    return { ok: false as const, error: SERVICE_ROLE_HELP };
  }

  let shippingOptions: unknown = [];
  try {
    shippingOptions = JSON.parse(String(formData.get("shippingOptions") || "[]"));
  } catch {
    return { ok: false as const, error: "Shipping options could not be read." };
  }

  const settings = normalizeSettings({
    minOrderSubtotal: Number(formData.get("minOrderSubtotal") || 0),
    shippingOptions,
    whatsappNumber: String(formData.get("whatsappNumber") || ""),
    telegramUrl: String(formData.get("telegramUrl") || ""),
    orderEmail: String(formData.get("orderEmail") || ""),
    announcement: {
      enabled: formData.get("announcementEnabled") === "on",
      text: String(formData.get("announcementText") || ""),
      href: String(formData.get("announcementHref") || ""),
    },
  });

  const admin = createAdminClient();
  const { error } = await admin.from("site_settings").upsert({
    id: "default",
    data: settings,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return {
      ok: false as const,
      error:
        error.code === "42P01"
          ? "Settings table missing. Run supabase/schema-settings.sql in the Supabase SQL Editor."
          : error.message,
    };
  }

  // The storefront reads /api/settings at runtime, so no rebuild is needed.
  return { ok: true as const, settings };
}
