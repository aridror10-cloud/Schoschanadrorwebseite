import { NextResponse } from "next/server";
import { MAX_QTY, MODELS, isModelKey, isVersion, type ModelKey, type Version } from "@/lib/cart";
import { content } from "@/lib/content";
import { generatePaymentLink, payplusConfig, type PayPlusItem } from "@/lib/payplus";

/**
 * Zweite Kasse: baut aus dem Korb eine PayPlus-Zahlseite (02.11.26).
 * Gleiche Eingabe wie /api/cart (SUMIT), das bleibt unberuehrt.
 *
 * Preise kommen nur vom Server (lib/cart.ts MODELS), nie aus dem Browser.
 * PayPlus legt Produkte, die es noch nicht kennt, beim ersten Kauf unter
 * ihrem Namen selbst an. Neue Werke brauchen also nur einen Eintrag in
 * MODELS und einen Namen in content.ts.
 *
 * Versand: 50 ₪ pro Bestellung, mit einem Set gratis (wie bisher).
 * Shoshana ist עוסק פטור, daher vat_type 2 (ohne MwSt).
 */

const SHIPPING = 50;
const FREE_SHIPPING: ModelKey[] = ["set", "sukkotSet"];

const RECENT = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const past = (RECENT.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  if (past.length >= 30) return true;
  past.push(now);
  if (RECENT.size > 5000) RECENT.clear();
  RECENT.set(ip, past);
  return false;
}

interface Line {
  model: ModelKey;
  version: Version;
  qty: number;
}

function parseLines(raw: unknown): Line[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const lines: Line[] = [];
  for (const item of raw.slice(0, 12)) {
    if (typeof item !== "object" || item === null) continue;
    const { model, version, qty } = item as Record<string, unknown>;
    if (typeof model !== "string" || !isModelKey(model)) continue;
    if (typeof version !== "string" || !isVersion(version)) continue;
    const n = Math.floor(Number(qty));
    if (!Number.isFinite(n) || n < 1 || n > MAX_QTY) continue;
    const id = `${model}:${version}`;
    if (seen.has(id)) continue;
    seen.add(id);
    lines.push({ model, version, qty: n });
  }
  return lines;
}

export async function POST(req: Request) {
  if (!payplusConfig()) return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unbekannt";
  if (limited(ip)) return NextResponse.json({ error: "rate" }, { status: 429 });

  let lines: Line[];
  let lang: "he" | "en" = "he";
  let delivery: "ship" | "pickup" = "ship";
  let ref = "";
  try {
    const body = (await req.json()) as { lines?: unknown; lang?: unknown; delivery?: unknown; ref?: unknown };
    lines = parseLines(body.lines);
    if (body.lang === "en") lang = "en";
    if (body.delivery === "pickup") delivery = "pickup";
    if (typeof body.ref === "string" && /^[a-z0-9-]{2,40}$/.test(body.ref)) ref = body.ref;
  } catch {
    return NextResponse.json({ error: "bad" }, { status: 400 });
  }
  if (lines.length === 0) return NextResponse.json({ error: "bad" }, { status: 400 });

  const t = content[lang].cart;
  const items: PayPlusItem[] = lines.map((l) => ({
    // Fassung im Namen, damit auf Beleg und Bestellung steht, was gefertigt wird
    name: l.model === "chanuka" ? t.names[l.model] : `${t.names[l.model]} (${l.version === "with" ? t.versionWith : t.versionWithout})`,
    quantity: l.qty,
    price: MODELS[l.model].price,
    vat_type: 2,
  }));
  const free = lines.some((l) => FREE_SHIPPING.includes(l.model));
  if (delivery === "ship") {
    items.push({
      name: lang === "he" ? (free ? "משלוח עד הבית (חינם עם סט)" : "משלוח עד הבית") : free ? "Home delivery (free with a set)" : "Home delivery",
      quantity: 1,
      price: free ? 0 : SHIPPING,
      vat_type: 2,
      shipping: true,
    });
  }
  const amount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const origin = new URL(req.url).origin;
  const summary = lines.map((l) => `${l.model}:${l.version}x${l.qty}`).join(",") + `|${delivery}`;
  try {
    const url = await generatePaymentLink({
      amount,
      items,
      language: lang,
      successUrl: `${origin}/toda?kasse=payplus`,
      failureUrl: `${origin}/${lang === "en" ? "en" : "carlebach"}?kasse=fehler`,
      cancelUrl: `${origin}/${lang === "en" ? "en" : "carlebach"}`,
      callbackUrl: `${origin}/api/payplus/callback`,
      moreInfo: ref,
      moreInfo2: summary,
    });
    return NextResponse.json({ url });
  } catch (e) {
    console.error("payplus generateLink", e);
    return NextResponse.json({ error: "payplus" }, { status: 502 });
  }
}
