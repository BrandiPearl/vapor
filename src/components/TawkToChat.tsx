"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: Record<string, unknown>;
    Tawk_LoadStart?: Date;
  }
}

/**
 * Loads the Tawk.to chat widget on the storefront.
 * Set NEXT_PUBLIC_TAWK_PROPERTY_ID + NEXT_PUBLIC_TAWK_WIDGET_ID from
 * Tawk → Administration → Channels → Chat Widget → embed code
 * (https://embed.tawk.to/{propertyId}/{widgetId}).
 */
export function TawkToChat() {
  useEffect(() => {
    const propertyId =
      process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID?.trim() ||
      "6a669992f72ee51d4882401d";
    const widgetId =
      process.env.NEXT_PUBLIC_TAWK_WIDGET_ID?.trim() || "1jugcfpk6";

    if (!propertyId) return;
    if (document.getElementById("tawkto-script")) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.id = "tawkto-script";
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
