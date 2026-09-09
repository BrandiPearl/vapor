import type { Metadata } from "next";
import { Suspense } from "react";
import { getNicotinePouchProducts } from "@/lib/catalog";
import { NicotinePouchesClient } from "@/components/NicotinePouchesClient";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Nicotine Pouches",
  description:
    "Buy ZYN, VELO, XQS, PABLO and KILLA tobacco-free nicotine pouches online in Australia. Separate from our vape shop with discreet nationwide delivery.",
  path: "/nicotine-pouches",
});

export default async function NicotinePouchesPage() {
  const products = await getNicotinePouchProducts();

  return (
    <Suspense
      fallback={
        <div className="container-site py-14 text-sm text-muted">
          Loading nicotine pouches…
        </div>
      }
    >
      <NicotinePouchesClient products={products} />
    </Suspense>
  );
}
