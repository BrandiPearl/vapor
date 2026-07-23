import Link from "next/link";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[var(--hero-from)] via-[var(--hero-via)] to-[var(--hero-to)] text-white min-h-[min(100svh,920px)] md:min-h-[84vh]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-texture.svg')] opacity-50" />
        <div className="hero-aurora absolute -left-1/4 top-[-20%] h-[70%] w-[80%] rounded-full bg-[radial-gradient(circle,rgba(125,255,179,0.28),transparent_68%)]" />
        <div className="hero-aurora absolute -right-1/5 bottom-[-10%] h-[60%] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_70%)] [animation-delay:2.5s]" />
        <div className="cloud-drift absolute left-[8%] top-[18%] h-40 w-64 rounded-full bg-[#7DFFB3]/12 blur-3xl" />
        <div className="cloud-drift absolute bottom-[12%] right-[5%] h-52 w-72 rounded-full bg-white/10 blur-3xl [animation-delay:1.8s]" />
        <div className="vapor-sheet absolute inset-x-0 top-[28%] h-40 opacity-40" />
        <div className="vapor-sheet vapor-sheet-slow absolute inset-x-0 top-[42%] h-32 opacity-25 [animation-delay:3s]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      <div className="container-site relative grid min-h-[inherit] items-center gap-6 py-10 sm:gap-8 sm:py-14 md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:py-20">
        <div className="relative z-10 max-w-2xl pt-2 md:pb-0">
          <p className="fade-up text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#9AF5C8] sm:text-xs sm:tracking-[0.28em]">
            Australia&apos;s #1 Online Vape Shop
          </p>
          <h1 className="fade-up mt-4 font-[family-name:var(--font-display)] text-[2.65rem] font-bold leading-[0.96] tracking-tight sm:mt-5 sm:text-5xl md:text-7xl lg:text-8xl [animation-delay:80ms]">
            Aussie Cloud Vape
          </h1>
          <p className="fade-up mt-4 max-w-xl text-[0.95rem] leading-relaxed text-white/80 sm:mt-6 sm:text-base md:text-lg [animation-delay:160ms]">
            Authentic disposables, pods, devices and e-liquids. Fast, discreet
            delivery across Australia.
          </p>
          <div className="fade-up mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 [animation-delay:240ms]">
            <Link
              href="/shop"
              className="cta-shine relative inline-flex w-full items-center justify-center overflow-hidden rounded-md bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#0b1f1a] shadow-[0_0_0_1px_rgba(125,255,179,0.35),0_12px_40px_rgba(0,0,0,0.25)] transition duration-300 hover:bg-[#7DFFB3] sm:w-auto"
            >
              Shop now
            </Link>
            <Link
              href="/shop?sort=popularity"
              className="inline-flex w-full items-center justify-center py-2 text-sm font-semibold text-white/80 underline-offset-4 transition hover:text-[#7DFFB3] hover:underline sm:w-auto sm:justify-start"
            >
              See bestsellers
            </Link>
          </div>
        </div>

        <div className="fade-up relative mx-auto flex w-full max-w-[280px] items-end justify-center sm:max-w-[360px] md:max-w-[620px] md:justify-self-end [animation-delay:180ms]">
          <div className="hero-glow pointer-events-none absolute left-1/2 top-1/3 h-[70%] w-[75%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(125,255,179,0.35),transparent_68%)] blur-2xl" />
          <div className="pointer-events-none absolute inset-x-10 bottom-1 h-16 rounded-full bg-black/40 blur-2xl sm:h-24 md:inset-x-24" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-person-framed.png"
            alt=""
            width={704}
            height={1530}
            className="hero-float relative mx-auto h-auto w-full max-h-[42vh] object-contain object-bottom drop-shadow-[0_28px_60px_rgba(0,0,0,0.45)] sm:max-h-[52vh] md:max-h-[84vh]"
          />
        </div>
      </div>
    </section>
  );
}
