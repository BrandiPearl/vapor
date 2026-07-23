import { Suspense } from "react";
import { getAllProducts } from "@/lib/catalog";
import { ShopClient } from "@/components/ShopClient";

export const revalidate = 60;

export default async function ShopPage() {
  const products = await getAllProducts();

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
