"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES } from "@/lib/admin/orders";
import { updateOrderStatusAction } from "@/lib/admin/order-actions";

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(async () => {
          const result = await updateOrderStatusAction(orderId, next);
          if (result.ok) router.refresh();
          else alert(result.error);
        });
      }}
      className="rounded-md border border-border bg-white px-2.5 py-1.5 text-sm outline-none focus:border-accent disabled:opacity-60"
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
      {!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number]) && (
        <option value={status}>{status}</option>
      )}
    </select>
  );
}
