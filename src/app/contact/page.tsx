"use client";

import { FormEvent, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="container-site py-14">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Get in touch
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-brand">
            Message us
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            We offer authentic vape products, competitive prices, fast
            Australia-wide delivery, secure payments, reliable support, and a
            hassle-free online shopping experience.
          </p>

          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-accent" />
              Brisbane, Australia
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-accent" />
              <a
                href="mailto:sales@aussiecloudvape.com.au"
                className="hover:text-accent"
              >
                sales@aussiecloudvape.com.au
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-accent" />
              1300 CLOUD VAPE
            </li>
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="border border-border bg-surface p-6 md:p-8"
        >
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-brand">
            Contact Us
          </h2>

          {sent ? (
            <p className="mt-6 rounded-md bg-[#e8f7ef] px-4 py-3 text-sm text-accent">
              Thanks — your message has been received. We&apos;ll get back to
              you shortly.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium">
                    First name <span className="text-sale">*</span>
                  </span>
                  <input
                    required
                    name="first"
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium">
                    Last name <span className="text-sale">*</span>
                  </span>
                  <input
                    required
                    name="last"
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
                  />
                </label>
              </div>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">
                  Email <span className="text-sale">*</span>
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">
                  Message <span className="text-sale">*</span>
                </span>
                <textarea
                  required
                  name="message"
                  rows={5}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
                />
              </label>
              <button
                type="submit"
                className="rounded-md bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-soft"
              >
                Send
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
