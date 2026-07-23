import { createProductAction } from "@/lib/admin/actions";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-3xl font-bold text-brand">
        Add product
      </h1>
      <ProductForm action={createProductAction} submitLabel="Create product" />
    </div>
  );
}
