import type { MetadataRoute } from "next";
import { getProductSlugs } from "@/lib/catalog";
import { SITE_URL } from "@/lib/seo";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
  { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
  { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  {
    url: `${SITE_URL}/refund-policy`,
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productEntries: MetadataRoute.Sitemap = [];

  try {
    const slugs = await getProductSlugs();
    productEntries = slugs.map((slug) => ({
      url: `${SITE_URL}/product/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Supabase may be unavailable at build time; static routes still ship.
  }

  return [...STATIC_ROUTES, ...productEntries];
}
