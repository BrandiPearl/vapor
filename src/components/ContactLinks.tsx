"use client";

import { useSiteSettings } from "@/components/SettingsProvider";
import { getWhatsAppContactUrl } from "@/lib/site";

/** Footer chat links, driven by the settings the owner edits in /admin. */
export function ContactLinks() {
  const { settings } = useSiteSettings();
  const whatsappUrl = getWhatsAppContactUrl(undefined, settings.whatsappNumber);

  return (
    <>
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block text-sm text-white/80 hover:text-white"
        >
          WhatsApp
        </a>
      )}
      <a
        href={settings.telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1.5 block text-sm text-white/80 hover:text-white"
      >
        Telegram
      </a>
    </>
  );
}
