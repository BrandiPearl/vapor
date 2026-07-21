"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-store";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-site flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-brand">
          Your cart is currently empty.
        </h1>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-md bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-soft"
        >
          Return to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container-site py-10 md:py-14">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-brand">
        Cart
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="overflow-hidden border border-border bg-surface">
          <div className="hidden grid-cols-[1.5fr_0.5fr_0.5fr_0.5fr_auto] gap-4 border-b border-border bg-background px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted md:grid">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
            <span />
          </div>
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="grid gap-4 border-b border-border px-4 py-4 last:border-b-0 md:grid-cols-[1.5fr_0.5fr_0.5fr_0.5fr_auto] md:items-center"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={product.image}
                  alt=""
                  width={72}
                  height={72}
                  className="h-16 w-16 bg-[#f4f4f2] object-cover"
                />
                <Link
                  href={`/product/${product.slug}`}
                  className="text-sm font-semibold hover:text-accent"
                >
                  {product.name}
                </Link>
              </div>
              <p className="text-sm">{formatPrice(product.price)}</p>
              <div className="flex w-fit items-center border border-border">
                <button
                  type="button"
                  className="px-2 py-1"
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                >
                  −
                </button>
                <span className="min-w-8 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  className="px-2 py-1"
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                >
                  +
                </button>
              </div>
              <p className="text-sm font-semibold">
                {formatPrice(product.price * quantity)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(product.id)}
                className="justify-self-start text-sm text-sale hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <aside className="h-fit border border-border bg-surface p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand">
            Cart totals
          </h2>
          <div className="mt-4 flex items-center justify-between border-b border-border py-3 text-sm">
            <span className="text-muted">Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal())}</span>
          </div>
          <div className="flex items-center justify-between py-3 text-base">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold">{formatPrice(subtotal())}</span>
          </div>
          <button
            type="button"
            className="mt-4 w-full rounded-md bg-accent px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-accent-hover"
          >
            Proceed to checkout
          </button>
          <button
            type="button"
            onClick={clearCart}
            className="mt-3 w-full text-sm text-muted underline-offset-2 hover:underline"
          >
            Clear cart
          </button>
        </aside>
      </div>
    </div>
  );
}
