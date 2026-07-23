"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/lib/admin/auth-actions";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl text-foreground">
        <div className="mb-6 flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 shrink-0"
          />
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl font-bold text-brand">
              Aussie Cloud Vape
            </p>
            <p className="text-sm text-muted">Admin sign in</p>
          </div>
        </div>

        <form
          action={(formData) => {
            setError(null);
            startTransition(async () => {
              const result = await loginAction(formData);
              if (result && !result.ok) setError(result.error);
            });
          }}
          className="space-y-4"
        >
          <input type="hidden" name="next" value={next} />
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Password</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
            />
          </label>

          {error && <p className="text-sm text-sale">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-brand px-4 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-soft disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/" className="hover:text-accent">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}
