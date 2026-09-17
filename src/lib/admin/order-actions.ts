"use server";

import { requireAdmin } from "@/lib/admin/auth";
import {
  createAdminClient,
  hasServiceRoleKey,
  SERVICE_ROLE_HELP,
} from "@/lib/supabase/admin";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/admin/orders";

export async function updateOrderStatusAction(id: string, status: string) {
  await requireAdmin();
  if (!hasServiceRoleKey()) {
    return { ok: false as const, error: SERVICE_ROLE_HELP };
  }

  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    return { ok: false as const, error: "Unknown status." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    return {
      ok: false as const,
      error:
        error.code === "42P01"
          ? "Orders table missing. Run supabase/schema-orders-visits.sql in Supabase."
          : error.message,
    };
  }

  return { ok: true as const };
}
