import { NextResponse } from "next/server";
import { MODELS, isModelKey } from "@/lib/cart";
import { content } from "@/lib/content";

/**
 * Meldet Shoshana per Mail einen abgeschlossenen Kauf, der ueber einen
 * Empfehlungslink kam (Aufruf von der Dankesseite, siehe lib/ref.ts).
 * Inhalt: Name des Links, Zeit, und - falls im Browser gemerkt - der Korb.
 * Den genauen Betrag bestaetigt der SUMIT-Beleg zur selben Zeit.
 */

const TO = process.env.ORDER_TO ?? "ssdror@gmail.com";
const FROM = process.env.ORDER_FROM ?? "Shoshana Judaica <onboarding@resend.dev>";

const RECENT = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const hits = (RECENT.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  if (hits.length >= 5) return true;
  hits.push(now);
  RECENT.set(ip, hits);
  if (RECENT.size > 5000) RECENT.clear();
  return false;
}

const esc = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(request: Request) {
  let data: { ref?: unknown; cart?: unknown };
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const ref = String(data.ref ?? "").toLowerCase();
  if (!/^[a-z0-9-]{2,40}$/.test(ref)) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) return NextResponse.json({ error: "too_many" }, { status: 429 });
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: "unconfigured" }, { status: 503 });

  // Korb nur mit bekannten Modellen und plausiblen Mengen uebernehmen
  const names = content.he.cart.names;
  const rows: string[] = [];
  let total = 0;
  const cart = data.cart as { lines?: unknown } | null;
  if (cart && Array.isArray(cart.lines)) {
    for (const l of cart.lines.slice(0, 12)) {
      const { model, version, qty } = (l ?? {}) as Record<string, unknown>;
      const n = Math.floor(Number(qty));
      if (typeof model !== "string" || !isModelKey(model) || !(n >= 1 && n <= 10)) continue;
      const ver = version === "without" ? "בלי פסוק" : "עם פסוק";
      rows.push(`${names[model]} (${ver}) × ${n}`);
      total += MODELS[model].price * n;
    }
  }

  const when = new Intl.DateTimeFormat("he-IL", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Jerusalem",
  }).format(new Date());

  const html = `
    <div dir="rtl" style="font-family:system-ui,Arial,sans-serif;background:#faf8f4;padding:28px">
      <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid rgba(171,145,73,.4);padding:26px 28px">
        <div style="font-size:12px;letter-spacing:1px;color:#ab9149">שושנה יודאיקה</div>
        <h1 style="font-size:19px;margin:8px 0 10px;color:#2e2e2e;font-weight:600">רכישה דרך קישור: ${esc(ref)}</h1>
        <p style="font-size:14px;color:#5c5c5c;margin:0 0 6px">לקוח שהגיע דרך הקישור הזה סיים תשלום באתר.</p>
        <p style="font-size:14px;color:#5c5c5c;margin:0 0 14px">זמן: ${esc(when)}</p>
        ${
          rows.length
            ? `<p style="font-size:14px;color:#2e2e2e;margin:0 0 4px"><b>הסל:</b></p><ul style="font-size:14px;color:#2e2e2e;margin:0 0 10px;padding-inline-start:20px">${rows
                .map((r) => `<li>${esc(r)}</li>`)
                .join("")}</ul><p style="font-size:14px;color:#2e2e2e;margin:0 0 4px"><b>סכום המוצרים:</b> ₪${total.toLocaleString("en-US")} (ללא משלוח)</p><p style="font-size:15px;color:#806a2b;margin:0 0 14px"><b>עמלה של 10% ל־${esc(ref)}:</b> ₪${Math.round(total / 10).toLocaleString("en-US")}</p>`
            : ""
        }
        <p style="font-size:13px;color:#77736a;margin:0">את הקבלה המדויקת אפשר לראות בסאמיט, בהזמנה מאותה שעה.</p>
      </div>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [TO], subject: total ? `רכישה דרך הקישור של ${ref}, עמלה ₪${Math.round(total / 10)}` : `רכישה דרך הקישור של ${ref}`, html }),
    });
    if (!res.ok) throw new Error(String(res.status));
  } catch {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
