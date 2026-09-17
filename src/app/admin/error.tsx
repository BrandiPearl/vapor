"use client";

import Link from "next/link";

export default function AdminError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f4f2] px-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-8 shadow-sm">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-brand">
          The admin could not load
        </h1>
        <p className="mt-2 text-sm text-muted">
          Something failed while rendering this page. Retry first — if it keeps
          failing, check the Worker logs for the reference below.
        </p>
        <p className="mt-4 break-words rounded-md bg-[#f3f5f3] px-3 py-2 font-mono text-xs text-foreground">
          {error.message}
          {error.digest ? ` (ref ${error.digest})` : ""}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-soft"
          >
            Try again
          </button>
          <Link
            href="/admin"
            className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold hover:border-accent"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
