import Link from "next/link";
import Image from "next/image";
import { footerLinks, navLinks } from "@/lib/products";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-brand text-white">
      <div className="container-site grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="" width={40} height={40} />
            <p className="font-[family-name:var(--font-display)] text-lg font-bold">
              Aussie Cloud Vape
            </p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Australia&apos;s trusted online destination for authentic disposable
            vapes, pods, devices, and e-liquids — discreet shipping nationwide.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/50">
            Explore
          </p>
          <ul className="mt-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/80 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/50">
            Policies
          </p>
          <ul className="mt-4 space-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/80 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Contact
            </p>
            <a
              href="mailto:sales@aussiecloudvape.com.au"
              className="mt-2 block text-sm text-white/80 hover:text-white"
            >
              sales@aussiecloudvape.com.au
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright © {new Date().getFullYear()} Aussie Cloud Vape. All rights
            reserved.
          </p>
          <p>18+ only. Nicotine is addictive. Consume responsibly.</p>
        </div>
      </div>
    </footer>
  );
}
