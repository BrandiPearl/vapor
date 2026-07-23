"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/site";
import { selectCartCount, useCart } from "@/lib/cart-store";
import { clsx } from "clsx";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCart(selectCartCount);
  const hasHydrated = useCart((s) => s.hasHydrated);

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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-border/80 bg-surface/95 shadow-sm backdrop-blur-md"
            : "border-transparent bg-surface",
        )}
      >
        <div className="container-site flex h-14 items-center justify-between gap-2 sm:h-16 md:h-[4.75rem] md:gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Image
              src="/logo.svg"
              alt="Aussie Cloud Vape"
              width={64}
              height={64}
              className="h-10 w-10 shrink-0 drop-shadow-sm sm:h-12 sm:w-12 md:h-[3.75rem] md:w-[3.75rem]"
              priority
            />
            <span className="truncate font-[family-name:var(--font-display)] text-base font-bold tracking-tight text-brand sm:text-lg md:text-2xl">
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

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
            <Link
              href="/account"
              className="hidden rounded-md p-2.5 text-brand transition hover:bg-background sm:inline-flex"
              aria-label="My account"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/cart"
              className="relative inline-flex rounded-md p-2.5 text-brand transition hover:bg-background"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
            {mounted && hasHydrated && totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-sale px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
            </Link>
            <button
              type="button"
              className="inline-flex rounded-md p-2.5 text-brand lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-drawer"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile side drawer */}
      <div className="lg:hidden" aria-hidden={!open}>
        <button
          type="button"
          className={clsx(
            "fixed inset-0 z-[60] bg-brand/50 backdrop-blur-[2px] transition-opacity duration-300",
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0",
          )}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />

        <aside
          id="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={clsx(
            "fixed inset-y-0 right-0 z-[70] flex w-[min(20rem,88vw)] flex-col bg-surface shadow-2xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.svg"
                alt=""
                width={40}
                height={40}
                className="h-9 w-9"
              />
              <p className="font-[family-name:var(--font-display)] text-base font-bold text-brand">
                Menu
              </p>
            </div>
            <button
              type="button"
              className="inline-flex rounded-md p-2 text-brand hover:bg-background"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "rounded-md px-3 py-3.5 text-base font-medium transition",
                  pathname === link.href
                    ? "bg-brand text-white"
                    : "text-foreground hover:bg-background",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/account"
              className={clsx(
                "mt-1 rounded-md px-3 py-3.5 text-base font-medium transition sm:hidden",
                pathname === "/account"
                  ? "bg-brand text-white"
                  : "text-foreground hover:bg-background",
              )}
            >
              My account
            </Link>
          </nav>

          <div className="border-t border-border p-4">
            <Link
              href="/shop"
              className="flex min-h-11 items-center justify-center rounded-md bg-brand px-4 py-3 text-sm font-bold uppercase tracking-wider text-white"
            >
              Shop all
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
