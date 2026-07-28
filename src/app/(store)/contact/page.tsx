import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Aussie Cloud Vape on WhatsApp or Telegram for orders, stock enquiries and delivery questions. Based in Brisbane, shipping Australia-wide.",
  path: "/contact",
});

export { default } from "./ContactClient";
