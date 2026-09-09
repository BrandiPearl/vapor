import type { Metadata } from "next";
import { Suspense } from "react";
import { getVapeProducts } from "@/lib/catalog";
import { ShopClient } from "@/components/ShopClient";
import { pageMetadata } from "@/lib/seo";

// Prerendered at build time. The Cloudflare cache is read-only, so a positive
// revalidate would re-render on every request without ever storing the result.
export const revalidate = false;

export const metadata: Metadata = pageMetadata({
  title: "Shop All Vapes",
  description:
    "Browse disposable vapes, pods, devices and e-liquids from IGET, HQD, Al Fakher and more. Filter by brand and shop Australia's full catalogue.",
  path: "/shop",
});

export default async function ShopPage() {
  const products = await getVapeProducts();

  return (
    <Suspense
      fallback={
        <div className="container-site py-14 text-sm text-muted">
          Loading shop…
        </div>
      }
    >
      <ShopClient products={products} />
    </Suspense>
  );
}
