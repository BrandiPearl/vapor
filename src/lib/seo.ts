import type { Metadata } from "next";
import type { Product } from "@/lib/types";
import { faqs, getWhatsAppContactUrl } from "@/lib/site";

export const SITE_NAME = "Aussie Cloud Vape";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://cloudsourceau.com";

export const DEFAULT_DESCRIPTION =
  "Australia's trusted online vape shop. Shop authentic disposable vapes, pods, devices and e-liquids with fast nationwide delivery.";

export const OG_IMAGE_PATH = "/og.png";

export function absoluteUrl(path: string) {
  return new URL(path.startsWith("/") ? path : `/${path}`, SITE_URL).toString();
}

export function truncateDescription(text: string, max = 160) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trim()}…`;
}

export const defaultOpenGraph: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  locale: "en_AU",
  siteName: SITE_NAME,
  images: [
    {
      url: OG_IMAGE_PATH,
      width: 1200,
      height: 630,
      alt: SITE_NAME,
    },
  ],
};

export const defaultTwitter: NonNullable<Metadata["twitter"]> = {
  card: "summary_large_image",
  images: [OG_IMAGE_PATH],
};

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(input.path);
  return {
    title: input.title,
    description: truncateDescription(input.description),
    alternates: { canonical },
    openGraph: {
      ...defaultOpenGraph,
      title: input.title,
      description: truncateDescription(input.description),
      url: canonical,
    },
    twitter: {
      ...defaultTwitter,
      title: input.title,
      description: truncateDescription(input.description),
    },
    ...(input.noIndex
      ? { robots: { index: false, follow: false } }
      : undefined),
  };
}

export function organizationJsonLd() {
  const whatsapp = getWhatsAppContactUrl();
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo.svg"),
    description: DEFAULT_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brisbane",
      addressCountry: "AU",
    },
    areaServed: {
      "@type": "Country",
      name: "Australia",
    },
    ...(whatsapp
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: "English",
            url: whatsapp,
          },
        }
      : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/shop")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productJsonLd(product: Product) {
  const inStock = product.inStock !== false;
  const image =
    product.image.startsWith("http") || product.image.startsWith("/")
      ? product.image.startsWith("http")
        ? product.image
        : absoluteUrl(product.image)
      : absoluteUrl(product.image);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: truncateDescription(
      product.description || product.name,
      5000,
    ),
    image: [image],
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: "AUD",
      price: product.price.toFixed(2),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
  };
}
