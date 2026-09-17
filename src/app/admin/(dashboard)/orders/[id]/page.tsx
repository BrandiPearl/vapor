import Link from "next/link";
import { notFound } from "next/navigation";
import {
  createAdminClient,
  hasServiceRoleKey,
  SERVICE_ROLE_HELP,
} from "@/lib/supabase/admin";
import {
  formatOrderWhen,
  orderChannel,
  orderCustomerName,
  statusTone,
  type OrderItem,
  type OrderRecord,
} from "@/lib/admin/orders";
import { formatPrice } from "@/lib/site";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { clsx } from "clsx";

type Props = {
  params: Promise<{ id: string }>;
};

function addressBlock(label: string, data: Record<string, unknown> | null) {
  if (!data) return null;
  const lines = [
    [data.firstName, data.lastName].filter(Boolean).join(" "),
    data.address1,
    data.address2,
    [data.city, data.state, data.postcode].filter(Boolean).join(", "),
    data.country,
  ].filter((line) => String(line || "").trim());

  if (!lines.length) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </h3>
      <div className="mt-2 space-y-0.5 text-sm">
        {lines.map((line) => (
          <p key={String(line)}>{String(line)}</p>
        ))}
      </div>
    </div>
  );
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  if (!hasServiceRoleKey()) {
    return (
      <div>
        <Link
          href="/admin/orders"
          className="text-sm font-medium text-accent hover:underline"
        >
          ← Orders
        </Link>
        <div className="mt-6">
          <AdminNotice
            tone="error"
            title="Orders need the service-role key."
            detail={SERVICE_ROLE_HELP}
          />
        </div>
      </div>
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select(
      "id, created_at, status, email, phone, customer, billing, shipping, items, subtotal, shipping_price, total, shipping_method, payment_preference, coupon, notes, whatsapp_message",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();
  const order = data as OrderRecord;
  const items = (order.items || []) as OrderItem[];

  return (
    <div>
      <Link
        href="/admin/orders"
        className="text-sm font-medium text-accent hover:underline"
      >
        ← Orders
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-brand">
            {orderCustomerName(order)}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {formatOrderWhen(order.created_at)} · via{" "}
            <span className="capitalize">{orderChannel(order)}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={clsx(
              "rounded px-2 py-1 text-xs font-semibold capitalize",
              statusTone(order.status),
            )}
          >
            {order.status}
          </span>
          <OrderStatusSelect orderId={order.id} status={order.status} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-brand">Items</h2>
          <ul className="mt-4 divide-y divide-border">
            {items.map((item, i) => (
              <li
                key={`${item.slug || item.name}-${i}`}
                className="flex items-start justify-between gap-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted">
                    {formatPrice(Number(item.price))} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  {formatPrice(
                    Number(item.lineTotal ?? item.price * item.quantity),
                  )}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(Number(order.subtotal))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">
                Shipping
                {order.shipping_method ? ` (${order.shipping_method})` : ""}
              </span>
              <span>{formatPrice(Number(order.shipping_price))}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(Number(order.total))}</span>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-brand">Customer</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-muted">Email</dt>
                <dd>
                  <a
                    href={`mailto:${order.email}`}
                    className="font-medium text-accent hover:underline"
                  >
                    {order.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted">Phone</dt>
                <dd className="font-medium">{order.phone}</dd>
              </div>
              <div>
                <dt className="text-muted">Payment preference</dt>
                <dd className="font-medium capitalize">
                  {order.payment_preference || "—"}
                </dd>
              </div>
              {order.coupon && (
                <div>
                  <dt className="text-muted">Coupon</dt>
                  <dd className="font-medium">{order.coupon}</dd>
                </div>
              )}
              {order.notes && (
                <div>
                  <dt className="text-muted">Notes</dt>
                  <dd className="whitespace-pre-wrap">{order.notes}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="grid gap-5 rounded-xl border border-border bg-white p-5 shadow-sm sm:grid-cols-2">
            {addressBlock("Billing", order.billing)}
            {addressBlock("Shipping", order.shipping)}
          </section>

          {order.whatsapp_message && (
            <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-brand">Order message</h2>
              <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded-md bg-[#f3f5f3] p-3 text-xs leading-relaxed">
                {order.whatsapp_message}
              </pre>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
