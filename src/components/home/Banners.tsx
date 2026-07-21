import Link from "next/link";
import { Truck, ShieldCheck, CreditCard } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    text: "We offer the fastest shipping to all locations in Australia.",
  },
  {
    icon: ShieldCheck,
    title: "Shipping Guarantee",
    text: "You are guaranteed the best quality and a smooth shopping experience.",
  },
  {
    icon: CreditCard,
    title: "Easy Payment",
    text: "We accept flexible payment options such as bank transfer, PayID and cryptocurrency.",
  },
];

export function TrustFeatures() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="container-site grid gap-8 py-12 md:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-white">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-brand">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CategoryBanners() {
  return (
    <section className="container-site grid gap-5 py-10 md:grid-cols-2">
      <Link
        href="/shop?category=devices"
        className="group relative min-h-[220px] overflow-hidden rounded-xl bg-brand text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(125,255,179,0.25),transparent_55%)] transition duration-500 group-hover:scale-110" />
        <div className="relative flex h-full flex-col justify-end p-8">
          <h3 className="font-[family-name:var(--font-display)] text-3xl font-bold">
            VAPE DEVICES
          </h3>
          <p className="mt-2 max-w-sm text-sm text-white/75">
            Buy vape devices online in Australia on Aussie Cloud Vape
          </p>
          <span className="mt-5 inline-flex w-fit rounded-md bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider transition group-hover:bg-white group-hover:text-brand">
            Shop now
          </span>
        </div>
      </Link>

      <Link
        href="/shop?category=e-liquids"
        className="group relative min-h-[220px] overflow-hidden rounded-xl bg-[#1a2f4a] text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(56,189,248,0.22),transparent_55%)] transition duration-500 group-hover:scale-110" />
        <div className="relative flex h-full flex-col justify-end p-8">
          <h3 className="font-[family-name:var(--font-display)] text-3xl font-bold">
            E-Liquids
          </h3>
          <p className="mt-2 max-w-sm text-sm text-white/75">
            Buy vape e-liquids online Australia and ship safely to your address
          </p>
          <span className="mt-5 inline-flex w-fit rounded-md bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider transition group-hover:bg-white group-hover:text-brand">
            Shop now
          </span>
        </div>
      </Link>
    </section>
  );
}

export function IgetBanner() {
  return (
    <section className="container-site py-6">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-brand via-brand-soft to-[#0e3d30] px-8 py-12 text-white md:px-12">
        <div className="cloud-drift pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="cloud-drift pointer-events-none absolute bottom-0 right-24 h-28 w-28 rounded-full bg-[#7DFFB3]/20 blur-xl [animation-delay:1.5s]" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7DFFB3]">
          New collection
        </p>
        <h2 className="mt-3 max-w-xl font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
          The Top Quality and Authentic IGET Vape Collection
        </h2>
        <Link
          href="/shop?brand=IGET"
          className="mt-6 inline-flex rounded-md bg-accent px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-brand"
        >
          Shop now
        </Link>
      </div>
    </section>
  );
}
