"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

type Props = {
  products: Product[];
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
};

export function ProductCarousel({
  products,
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View all",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  if (!products.length) return null;

  const scroll = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="relative">
      <div className="mb-4 flex items-end justify-between gap-3 sm:mb-6 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-brand sm:text-2xl md:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 max-w-2xl text-sm text-muted md:text-base">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="mr-1 hidden text-sm font-semibold text-accent hover:underline sm:inline"
            >
              {viewAllLabel}
            </Link>
          )}
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-brand transition hover:border-brand hover:bg-brand hover:text-white sm:h-11 sm:w-11"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-brand transition hover:border-brand hover:bg-brand hover:text-white sm:h-11 sm:w-11"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div ref={ref} className="product-scroll">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {viewAllHref && (
        <div className="mt-4 sm:hidden">
          <Link
            href={viewAllHref}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-accent hover:underline"
          >
            {viewAllLabel} →
          </Link>
        </div>
      )}
    </section>
  );
}
