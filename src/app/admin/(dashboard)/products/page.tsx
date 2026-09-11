import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapDbProduct, PRODUCT_COLUMNS } from "@/lib/catalog";
import type { DbProduct } from "@/lib/types";
import { AdminProductTable } from "@/components/admin/AdminProductTable";

function escapeIlike(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminProductsPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const admin = createAdminClient();

  let request = admin
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("name")
    .limit(80);

  if (query) {
    const safe = escapeIlike(query);
    request = request.or(
      `name.ilike.%${safe}%,slug.ilike.%${safe}%,brand.ilike.%${safe}%`,
    );
  }

  const { data, error } = await request;
  if (error) {
    throw new Error(error.message);
  }

  const products = (data as DbProduct[]).map(mapDbProduct);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-brand">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted">
            Search the catalogue, then open a product to edit price and media.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-soft"
        >
          Add product
        </Link>
      </div>
      <AdminProductTable products={products} initialQuery={query} />
    </div>
  );
}
