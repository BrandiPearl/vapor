import Link from "next/link";
import {
  createAdminClient,
  hasServiceRoleKey,
  SERVICE_ROLE_HELP,
} from "@/lib/supabase/admin";
import {
  formatOrderWhen,
  orderChannel,
  orderCustomerName,
  statusTone,
  summarizeItems,
  type OrderRecord,
} from "@/lib/admin/orders";
import { formatPrice } from "@/lib/site";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { clsx } from "clsx";

export default async function AdminOrdersPage() {
  if (!hasServiceRoleKey()) {
    return (
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-brand">
          Orders
        </h1>
        <div className="mt-6">
          <AdminNotice
            tone="error"
            title="Orders need the service-role key."
            detail={SERVICE_ROLE_HELP}
          />
        </div>
      </div>
    );
  }

  let orders: OrderRecord[] = [];
  let failure: string | null = null;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("orders")
      .select(
        "id, created_at, status, email, phone, customer, billing, shipping, items, subtotal, shipping_price, total, shipping_method, payment_preference, coupon, notes, whatsapp_message",
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      failure =
        error.code === "42P01"
          ? "Orders table missing. Run supabase/schema-orders-visits.sql in the Supabase SQL Editor."
          : error.message;
    } else {
      orders = (data || []) as OrderRecord[];
    }
  } catch (err) {
    failure = err instanceof Error ? err.message : String(err);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-brand">
            Orders
          </h1>
          <p className="mt-1 text-sm text-muted">
            Latest {orders.length} checkout submissions saved to Supabase.
          </p>
        </div>
      </div>

      {failure && (
        <AdminNotice
          tone="error"
          title="Could not load orders."
          detail={failure}
        />
      )}

      {!failure && orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white px-6 py-16 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand">
            No orders yet
          </h2>
          <p className="mt-2 text-sm text-muted">
            When a customer places an order on WhatsApp, Telegram, or Email, it
            will show up here — if the service-role key is set and the orders
            table exists.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="max-h-[70vh] overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 bg-[#f3f5f3] text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-border">
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {formatOrderWhen(order.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{orderCustomerName(order)}</p>
                      <p className="text-xs text-muted">{order.email}</p>
                    </td>
                    <td className="px-4 py-3 capitalize text-muted">
                      {orderChannel(order)}
                    </td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-muted">
                      {summarizeItems(order.items)}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {formatPrice(Number(order.total))}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx(
                          "rounded px-1.5 py-0.5 text-xs font-medium capitalize",
                          statusTone(order.status),
                        )}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-accent hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
