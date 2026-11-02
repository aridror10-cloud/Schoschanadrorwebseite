import { NextResponse } from "next/server";
import { dbRpc } from "@/lib/db";
import { STUDIO_COOKIE, studioToken } from "@/lib/studio-auth";

/** Passwort festlegen, Anmelden, Abmelden und Status einer Anfrage aendern (Formulare auf /studio). */

const COOKIE_OPTS = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 30 };

export async function POST(req: Request) {
  const form = await req.formData();
  const action = String(form.get("action") ?? "");
  const go = (q = "") => NextResponse.redirect(new URL(`/studio${q}`, req.url), 303);

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
  } catch (e) {
    console.error("studio", action, e);
    return go("?e=db");
  }

  return go();
}
