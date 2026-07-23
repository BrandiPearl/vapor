import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminHomePage() {
  const admin = createAdminClient();
  const [{ count: total }, { count: onSale }, { count: outOfStock }] =
    await Promise.all([
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

  const cards = [
    { label: "Products", value: total ?? 0 },
    { label: "On sale", value: onSale ?? 0 },
    { label: "Out of stock", value: outOfStock ?? 0 },
  ];

  return (
    <div>
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
