"use client";

import { useEffect, useState } from "react";

export function AgeGate() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ok = localStorage.getItem("acv-age-verified");
    if (!ok) setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-surface p-8 text-center shadow-2xl">
        <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-brand">
          Aussie Cloud Vape
        </p>
        <h2 className="mt-4 text-xl font-semibold">Are you 18 or older?</h2>
        <p className="mt-2 text-sm text-muted">
          You must be of legal smoking age to enter this website. Nicotine
          products are addictive and not for sale to minors.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => {
              localStorage.setItem("acv-age-verified", "1");
              setOpen(false);
            }}
            className="flex-1 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            Yes, I am 18+
          </button>
          <a
            href="https://www.health.gov.au/"
            className="flex-1 rounded-md border border-border px-4 py-3 text-sm font-semibold transition hover:bg-background"
          >
            No, exit
          </a>
        </div>
      </div>
    </div>
  );
}
