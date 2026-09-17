import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyOwner } from "@/lib/notify-owner";
import { formatPrice } from "@/lib/site";
import { meetsMinimumOrder } from "@/lib/settings";
import { getSiteSettings } from "@/lib/settings-server";

type OrderChannel = "whatsapp" | "telegram" | "email";

type OrderBody = {
  form: {
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
    shipping: string;
    payment: string;
    coupon: string;
  };
  items: {
    product: { id: string; slug: string; name: string; price: number };
    quantity: number;
  }[];
  subtotal: number;
  shippingPrice: number;
  total: number;
  whatsappMessage: string;
  channel?: OrderChannel;
};

async function deliverOrderEmail(input: {
  to: string;
  subject: string;
  body: string;
  replyTo: string;
  customerName: string;
}) {
  // FormSubmit delivers without SMTP keys. The inbox must confirm once
  // (FormSubmit sends an activation mail on the first submission).
  try {
    const res = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(input.to)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: input.subject,
          _replyto: input.replyTo,
          _template: "table",
          name: input.customerName,
          email: input.replyTo,
          message: input.body,
        }),
        signal: AbortSignal.timeout(12000),
      },
    );
    return res.ok ? "email:ok" : `email:${res.status}`;
  } catch {
    return "email:error";
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderBody;
    const {
      form,
      items,
      subtotal,
      shippingPrice,
      total,
      whatsappMessage,
      channel = "whatsapp",
    } = body;

    if (!form?.email || !form?.phone || !items?.length) {
      return NextResponse.json(
        { error: "Missing required order fields." },
        { status: 400 },
      );
    }

    const settings = await getSiteSettings();
    if (!meetsMinimumOrder(subtotal, settings.minOrderSubtotal)) {
      return NextResponse.json(
        {
          error: `Minimum order is ${formatPrice(settings.minOrderSubtotal)}. Add more items to continue.`,
        },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const billing = {
      address1: form.address1,
      address2: form.address2,
      city: form.city,
      state: form.state,
      postcode: form.postcode,
      country: form.country,
    };

    const shipping = form.shipDifferent
      ? {
          firstName: form.shipFirstName,
          lastName: form.shipLastName,
          address1: form.shipAddress1,
          address2: form.shipAddress2,
          city: form.shipCity,
          state: form.shipState,
          postcode: form.shipPostcode,
          country: form.country,
        }
      : { ...billing, firstName: form.firstName, lastName: form.lastName };

    const { data, error } = await supabase
      .from("orders")
      .insert({
        email: form.email.trim(),
        phone: form.phone.trim(),
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          channel,
        },
        billing,
        shipping,
        items: items.map(({ product, quantity }) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          quantity,
          lineTotal: product.price * quantity,
        })),
        subtotal,
        shipping_price: shippingPrice,
        total,
        shipping_method: form.shipping,
        payment_preference: form.payment,
        coupon: form.coupon?.trim() || null,
        notes: form.notes?.trim() || null,
        whatsapp_message: whatsappMessage,
        status: "submitted",
      })
      .select("id")
      .single();

    if (error) {
      console.error("order insert", error);
      return NextResponse.json(
        {
          error:
            error.message.includes("orders") && error.code === "42P01"
              ? "Orders table missing. Run supabase/schema-orders-visits.sql in Supabase."
              : "Could not save order.",
        },
        { status: 500 },
      );
    }

    const emailStatus = await deliverOrderEmail({
      to: settings.orderEmail,
      subject: `New order ${formatPrice(total)} via ${channel}`,
      body: whatsappMessage,
      replyTo: form.email.trim(),
      customerName: `${form.firstName} ${form.lastName}`.trim(),
    });

    await notifyOwner({
      kind: "order",
      text: `New order ${formatPrice(total)} via ${channel} from ${form.firstName} ${form.lastName} (${form.email}).`,
      meta: {
        orderId: data.id,
        total,
        email: form.email,
        channel,
        emailStatus,
      },
    });

    return NextResponse.json({ id: data.id, emailStatus });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save order." }, { status: 500 });
  }
}
