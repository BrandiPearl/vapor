import { formatPrice } from "@/lib/site";
import type { CartLine } from "@/lib/cart-store";

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

export const SHIPPING_OPTIONS = [
  {
    id: "standard" as const,
    label: "Standard Shipping",
    price: 20,
  },
  {
    id: "express" as const,
    label: "Express Shipping",
    price: 35,
  },
] as const;

export type ShippingId = (typeof SHIPPING_OPTIONS)[number]["id"];

export const PAYMENT_OPTIONS = [
  {
    id: "bank" as const,
    label: "Bank transfer",
    hint: "After you send your order on WhatsApp, we will reply with bank details.",
  },
  {
    id: "payid" as const,
    label: "PAYID",
    hint: "After you send your order on WhatsApp, we will reply with PAYID details.",
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

export function getShippingPrice(id: ShippingId) {
  return SHIPPING_OPTIONS.find((o) => o.id === id)?.price ?? 0;
}

/** Digits only, with country code (e.g. 61412345678). */
export function getWhatsAppNumber() {
  const raw =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ||
    "61400000000";
  return raw;
}

export function buildWhatsAppOrderMessage(input: {
  form: CheckoutFormData;
  items: CartLine[];
  subtotal: number;
  shippingPrice: number;
  total: number;
}) {
  const { form, items, subtotal, shippingPrice, total } = input;
  const shippingLabel =
    SHIPPING_OPTIONS.find((o) => o.id === form.shipping)?.label ?? "Shipping";
  const paymentLabel =
    PAYMENT_OPTIONS.find((o) => o.id === form.payment)?.label ?? "Payment";

  const lines = [
    "*New order - Aussie Cloud Vape*",
    "",
    "*Customer*",
    `${form.firstName} ${form.lastName}`,
    form.email,
    form.phone,
    "",
    "*Billing address*",
    form.address1,
    form.address2 || null,
    `${form.city}, ${form.state} ${form.postcode}`,
    form.country,
    "",
  ];

  if (form.shipDifferent) {
    lines.push(
      "*Shipping address*",
      `${form.shipFirstName} ${form.shipLastName}`,
      form.shipAddress1,
      form.shipAddress2 || null,
      `${form.shipCity}, ${form.shipState} ${form.shipPostcode}`,
      "",
    );
  }

  lines.push("*Items*");
  for (const { product, quantity } of items) {
    lines.push(
      `• ${product.name} x${quantity} - ${formatPrice(product.price * quantity)}`,
    );
  }

  lines.push(
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    `${shippingLabel}: ${formatPrice(shippingPrice)}`,
    `*Total: ${formatPrice(total)}*`,
    "",
    `Payment preference: ${paymentLabel}`,
  );

  if (form.coupon.trim()) {
    lines.push(`Coupon: ${form.coupon.trim()}`);
  }
  if (form.notes.trim()) {
    lines.push("", "*Order notes*", form.notes.trim());
  }

  lines.push("", "Please confirm stock and send payment details. Thanks!");

  return lines.filter((l) => l !== null).join("\n");
}

export function buildWhatsAppUrl(message: string) {
  const phone = getWhatsAppNumber();
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
