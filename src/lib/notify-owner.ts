/**
 * Push a short alert to the store owner.
 * Configure one (or more) of:
 *   OWNER_NOTIFY_WEBHOOK_URL  - POST JSON { text, kind, meta }
 *   OWNER_NTFY_TOPIC          - ntfy.sh topic (install ntfy app on phone)
 *   OWNER_CALLMEBOT_APIKEY    - CallMeBot WhatsApp API key
 *   NEXT_PUBLIC_WHATSAPP_NUMBER / OWNER_WHATSAPP_NUMBER
 */

function ownerWhatsAppDigits() {
  return (
    process.env.OWNER_WHATSAPP_NUMBER?.replace(/\D/g, "") ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ||
    ""
  );
}

export async function notifyOwner(input: {
  text: string;
  kind: "visit" | "order";
  meta?: Record<string, unknown>;
}) {
  const results: string[] = [];
  const phone = ownerWhatsAppDigits();

  const webhook = process.env.OWNER_NOTIFY_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input.text,
          kind: input.kind,
          meta: input.meta ?? {},
        }),
      });
      results.push(res.ok ? "webhook:ok" : `webhook:${res.status}`);
    } catch {
      results.push("webhook:error");
    }
  }

  const topic = process.env.OWNER_NTFY_TOPIC?.trim();
  if (topic) {
    try {
      const res = await fetch(`https://ntfy.sh/${encodeURIComponent(topic)}`, {
        method: "POST",
        headers: {
          Title:
            input.kind === "order"
              ? "Aussie Cloud Vape - New order"
              : "Aussie Cloud Vape - New visitor",
          Priority: input.kind === "order" ? "high" : "default",
        },
        body: input.text,
      });
      results.push(res.ok ? "ntfy:ok" : `ntfy:${res.status}`);
    } catch {
      results.push("ntfy:error");
    }
  }

  const callmebotKey = process.env.OWNER_CALLMEBOT_APIKEY?.trim();
  if (callmebotKey && phone) {
    try {
      const url = new URL("https://api.callmebot.com/whatsapp.php");
      url.searchParams.set("phone", phone);
      url.searchParams.set("text", input.text);
      url.searchParams.set("apikey", callmebotKey);
      const res = await fetch(url.toString());
      results.push(res.ok ? "whatsapp:ok" : `whatsapp:${res.status}`);
    } catch {
      results.push("whatsapp:error");
    }
  }

  return results;
}
