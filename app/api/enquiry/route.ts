import { NextResponse } from "next/server";

/**
 * Anfragen der Website "שושנה יודאיקה" (Abschnitt 8 des Konzepts).
 *
 * Drei Arten, klar getrennt, damit Shoshana schon am Betreff sieht,
 * worum es geht:
 *   business  פנייה עסקית   Hersteller, Importeure, Gruender
 *   order     בירור הזמנה   Papierschnitte und bestellbare Werke
 *   interest  הבעת עניין    Schmuck und Metallschnitte, nicht im Verkauf
 *
 * Die Carlebach-Anfragen laufen unveraendert ueber /api/order.
 *
 * Umgebungsvariablen (dieselben wie /api/order):
 *   RESEND_API_KEY  Pflicht, sonst 503 und das Formular zeigt den Mailweg
 *   ORDER_TO        Empfaengerin (Standard ssdror@gmail.com)
 *   ORDER_FROM      Absender
 */

type Kind = "business" | "order" | "interest";

const TO = process.env.ORDER_TO ?? "ssdror@gmail.com";
const FROM = process.env.ORDER_FROM ?? "Shoshana Judaica <onboarding@resend.dev>";

const LABEL: Record<Kind, string> = {
  business: "פנייה עסקית",
  order: "בירור הזמנה",
  interest: "הבעת עניין",
};

const HEADING: Record<Kind, string> = {
  business: "פנייה עסקית חדשה",
  order: "בירור הזמנה חדש",
  interest: "הבעת עניין חדשה",
};

/* Ratenbegrenzung je Absender-IP, wie in /api/order */
const RECENT = new Map<string, number[]>();
const LIMIT = 4;
const WINDOW = 60 * 60 * 1000;

function tooMany(ip: string) {
  const now = Date.now();
  const hits = (RECENT.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (hits.length >= LIMIT) {
    RECENT.set(ip, hits);
    return true;
  }
  hits.push(now);
  RECENT.set(ip, hits);
  if (RECENT.size > 5000) RECENT.clear();
  return false;
}

function esc(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clamp(value: unknown, max = 3000) {
  return String(value ?? "").trim().slice(0, max);
}

/** Anhang (Bild oder PDF), Groesse und Typ werden hier erneut geprueft. */
const MAX_ATTACHMENT = 2.5 * 1024 * 1024;

function attachment(raw: unknown) {
  if (typeof raw !== "object" || raw === null) return null;
  const { name, type, data } = raw as Record<string, unknown>;
  if (typeof data !== "string" || !data) return null;
  if (!/^[A-Za-z0-9+/=]+$/.test(data)) return null;
  if ((data.length * 3) / 4 > MAX_ATTACHMENT) return null;
  const art = String(type ?? "");
  if (!art.startsWith("image/") && art !== "application/pdf") return null;
  const datei = clamp(name, 120).replace(/[^\w.\- ]+/g, "_") || "attachment";
  return { filename: datei, content: data };
}

async function sendMail(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`resend ${res.status}`);
  return res.json();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Honigtopf: Roboter fuellen das unsichtbare Feld aus
  if (clamp(data.website)) return NextResponse.json({ ok: true });

  const kind = data.kind as Kind;
  if (!(kind in LABEL)) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) return NextResponse.json({ error: "too_many" }, { status: 429 });

  const name = clamp(data.name, 120);
  const email = clamp(data.email, 160);
  const phone = clamp(data.phone, 60);
  const company = clamp(data.company, 160);
  const piece = clamp(data.piece, 200);
  const message = clamp(data.message);

  const emailOk = !email || EMAIL_RE.test(email);
  const reachable = Boolean(phone) || (Boolean(email) && emailOk);
  const pieceOk = kind === "business" || Boolean(piece);
  const messageOk = kind !== "business" || Boolean(message);
  if (!name || !emailOk || !reachable || !pieceOk || !messageOk) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }

  const rows: [string, string][] = [
    ["סוג הפנייה", LABEL[kind]],
    ["שם", name],
    ["שם העסק", company],
    ["טלפון", phone],
    ["אימייל", email],
    [kind === "order" ? "היצירה המבוקשת" : "היצירה", piece],
    [kind === "business" ? "הרעיון או הצורך" : "הערה", message],
    ["הגיע דרך קישור", clamp(data.ref, 40)],
  ];

  const table = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:7px 0 7px 14px;color:#8a7238;white-space:nowrap;vertical-align:top">${esc(
          label,
        )}</td><td style="padding:7px 0;color:#2e2e2e">${esc(value).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");

  const shell = (heading: string, intro: string, footnote = "") => `
    <div dir="rtl" style="font-family:system-ui,Arial,sans-serif;background:#faf8f4;padding:28px">
      <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid rgba(171,145,73,.4);padding:26px 28px">
        <div style="font-size:12px;letter-spacing:1.6px;color:#ab9149">שושנה יודאיקה</div>
        <h1 style="font-size:19px;margin:8px 0 4px;color:#2e2e2e;font-weight:600">${esc(heading)}</h1>
        <p style="font-size:14px;color:#5c5c5c;margin:0 0 18px">${esc(intro)}</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;border-top:1px solid rgba(171,145,73,.3)">${table}</table>
        ${footnote ? `<p style="font-size:13px;color:#5c5c5c;margin:18px 0 0">${esc(footnote)}</p>` : ""}
      </div>
    </div>`;

  const anhang = kind === "business" ? attachment(data.file) : null;

  try {
    await sendMail({
      from: FROM,
      to: [TO],
      ...(email ? { reply_to: email } : {}),
      ...(anhang ? { attachments: [anhang] } : {}),
      subject: `${HEADING[kind]} מהאתר: ${name}`,
      html: shell(HEADING[kind], "התקבלה פנייה דרך טופס האתר."),
    });
  } catch {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  // Bestaetigung an die Absenderin, nur wenn eine Mailadresse da ist
  if (email) {
    try {
      await sendMail({
        from: FROM,
        to: [email],
        reply_to: TO,
        subject: "הפנייה שלך התקבלה, שושנה יודאיקה",
        html: shell(
          "הפנייה התקבלה, תודה!",
          "אחזור אליך בהקדם. אלה הפרטים שהתקבלו:",
          kind === "interest" ? "הבעת עניין אינה הזמנה מחייבת." : "",
        ),
      });
    } catch {
      /* Bestaetigung ist nett, aber nicht entscheidend */
    }
  }

  return NextResponse.json({ ok: true });
}
