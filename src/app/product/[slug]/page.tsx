import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, formatPrice, products } from "@/lib/products";
import { ProductCarousel } from "@/components/ProductCarousel";
import { AddToCartControls } from "@/components/AddToCartControls";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.brand === product.brand && p.id !== product.id)
    .slice(0, 8);

  return (
    <div className="pb-16">
      <div className="border-b border-border bg-surface">
        <div className="container-site py-4 text-sm text-muted">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-accent">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <div className="container-site grid gap-10 py-10 md:grid-cols-2 md:py-14">
        <div className="relative overflow-hidden bg-[#f4f4f2] p-8">
          {product.onSale && (
            <span className="absolute left-4 top-4 z-10 rounded-sm bg-sale px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Sale!
            </span>
          )}
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            className="mx-auto h-auto w-full max-w-md"
            priority
          />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {product.category}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-brand md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            {product.compareAtPrice != null && (
              <span className="text-lg text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted">
            {product.description}
          </p>

          {product.puffs && (
            <p className="mt-4 text-sm font-medium text-brand">
              Up to {product.puffs.toLocaleString()} puffs
            </p>
          )}

          <AddToCartControls product={product} />

          <p className="mt-6 text-xs text-muted">
            You can request flavours at checkout in the “order notes” section.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="container-site">
          <ProductCarousel products={related} title="Related products" />
        </div>
      )}
    </div>
  );
}
