import { NextResponse } from "next/server";
import { dbInsert, deviceOf } from "@/lib/db";

/**
 * Empfehlungslinks fuer Partnerinnen: /r/<name> und kurze Direktlinks wie
 * /r/<name>/chanuka (04.11.26, Frage Shoshana). Merkt sich den Namen 60 Tage
 * im Cookie "sj_ref" und fuehrt zur gewuenschten Seite. Alt bleibt
 * ?to=/pfad moeglich. Siehe lib/ref.ts fuer die Auswertung.
 */

/** Kurze Ziele fuer Direktlinks, so in /studio/partners angeboten */
export const REF_TARGETS: Record<string, { path: string; he: string }> = {
  chanuka: { path: "/carlebach#chanuka", he: "ישר לחנוכיה" },
  en: { path: "/en", he: "האתר באנגלית" },
  "en-chanuka": { path: "/en#chanuka", he: "החנוכיה באנגלית" },
};

export function refRedirect(request: Request, code: string, target?: string) {
  const url = new URL(request.url);
  const to = url.searchParams.get("to");
  const fromTarget = target ? REF_TARGETS[target.toLowerCase()]?.path : undefined;
  const dest = fromTarget ?? (to && /^\/[a-z0-9/_#-]*$/i.test(to) ? to : "/carlebach");
  const res = NextResponse.redirect(new URL(dest, url.origin), 302);
  const clean = code.toLowerCase();
  if (!/^[a-z0-9-]{2,40}$/.test(clean)) return Promise.resolve(res);

  res.cookies.set("sj_ref", clean, { maxAge: 60 * 60 * 24 * 60, path: "/", sameSite: "lax" });
  // Klickzaehler fuer /studio (anonym), Vorschau-Roboter zaehlen nicht
  const ua = request.headers.get("user-agent");
  if (/bot|crawl|spider|preview|facebookexternalhit|whatsapp|telegram|slack|discord/i.test(ua ?? "")) return Promise.resolve(res);
  return dbInsert("events", {
    type: "ref_click",
    ref: clean,
    path: dest,
    device: deviceOf(ua),
    country: request.headers.get("x-vercel-ip-country")?.slice(0, 4) ?? null,
    source: (() => {
      try {
        return new URL(request.headers.get("referer") ?? "").hostname.slice(0, 120) || null;
      } catch {
        return null;
      }
    })(),
  }).then(() => res);
}
