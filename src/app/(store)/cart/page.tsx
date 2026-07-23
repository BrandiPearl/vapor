"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/site";
import {
  selectCartCount,
  selectCartSubtotal,
  useCart,
} from "@/lib/cart-store";
import { QtyStepper } from "@/components/cart/QtyStepper";
import { RemoveFromCartButton } from "@/components/cart/RemoveFromCartButton";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const hasHydrated = useCart((s) => s.hasHydrated);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const clearCart = useCart((s) => s.clearCart);
  const total = useCart(selectCartSubtotal);
  const count = useCart(selectCartCount);

  if (!hasHydrated) {
    return (
      <div className="container-site flex min-h-[40vh] items-center justify-center py-20">
        <p className="text-sm text-muted">Loading cart…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-site flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-brand">
          Your cart is empty
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted">
          Browse the catalogue and add disposables, devices, or multipacks when
          you&apos;re ready.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-md bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-soft"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-site py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-brand sm:text-4xl">
            Cart
          </h1>
          <p className="mt-1 text-sm text-muted">
            {count} {count === 1 ? "item" : "items"}
          </p>
        </div>
        <RemoveFromCartButton
          onClick={clearCart}
          label="Clear cart"
          size="sm"
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="hidden grid-cols-[1.5fr_0.5fr_0.5fr_0.5fr_auto] gap-4 border-b border-border bg-[#f3f5f3] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted md:grid">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
            <span />
          </div>
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="grid gap-3 border-b border-border px-4 py-4 last:border-b-0 sm:gap-4 md:grid-cols-[1.5fr_0.5fr_0.5fr_0.5fr_auto] md:items-center"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={product.image}
                  alt=""
                  width={72}
                  height={72}
                  unoptimized={product.image.startsWith("http")}
                  className="h-16 w-16 shrink-0 rounded bg-[#eef2ef] object-contain"
                />
                <Link
                  href={`/product/${product.slug}`}
                  className="text-sm font-semibold hover:text-accent"
                >
                  {product.name}
                </Link>
              </div>
              <div className="flex items-center justify-between text-sm md:block">
                <span className="text-muted md:hidden">Price</span>
                <span>{formatPrice(product.price)}</span>
              </div>
              <div className="flex items-center justify-between md:block">
                <span className="text-sm text-muted md:hidden">Qty</span>
                <QtyStepper
                  size="sm"
                  value={quantity}
                  onChange={(next) => updateQuantity(product.id, next)}
                  min={0}
                />
              </div>
              <div className="flex items-center justify-between text-sm font-semibold md:block">
                <span className="font-normal text-muted md:hidden">Subtotal</span>
                <span>{formatPrice(product.price * quantity)}</span>
              </div>
              <RemoveFromCartButton
                onClick={() => removeItem(product.id)}
                iconOnly
                size="sm"
                className="justify-self-start md:justify-self-center"
              />
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand">
            Cart totals
          </h2>
          <div className="mt-4 flex items-center justify-between border-b border-border py-3 text-sm">
            <span className="text-muted">Subtotal</span>
            <span className="font-semibold">{formatPrice(total)}</span>
          </div>
          <div className="flex items-center justify-between py-3 text-base">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold">{formatPrice(total)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-4 flex w-full items-center justify-center rounded-md bg-brand px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-soft"
          >
            Proceed to checkout
          </Link>
          <p className="mt-2 text-center text-xs text-muted">
            Checkout opens WhatsApp with your order. No payments on this site.
          </p>
          <Link
            href="/shop"
            className="mt-4 block text-center text-sm font-semibold text-accent hover:underline"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
