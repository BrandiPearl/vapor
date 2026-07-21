"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { clsx } from "clsx";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCart((s) => s.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-border/80 bg-surface/95 shadow-sm backdrop-blur-md"
          : "border-transparent bg-surface",
      )}
    >
      <div className="container-site flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Aussie Cloud Vape"
            width={44}
            height={44}
            className="h-10 w-10 md:h-11 md:w-11"
            priority
          />
          <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-brand md:text-xl">
            Aussie Cloud Vape
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "rounded-md px-3 py-2 text-sm font-medium transition",
                pathname === link.href
                  ? "bg-brand text-white"
                  : "text-foreground/80 hover:bg-background hover:text-brand",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/account"
            className="hidden rounded-md p-2 text-brand transition hover:bg-background sm:inline-flex"
            aria-label="My account"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex rounded-md p-2 text-brand transition hover:bg-background"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-sale px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="inline-flex rounded-md p-2 text-brand lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-surface lg:hidden">
          <div className="container-site flex flex-col py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "rounded-md px-3 py-3 text-sm font-medium",
                  pathname === link.href
                    ? "bg-brand text-white"
                    : "hover:bg-background",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
