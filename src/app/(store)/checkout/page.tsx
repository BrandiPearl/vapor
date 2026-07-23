import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your Aussie Cloud Vape order details and send them via WhatsApp. No card payments on this website.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
