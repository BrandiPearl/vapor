"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice } from "@/lib/site";

const POUCH_BRANDS = ["all", "ZYN", "VELO", "XQS", "PABLO", "KILLA"] as const;

export function NicotinePouchesClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [brand, setBrand] = useState(searchParams.get("brand") || "all");

  const syncBrand = (next: string) => {
    setBrand(next);
    const params = new URLSearchParams();
    if (next && next !== "all") params.set("brand", next);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const filtered = useMemo(() => {
    if (brand === "all") return products;
    return products.filter(
      (p) => p.brand.toLowerCase() === brand.toLowerCase(),
    );
  }, [products, brand]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      map.set(p.brand, (map.get(p.brand) || 0) + 1);
    }
    return map;
  }, [products]);

  return (
    <div className="container-site py-10 md:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        Tobacco-free
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-brand sm:text-4xl">
        Nicotine Pouches
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
        Shop ZYN, VELO, XQS, PABLO and KILLA nicotine pouches. Separate from our
        vape range — discreet, spit-free and ready for Australia-wide delivery.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {POUCH_BRANDS.map((b) => {
          const active = brand.toLowerCase() === b.toLowerCase();
          const count =
            b === "all" ? products.length : counts.get(b) || counts.get(b.toUpperCase()) || 0;
          return (
            <button
              key={b}
              type="button"
              onClick={() => syncBrand(b)}
              className={
                active
                  ? "rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground hover:border-accent"
              }
            >
              {b === "all" ? "All brands" : b}
              <span className="ml-1.5 text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-muted">
        Showing {filtered.length}{" "}
        {filtered.length === 1 ? "product" : "products"}
        {brand !== "all" ? ` in ${brand}` : ""}
        {filtered.length > 0
          ? ` · from ${formatPrice(Math.min(...filtered.map((p) => p.price)))}`
          : ""}
        .
      </p>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border bg-white p-10 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-brand">
            No pouches found
          </h2>
          <p className="mt-2 text-sm text-muted">
            Try another brand or check back soon.
          </p>
          <button
            type="button"
            onClick={() => syncBrand("all")}
            className="mt-6 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-soft"
          >
            View all pouches
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <p className="mt-10 max-w-3xl text-xs leading-relaxed text-muted">
        Nicotine is addictive. 18+ only. In Australia, personal importation of
        nicotine products may require a valid prescription under TGA rules.
        Confirm you meet all legal requirements before ordering.
      </p>
    </div>
  );
}
