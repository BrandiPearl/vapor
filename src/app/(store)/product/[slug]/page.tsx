import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
  formatPrice,
} from "@/lib/catalog";
import { ProductCarousel } from "@/components/ProductCarousel";
import { AddToCartControls } from "@/components/AddToCartControls";
import { JsonLd } from "@/components/JsonLd";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  productJsonLd,
  truncateDescription,
} from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await getProductSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  const title = `${product.name} | Buy Online Australia`;
  const description = truncateDescription(
    product.description ||
      `Buy ${product.name} online at Aussie Cloud Vape. ${product.brand} ${product.category} with fast Australia-wide delivery.`,
  );
  const canonical = `/product/${product.slug}`;
  const image =
    product.image.startsWith("http") || product.image.startsWith("/")
      ? product.image
      : `/${product.image}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonical),
      type: "website",
      locale: "en_AU",
      images: [
        {
          url: image.startsWith("http") ? image : absoluteUrl(image),
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.startsWith("http") ? image : absoluteUrl(image)],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = product.brand
    ? await getRelatedProducts(product.brand, product.id, 8)
    : [];

  const categoryHref = `/shop?category=${encodeURIComponent(product.category)}`;
  const inStock = product.inStock !== false;
  const isRemote = product.image.startsWith("http");

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: product.category, path: categoryHref },
    { name: product.name, path: `/product/${product.slug}` },
  ];

  return (
    <div className="pb-16">
      <JsonLd
        data={[productJsonLd(product), breadcrumbJsonLd(breadcrumbs)]}
      />
      <div className="border-b border-border bg-white">
        <div className="container-site overflow-hidden py-3 text-sm text-muted sm:py-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              <li className="shrink-0">
                <Link href="/" className="hover:text-accent">
                  Home
                </Link>
              </li>
              <li className="shrink-0" aria-hidden="true">
                /
              </li>
              <li className="shrink-0">
                <Link href={categoryHref} className="hover:text-accent">
                  {product.category}
                </Link>
              </li>
              <li className="shrink-0" aria-hidden="true">
                /
              </li>
              <li className="truncate text-foreground" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-site grid gap-8 py-8 md:grid-cols-2 md:gap-10 md:py-14">
        <div className="relative overflow-hidden rounded-xl border border-border bg-[#eef2ef] p-4 shadow-sm sm:p-8">
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
            unoptimized={isRemote}
            className="mx-auto h-auto w-full max-w-md object-contain"
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

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {product.compareAtPrice != null && (
              <span className="text-lg text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                inStock
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {inStock ? "In stock" : "Out of stock"}
            </span>
          </div>

          {product.description ? (
            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-muted">
              {product.description}
            </p>
          ) : null}

          {product.puffs ? (
            <p className="mt-4 text-sm font-medium text-brand">
              Up to {product.puffs.toLocaleString()} puffs
            </p>
          ) : null}

          <AddToCartControls product={product} />

          <p className="mt-6 text-xs text-muted">
            You can request flavours at checkout in the “order notes” section.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="container-site">
          <ProductCarousel
            products={related}
            title="Related products"
            viewAllHref={`/shop?brand=${encodeURIComponent(product.brand)}`}
          />
        </div>
      )}
    </div>
  );
}
