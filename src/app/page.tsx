import {
  getBestSellers,
  getFeaturedProducts,
  getProductsByBrand,
} from "@/lib/products";
import { Hero } from "@/components/home/Hero";
import {
  CategoryBanners,
  IgetBanner,
  TrustFeatures,
} from "@/components/home/Banners";
import { ProductCarousel } from "@/components/ProductCarousel";
import { FaqSection } from "@/components/FaqSection";

export default function HomePage() {
  const featured = getFeaturedProducts();
  const bestSellers = getBestSellers();
  const iget = getProductsByBrand("IGET");
  const alfakher = getProductsByBrand("ALFAKHER");
  const hqd = getProductsByBrand("HQD");
  const gunnpod = getProductsByBrand("GUNNPOD");
  const mrfog = getProductsByBrand("MR FOG");
  const alibarbar = getProductsByBrand("ALIBARBAR");

  return (
    <>
      <Hero />

      <section className="container-site prose-shop py-14">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-brand md:text-3xl">
          Disposable Vapes Australia — Buy Disposable Vapes Online Australia
        </h2>
        <div className="mt-5 max-w-4xl">
          <p>
            Finding quality disposable vapes, vape pods, or e-liquid flavors in
            Australia can be difficult when stock runs out. Aussie Cloud Vape
            allows you to buy vapes online in Australia easily from the comfort
            of your home, with a 100% guarantee of delivery to your doorstep on
            time. Buy vapes online Australia from a trusted online vape store
            offering the best disposable vapes, e-liquids, vape kits, vape pods,
            vape devices, and vaporizers from top reputable brands.
          </p>
          <p>
            We are ready to meet all your vaping needs, and Aussie Cloud Vape is
            the best place for nicotine vapes. If you are a smoker in Australia
            looking to quit, Aussie Cloud Vape is the legitimate and fast way to
            buy vapes, vape coils, and e-liquids hassle-free. The availability of
            vape products in Australia has changed significantly.
          </p>
          <p>
            It is no longer possible to buy vapes online without a prescription,
            but Aussie Cloud Vape makes this process hassle-free. There is no
            need to visit a local chemist or pharmacy when buying from the best
            disposable vape store in Australia, because we have you covered. All
            our products are sourced from regulated and controlled environments,
            ensuring consumer safety and compliance with relevant health
            regulations.
          </p>
        </div>
      </section>

      <section className="container-site pb-12">
        <ProductCarousel products={featured} />
      </section>

      <section className="bg-surface py-12">
        <div className="container-site">
          <ProductCarousel
            products={bestSellers}
            title="BEST SELLING PRODUCTS"
          />
        </div>
      </section>

      <CategoryBanners />

      <section className="container-site prose-shop py-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-brand md:text-3xl">
          E-liquids Online Australia — Vape Juice for Sale
        </h2>
        <div className="mt-5 max-w-4xl">
          <p>
            Are you looking to buy e-liquids online Australia? We are proud to
            offer one of the best selections of premium e-liquid flavors in
            Australia, carefully curated to deliver an exceptional vaping
            experience. Our wide range of e-liquids and vape liquids is designed
            to suit both casual vapers and experienced users who demand
            consistent quality and rich flavor.
          </p>
          <p>
            Crafted from concentrated flavor sources and made using the finest
            ingredients, our vape juices in Australia provide smooth vapor
            production and long-lasting taste. Whether you prefer classic,
            fruity, dessert, or menthol profiles, our e-liquids are the perfect
            choice to elevate your vape session.
          </p>
        </div>
      </section>

      <IgetBanner />

      <section className="container-site prose-shop py-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-brand md:text-3xl">
          IGET Vapes Australia — Buy IGET Vapes Online Australia
        </h2>
        <div className="mt-5 max-w-4xl">
          <p>
            Looking for IGET vape for sale in Australia? IGET vapes are among
            the most popular disposable vape devices, known for their sleek
            design, powerful performance, and rich flavor delivery. Whether you
            are new to vaping or an experienced user, IGET disposable vapes
            offer a hassle-free experience with no refilling, no charging setup,
            and no maintenance required.
          </p>
          <p>
            Our collection of IGET vapes for sale Australia includes a wide
            variety of flavors to suit every preference, from fruity and icy
            blends to classic options. Designed for long-lasting use, IGET vapes
            provide consistent vapor production and a smooth draw from the first
            puff to the last.
          </p>
        </div>
        <div className="mt-8">
          <ProductCarousel products={iget} />
        </div>
      </section>

      <TrustFeatures />

      <section className="container-site prose-shop py-12">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-brand md:text-3xl">
          ALFAKHER Vapes Australia — Buy ALFAKHER Vapes Online Australia
        </h2>
        <div className="mt-5 max-w-4xl">
          <p>
            Looking for the finest Al Fakher shisha and vape products in
            Australia? Aussie Cloud Vape proudly offers a wide selection of Al
            Fakher e-liquids, premium vape juices, and authentic nicotine vapes
            to elevate your vaping experience. Known worldwide for quality and
            consistency, Al Fakher delivers rich flavors and smooth vapor.
          </p>
        </div>
        <div className="mt-8">
          <ProductCarousel products={alfakher} />
        </div>
      </section>

      <section className="bg-surface py-12">
        <div className="container-site prose-shop">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-brand md:text-3xl">
            Buy HQD Vapes Online Australia
          </h2>
          <div className="mt-5 max-w-4xl">
            <p>
              HQD is a well-known disposable vape brand trusted by vapers for
              its quality, performance, and bold flavor profiles. Designed for
              convenience, HQD vapes come pre-filled, pre-charged, and ready to
              use straight out of the box.
            </p>
          </div>
          <div className="mt-8">
            <ProductCarousel products={hqd} />
          </div>
        </div>
      </section>

      <FaqSection />

      <section className="container-site prose-shop py-12">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-brand md:text-3xl">
          GUNNpods Australia — Buy GUNNpods Online Australia
        </h2>
        <div className="mt-5 max-w-4xl">
          <p>
            GunnPod Plus vapes for sale at Aussie Cloud Vape are designed for
            convenience, power, and smooth flavor delivery. These sleek,
            portable devices are perfect for both beginners and experienced
            vapers, offering a satisfying puff without the need for refills or
            complicated settings.
          </p>
        </div>
        <div className="mt-8">
          <ProductCarousel products={gunnpod} />
        </div>
      </section>

      <section className="bg-surface py-12">
        <div className="container-site prose-shop">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-brand md:text-3xl">
            Mr FOG Vapes Australia — Mr FOG Vapes for Sale Australia
          </h2>
          <div className="mt-5 max-w-4xl">
            <p>
              Mr Fog vapes for sale at Aussie Cloud Vape are designed for
              smooth, flavorful, and hassle-free vaping. These disposable vapes
              are perfect for beginners and experienced users, offering
              consistent puffs without refills or charging.
            </p>
          </div>
          <div className="mt-8">
            <ProductCarousel products={mrfog} />
          </div>
        </div>
      </section>

      <section className="container-site prose-shop py-12 pb-20">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-brand md:text-3xl">
          ALIBARBAR Vapes Australia — ALIBARBAR Vapes For Sale Australia
        </h2>
        <div className="mt-5 max-w-4xl">
          <p>
            AliBarBar vapes for sale at Aussie Cloud Vape bring premium flavor,
            convenience, and reliability to your vaping experience. These sleek
            disposable vapes and pod devices deliver smooth, consistent puffs
            without the need for refills or charging.
          </p>
        </div>
        <div className="mt-8">
          <ProductCarousel products={alibarbar} />
        </div>
      </section>
    </>
  );
}
