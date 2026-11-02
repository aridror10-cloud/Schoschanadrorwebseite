import { NextResponse } from "next/server";
import { MODELS, isModelKey } from "@/lib/cart";
import { verifyCallback } from "@/lib/payplus";

/**
 * PayPlus meldet hier jede abgeschlossene Zahlung (refURL_callback).
 * Wir pruefen die Unterschrift und schicken Shoshana eine Mail mit Korb,
 * Versandart und, falls die Kundschaft ueber einen Empfehlungslink kam,
 * der 10%-Provision. Das laeuft auf dem Server, also auch dann, wenn die
 * Kundschaft das Fenster vor der Dankesseite schliesst.
 */

const TO = process.env.ORDER_TO ?? "ssdror@gmail.com";
const FROM = process.env.ORDER_FROM ?? "Shoshana Judaica <onboarding@resend.dev>";

const esc = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Obj = Record<string, unknown>;
const pick = (o: unknown, ...keys: string[]): unknown => {
  let cur: unknown = o;
  for (const k of keys) cur = cur && typeof cur === "object" ? (cur as Obj)[k] : undefined;
  return cur;
};

export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyCallback(raw, req.headers.get("hash"), req.headers.get("user-agent"))) {
    return NextResponse.json({ error: "signature" }, { status: 401 });
  }
  let body: Obj;
  try {
    body = JSON.parse(raw) as Obj;
  } catch {
    return NextResponse.json({ error: "bad" }, { status: 400 });
  }

  const tx = (pick(body, "transaction") ?? body) as Obj;
  const status = String(tx.status_code ?? "");
  if (status && status !== "000") return NextResponse.json({ ok: true, skipped: status });

  const amount = Number(tx.amount ?? pick(body, "data", "amount") ?? 0);
  const ref = String(tx.more_info ?? "").toLowerCase();
  const summary = String(tx.more_info_2 ?? "");
  const customer = {
    name: pick(body, "data", "customer_name") ?? pick(body, "data", "card_information", "card_holder_name") ?? "",
    email: pick(body, "data", "customer_email") ?? "",
    phone: pick(body, "data", "customer_phone") ?? "",
  };

  // Korb aus unserer eigenen Zusammenfassung: modell:fassung x menge, ... | versand
  const [linesPart = "", delivery = ""] = summary.split("|");
  let goods = 0;
  const rows: string[] = [];
  for (const entry of linesPart.split(",")) {
    const m = entry.match(/^([a-zA-Z]+):(with|without)x(\d{1,2})$/);
    if (!m || !isModelKey(m[1]!)) continue;
    const qty = Number(m[3]);
    goods += MODELS[m[1]!].price * qty;
    rows.push(`${m[1]} (${m[2] === "with" ? "עם פסוק" : "בלי פסוק"}) × ${qty}`);
  }

  if (!process.env.RESEND_API_KEY) return NextResponse.json({ ok: true, mail: "unconfigured" });

  const refLine = /^[a-z0-9-]{2,40}$/.test(ref)
    ? `<p style="font-size:15px;color:#806a2b;margin:0 0 12px"><b>דרך הקישור ${esc(ref)}, עמלה של 10%:</b> ₪${Math.round(goods / 10)}</p>`
    : "";
  const html = `
    <div dir="rtl" style="font-family:system-ui,Arial,sans-serif;background:#faf8f4;padding:28px">
      <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid rgba(171,145,73,.4);padding:26px 28px">
        <div style="font-size:12px;letter-spacing:1px;color:#ab9149">שושנה יודאיקה · פייפלוס</div>
        <h1 style="font-size:19px;margin:8px 0 12px;color:#2e2e2e;font-weight:600">תשלום חדש התקבל: ₪${esc(amount)}</h1>
        <p style="font-size:14px;color:#2e2e2e;margin:0 0 4px"><b>לקוח:</b> ${esc(customer.name)} ${esc(customer.phone)} ${esc(customer.email)}</p>
        <p style="font-size:14px;color:#2e2e2e;margin:0 0 4px"><b>אופן קבלה:</b> ${delivery === "pickup" ? "איסוף עצמי" : "משלוח עד הבית"}</p>
        ${rows.length ? `<ul style="font-size:14px;color:#2e2e2e;margin:8px 0 10px;padding-inline-start:20px">${rows.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>` : ""}
        ${refLine}
        <p style="font-size:13px;color:#77736a;margin:0">כתובת המשלוח והקבלה המלאה נמצאות בפייפלוס, בעסקה הזאת.</p>
      </div>
    </div>`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        subject: ref ? `תשלום חדש ₪${amount}, דרך הקישור של ${ref}` : `תשלום חדש ₪${amount}`,
        html,
      }),
    });
  } catch (e) {
    console.error("payplus callback mail", e);
  }
  return NextResponse.json({ ok: true });
}
