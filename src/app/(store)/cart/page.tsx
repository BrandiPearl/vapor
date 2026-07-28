import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cart",
  description: "Review items in your Aussie Cloud Vape cart.",
  path: "/cart",
  noIndex: true,
});

export { default } from "./CartClient";
