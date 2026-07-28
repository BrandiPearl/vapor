import type { Metadata } from "next";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { faqPageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about buying vapes online in Australia, delivery, nicotine products, authenticity and customer support at Aussie Cloud Vape.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <div className="py-6">
      <div className="container-site pt-10">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-brand md:text-4xl">
          FAQs: Aussie Cloud Vape
        </h1>
      </div>
      <JsonLd data={faqPageJsonLd()} />
      <FaqSection showHeading={false} />
    </div>
  );
}
