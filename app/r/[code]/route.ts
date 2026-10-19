import { NextResponse } from "next/server";

/**
 * Empfehlungslink fuer Partnerinnen: /r/<name>
 * Merkt sich den Namen 60 Tage im Cookie "sj_ref" und fuehrt zur
 * Carlebach-Seite. Optional ?to=/pfad fuer ein anderes Ziel auf der Website.
 * Siehe lib/ref.ts fuer die Auswertung.
 */
export function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  return params.then(({ code }) => {
    const url = new URL(request.url);
    const to = url.searchParams.get("to");
    const target = to && /^\/[a-z0-9/_#-]*$/i.test(to) ? to : "/carlebach";
    const res = NextResponse.redirect(new URL(target, url.origin), 302);
    const clean = code.toLowerCase();
    if (/^[a-z0-9-]{2,40}$/.test(clean)) {
      res.cookies.set("sj_ref", clean, { maxAge: 60 * 60 * 24 * 60, path: "/", sameSite: "lax" });
    }
    return res;
  });
}
