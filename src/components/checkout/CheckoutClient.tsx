"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FormEvent,
  useState,
  type ChangeEvent,
} from "react";
import { Lock, MessageCircle } from "lucide-react";
import { formatPrice } from "@/lib/site";
import {
  selectCartCount,
  selectCartSubtotal,
  useCart,
} from "@/lib/cart-store";
import {
  AU_STATES,
  PAYMENT_OPTIONS,
  SHIPPING_OPTIONS,
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  getShippingPrice,
  type CheckoutFormData,
  type PaymentId,
  type ShippingId,
} from "@/lib/checkout";
import { clsx } from "clsx";

const initialForm: CheckoutFormData = {
  email: "",
  firstName: "",
  lastName: "",
  country: "Australia",
  address1: "",
  address2: "",
  city: "",
  state: AU_STATES[0],
  postcode: "",
  phone: "",
  shipDifferent: false,
  shipFirstName: "",
  shipLastName: "",
  shipAddress1: "",
  shipAddress2: "",
  shipCity: "",
  shipState: AU_STATES[0],
  shipPostcode: "",
  notes: "",
  shipping: "standard",
  payment: "bank",
  coupon: "",
};

const fieldClass =
  "w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-accent";

export function CheckoutClient() {
  const items = useCart((s) => s.items);
  const hasHydrated = useCart((s) => s.hasHydrated);
  const clearCart = useCart((s) => s.clearCart);
  const subtotal = useCart(selectCartSubtotal);
  const count = useCart(selectCartCount);
  const [form, setForm] = useState<CheckoutFormData>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [couponNote, setCouponNote] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const shippingPrice = getShippingPrice(form.shipping);
  const total = subtotal + shippingPrice;

  const set =
    (key: keyof CheckoutFormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
    };

  if (!hasHydrated) {
    return (
      <div className="container-site flex min-h-[40vh] items-center justify-center py-20">
        <p className="text-sm text-muted">Loading checkout…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-site flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-brand">
          Nothing to check out
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted">
          Your cart is empty. Add products, then return here to place your order
          on WhatsApp.
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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const required: (keyof CheckoutFormData)[] = [
      "email",
      "firstName",
      "lastName",
      "address1",
      "city",
      "state",
      "postcode",
      "phone",
    ];
    for (const key of required) {
      if (!String(form[key]).trim()) {
        setError("Please fill in all required billing fields.");
        return;
      }
    }
    if (form.shipDifferent) {
      const shipRequired: (keyof CheckoutFormData)[] = [
        "shipFirstName",
        "shipLastName",
        "shipAddress1",
        "shipCity",
        "shipState",
        "shipPostcode",
      ];
      for (const key of shipRequired) {
        if (!String(form[key]).trim()) {
          setError("Please fill in all required shipping fields.");
          return;
        }
      }
    }

    const message = buildWhatsAppOrderMessage({
      form,
      items,
      subtotal,
      shippingPrice,
      total,
    });

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form,
          items,
          subtotal,
          shippingPrice,
          total,
          whatsappMessage: message,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Could not save your order. Please try again.");
        setSubmitting(false);
        return;
      }

      const url = buildWhatsAppUrl(message);
      window.open(url, "_blank", "noopener,noreferrer");
      clearCart();
    } catch {
      setError("Could not save your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#e8efe9]">
      <div className="container-site py-8 md:py-12">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Checkout
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-brand sm:text-4xl">
            Place your order
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            No card payments on this site. Complete your details and we will
            open WhatsApp with your order so our team can confirm and send
            payment instructions.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start"
        >
          <div className="space-y-8 rounded-xl border border-border/70 bg-[#f3f7f4] p-5 shadow-sm sm:p-8">
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand">
                Contact
              </h2>
              <label className="mt-4 block text-sm">
                <span className="mb-1.5 block font-medium">
                  Email Address <span className="text-sale">*</span>
                </span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  className={fieldClass}
                  autoComplete="email"
                />
              </label>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand">
                Billing details
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium">
                    First name <span className="text-sale">*</span>
                  </span>
                  <input
                    required
                    value={form.firstName}
                    onChange={set("firstName")}
                    className={fieldClass}
                    autoComplete="given-name"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium">
                    Last name <span className="text-sale">*</span>
                  </span>
                  <input
                    required
                    value={form.lastName}
                    onChange={set("lastName")}
                    className={fieldClass}
                    autoComplete="family-name"
                  />
                </label>
              </div>

              <label className="mt-3 block text-sm">
                <span className="mb-1.5 block font-medium">Country</span>
                <select
                  value={form.country}
                  onChange={set("country")}
                  className={fieldClass}
                >
                  <option>Australia</option>
                </select>
              </label>

              <label className="mt-3 block text-sm">
                <span className="mb-1.5 block font-medium">
                  Street address <span className="text-sale">*</span>
                </span>
                <input
                  required
                  value={form.address1}
                  onChange={set("address1")}
                  placeholder="House number and street name"
                  className={fieldClass}
                  autoComplete="address-line1"
                />
              </label>
              <input
                value={form.address2}
                onChange={set("address2")}
                placeholder="Apartment, suite, unit, etc. (optional)"
                className={clsx(fieldClass, "mt-2")}
                autoComplete="address-line2"
              />

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <label className="block text-sm sm:col-span-1">
                  <span className="mb-1.5 block font-medium">
                    Town / City <span className="text-sale">*</span>
                  </span>
                  <input
                    required
                    value={form.city}
                    onChange={set("city")}
                    className={fieldClass}
                    autoComplete="address-level2"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium">
                    State <span className="text-sale">*</span>
                  </span>
                  <select
                    required
                    value={form.state}
                    onChange={set("state")}
                    className={fieldClass}
                    autoComplete="address-level1"
                  >
                    {AU_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium">
                    Postcode <span className="text-sale">*</span>
                  </span>
                  <input
                    required
                    value={form.postcode}
                    onChange={set("postcode")}
                    className={fieldClass}
                    autoComplete="postal-code"
                  />
                </label>
              </div>

              <label className="mt-3 block text-sm">
                <span className="mb-1.5 block font-medium">
                  Phone <span className="text-sale">*</span>
                </span>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  className={fieldClass}
                  autoComplete="tel"
                />
              </label>

              <label className="mt-4 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.shipDifferent}
                  onChange={set("shipDifferent")}
                  className="h-4 w-4 rounded border-border accent-[var(--accent)]"
                />
                Ship to a different address?
              </label>

              {form.shipDifferent && (
                <div className="mt-4 space-y-3 rounded-lg border border-border bg-white/70 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-sm">
                      <span className="mb-1.5 block font-medium">
                        First name <span className="text-sale">*</span>
                      </span>
                      <input
                        value={form.shipFirstName}
                        onChange={set("shipFirstName")}
                        className={fieldClass}
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-1.5 block font-medium">
                        Last name <span className="text-sale">*</span>
                      </span>
                      <input
                        value={form.shipLastName}
                        onChange={set("shipLastName")}
                        className={fieldClass}
                      />
                    </label>
                  </div>
                  <input
                    value={form.shipAddress1}
                    onChange={set("shipAddress1")}
                    placeholder="Street address"
                    className={fieldClass}
                  />
                  <input
                    value={form.shipAddress2}
                    onChange={set("shipAddress2")}
                    placeholder="Apartment, suite, unit (optional)"
                    className={fieldClass}
                  />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input
                      value={form.shipCity}
                      onChange={set("shipCity")}
                      placeholder="Town / City"
                      className={fieldClass}
                    />
                    <select
                      value={form.shipState}
                      onChange={set("shipState")}
                      className={fieldClass}
                    >
                      {AU_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <input
                      value={form.shipPostcode}
                      onChange={set("shipPostcode")}
                      placeholder="Postcode"
                      className={fieldClass}
                    />
                  </div>
                </div>
              )}

              <label className="mt-4 block text-sm">
                <span className="mb-1.5 block font-medium">Order notes</span>
                <textarea
                  value={form.notes}
                  onChange={set("notes")}
                  rows={4}
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  className={clsx(fieldClass, "resize-y")}
                />
              </label>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand">
                Shipping
              </h2>
              <div className="mt-4 space-y-2">
                {SHIPPING_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={clsx(
                      "flex cursor-pointer items-center justify-between gap-3 rounded-md border bg-white px-4 py-3 text-sm transition",
                      form.shipping === opt.id
                        ? "border-accent ring-1 ring-accent/30"
                        : "border-border",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={form.shipping === opt.id}
                        onChange={() =>
                          setForm((f) => ({
                            ...f,
                            shipping: opt.id as ShippingId,
                          }))
                        }
                        className="accent-[var(--accent)]"
                      />
                      {opt.label}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(opt.price)}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand">
                Payment
              </h2>
              <p className="mt-1 text-sm text-muted">
                Choose how you prefer to pay. Details are arranged on WhatsApp.
              </p>
              <div className="mt-4 space-y-2">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={clsx(
                      "flex cursor-pointer items-start gap-3 rounded-md border bg-white px-4 py-3 text-sm transition",
                      form.payment === opt.id
                        ? "border-accent ring-1 ring-accent/30"
                        : "border-border",
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={form.payment === opt.id}
                      onChange={() =>
                        setForm((f) => ({
                          ...f,
                          payment: opt.id as PaymentId,
                        }))
                      }
                      className="mt-0.5 accent-[var(--accent)]"
                    />
                    <span>
                      <span className="font-medium">{opt.label}</span>
                      {form.payment === opt.id && (
                        <span className="mt-1 block text-muted">{opt.hint}</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <p className="text-xs leading-relaxed text-muted">
              Your personal data will be used to process your order and for
              other purposes described in our{" "}
              <Link href="/privacy" className="text-accent underline">
                privacy policy
              </Link>
              .
            </p>

            {error && (
              <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-sale">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MessageCircle className="h-4 w-4" />
              {submitting ? "Saving order…" : `Place order ${formatPrice(total)}`}
              <Lock className="h-3.5 w-3.5 opacity-80" />
            </button>
            <p className="text-center text-xs text-muted">
              Saves your order, then opens WhatsApp. No payment is taken on this
              website.
            </p>
          </div>

          <aside className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand">
              Your order
            </h2>
            <p className="mt-1 text-sm text-muted">
              {count} {count === 1 ? "item" : "items"}
            </p>

            <ul className="mt-5 divide-y divide-border">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-3 py-3 first:pt-0">
                  <div className="relative shrink-0">
                    <Image
                      src={product.image}
                      alt=""
                      width={64}
                      height={64}
                      unoptimized={product.image.startsWith("http")}
                      className="h-16 w-16 rounded-md bg-[#eef2ef] object-contain"
                    />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                      {quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug text-foreground">
                      {product.name}
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {formatPrice(product.price * quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex gap-2">
              <input
                value={form.coupon}
                onChange={set("coupon")}
                placeholder="Coupon code"
                className={clsx(fieldClass, "flex-1")}
              />
              <button
                type="button"
                onClick={() =>
                  setCouponNote(
                    form.coupon.trim()
                      ? "Coupon noted. We will confirm any discount on WhatsApp."
                      : "Enter a coupon code first.",
                  )
                }
                className="shrink-0 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-soft"
              >
                Apply
              </button>
            </div>
            {couponNote && (
              <p className="mt-2 text-xs text-muted">{couponNote}</p>
            )}

            <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">Shipping</span>
                <span className="text-right font-medium">
                  {
                    SHIPPING_OPTIONS.find((o) => o.id === form.shipping)
                      ?.label
                  }
                  : {formatPrice(shippingPrice)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-brand">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <Link
              href="/cart"
              className="mt-5 block text-center text-sm font-semibold text-accent hover:underline"
            >
              Back to cart
            </Link>
          </aside>
        </form>
      </div>
    </div>
  );
}
