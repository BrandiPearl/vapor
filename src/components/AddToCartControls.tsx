"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-store";

export function AddToCartControls({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <div className="flex items-center border border-border bg-surface">
        <button
          type="button"
          className="px-3 py-3 text-lg"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="min-w-10 text-center text-sm font-semibold">{qty}</span>
        <button
          type="button"
          className="px-3 py-3 text-lg"
          onClick={() => setQty((q) => q + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          addItem(product, qty);
          setAdded(true);
          setTimeout(() => setAdded(false), 1600);
        }}
        className="rounded-md bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-soft"
      >
        {added ? "Added!" : "Add to cart"}
      </button>
    </div>
  );
}
