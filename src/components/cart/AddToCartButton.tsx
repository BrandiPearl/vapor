"use client";

import { useEffect, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { clsx } from "clsx";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-store";

type Props = {
  product: Product;
  quantity?: number;
  size?: "sm" | "md";
  className?: string;
  showIcon?: boolean;
  onAdded?: (qtyInCart: number) => void;
};

export function AddToCartButton({
  product,
  quantity = 1,
  size = "md",
  className,
  showIcon = true,
  onAdded,
}: Props) {
  const addItem = useCart((s) => s.addItem);
  const cartQty = useCart(
    (s) => s.items.find((i) => i.product.id === product.id)?.quantity ?? 0,
  );
  const hasHydrated = useCart((s) => s.hasHydrated);
  const [flash, setFlash] = useState(false);
  const inStock = product.inStock !== false;
  const compact = size === "sm";

  useEffect(() => {
    if (!flash) return;
    const t = window.setTimeout(() => setFlash(false), 1400);
    return () => window.clearTimeout(t);
  }, [flash]);

  const handleAdd = () => {
    if (!inStock) return;
    const next = addItem(product, quantity);
    setFlash(true);
    onAdded?.(next);
  };

  const label = !inStock
    ? "Out of stock"
    : flash
      ? "Added"
      : hasHydrated && cartQty > 0
        ? compact
          ? `In cart (${cartQty})`
          : `Add more · ${cartQty} in cart`
        : compact
          ? "Add to cart"
          : "Add to cart";

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={!inStock}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold uppercase tracking-wider transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        flash
          ? "bg-[#1f8a5b] text-white shadow-[0_0_0_1px_rgba(125,255,179,0.45)]"
          : "bg-brand text-white hover:bg-brand-soft",
        compact
          ? "min-h-10 w-full px-3 py-2 text-[11px] sm:text-xs"
          : "min-h-12 px-6 py-3 text-sm",
        className,
      )}
    >
      {showIcon &&
        (flash ? (
          <Check
            className={compact ? "h-3.5 w-3.5" : "h-4 w-4"}
            strokeWidth={2.5}
          />
        ) : (
          <ShoppingBag className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        ))}
      <span>{label}</span>
    </button>
  );
}
