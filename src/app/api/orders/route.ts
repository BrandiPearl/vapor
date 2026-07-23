import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyOwner } from "@/lib/notify-owner";
import { formatPrice } from "@/lib/site";

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
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderBody;
    const { form, items, subtotal, shippingPrice, total, whatsappMessage } =
      body;

    if (!form?.email || !form?.phone || !items?.length) {
      return NextResponse.json(
        { error: "Missing required order fields." },
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

    await notifyOwner({
      kind: "order",
      text: `New order ${formatPrice(total)} from ${form.firstName} ${form.lastName} (${form.email}). Open admin or WhatsApp to confirm.`,
      meta: { orderId: data.id, total, email: form.email },
    });

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save order." }, { status: 500 });
  }
}
