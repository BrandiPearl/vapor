import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapDbProduct } from "@/lib/catalog";
import type { DbProduct } from "@/lib/types";
import {
  deleteProductAction,
  updateProductAction,
} from "@/lib/admin/actions";
import { ProductForm } from "@/components/admin/ProductForm";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("products")
    .select(
      "id, slug, name, brand, category_name, description, price, compare_at_price, image_url, puffs, on_sale, featured, best_seller, in_stock, stock_quantity, metadata",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const product = mapDbProduct(data as DbProduct);
  const stockQuantity = Number(
    (data as { stock_quantity?: number }).stock_quantity ?? 0,
  );

  async function updateAction(formData: FormData) {
    "use server";
    return updateProductAction(id, formData);
  }

  async function removeAction() {
    "use server";
    await deleteProductAction(id);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-brand">
            Edit product
          </h1>
          <p className="mt-1 text-sm text-muted">{product.name}</p>
          <Link
            href={`/product/${product.slug}`}
            className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
          >
            View on storefront
          </Link>
        </div>
        {product.image && (
          <Image
            src={product.image}
            alt=""
            width={80}
            height={80}
            unoptimized={product.image.startsWith("http")}
            className="rounded-lg bg-[#f4f4f2] object-contain"
          />
        )}
      </div>

      <ProductForm
        product={{ ...product, stockQuantity }}
        action={updateAction}
        submitLabel="Save changes"
      />

      <div className="mt-10 border-t border-border pt-6">
        <p className="mb-3 text-sm text-muted">Danger zone</p>
        <DeleteProductButton
          productName={product.name}
          action={removeAction}
        />
      </div>
    </div>
  );
}
