"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-store";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const addItem = useCart((s) => s.addItem);

  return (
    <article className="group relative flex h-full flex-col bg-surface text-center transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(11,31,26,0.1)]">
      <div className="relative overflow-hidden bg-[#f4f4f2]">
        {product.onSale && (
          <span className="absolute left-3 top-3 z-10 rounded-sm bg-sale px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Sale!
          </span>
        )}
        <button
          type="button"
          onClick={() => addItem(product)}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand opacity-0 shadow transition group-hover:opacity-100"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
        <Link href={`/product/${product.slug}`} className="block p-4">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="mx-auto h-auto w-full max-w-[240px] transition duration-500 group-hover:scale-[1.04]"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-3 pb-5 pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          {product.category}
        </p>
        <Link href={`/product/${product.slug}`} className="mt-1.5 flex-1">
          <h3 className="text-sm font-semibold leading-snug text-foreground transition group-hover:text-accent">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm">
          {product.compareAtPrice != null && (
            <span className="text-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <span className="font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => addItem(product)}
          className="mt-4 w-full rounded-md bg-brand px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-brand-soft"
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
