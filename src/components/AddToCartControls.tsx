"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-store";
import { QtyStepper } from "@/components/cart/QtyStepper";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export function AddToCartControls({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const cartQty = useCart(
    (s) => s.items.find((i) => i.product.id === product.id)?.quantity ?? 0,
  );
  const hasHydrated = useCart((s) => s.hasHydrated);
  const inStock = product.inStock !== false;

  return (
    <div className="mt-8 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <QtyStepper
          value={qty}
          onChange={setQty}
          disabled={!inStock}
          className="w-full justify-between sm:w-auto"
        />
        <AddToCartButton
          product={product}
          quantity={qty}
          className="w-full sm:w-auto sm:min-w-[12rem]"
          onAdded={() => setQty(1)}
        />
      </div>
      {hasHydrated && cartQty > 0 && (
        <p className="text-sm text-muted">
          <span className="font-semibold text-accent">{cartQty}</span> already in
          your cart
        </p>
      )}
    </div>
  );
}
