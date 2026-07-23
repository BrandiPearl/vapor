import {
  getBestSellers,
  getFeaturedProducts,
  getProductsByBrand,
} from "@/lib/catalog";
import { Hero } from "@/components/home/Hero";
import {
  CategoryBanners,
  IgetBanner,
  TrustFeatures,
} from "@/components/home/Banners";
import { ProductCarousel } from "@/components/ProductCarousel";
import { FaqSection } from "@/components/FaqSection";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, bestSellers, iget, alfakher, hqd, gunnpod, mrfog, alibarbar] =
    await Promise.all([
      getFeaturedProducts(12),
      getBestSellers(12),
      getProductsByBrand("IGET", 12),
      getProductsByBrand("ALFAKHER", 12),
      getProductsByBrand("HQD", 12),
      getProductsByBrand("GUNNPOD", 12),
      getProductsByBrand("MR FOG", 12),
      getProductsByBrand("ALIBARBAR", 12),
    ]);

  return (
    <>
      <Hero />

      <section className="container-site py-8 md:py-12">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-brand sm:text-2xl md:text-3xl">
          Shop disposables, pods &amp; devices
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          Authentic brands, discreet Australia-wide delivery, and everyday
          pricing. Browse bestsellers below or open the full catalogue.
        </p>
      </section>

      {featured.length > 0 && (
        <section className="container-site pb-12">
          <ProductCarousel
            products={featured}
            title="On sale now"
            subtitle="Limited deals across popular disposables and multipacks."
            viewAllHref="/shop?sort=price-asc"
            viewAllLabel="Shop all deals"
          />
        </section>
      )}

      {bestSellers.length > 0 && (
        <section className="bg-white py-12">
          <div className="container-site">
            <ProductCarousel
              products={bestSellers}
              title="Best sellers"
              viewAllHref="/shop"
            />
          </div>
        </section>
      )}

      <CategoryBanners />

      <section className="container-site py-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-brand md:text-3xl">
          E-liquids
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">
          Premium flavours for refillable kits: fruity, menthol, classic and
          dessert profiles.
        </p>
      </section>

      <IgetBanner />

      {iget.length > 0 && (
        <section className="container-site py-10">
          <ProductCarousel
            products={iget}
            title="IGET"
            subtitle="Popular disposable bars with long-lasting flavour."
            viewAllHref="/shop?brand=IGET"
          />
        </section>
      )}

      <TrustFeatures />

      {alfakher.length > 0 && (
        <section className="container-site py-12">
          <ProductCarousel
            products={alfakher}
            title="Al Fakher"
            subtitle="Shisha-inspired Crown Bar disposables."
            viewAllHref="/shop?brand=ALFAKHER"
          />
        </section>
      )}

      {hqd.length > 0 && (
        <section className="bg-white py-12">
          <div className="container-site">
            <ProductCarousel
              products={hqd}
              title="HQD"
              subtitle="Ready-to-use Slick disposables with bold flavours."
              viewAllHref="/shop?brand=HQD"
            />
          </div>
        </section>
      )}

      <FaqSection />

      {gunnpod.length > 0 && (
        <section className="container-site py-12">
          <ProductCarousel
            products={gunnpod}
            title="GunnPod"
            subtitle="Compact Plus devices for on-the-go sessions."
            viewAllHref="/shop?brand=GUNNPOD"
          />
        </section>
      )}

      {mrfog.length > 0 && (
        <section className="bg-white py-12">
          <div className="container-site">
            <ProductCarousel
              products={mrfog}
              title="Mr Fog"
              subtitle="Smooth Max Air disposables."
              viewAllHref="/shop?brand=MR%20FOG"
            />
          </div>
        </section>
      )}

      {alibarbar.length > 0 && (
        <section className="container-site py-12 pb-20">
          <ProductCarousel
            products={alibarbar}
            title="AliBarBar"
            subtitle="Ingot series with high puff counts and rich blends."
            viewAllHref="/shop?brand=ALIBARBAR"
          />
        </section>
      )}
    </>
  );
}
