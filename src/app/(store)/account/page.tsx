import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "My Account",
  description: "Sign in or create an Aussie Cloud Vape account.",
  path: "/account",
  noIndex: true,
});

export { default } from "./AccountClient";
