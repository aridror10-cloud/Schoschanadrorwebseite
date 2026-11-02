import { NextResponse } from "next/server";
import { dbInsert, deviceOf } from "@/lib/db";

/**
 * Nimmt anonyme Ereignisse der Website an (lib/analytics.ts) und legt sie in
 * Supabase ab. Kein Cookie, keine IP, keine Namen: nur eine zufaellige
 * Besuchsnummer pro Tab, die Seite, die Herkunft und das Land (von Vercel).
 */

const TYPES = new Set([
  "page_view",
  "add_to_cart",
  "checkout",
  "purchase",
  "lead",
  "phone_click",
  "mail_click",
  "video_play",
  "quiz_start",
  "quiz_answer",
  "quiz_result",
  "cta_click",
  "lightbox_open",
  "scroll_75",
]);

const RECENT = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const past = (RECENT.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (past.length >= 60) return true;
  past.push(now);
  if (RECENT.size > 5000) RECENT.clear();
  RECENT.set(ip, past);
  return false;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : null);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "?";
  if (limited(ip)) return new NextResponse(null, { status: 204 });
  let b: Record<string, unknown>;
  try {
    b = JSON.parse(await req.text()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  const type = str(b.type, 40);
  if (!type || !TYPES.has(type)) return new NextResponse(null, { status: 204 });
  // Bots nicht mitzaehlen
  const ua = req.headers.get("user-agent");
  if (/bot|crawl|spider|preview|headless|lighthouse/i.test(ua ?? "")) return new NextResponse(null, { status: 204 });

  const ref = str(b.ref, 40);
  const data = b.data && typeof b.data === "object" ? JSON.stringify(b.data).length < 2000 ? b.data : {} : {};
  await dbInsert("events", {
    session: str(b.session, 40),
    type,
    path: str(b.path, 300),
    ref: ref && /^[a-z0-9-]{2,40}$/.test(ref) ? ref : null,
    source: str(b.source, 120),
    lang: b.lang === "en" ? "en" : b.lang === "he" ? "he" : null,
    device: deviceOf(ua),
    country: str(req.headers.get("x-vercel-ip-country"), 4),
    data,
  });
  return new NextResponse(null, { status: 204 });
}
