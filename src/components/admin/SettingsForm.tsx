"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/site";
import {
  slugifyOptionId,
  type ShippingOption,
  type SiteSettings,
} from "@/lib/settings";

type Props = {
  settings: SiteSettings;
  action: (
    formData: FormData,
  ) => Promise<{ ok: boolean; error?: string } | void>;
};

const fieldClass =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent";

export function SettingsForm({ settings, action }: Props) {
  const [minimum, setMinimum] = useState(String(settings.minOrderSubtotal));
  const [shipping, setShipping] = useState<ShippingOption[]>(
    settings.shippingOptions,
  );
  const [announcementEnabled, setAnnouncementEnabled] = useState(
    settings.announcement.enabled,
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const updateOption = (index: number, patch: Partial<ShippingOption>) => {
    setShipping((rows) =>
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  return (
    <form
      className="space-y-6"
      action={(formData) => {
        setError(null);
        setSaved(false);
        formData.set("shippingOptions", JSON.stringify(shipping));
        startTransition(async () => {
          const result = await action(formData);
          if (result && !result.ok) setError(result.error || "Save failed");
          else setSaved(true);
        });
      }}
    >
      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-sale">
          {error}
        </p>
      )}
      {saved && (
        <p className="rounded-md bg-[#e8f7ef] px-4 py-3 text-sm text-accent">
          Saved. The storefront picks this up within a minute — no rebuild
          needed.
        </p>
      )}

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-brand">Orders</h2>
        <label className="mt-4 block max-w-xs text-sm">
          <span className="mb-1.5 block font-medium">
            Minimum order subtotal (AUD)
          </span>
          <input
            name="minOrderSubtotal"
            type="number"
            min="0"
            step="1"
            required
            value={minimum}
            onChange={(e) => setMinimum(e.target.value)}
            className={fieldClass}
          />
          <span className="mt-1.5 block text-xs text-muted">
            Carts below {formatPrice(Number(minimum) || 0)} cannot check out.
          </span>
        </label>
      </section>

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-brand">Shipping options</h2>
          <button
            type="button"
            onClick={() =>
              setShipping((rows) => [
                ...rows,
                { id: `option-${rows.length + 1}`, label: "", price: 0 },
              ])
            }
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:border-accent"
          >
            <Plus className="h-3.5 w-3.5" />
            Add option
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {shipping.map((option, index) => (
            <div key={index} className="flex flex-wrap items-end gap-3">
              <label className="min-w-[200px] flex-1 text-sm">
                <span className="mb-1.5 block font-medium">Label</span>
                <input
                  value={option.label}
                  onChange={(e) =>
                    updateOption(index, {
                      label: e.target.value,
                      id:
                        option.id ||
                        slugifyOptionId(e.target.value, index),
                    })
                  }
                  placeholder="Express Shipping"
                  className={fieldClass}
                />
              </label>
              <label className="w-32 text-sm">
                <span className="mb-1.5 block font-medium">Price</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={option.price}
                  onChange={(e) =>
                    updateOption(index, { price: Number(e.target.value) })
                  }
                  className={fieldClass}
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  setShipping((rows) => rows.filter((_, i) => i !== index))
                }
                className="rounded-md border border-border p-2.5 text-muted hover:border-sale hover:text-sale"
                aria-label={`Remove ${option.label || "option"}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {shipping.length === 0 && (
            <p className="text-sm text-muted">
              No options left — the default Standard and Express options will be
              restored on save.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-brand">Contact</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">WhatsApp number</span>
            <input
              name="whatsappNumber"
              defaultValue={settings.whatsappNumber}
              placeholder="61468292610"
              className={fieldClass}
            />
            <span className="mt-1.5 block text-xs text-muted">
              Include the country code. A local 04… number is converted to 614…
              automatically.
            </span>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Telegram link</span>
            <input
              name="telegramUrl"
              type="url"
              defaultValue={settings.telegramUrl}
              placeholder="https://t.me/yourhandle"
              className={fieldClass}
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1.5 block font-medium">Order inbox email</span>
            <input
              name="orderEmail"
              type="email"
              defaultValue={settings.orderEmail}
              placeholder="yangsegery@gmail.com"
              className={fieldClass}
            />
            <span className="mt-1.5 block text-xs text-muted">
              Every order is emailed here. The Email checkout channel also opens
              the customer&apos;s mail app addressed to this inbox.
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-brand">Announcement banner</h2>
        <label className="mt-4 flex items-center gap-2 text-sm font-medium">
          <input
            name="announcementEnabled"
            type="checkbox"
            checked={announcementEnabled}
            onChange={(e) => setAnnouncementEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-[var(--accent)]"
          />
          Show the banner above the header
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1.6fr_1fr]">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Message</span>
            <input
              name="announcementText"
              defaultValue={settings.announcement.text}
              placeholder="Free express shipping on orders over $300"
              className={fieldClass}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">
              Link <span className="text-muted">(optional)</span>
            </span>
            <input
              name="announcementHref"
              defaultValue={settings.announcement.href}
              placeholder="/shop"
              className={fieldClass}
            />
          </label>
        </div>
      </section>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand px-5 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
