"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { faqs } from "@/lib/products";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="container-site py-16">
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-brand md:text-3xl">
        FAQs — Aussie Cloud Vape
      </h2>
      <div className="mt-8 divide-y divide-border border-y border-border bg-surface">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={faq.q}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-foreground">{faq.q}</span>
                <ChevronDown
                  className={clsx(
                    "h-5 w-5 shrink-0 text-muted transition",
                    isOpen && "rotate-180 text-accent",
                  )}
                />
              </button>
              <div
                className={clsx(
                  "grid transition-all duration-300",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
