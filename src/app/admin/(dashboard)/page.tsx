import Link from "next/link";
import { createAdminReadClient } from "@/lib/supabase/admin";
import { AdminNotice } from "@/components/admin/AdminNotice";

export default async function AdminHomePage() {
  let total = 0;
  let onSale = 0;
  let outOfStock = 0;
  let failure: string | null = null;

  try {
    const admin = createAdminReadClient();
    const [totalRes, onSaleRes, outOfStockRes] = await Promise.all([
      admin.from("products").select("*", { count: "exact", head: true }),
      admin
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("on_sale", true),
      admin
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("in_stock", false),
    ]);
    total = totalRes.count ?? 0;
    onSale = onSaleRes.count ?? 0;
    outOfStock = outOfStockRes.count ?? 0;
  } catch (err) {
    console.error("admin dashboard counts", err);
    failure = err instanceof Error ? err.message : String(err);
  }

  const cards = [
    { label: "Products", value: total ?? 0 },
    { label: "On sale", value: onSale ?? 0 },
    { label: "Out of stock", value: outOfStock ?? 0 },
  ];

  return (
    <div>
      {failure && (
        <AdminNotice
          tone="error"
          title="Could not read the catalogue counts."
          detail={failure}
        />
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-brand">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage Aussie Cloud Vape catalogue and media.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-soft"
        >
          Add product
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-muted">{card.label}</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-brand">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-brand">Quick links</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link
              href="/admin/products"
              className="font-medium text-accent hover:underline"
            >
              Browse all products
            </Link>
          </li>
          <li>
            <Link href="/shop" className="font-medium text-accent hover:underline">
              Open storefront shop
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
