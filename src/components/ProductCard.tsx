"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/site";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const isRemote = product.image.startsWith("http");

  return (
    <article className="group flex h-full flex-col bg-white text-center transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(11,31,26,0.08)]">
      <div className="relative overflow-hidden bg-[#eef2ef]">
        {product.onSale && (
          <span className="absolute left-2 top-2 z-10 rounded-sm bg-sale px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white sm:left-3 sm:top-3 sm:px-2 sm:py-1 sm:text-[11px]">
            Sale!
          </span>
        )}
        <Link href={`/product/${product.slug}`} className="block p-3 sm:p-4">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            unoptimized={isRemote}
            className="mx-auto aspect-square h-auto w-full max-w-[240px] object-contain transition duration-500 group-hover:scale-[1.03]"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-3.5 pt-2.5 sm:px-3 sm:pb-5 sm:pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted sm:text-[11px] sm:tracking-[0.14em]">
          {product.category}
        </p>
        <Link href={`/product/${product.slug}`} className="mt-1 flex-1 sm:mt-1.5">
          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition group-hover:text-accent sm:text-sm">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-sm sm:mt-3 sm:gap-2">
          {product.compareAtPrice != null && (
            <span className="text-xs text-muted line-through sm:text-sm">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <span className="font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
        </div>
        <AddToCartButton
          product={product}
          size="sm"
          className="mt-3 sm:mt-4"
        />
      </div>
    </article>
  );
}
