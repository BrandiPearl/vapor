"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { logoutAction } from "@/lib/admin/auth-actions";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/products/new", label: "Add product" },
];

export function AdminNav({ email }: { email?: string | null }) {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3.5">
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 font-[family-name:var(--font-display)] text-lg font-bold text-brand"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" className="h-9 w-9" />
            ACV Admin
          </Link>
          <nav className="flex flex-wrap gap-1">
            {links.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === link.href ||
                    (link.href !== "/admin/products/new" &&
                      pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition",
                    active
                      ? "bg-brand text-white"
                      : "text-foreground/80 hover:bg-background hover:text-brand",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/"
            className="font-medium text-muted transition hover:text-brand"
          >
            View store
          </Link>
          {email && (
            <span className="hidden max-w-[180px] truncate text-muted sm:inline">
              {email}
            </span>
          )}
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-md border border-border px-3 py-1.5 font-medium text-foreground transition hover:bg-background"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
