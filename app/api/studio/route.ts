import { NextResponse } from "next/server";
import { dbRpc } from "@/lib/db";
import { STUDIO_COOKIE, studioToken } from "@/lib/studio-auth";

/**
 * Passwort festlegen, Anmelden, Abmelden und Status einer Anfrage aendern
 * (Formulare auf /studio). Seit 03.11.26 auch die Partnerverwaltung von
 * /studio/partners: Partner anlegen/aendern, Verkaeufe bezahlt markieren,
 * Verkauf nachtragen. "back" bestimmt, wohin es danach zurueckgeht.
 */

const BACKS = new Set(["/studio", "/studio/partners"]);

// Hebraeische Namen grob in lateinische Buchstaben fuer den Link
const HE: Record<string, string> = {
  א: "a", ב: "b", ג: "g", ד: "d", ה: "h", ו: "v", ז: "z", ח: "ch", ט: "t", י: "y", כ: "k", ך: "ch", ל: "l",
  מ: "m", ם: "m", נ: "n", ן: "n", ס: "s", ע: "a", פ: "p", ף: "f", צ: "tz", ץ: "tz", ק: "k", ר: "r", ש: "sh", ת: "t",
};
function slug(v: string): string {
  const s = v
    .toLowerCase()
    .split("")
    .map((c) => HE[c] ?? c)
    .join("")
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  return s.length >= 2 ? s : "";
}

const COOKIE_OPTS = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 30 };

export async function POST(req: Request) {
  const form = await req.formData();
  const action = String(form.get("action") ?? "");
  const backRaw = String(form.get("back") ?? "/studio");
  const back = BACKS.has(backRaw) ? backRaw : "/studio";
  const go = (q = "") => NextResponse.redirect(new URL(`${back}${q}`, req.url), 303);

  try {
    if (action === "setup") {
      const pw = String(form.get("password") ?? "");
      if (pw.length < 8) return go("?e=kurz");
      if (pw !== String(form.get("password2") ?? "")) return go("?e=ungleich");
      const token = await dbRpc<string>("studio_set_password", { p_new: pw });
      if (!token) return go("?e=gesetzt");
      const res = go();
      res.cookies.set(STUDIO_COOKIE, token, COOKIE_OPTS);
      return res;
    }

    if (action === "login") {
      const token = await dbRpc<string>("studio_login", { p_pw: String(form.get("password") ?? "") });
      if (token === "zu-viele") return go("?e=zu-viele");
      if (!token) return go("?e=falsch");
      const res = go();
      res.cookies.set(STUDIO_COOKIE, token, COOKIE_OPTS);
      return res;
    }

    const token = await studioToken();

    if (action === "logout") {
      if (token) await dbRpc("studio_logout", { p_token: token });
      const res = go();
      res.cookies.set(STUDIO_COOKIE, "", { path: "/", maxAge: 0 });
      return res;
    }

    if (action === "status" && token) {
      const id = Number(form.get("id"));
      const status = String(form.get("status"));
      if (Number.isInteger(id)) await dbRpc("studio_lead_status", { p_token: token, p_id: id, p_status: status });
      const days = String(form.get("days") ?? "");
      return go(`${/^\d+$/.test(days) ? `?d=${days}` : ""}#anfragen`);
    }

    // ----- Partner (Shoshana, /studio/partners) -----
    if (action === "partner_save" && token) {
      const name = String(form.get("name") ?? "").trim();
      const orig = String(form.get("orig") ?? "");
      let code = orig;
      if (!code) {
        const wanted = slug(String(form.get("code") ?? "")) || slug(name) || `p${Math.random().toString(36).slice(2, 7)}`;
        code = wanted;
        for (let i = 2; i < 50 && (await dbRpc<boolean>("partner_code_taken", { p_token: token, p_code: code })); i++) {
          code = `${wanted.slice(0, 36)}-${i}`;
        }
      }
      const pctNum = Number(String(form.get("pct") ?? "10").replace(",", "."));
      const r = await dbRpc<string>("partner_save", {
        p_token: token,
        p_code: code,
        p_name: name,
        p_phone: String(form.get("phone") ?? ""),
        p_email: String(form.get("email") ?? ""),
        p_pct: Number.isFinite(pctNum) ? pctNum : 10,
        p_note: String(form.get("note") ?? ""),
        p_active: form.get("active") !== "0",
      });
      if (r !== "ok") return go(`?e=${r ?? "db"}`);
      return go(`?ok=${orig ? "saved" : "new"}&p=${code}#p-${code}`);
    }

    if (action === "sale_set" && token) {
      const id = Number(form.get("id"));
      const what = String(form.get("what"));
      const code = String(form.get("code") ?? "");
      if (Number.isInteger(id)) await dbRpc("referral_sale_set", { p_token: token, p_id: id, p_action: what });
      return go(`?p=${encodeURIComponent(code)}#p-${encodeURIComponent(code)}`);
    }

    if (action === "pay_all" && token) {
      const code = String(form.get("code") ?? "");
      await dbRpc("referral_pay_all", { p_token: token, p_ref: code });
      return go(`?ok=paid&p=${encodeURIComponent(code)}#p-${encodeURIComponent(code)}`);
    }

    if (action === "sale_add" && token) {
      const code = String(form.get("code") ?? "");
      const total = Math.round(Number(String(form.get("total") ?? "").replace(",", ".")));
      const ok = await dbRpc<boolean>("referral_sale_add", {
        p_token: token,
        p_ref: code,
        p_total: total,
        p_note: String(form.get("note") ?? ""),
      });
      return go(`?${ok ? "ok=added" : "e=total"}&p=${encodeURIComponent(code)}#p-${encodeURIComponent(code)}`);
    }

    if (action === "sale_amount" && token) {
      const code = String(form.get("code") ?? "");
      const id = Number(form.get("id"));
      const total = Math.round(Number(String(form.get("total") ?? "").replace(",", ".")));
      const ok = Number.isInteger(id) && (await dbRpc<boolean>("referral_sale_amount", { p_token: token, p_id: id, p_total: total }));
      return go(`?${ok ? "ok=amount" : "e=total"}&p=${encodeURIComponent(code)}#p-${encodeURIComponent(code)}`);
    }

    if (action === "partner_delete" && token) {
      const r = await dbRpc<string>("partner_delete", { p_token: token, p_code: String(form.get("code") ?? "") });
      return go(r === "ok" ? "?ok=deleted" : `?e=${r ?? "db"}`);
    }

    if (action.startsWith("partner") || action.startsWith("sale") || action === "pay_all") return go("?e=login");
  } catch (e) {
    console.error("studio", action, e);
    return go("?e=db");
  }

  return go();
}
