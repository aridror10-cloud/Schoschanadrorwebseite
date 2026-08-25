import { NextResponse } from "next/server";

/**
 * Nimmt eine Bestellung aus der Bestellkarte entgegen und schickt sie per
 * E-Mail an Shoshana; die Kundin bekommt eine Kopie als Bestaetigung.
 *
 * Konfiguration ueber Umgebungsvariablen in Vercel:
 *   RESEND_API_KEY  Pflicht - ohne den Schluessel antwortet die Route mit
 *                   503, das Formular faellt dann sichtbar auf den
 *                   E-Mail-Weg zurueck statt kaputt zu wirken.
 *   ORDER_TO        Empfaengerin (Standard: ssdror@gmail.com)
 *   ORDER_FROM      Absender. Erst nach Verifizierung der Domain in Resend
 *                   auf z. B. "Shoshana Dror <orders@shoshanajudaica.co.il>"
 *                   setzen; vorher greift die Resend-Testadresse.
 */

const TO = process.env.ORDER_TO ?? "ssdror@gmail.com";
const FROM = process.env.ORDER_FROM ?? "Carlebach Collection <onboarding@resend.dev>";

/** Schuetzt vor HTML-Einschleusung in der Bestellmail. */
function esc(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clamp(value: unknown, max = 2000) {
  return String(value ?? "").trim().slice(0, max);
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

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Roboter fuellen das unsichtbare Feld aus: still schlucken, nicht melden
  if (clamp(data.company)) return NextResponse.json({ ok: true });

  const name = clamp(data.name, 120);
  const email = clamp(data.email, 160);
  const isHebrew = data.lang !== "en";

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }

  const rows: [string, string][] = [
    [isHebrew ? "דגם" : "Design", clamp(data.model, 120)],
    [isHebrew ? "גרסה" : "Version", clamp(data.version, 120)],
    [isHebrew ? "כמות" : "Quantity", clamp(data.qty, 20)],
    [isHebrew ? "שם" : "Name", name],
    [isHebrew ? "טלפון" : "Phone", clamp(data.phone, 60)],
    [isHebrew ? "אימייל" : "Email", email],
    [isHebrew ? "אופן קבלה" : "Delivery", clamp(data.delivery, 160)],
    [isHebrew ? "כתובת" : "Address", clamp(data.address, 400)],
    [isHebrew ? "הערות" : "Notes", clamp(data.notes)],
  ];

  const dir = isHebrew ? "rtl" : "ltr";
  const table = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:7px 14px 7px 0;color:#8a7238;white-space:nowrap;vertical-align:top">${esc(
          label,
        )}</td><td style="padding:7px 0;color:#2e2e2e">${esc(value).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");

  const shell = (heading: string, intro: string) => `
    <div dir="${dir}" style="font-family:system-ui,Arial,sans-serif;background:#faf8f4;padding:28px">
      <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid rgba(171,145,73,.4);padding:26px 28px">
        <div style="font-size:12px;letter-spacing:1.6px;color:#ab9149">${
          isHebrew ? "קולקציית קרליבך" : "THE CARLEBACH COLLECTION"
        }</div>
        <h1 style="font-size:19px;margin:8px 0 4px;color:#2e2e2e;font-weight:600">${esc(heading)}</h1>
        <p style="font-size:14px;color:#5c5c5c;margin:0 0 18px">${esc(intro)}</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;border-top:1px solid rgba(171,145,73,.3)">${table}</table>
      </div>
    </div>`;

  try {
    await sendMail({
      from: FROM,
      to: [TO],
      reply_to: email,
      subject: isHebrew
        ? `הזמנה חדשה מהאתר – ${name}`
        : `New order from the website – ${name}`,
      html: shell(
        isHebrew ? "הזמנה חדשה" : "New order",
        isHebrew ? "התקבלה הזמנה דרך טופס האתר." : "An order came in through the website form.",
      ),
    });
  } catch {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  // Bestaetigung an die Kundin: schoen, aber nicht kritisch - Fehler hier
  // duerfen die Bestellung nicht scheitern lassen
  try {
    await sendMail({
      from: FROM,
      to: [email],
      reply_to: TO,
      subject: isHebrew
        ? "ההזמנה שלך התקבלה – סדרת דיוקנאות קרליבך"
        : "We received your order – Carlebach Portrait Collection",
      html: shell(
        isHebrew ? "ההזמנה התקבלה, תודה!" : "Thank you, your order came through!",
        isHebrew
          ? "אחזור אלייך בהקדם לתיאום התשלום והאספקה. אלה הפרטים שהתקבלו:"
          : "I'll be in touch shortly to arrange payment and delivery. Here is what we received:",
      ),
    });
  } catch {
    /* Bestaetigung fehlgeschlagen - die Bestellung ist trotzdem angekommen */
  }

  return NextResponse.json({ ok: true });
}
