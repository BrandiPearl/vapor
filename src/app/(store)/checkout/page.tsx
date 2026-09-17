import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Checkout",
  description:
    "Complete your Aussie Cloud Vape order details and send them via WhatsApp, Telegram, or Email. No card payments on this website.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}
