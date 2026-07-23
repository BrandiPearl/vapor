"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

const sortOptions = [
  { value: "default", label: "Default sorting" },
  { value: "popularity", label: "Sort by popularity" },
  { value: "name-asc", label: "Sort by name: A-Z" },
  { value: "price-asc", label: "Sort by price: low to high" },
  { value: "price-desc", label: "Sort by price: high to low" },
];

export function ShopClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sort, setSort] = useState(searchParams.get("sort") || "default");
  const [brand, setBrand] = useState(searchParams.get("brand") || "all");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setSort(searchParams.get("sort") || "default");
    setBrand(searchParams.get("brand") || "all");
    setCategory(searchParams.get("category") || "all");
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const syncUrl = (next: {
    sort?: string;
    brand?: string;
    category?: string;
    q?: string;
  }) => {
    const params = new URLSearchParams();
    const s = next.sort ?? sort;
    const b = next.brand ?? brand;
    const c = next.category ?? category;
    const q = next.q ?? query;

    if (s && s !== "default") params.set("sort", s);
    if (b && b !== "all") params.set("brand", b);
    if (c && c !== "all") params.set("category", c);
    if (q.trim()) params.set("q", q.trim());

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const brands = useMemo(
    () => [
      "all",
      ...Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort(),
    ],
    [products],
  );

  const categories = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(products.map((p) => p.category).filter(Boolean)),
      ).sort(),
    ],
    [products],
  );

  const filtered = useMemo(() => {
    let list = [...products];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    if (brand !== "all") {
      list = list.filter(
        (p) => p.brand.toLowerCase() === brand.toLowerCase(),
      );
    }
    if (category !== "all") {
      list = list.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      );
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "popularity":
        list.sort(
          (a, b) =>
            Number(b.bestSeller) - Number(a.bestSeller) ||
            Number(b.onSale) - Number(a.onSale) ||
            a.price - b.price,
        );
        break;
      default:
        break;
    }
    return list;
  }, [products, sort, brand, category, query]);

  const clearFilters = () => {
    setSort("default");
    setBrand("all");
    setCategory("all");
    setQuery("");
    router.replace(pathname, { scroll: false });
  };

  const hasFilters =
    brand !== "all" || category !== "all" || query.trim() || sort !== "default";

  return (
    <div className="container-site py-8 md:py-14">
      <div className="mb-6 sm:mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Catalogue
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-brand sm:text-4xl">
          Shop All
        </h1>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-white p-3 shadow-sm sm:mb-8 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
          <p className="text-sm text-muted">
            Showing {filtered.length} of {products.length} results
          </p>
          <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                syncUrl({ q: e.target.value });
              }}
              placeholder="Search products…"
              className="min-h-11 w-full rounded-md border border-border bg-[#f3f5f3] px-3 py-2.5 text-base outline-none focus:border-accent sm:min-w-[180px] sm:flex-1 sm:text-sm md:flex-none"
            />
            <select
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                syncUrl({ brand: e.target.value });
              }}
              className="min-h-11 w-full rounded-md border border-border bg-[#f3f5f3] px-3 py-2.5 text-base outline-none focus:border-accent sm:w-auto sm:text-sm"
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b === "all" ? "All brands" : b}
                </option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                syncUrl({ category: e.target.value });
              }}
              className="min-h-11 w-full rounded-md border border-border bg-[#f3f5f3] px-3 py-2.5 text-base outline-none focus:border-accent sm:w-auto sm:text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All categories" : c}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                syncUrl({ sort: e.target.value });
              }}
              className="min-h-11 w-full rounded-md border border-border bg-[#f3f5f3] px-3 py-2.5 text-base outline-none focus:border-accent sm:w-auto sm:text-sm"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white px-6 py-16 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-brand">
            No products found
          </h2>
          <p className="mt-2 text-sm text-muted">
            Try a different search or clear your filters.
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-soft"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
