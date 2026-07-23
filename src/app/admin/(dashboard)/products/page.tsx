import Link from "next/link";
import { getAllProducts } from "@/lib/catalog";
import { AdminProductTable } from "@/components/admin/AdminProductTable";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-brand">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted">
            Edit catalogue items and media stored in Supabase.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-soft"
        >
          Add product
        </Link>
      </div>
      <AdminProductTable products={products} />
    </div>
  );
}
