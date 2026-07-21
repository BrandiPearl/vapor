"use client";

import { useMemo, useState } from "react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

const sortOptions = [
  { value: "default", label: "Default sorting" },
  { value: "popularity", label: "Sort by popularity" },
  { value: "latest", label: "Sort by latest" },
  { value: "price-asc", label: "Sort by price: low to high" },
  { value: "price-desc", label: "Sort by price: high to low" },
];

export default function ShopPage() {
  const [sort, setSort] = useState("default");
  const [brand, setBrand] = useState("all");

  const brands = useMemo(
    () => ["all", ...Array.from(new Set(products.map((p) => p.brand))).sort()],
    [],
  );

  const filtered = useMemo(() => {
    let list = [...products];
    if (brand !== "all") {
      list = list.filter((p) => p.brand === brand);
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "latest":
        list.reverse();
        break;
      case "popularity":
        list.sort(
          (a, b) => Number(b.bestSeller) - Number(a.bestSeller) || a.price - b.price,
        );
        break;
      default:
        break;
    }
    return list;
  }, [sort, brand]);

  return (
    <div className="container-site py-10 md:py-14">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Catalogue
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-brand">
          Shop All
        </h1>
      </div>

      <div className="mb-8 flex flex-col gap-4 border-y border-border bg-surface px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Showing 1–{filtered.length} of {filtered.length} results
        </p>
        <div className="flex flex-wrap gap-3">
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b === "all" ? "All brands" : b}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
