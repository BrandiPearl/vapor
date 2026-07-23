"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { makeSlug } from "@/lib/admin/utils";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/site";

type Props = {
  product?: Product & {
    stockQuantity?: number;
  };
  action: (formData: FormData) => Promise<{ ok: boolean; error?: string } | void>;
  submitLabel: string;
};

export function ProductForm({ product, action, submitLabel }: Props) {
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(product?.image || null);

  const autoSlug = useMemo(() => makeSlug(name), [name]);

  return (
    <form
      className="space-y-6"
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = await action(formData);
          if (result && !result.ok) setError(result.error || "Save failed");
        });
      }}
    >
      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-sale">{error}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4 rounded-xl border border-border bg-white p-5 shadow-sm">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Name</span>
            <input
              name="name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(makeSlug(e.target.value));
              }}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Slug</span>
            <input
              name="slug"
              required
              value={slug || autoSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Brand</span>
              <input
                name="brand"
                defaultValue={product?.brand || ""}
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Category</span>
              <input
                name="category_name"
                defaultValue={product?.category || ""}
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Description</span>
            <textarea
              name="description"
              rows={6}
              defaultValue={product?.description || ""}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Tags (comma separated)</span>
            <input
              name="tags"
              defaultValue={(product?.tags || []).join(", ")}
              placeholder="BEST SELLING PRODUCTS, BULK"
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
            />
          </label>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-medium">Pricing & stock</p>
            <div className="space-y-3">
              <label className="block text-sm">
                <span className="mb-1.5 block">Price (AUD)</span>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={product?.price ?? 0}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block">Compare at price</span>
                <input
                  name="compare_at_price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={product?.compareAtPrice ?? ""}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block">Puffs</span>
                <input
                  name="puffs"
                  type="number"
                  min="0"
                  defaultValue={product?.puffs ?? ""}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block">Stock quantity</span>
                <input
                  name="stock_quantity"
                  type="number"
                  min="0"
                  defaultValue={product?.stockQuantity ?? 100}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
                />
              </label>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              {[
                ["on_sale", "On sale", product?.onSale],
                ["featured", "Featured", product?.featured],
                ["best_seller", "Best seller", product?.bestSeller],
                ["in_stock", "In stock", product?.inStock ?? true],
              ].map(([name, label, checked]) => (
                <label key={String(name)} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={String(name)}
                    defaultChecked={Boolean(checked)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-medium">Image</p>
            {preview && (
              <div className="mb-3 overflow-hidden rounded-lg bg-[#f4f4f2] p-3">
                <Image
                  src={preview}
                  alt=""
                  width={240}
                  height={240}
                  unoptimized={preview.startsWith("http")}
                  className="mx-auto h-40 w-auto object-contain"
                />
              </div>
            )}
            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
              className="block w-full text-sm"
            />
            {product && (
              <p className="mt-2 text-xs text-muted">
                Current price preview: {formatPrice(product.price)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-soft disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link
          href="/admin/products"
          className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold hover:bg-surface"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
