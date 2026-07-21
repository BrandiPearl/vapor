import Link from "next/link";

export function Hero() {
  return (
    <section className="relative isolate min-h-[78vh] overflow-hidden bg-gradient-to-br from-[var(--hero-from)] via-[var(--hero-via)] to-[var(--hero-to)] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[url('/hero-texture.svg')] opacity-40" />
        <div className="cloud-drift absolute -left-16 top-20 h-56 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="cloud-drift absolute bottom-10 right-0 h-64 w-72 rounded-full bg-[#7DFFB3]/18 blur-3xl [animation-delay:2s]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/25 to-transparent" />
      </div>

      <div className="container-site relative flex min-h-[78vh] flex-col justify-center py-20">
        <div className="fade-up max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9AF5C8]">
            Australia&apos;s #1 Online Vape Shop
          </p>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Aussie Cloud Vape
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            Shop from our top quality and authentic disposable vapes, vape pods,
            vape devices, vape mods, e-liquids, vape kits and vaporizers online.
          </p>
          <div className="mt-9">
            <Link
              href="/shop"
              className="inline-flex rounded-md bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-brand transition hover:bg-[#7DFFB3]"
            >
              Shop now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
