import Link from "next/link";
import {
  createAdminClient,
  createAdminReadClient,
  hasServiceRoleKey,
  SERVICE_ROLE_HELP,
} from "@/lib/supabase/admin";
import {
  formatOrderWhen,
  orderChannel,
  orderCustomerName,
  statusTone,
  type OrderRecord,
} from "@/lib/admin/orders";
import { formatPrice } from "@/lib/site";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { clsx } from "clsx";

function startOfTodayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export default async function AdminHomePage() {
  let productTotal = 0;
  let onSale = 0;
  let outOfStock = 0;
  let orderTotal = 0;
  let ordersToday = 0;
  let revenueToday = 0;
  let pendingOrders = 0;
  let recent: OrderRecord[] = [];
  let productFailure: string | null = null;
  let orderFailure: string | null = null;

  try {
    const catalog = createAdminReadClient();
    const [totalRes, onSaleRes, outOfStockRes] = await Promise.all([
      catalog.from("products").select("*", { count: "exact", head: true }),
      catalog
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("on_sale", true),
      catalog
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("in_stock", false),
    ]);
    productTotal = totalRes.count ?? 0;
    onSale = onSaleRes.count ?? 0;
    outOfStock = outOfStockRes.count ?? 0;
  } catch (err) {
    console.error("admin dashboard product counts", err);
    productFailure = err instanceof Error ? err.message : String(err);
  }

  if (!hasServiceRoleKey()) {
    orderFailure = SERVICE_ROLE_HELP;
  } else {
    try {
      const admin = createAdminClient();
      const since = startOfTodayIso();
      const [allRes, todayRes, pendingRes, recentRes] = await Promise.all([
        admin.from("orders").select("*", { count: "exact", head: true }),
        admin
          .from("orders")
          .select("total")
          .gte("created_at", since),
        admin
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "submitted"),
        admin
          .from("orders")
          .select(
            "id, created_at, status, email, phone, customer, items, total, shipping_method, payment_preference",
          )
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

      if (allRes.error) {
        orderFailure =
          allRes.error.code === "42P01"
            ? "Orders table missing. Run supabase/schema-orders-visits.sql in Supabase."
            : allRes.error.message;
      } else {
        orderTotal = allRes.count ?? 0;
        ordersToday = todayRes.data?.length ?? 0;
        revenueToday = (todayRes.data || []).reduce(
          (sum, row) => sum + Number(row.total || 0),
          0,
        );
        pendingOrders = pendingRes.count ?? 0;
        recent = (recentRes.data || []) as OrderRecord[];
      }
    } catch (err) {
      console.error("admin dashboard orders", err);
      orderFailure = err instanceof Error ? err.message : String(err);
    }
  }

  const kpis = [
    {
      label: "Orders today",
      value: String(ordersToday),
      hint: formatPrice(revenueToday) + " revenue",
      href: "/admin/orders",
    },
    {
      label: "Awaiting action",
      value: String(pendingOrders),
      hint: "status: submitted",
      href: "/admin/orders",
    },
    {
      label: "All orders",
      value: String(orderTotal),
      hint: "saved in Supabase",
      href: "/admin/orders",
    },
    {
      label: "Catalogue",
      value: String(productTotal),
      hint: `${onSale} on sale · ${outOfStock} OOS`,
      href: "/admin/products",
    },
  ];

  return (
    <div>
      {(productFailure || orderFailure) && (
        <AdminNotice
          tone="error"
          title="Some dashboard data could not load."
          detail={[productFailure, orderFailure].filter(Boolean).join(" · ")}
        />
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Operations
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold text-brand">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            Orders, catalogue health, and shortcuts for Aussie Cloud Vape.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/orders"
            className="rounded-md border border-border bg-white px-4 py-2.5 text-sm font-semibold hover:border-accent"
          >
            View orders
          </Link>
          <Link
            href="/admin/products/new"
            className="rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-soft"
          >
            Add product
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-border bg-white p-5 shadow-sm transition hover:border-accent"
          >
            <p className="text-sm font-medium text-muted">{card.label}</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-brand">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-muted">{card.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold text-brand">Recent orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-accent hover:underline"
            >
              See all
            </Link>
          </div>

          {orderFailure ? (
            <p className="px-5 py-10 text-center text-sm text-muted">
              Orders unavailable until the service-role key and orders table are
              in place.
            </p>
          ) : recent.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted">
              No orders yet. New checkouts will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-[#f7f8f6]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {orderCustomerName(order)}
                      </p>
                      <p className="text-xs text-muted">
                        {formatOrderWhen(order.created_at)} ·{" "}
                        <span className="capitalize">
                          {orderChannel(order)}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={clsx(
                          "rounded px-1.5 py-0.5 text-xs font-medium capitalize",
                          statusTone(order.status),
                        )}
                      >
                        {order.status}
                      </span>
                      <span className="font-semibold">
                        {formatPrice(Number(order.total))}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-brand">Catalogue</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Products</dt>
                <dd className="font-semibold">{productTotal}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">On sale</dt>
                <dd className="font-semibold">{onSale}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Out of stock</dt>
                <dd className="font-semibold">{outOfStock}</dd>
              </div>
            </dl>
            <Link
              href="/admin/products"
              className="mt-5 inline-block text-sm font-medium text-accent hover:underline"
            >
              Manage products
            </Link>
          </section>

          <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-brand">Shortcuts</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/admin/settings"
                  className="font-medium text-accent hover:underline"
                >
                  Store settings
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="font-medium text-accent hover:underline"
                >
                  Open storefront
                </Link>
              </li>
              <li>
                <Link
                  href="/checkout"
                  className="font-medium text-accent hover:underline"
                >
                  Preview checkout
                </Link>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
