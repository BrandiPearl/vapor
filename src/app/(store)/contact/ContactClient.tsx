"use client";

import { FormEvent, useState } from "react";
import { Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { getWhatsAppContactUrl } from "@/lib/site";
import { STORE_ORDER_EMAIL } from "@/lib/settings";
import { useSiteSettings } from "@/components/SettingsProvider";

export default function ContactClient() {
  const [sent, setSent] = useState(false);
  const { settings } = useSiteSettings();
  const telegramUrl = settings.telegramUrl;
  const orderEmail = settings.orderEmail || STORE_ORDER_EMAIL;
  const whatsappUrl = getWhatsAppContactUrl(
    "Hi Aussie Cloud Vape, I have a question.",
    settings.whatsappNumber,
  );
  const mailtoUrl = `mailto:${orderEmail}`;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const first = String(data.get("first") || "").trim();
    const last = String(data.get("last") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = `Contact from ${first} ${last}`.trim();
    const body = [
      `Name: ${first} ${last}`.trim(),
      `Email: ${email}`,
      "",
      message,
    ].join("\n");
    window.location.href = `mailto:${encodeURIComponent(orderEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
            Email{" "}
            <a
              href={mailtoUrl}
              className="font-medium text-accent hover:underline"
            >
              {orderEmail}
            </a>
            , or reach us on WhatsApp or Telegram for the fastest reply.
            We&apos;re happy to help with orders, stock, and delivery.
          </p>

          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-accent" />
              Brisbane, Australia
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-accent" />
              <a
                href={mailtoUrl}
                className="font-medium text-accent hover:underline"
              >
                {orderEmail}
              </a>
            </li>
            {whatsappUrl && (
              <li className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-accent" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent hover:underline"
                >
                  WhatsApp us
                </a>
              </li>
            )}
            <li className="flex items-center gap-3">
              <Send className="h-4 w-4 text-accent" />
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent hover:underline"
              >
                Telegram
              </a>
            </li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={mailtoUrl}
              className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-soft"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-brand bg-white px-5 py-3 text-sm font-bold uppercase tracking-wider text-brand transition hover:bg-[#e8f7ef]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            )}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-brand bg-white px-5 py-3 text-sm font-bold uppercase tracking-wider text-brand transition hover:bg-[#e8f7ef]"
            >
              <Send className="h-4 w-4" />
              Telegram
            </a>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="border border-border bg-surface p-6 md:p-8"
        >
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-brand">
            Contact Us
          </h2>
          <p className="mt-2 text-sm text-muted">
            Sends an email to {orderEmail} from your mail app.
          </p>

          {sent ? (
            <p className="mt-6 rounded-md bg-[#e8f7ef] px-4 py-3 text-sm text-accent">
              Your email app should open with the message ready. Hit Send if it
              hasn&apos;t already.
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
