/**
 * Storefront settings the owner can edit from /admin/settings.
 *
 * Shared by server and client code, so it must stay free of server-only
 * imports. `DEFAULT_SETTINGS` is what the site falls back to before the
 * database row is read (and if the table is missing entirely), which keeps the
 * env-var configuration working as the baseline.
 */

export type ShippingOption = {
  id: string;
  label: string;
  price: number;
};

export type Announcement = {
  enabled: boolean;
  text: string;
  href: string;
};

export type SiteSettings = {
  minOrderSubtotal: number;
  shippingOptions: ShippingOption[];
  whatsappNumber: string;
  telegramUrl: string;
  /** Inbox that receives orders placed via the Email checkout channel. */
  orderEmail: string;
  announcement: Announcement;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  minOrderSubtotal: 129,
  shippingOptions: [
    { id: "standard", label: "Standard Shipping", price: 20 },
    { id: "express", label: "Express Shipping", price: 35 },
  ],
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "61468292610",
  telegramUrl:
    process.env.NEXT_PUBLIC_TELEGRAM_URL?.trim() || "https://t.me/garyb300",
  orderEmail:
    process.env.NEXT_PUBLIC_ORDER_EMAIL?.trim() || "yangsegery@gmail.com",
  announcement: { enabled: false, text: "", href: "" },
};

function toMoney(value: unknown, fallback: number) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return Math.round(n * 100) / 100;
}

function toText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

export function slugifyOptionId(value: string, index: number) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `option-${index + 1}`;
}

function normalizeShippingOptions(value: unknown): ShippingOption[] {
  if (!Array.isArray(value)) return DEFAULT_SETTINGS.shippingOptions;

  const seen = new Set<string>();
  const options: ShippingOption[] = [];

  value.forEach((raw, index) => {
    if (!raw || typeof raw !== "object") return;
    const row = raw as Record<string, unknown>;
    const label = toText(row.label);
    if (!label) return;

    let id = toText(row.id) || slugifyOptionId(label, index);
    while (seen.has(id)) id = `${id}-${index + 1}`;
    seen.add(id);

    options.push({ id, label, price: toMoney(row.price, 0) });
  });

  // Checkout always needs at least one selectable option.
  return options.length ? options : DEFAULT_SETTINGS.shippingOptions;
}

function normalizeAnnouncement(value: unknown): Announcement {
  if (!value || typeof value !== "object") return DEFAULT_SETTINGS.announcement;
  const row = value as Record<string, unknown>;
  const text = toText(row.text);
  const href = toText(row.href);

  return {
    enabled: row.enabled === true && text.length > 0,
    text,
    // Only allow same-origin paths and absolute http(s) links.
    href: /^(https?:\/\/|\/)/.test(href) ? href : "",
  };
}

export function normalizeSettings(raw: unknown): SiteSettings {
  if (!raw || typeof raw !== "object") return DEFAULT_SETTINGS;
  const row = raw as Record<string, unknown>;

  return {
    minOrderSubtotal: toMoney(
      row.minOrderSubtotal,
      DEFAULT_SETTINGS.minOrderSubtotal,
    ),
    shippingOptions: normalizeShippingOptions(row.shippingOptions),
    whatsappNumber:
      toText(row.whatsappNumber) || DEFAULT_SETTINGS.whatsappNumber,
    telegramUrl: toText(row.telegramUrl) || DEFAULT_SETTINGS.telegramUrl,
    orderEmail: toText(row.orderEmail) || DEFAULT_SETTINGS.orderEmail,
    announcement: normalizeAnnouncement(row.announcement),
  };
}

export function meetsMinimumOrder(subtotal: number, minimum: number) {
  return subtotal >= minimum;
}

export function minimumOrderShortfall(subtotal: number, minimum: number) {
  return Math.max(0, minimum - subtotal);
}

export function findShippingOption(
  options: ShippingOption[],
  id: string,
): ShippingOption | undefined {
  return options.find((o) => o.id === id);
}

export function resolveShippingOption(options: ShippingOption[], id: string) {
  return findShippingOption(options, id) ?? options[0];
}
