import { formatPrice } from "@/lib/site";
import type { CartLine } from "@/lib/cart-store";
import {
  resolveShippingOption,
  type ShippingOption,
  type SiteSettings,
} from "@/lib/settings";

export const AU_STATES = [
  "Australian Capital Territory",
  "New South Wales",
  "Northern Territory",
  "Queensland",
  "South Australia",
  "Tasmania",
  "Victoria",
  "Western Australia",
] as const;

/** Shipping options are editable in /admin/settings, so this is a plain id. */
export type ShippingId = string;

export const PAYMENT_OPTIONS = [
  {
    id: "bank" as const,
    label: "Bank transfer",
    hint: "After you send your order, we will reply with bank details.",
  },
  {
    id: "payid" as const,
    label: "PAYID",
    hint: "After you send your order, we will reply with PAYID details.",
  },
] as const;

export type PaymentId = (typeof PAYMENT_OPTIONS)[number]["id"];

export type CheckoutFormData = {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  shipDifferent: boolean;
  shipFirstName: string;
  shipLastName: string;
  shipAddress1: string;
  shipAddress2: string;
  shipCity: string;
  shipState: string;
  shipPostcode: string;
  notes: string;
  shipping: ShippingId;
  payment: PaymentId;
  coupon: string;
};

export function getShippingPrice(options: ShippingOption[], id: ShippingId) {
  return resolveShippingOption(options, id)?.price ?? 0;
}

/**
 * Digits only, with country code for wa.me (e.g. 61468292610).
 * Normalizes AU local mobiles like 0468292610 → 61468292610.
 */
export function normalizeWhatsAppPhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 10) {
    digits = `61${digits.slice(1)}`;
  }
  return digits;
}

export function buildOrderMessage(input: {
  form: CheckoutFormData;
  items: CartLine[];
  subtotal: number;
  shippingPrice: number;
  total: number;
  shippingOptions: ShippingOption[];
  /** When true, wrap emphasis in * for WhatsApp markdown. Off for Telegram/Email paste. */
  rich?: boolean;
}) {
  const {
    form,
    items,
    subtotal,
    shippingPrice,
    total,
    shippingOptions,
    rich = true,
  } = input;
  const bold = (s: string) => (rich ? `*${s}*` : s);
  const shippingLabel =
    resolveShippingOption(shippingOptions, form.shipping)?.label ?? "Shipping";
  const paymentLabel =
    PAYMENT_OPTIONS.find((o) => o.id === form.payment)?.label ?? "Payment";

  const lines = [
    bold("New order - Aussie Cloud Vape"),
    "",
    bold("Customer"),
    `${form.firstName} ${form.lastName}`,
    form.email,
    form.phone,
    "",
    bold("Billing address"),
    form.address1,
    form.address2 || null,
    `${form.city}, ${form.state} ${form.postcode}`,
    form.country,
    "",
  ];

  if (form.shipDifferent) {
    lines.push(
      bold("Shipping address"),
      `${form.shipFirstName} ${form.shipLastName}`,
      form.shipAddress1,
      form.shipAddress2 || null,
      `${form.shipCity}, ${form.shipState} ${form.shipPostcode}`,
      "",
    );
  }

  lines.push(bold("Items"));
  for (const { product, quantity } of items) {
    lines.push(
      `• ${product.name} x${quantity} - ${formatPrice(product.price * quantity)}`,
    );
  }

  lines.push(
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    `${shippingLabel}: ${formatPrice(shippingPrice)}`,
    bold(`Total: ${formatPrice(total)}`),
    "",
    `Payment preference: ${paymentLabel}`,
  );

  if (form.coupon.trim()) {
    lines.push(`Coupon: ${form.coupon.trim()}`);
  }
  if (form.notes.trim()) {
    lines.push("", bold("Order notes"), form.notes.trim());
  }

  lines.push("", "Please confirm stock and send payment details. Thanks!");

  return lines.filter((l) => l !== null).join("\n");
}

/** @deprecated Prefer buildOrderMessage — kept for call sites mid-migration. */
export function buildWhatsAppOrderMessage(
  input: Parameters<typeof buildOrderMessage>[0],
) {
  return buildOrderMessage({ ...input, rich: true });
}

export function buildWhatsAppUrl(message: string, number: string) {
  const phone = normalizeWhatsAppPhone(number);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildEmailOrderUrl(message: string, orderEmail: string) {
  const subject = "New order - Aussie Cloud Vape";
  return `mailto:${encodeURIComponent(orderEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

export type OrderChannel = "whatsapp" | "telegram" | "email";

/** Opens the store Telegram chat. Message must be pasted — Telegram blocks DM prefills. */
export function buildOrderChatUrl(
  channel: OrderChannel,
  message: string,
  settings: SiteSettings,
) {
  if (channel === "telegram") {
    return settings.telegramUrl;
  }
  if (channel === "email") {
    return buildEmailOrderUrl(message, settings.orderEmail);
  }
  return buildWhatsAppUrl(message, settings.whatsappNumber);
}

export function channelLabel(channel: OrderChannel) {
  if (channel === "telegram") return "Telegram";
  if (channel === "email") return "Email";
  return "WhatsApp";
}
