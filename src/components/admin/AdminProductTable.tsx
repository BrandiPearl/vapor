"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/site";

export function AdminProductTable({
  products,
  initialQuery = "",
}: {
  products: Product[];
  initialQuery?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(initialQuery);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query),
    );
  }, [products, q]);

  const submitSearch = (value: string) => {
    const next = value.trim();
    const params = new URLSearchParams();
    if (next) params.set("q", next);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div>
      <form
        className="mb-4 flex flex-wrap items-center justify-between gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch(q);
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, brand, or slug…"
          className="w-full max-w-sm rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-soft"
          >
            Search
          </button>
          <p className="text-sm text-muted">{filtered.length} shown</p>
        </div>
      </form>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white px-6 py-16 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand">
            No products match your search
          </h2>
          <p className="mt-2 text-sm text-muted">
            Search by product name to load matching rows from the database.
          </p>
          <button
            type="button"
            onClick={() => {
              setQ("");
              submitSearch("");
            }}
            className="mt-5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-soft"
          >
            Clear search
          </button>
        </div>
      ) : (
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="max-h-[70vh] overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-[#f3f5f3] text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={p.image}
                        alt=""
                        width={48}
                        height={48}
                        unoptimized={p.image.startsWith("http")}
                        className="h-12 w-12 rounded bg-[#eef2ef] object-contain"
                      />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{p.brand}</td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {p.onSale && (
                        <span className="rounded bg-red-50 px-1.5 py-0.5 font-medium text-sale">
                          Sale
                        </span>
                      )}
                      {p.bestSeller && (
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-medium text-emerald-800">
                          Best
                        </span>
                      )}
                      {!p.inStock && (
                        <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-medium text-zinc-600">
                          OOS
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="font-medium text-accent hover:underline"
                    >
                      Edit
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
