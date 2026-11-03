import type { Metadata } from "next";
import QRCode from "qrcode";
import { dbRpc } from "@/lib/db";
import { studioToken } from "@/lib/studio-auth";
import { CopyButton } from "./CopyButton";
import "./partners.css";

/**
 * Shoshanas Partnerverwaltung (03.11.26, auf Hebraeisch): Sie legt selbst
 * Verkaeuferinnen an, bekommt fuer jede einen eigenen Link mit QR-Code und
 * WhatsApp-Knopf und sieht Eintritte, Verkaeufe, Provisionen und was noch
 * offen ist. Gleiche Anmeldung wie /studio. Daten: Supabase partners +
 * referral_sales (Funktionen partners_overview, partner_save ...).
 */

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "משווקים", robots: { index: false, follow: false } };

const SITE = "https://shoshanajudaica.co.il";

type Sale = {
  id: number;
  created_at: string;
  total: number;
  pct: number;
  commission: number;
  items: { model: string; version: string; qty: number }[];
  source: "auto" | "manual";
  note: string | null;
  paid: boolean;
  paid_at: string | null;
  cancelled: boolean;
};
type Partner = {
  code: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  pct: number;
  note: string | null;
  active: boolean;
  known: boolean;
  created_at: string | null;
  clicks: number;
  carts: number;
  sales: number;
  revenue: number;
  commission: number;
  open: number;
  list: Sale[];
};

const MODEL: Record<string, string> = {
  simcha: "שמחה",
  regesh: "רגש",
  shrika: "שריקה",
  set: "סדרת השלושה",
  sukkot: "מהדורת סוכות",
  sukkotSet: "סדרת סוכות",
  chanuka: "חנוכיה",
};

const ils = (n: number) => `₪${Math.round(n).toLocaleString("en-US")}`;
const day = (iso: string) =>
  new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Jerusalem" }).format(new Date(iso));
const intlPhone = (p: string | null) => {
  const d = (p ?? "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("972")) return d;
  if (d.startsWith("0")) return `972${d.slice(1)}`;
  return d;
};

const ERR: Record<string, string> = {
  falsch: "הסיסמה אינה נכונה.",
  "zu-viele": "יותר מדי ניסיונות. אפשר לנסות שוב בעוד רבע שעה.",
  db: "אין כרגע חיבור למסד הנתונים. כדאי לנסות שוב בעוד רגע.",
  name: "חסר שם למשווק.",
  code: "השם בקישור יכול להכיל רק אותיות באנגלית, מספרים ומקף.",
  total: "הסכום לא תקין.",
  login: "צריך להתחבר מחדש.",
};
const OK: Record<string, string> = {
  new: "המשווק נוסף. הקישור האישי מוכן לשליחה.",
  saved: "הפרטים נשמרו.",
  paid: "העמלות סומנו כשולמו.",
  added: "המכירה נוספה.",
};

export default async function PartnersPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const token = await studioToken();
  let data: Partner[] | null = null;
  let dbError = false;
  try {
    data = token ? await dbRpc<Partner[]>("partners_overview", { p_token: token }) : null;
  } catch {
    dbError = true;
  }

  if (!data) {
    return (
      <div className="pt" dir="rtl" lang="he">
        <form className="pt-login" method="post" action="/api/studio">
          <h1>המשווקים שלי</h1>
          <p>כניסה עם הסיסמה של הסטודיו.</p>
          {dbError && <p className="pt-msg is-err">{ERR.db}</p>}
          {sp.e && ERR[sp.e] && <p className="pt-msg is-err">{ERR[sp.e]}</p>}
          <input type="hidden" name="action" value="login" />
          <input type="hidden" name="back" value="/studio/partners" />
          <input type="password" name="password" placeholder="סיסמה" autoComplete="current-password" required autoFocus dir="ltr" />
          <button type="submit" className="pt-btn">כניסה</button>
        </form>
      </div>
    );
  }

  const partners = data;
  const active = partners.filter((p) => p.known && p.active).length;
  const sum = (k: "clicks" | "sales" | "revenue" | "commission" | "open") => partners.reduce((a, p) => a + Number(p[k] ?? 0), 0);

  const qr = new Map<string, string>();
  for (const p of partners) {
    qr.set(
      p.code,
      await QRCode.toString(`${SITE}/r/${p.code}`, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#2e2e2e", light: "#ffffff00" } }),
    );
  }

  return (
    <div className="pt" dir="rtl" lang="he">
      <header className="pt-top">
        <div>
          <h1>המשווקים שלי</h1>
          <p>קישור אישי לכל משווק, ומעקב אחרי כניסות, מכירות ועמלות.</p>
        </div>
        <nav>
          <a href="/studio" className="pt-link">סטטיסטיקה של האתר</a>
          <form method="post" action="/api/studio">
            <input type="hidden" name="action" value="logout" />
            <input type="hidden" name="back" value="/studio/partners" />
            <button type="submit" className="pt-link">יציאה</button>
          </form>
        </nav>
      </header>

      {sp.e && ERR[sp.e] && <p className="pt-msg is-err">{ERR[sp.e]}</p>}
      {sp.ok && OK[sp.ok] && <p className="pt-msg is-ok">{OK[sp.ok]}</p>}

      <section className="pt-kpis">
        <Kpi label="משווקים פעילים" value={active} />
        <Kpi label="כניסות דרך קישורים" value={sum("clicks")} />
        <Kpi label="מכירות" value={sum("sales")} />
        <Kpi label="סכום המכירות" value={ils(sum("revenue"))} />
        <Kpi label="עמלות לתשלום" value={ils(sum("open"))} gold />
      </section>

      <section className="pt-card pt-new">
        <h2>משווק חדש</h2>
        <PartnerForm />
        <p className="pt-note">
          מי שנכנס דרך הקישור נרשם על שם המשווק למשך 60 יום. כל קנייה באתר נרשמת כאן מעצמה, ומגיע אלייך מייל. לפני תשלום עמלה
          כדאי לבדוק את הקבלה בסאמיט מאותה שעה.
        </p>
      </section>

      {partners.length === 0 ? (
        <p className="pt-empty">עדיין אין משווקים. אחרי שמוסיפים את הראשון, הקישור שלו יופיע כאן.</p>
      ) : (
        <section className="pt-list">
          {partners.map((p) => {
            const link = `${SITE}/r/${p.code}`;
            const wa = `https://wa.me/${intlPhone(p.phone)}?text=${encodeURIComponent(
              `שלום${p.name ? ` ${p.name}` : ""}, זה הקישור האישי שלך לאתר שושנה יודאיקה:\n${link}`,
            )}`;
            const focus = sp.p === p.code;
            return (
              <article key={p.code} id={`p-${p.code}`} className={`pt-card pt-partner${p.active ? "" : " is-off"}${focus ? " is-focus" : ""}`}>
                <div className="pt-partner-head">
                  <div>
                    <h3>{p.name ?? p.code}</h3>
                    <p className="pt-sub">
                      {p.known ? `עמלה ${Number(p.pct)}%` : "קישור שנוצר בלי שם. אפשר להוסיף פרטים למטה."}
                      {p.phone && <> · <span dir="ltr">{p.phone}</span></>}
                      {!p.active && " · לא פעיל"}
                    </p>
                  </div>
                  <div className="pt-open">
                    <span>לתשלום</span>
                    <strong>{ils(p.open)}</strong>
                    {p.open > 0 && (
                      <form method="post" action="/api/studio">
                        <input type="hidden" name="action" value="pay_all" />
                        <input type="hidden" name="back" value="/studio/partners" />
                        <input type="hidden" name="code" value={p.code} />
                        <button type="submit" className="pt-btn pt-btn-small">סימון הכול כשולם</button>
                      </form>
                    )}
                  </div>
                </div>

                <div className="pt-linkrow">
                  <div className="pt-qr" dangerouslySetInnerHTML={{ __html: qr.get(p.code) ?? "" }} />
                  <div className="pt-linkbox">
                    <code dir="ltr">{link}</code>
                    <div className="pt-actions">
                      <CopyButton text={link} />
                      <a className="pt-btn pt-btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">
                        שליחה בוואטסאפ
                      </a>
                      <a className="pt-btn pt-btn-ghost" href={`/api/qr?code=${p.code}`}>
                        הורדת קוד QR
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-stats">
                  <Stat label="כניסות" value={p.clicks} />
                  <Stat label="הוסיפו לסל" value={p.carts} />
                  <Stat label="מכירות" value={p.sales} />
                  <Stat label="סכום מכירות" value={ils(p.revenue)} />
                  <Stat label="עמלה בסך הכול" value={ils(p.commission)} />
                </div>

                {p.list.length > 0 && (
                  <table className="pt-table">
                    <thead>
                      <tr>
                        <th>תאריך</th>
                        <th>מה נקנה</th>
                        <th>סכום</th>
                        <th>עמלה</th>
                        <th>מצב</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {p.list.map((s) => (
                        <tr key={s.id} className={s.cancelled ? "is-cancel" : s.paid ? "is-paid" : ""}>
                          <td>{day(s.created_at)}</td>
                          <td>
                            {s.items?.length
                              ? s.items.map((i) => `${MODEL[i.model] ?? i.model} × ${i.qty}`).join(", ")
                              : s.source === "manual"
                                ? s.note ?? "נוסף ידנית"
                                : "לא ידוע"}
                          </td>
                          <td>{ils(s.total)}</td>
                          <td>{ils(s.commission)}</td>
                          <td>{s.cancelled ? "בוטל" : s.paid ? "שולם" : "פתוח"}</td>
                          <td className="pt-row-actions">
                            {!s.cancelled && (
                              <SaleButton id={s.id} code={p.code} what={s.paid ? "unpaid" : "paid"} label={s.paid ? "ביטול סימון" : "שולם"} />
                            )}
                            <SaleButton id={s.id} code={p.code} what={s.cancelled ? "restore" : "cancel"} label={s.cancelled ? "שחזור" : "ביטול מכירה"} quiet />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div className="pt-more">
                  <details>
                    <summary>הוספת מכירה ידנית</summary>
                    <form method="post" action="/api/studio" className="pt-form pt-form-inline">
                      <input type="hidden" name="action" value="sale_add" />
                      <input type="hidden" name="back" value="/studio/partners" />
                      <input type="hidden" name="code" value={p.code} />
                      <label>
                        סכום המוצרים בש״ח
                        <input name="total" inputMode="numeric" pattern="[0-9]+" required dir="ltr" />
                      </label>
                      <label>
                        הערה
                        <input name="note" placeholder="למשל: מספר קבלה בסאמיט" />
                      </label>
                      <button type="submit" className="pt-btn pt-btn-small">הוספה</button>
                    </form>
                  </details>
                  <details open={!p.known}>
                    <summary>{p.known ? "עריכת פרטים" : "הוספת פרטים"}</summary>
                    <PartnerForm partner={p} />
                  </details>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

function PartnerForm({ partner }: { partner?: Partner }) {
  const edit = Boolean(partner);
  return (
    <form method="post" action="/api/studio" className="pt-form">
      <input type="hidden" name="action" value="partner_save" />
      <input type="hidden" name="back" value="/studio/partners" />
      {edit && <input type="hidden" name="orig" value={partner!.code} />}
      <label>
        שם
        <input name="name" required maxLength={80} defaultValue={partner?.name ?? ""} placeholder="למשל: מרים כהן" />
      </label>
      <label>
        טלפון
        <input name="phone" type="tel" maxLength={40} defaultValue={partner?.phone ?? ""} dir="ltr" />
      </label>
      <label>
        מייל
        <input name="email" type="email" maxLength={120} defaultValue={partner?.email ?? ""} dir="ltr" />
      </label>
      <label>
        עמלה באחוזים
        <input name="pct" inputMode="decimal" defaultValue={partner ? String(Number(partner.pct)) : "10"} dir="ltr" />
      </label>
      {edit ? (
        <label>
          מצב
          <select name="active" defaultValue={partner!.active ? "1" : "0"}>
            <option value="1">פעיל</option>
            <option value="0">לא פעיל</option>
          </select>
        </label>
      ) : (
        <label>
          שם בקישור (לא חובה)
          <input name="code" maxLength={32} placeholder="miriam" dir="ltr" pattern="[A-Za-z0-9\-]*" />
          <small>אותיות באנגלית. אם משאירים ריק, נוצר מהשם.</small>
        </label>
      )}
      <label className="pt-wide">
        הערה לעצמך
        <input name="note" maxLength={500} defaultValue={partner?.note ?? ""} />
      </label>
      <button type="submit" className="pt-btn">{edit ? "שמירה" : "יצירת קישור"}</button>
    </form>
  );
}

function SaleButton({ id, code, what, label, quiet }: { id: number; code: string; what: string; label: string; quiet?: boolean }) {
  return (
    <form method="post" action="/api/studio">
      <input type="hidden" name="action" value="sale_set" />
      <input type="hidden" name="back" value="/studio/partners" />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="code" value={code} />
      <input type="hidden" name="what" value={what} />
      <button type="submit" className={quiet ? "pt-link" : "pt-btn pt-btn-small"}>
        {label}
      </button>
    </form>
  );
}

function Kpi({ label, value, gold }: { label: string; value: number | string; gold?: boolean }) {
  return (
    <div className={`pt-kpi${gold ? " is-gold" : ""}`}>
      <span className="pt-kpi-n">{value}</span>
      <span className="pt-kpi-l">{label}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="pt-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

