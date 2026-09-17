import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/settings-server";

export const dynamic = "force-dynamic";

/**
 * Lets prerendered pages (cart, checkout, layout chrome) pick up settings
 * changes without a rebuild. Short shared cache keeps this cheap under load
 * while staying fresh within a minute of a save.
 */
export async function GET() {
  const settings = await getSiteSettings();

  return NextResponse.json(settings, {
    headers: {
      "cache-control":
        "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
