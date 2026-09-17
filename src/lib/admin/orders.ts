import { formatPrice } from "@/lib/site";

export type OrderItem = {
  id?: string;
  slug?: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal?: number;
};

export type OrderRecord = {
  id: string;
  created_at: string;
  status: string;
  email: string;
  phone: string;
  customer: Record<string, unknown> | null;
  billing: Record<string, unknown> | null;
  shipping: Record<string, unknown> | null;
  items: OrderItem[] | null;
  subtotal: number;
  shipping_price: number;
  total: number;
  shipping_method: string | null;
  payment_preference: string | null;
  coupon: string | null;
  notes: string | null;
  whatsapp_message: string | null;
};

export const ORDER_STATUSES = [
  "submitted",
  "confirmed",
  "paid",
  "shipped",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function orderCustomerName(order: OrderRecord) {
  const c = order.customer || {};
  const first = String(c.firstName || "").trim();
  const last = String(c.lastName || "").trim();
  const name = `${first} ${last}`.trim();
  return name || order.email;
}

export function orderChannel(order: OrderRecord) {
  const channel = order.customer?.channel;
  return typeof channel === "string" ? channel : "whatsapp";
}

export function formatOrderWhen(iso: string) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function statusTone(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-sky-50 text-sky-800";
    case "paid":
      return "bg-emerald-50 text-emerald-800";
    case "shipped":
      return "bg-violet-50 text-violet-800";
    case "cancelled":
      return "bg-zinc-100 text-zinc-600";
    default:
      return "bg-amber-50 text-amber-900";
  }
}

export function summarizeItems(items: OrderItem[] | null | undefined) {
  if (!items?.length) return "No items";
  if (items.length === 1) {
    return `${items[0].name} ×${items[0].quantity}`;
  }
  return `${items.length} items · ${formatPrice(
    items.reduce((sum, i) => sum + (i.lineTotal ?? i.price * i.quantity), 0),
  )}`;
}
