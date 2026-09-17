"use client";

import Link from "next/link";
import { useSiteSettings } from "@/components/SettingsProvider";

export function AnnouncementBar() {
  const { settings } = useSiteSettings();
  const { enabled, text, href } = settings.announcement;

  if (!enabled || !text) return null;

  const content = (
    <span className="block px-4 py-2.5 text-center text-sm font-medium">
      {text}
    </span>
  );

  return (
    <div className="bg-brand text-white">
      {href ? (
        href.startsWith("/") ? (
          <Link href={href} className="block hover:bg-brand-soft">
            {content}
          </Link>
        ) : (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:bg-brand-soft"
          >
            {content}
          </a>
        )
      ) : (
        content
      )}
    </div>
  );
}
