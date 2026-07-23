import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyOwner } from "@/lib/notify-owner";

const SESSION_NOTIFY_HOURS = 12;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sessionId?: string;
      path?: string;
      referrer?: string;
    };

    const sessionId = body.sessionId?.trim();
    if (!sessionId || sessionId.length < 8 || sessionId.length > 80) {
      return NextResponse.json({ error: "Invalid session." }, { status: 400 });
    }

    const path = (body.path || "/").slice(0, 300);
    const referrer = (body.referrer || "").slice(0, 500);
    const userAgent = (request.headers.get("user-agent") || "").slice(0, 400);

    const supabase = createAdminClient();

    const since = new Date(
      Date.now() - SESSION_NOTIFY_HOURS * 60 * 60 * 1000,
    ).toISOString();

    const { data: recent } = await supabase
      .from("site_visits")
      .select("id, notified")
      .eq("session_id", sessionId)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5);

    const alreadyNotified = (recent || []).some((r) => r.notified);
    const shouldNotify = !alreadyNotified;

    const { error } = await supabase.from("site_visits").insert({
      session_id: sessionId,
      path,
      referrer: referrer || null,
      user_agent: userAgent || null,
      notified: shouldNotify,
    });

    if (error) {
      console.error("visit insert", error);
      return NextResponse.json(
        {
          error:
            error.code === "42P01"
              ? "Visits table missing. Run supabase/schema-orders-visits.sql."
              : "Could not log visit.",
        },
        { status: 500 },
      );
    }

    if (shouldNotify) {
      const channels = await notifyOwner({
        kind: "visit",
        text: `New visitor on Aussie Cloud Vape\nPage: ${path}${referrer ? `\nFrom: ${referrer}` : ""}`,
        meta: { path, referrer, sessionId },
      });
      return NextResponse.json({ logged: true, notified: true, channels });
    }

    return NextResponse.json({ logged: true, notified: false });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not log visit." }, { status: 500 });
  }
}
