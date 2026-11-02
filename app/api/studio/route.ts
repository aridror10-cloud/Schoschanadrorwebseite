import { NextResponse } from "next/server";
import { dbUpdate } from "@/lib/db";
import { isStudioUser, passwordMatches, studioCookie } from "@/lib/studio-auth";

/** Anmelden, Abmelden und Status einer Anfrage aendern (Formulare auf /studio). */

const TRIES = new Map<string, number[]>();

export async function POST(req: Request) {
  const form = await req.formData();
  const action = String(form.get("action") ?? "");
  const back = new URL("/studio", req.url);

  if (action === "login") {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "?";
    const now = Date.now();
    const past = (TRIES.get(ip) ?? []).filter((t) => now - t < 15 * 60_000);
    if (past.length >= 8) return NextResponse.redirect(new URL("/studio?e=zu-viele", req.url), 303);
    past.push(now);
    TRIES.set(ip, past);
    if (!passwordMatches(String(form.get("password") ?? ""))) {
      return NextResponse.redirect(new URL("/studio?e=falsch", req.url), 303);
    }
    const res = NextResponse.redirect(back, 303);
    const c = studioCookie();
    res.cookies.set(c.name, c.value, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
    return res;
  }

  if (!(await isStudioUser())) return NextResponse.redirect(back, 303);

  if (action === "logout") {
    const res = NextResponse.redirect(back, 303);
    res.cookies.set(studioCookie().name, "", { path: "/", maxAge: 0 });
    return res;
  }

  if (action === "status") {
    const id = Number(form.get("id"));
    const status = String(form.get("status"));
    if (Number.isInteger(id) && ["neu", "in_arbeit", "erledigt"].includes(status)) {
      await dbUpdate("leads", `id=eq.${id}`, { status });
    }
    const days = String(form.get("days") ?? "");
    return NextResponse.redirect(new URL(`/studio${/^\d+$/.test(days) ? `?d=${days}` : ""}#anfragen`, req.url), 303);
  }

  return NextResponse.redirect(back, 303);
}
