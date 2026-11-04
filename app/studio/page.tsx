import type { Metadata } from "next";
import { dbRpc } from "@/lib/db";
import { hasPassword, studioToken } from "@/lib/studio-auth";
import "./studio-dash.css";

/**
 * Bernards Uebersicht (02.11.26): Besuche, Herkunft, Korb, Kaeufe,
 * Empfehlungslinks, Quiz und alle Anfragen. Nur mit Passwort.
 */

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Studio", robots: { index: false, follow: false } };

type Stats = {
  sessions: number;
  page_views: number;
  add_to_cart: number;
  checkout: number;
  purchase: number;
  leads: number;
  phone_clicks: number;
  video_plays: number;
  quiz_done: number;
  mobile_share: number | null;
  by_day: { day: string; sessions: number; views: number; carts: number; purchases: number }[];
  top_pages: { path: string; views: number; sessions: number }[];
  sources: { source: string; sessions: number }[];
  refs: { ref: string; clicks: number; carts: number; purchases: number }[];
  products: { model: string | null; carts: number }[];
  quiz: { result: string | null; count: number }[];
};

type Lead = {
  id: number;
  created_at: string;
  kind: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  piece: string | null;
  message: string | null;
  ref: string | null;
  lang: string | null;
  path: string | null;
  status: "neu" | "in_arbeit" | "erledigt";
};

const KIND: Record<string, string> = {
  business: "Geschäftsanfrage",
  order: "Bestellung (Formular)",
  interest: "Interesse",
  carlebach_order: "Carlebach-Anfrage",
  question: "Frage",
  quiz: "Quiz",
  creation: "Fragenweg Yetzira",
};
const MODEL: Record<string, string> = {
  simcha: "Simcha (Freude)",
  regesh: "Regesch (Gefühl)",
  shrika: "Schrika (Pfeifen)",
  set: "Set der drei",
  sukkot: "Sukkot-Ausgabe",
  sukkotSet: "Sukkot-Serie",
  chanuka: "Chanukkia",
  chanukaBlack: "Chanukkia schwarz",
  chanukaWhite: "Chanukkia weiss",
  chanukaGold: "Chanukkia gold",
};
const PAGE: Record<string, string> = {
  "/": "Startseite",
  "/carlebach": "Carlebach (he)",
  "/en": "Carlebach (en)",
  "/design": "Design für Firmen",
  "/works": "Werke",
  "/about": "Über mich",
  "/contact": "Kontakt",
  "/toda": "Danke nach Kauf",
  "/privacy": "Datenschutz",
  "/yetzira": "Fragenweg Yetzira",
};
const pageName = (p: string) => PAGE[p.replace(/#.*$/, "")] ?? p;
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((100 * a) / b)} %` : "0 %");
const when = (iso: string) =>
  new Intl.DateTimeFormat("de-CH", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Jerusalem" }).format(new Date(iso));

export default async function StudioPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;

  const days = [7, 30, 90].includes(Number(sp.d)) ? Number(sp.d) : 7;
  const token = await studioToken();
  let stats: Stats | null = null;
  let leads: Lead[] = [];
  let error = "";
  let dash: { stats: Stats; leads: Lead[] } | null = null;
  try {
    dash = token ? await dbRpc<{ stats: Stats; leads: Lead[] }>("studio_dashboard", { p_token: token, p_days: days }) : null;
  } catch (e) {
    error = `Datenbank nicht erreichbar (${(e as Error).message}).`;
  }

  if (!dash) {
    let first = false;
    try {
      first = !(await hasPassword());
    } catch {
      /* Fehlertext steht schon oben */
    }
    const msg: Record<string, string> = {
      falsch: "Passwort stimmt nicht.",
      "zu-viele": "Zu viele Versuche, bitte 15 Minuten warten.",
      kurz: "Bitte mindestens 8 Zeichen.",
      ungleich: "Die beiden Passwörter sind nicht gleich.",
      gesetzt: "Das Passwort ist schon festgelegt. Bitte anmelden.",
      db: "Datenbank gerade nicht erreichbar, bitte nochmals versuchen.",
    };
    return (
      <div className="sd" dir="ltr" lang="de">
        <form className="sd-login" method="post" action="/api/studio">
          <h1>Studio</h1>
          <p>{first ? "Erster Besuch: Lege jetzt dein eigenes Passwort fest." : "Übersicht für shoshanajudaica.co.il"}</p>
          {error && <p className="sd-warn">{error}</p>}
          {sp.e && msg[sp.e] && <p className="sd-warn">{msg[sp.e]}</p>}
          <input type="hidden" name="action" value={first ? "setup" : "login"} />
          <input
            type="password"
            name="password"
            placeholder={first ? "Neues Passwort (mind. 8 Zeichen)" : "Passwort"}
            autoComplete={first ? "new-password" : "current-password"}
            minLength={first ? 8 : undefined}
            required
            autoFocus
          />
          {first && <input type="password" name="password2" placeholder="Passwort wiederholen" autoComplete="new-password" minLength={8} required />}
          <button type="submit">{first ? "Passwort festlegen" : "Anmelden"}</button>
        </form>
      </div>
    );
  }

  stats = dash.stats;
  leads = dash.leads ?? [];
  const s = stats;
  const maxDay = Math.max(1, ...(s?.by_day ?? []).map((d) => d.sessions));
  const open = leads.filter((l) => l.status === "neu").length;

  return (
    <div className="sd" dir="ltr" lang="de">
      <header className="sd-top">
        <div>
          <h1>Studio</h1>
          <p>shoshanajudaica.co.il · Zeiten in Israel</p>
        </div>
        <nav className="sd-range">
          {[7, 30, 90].map((d) => (
            <a key={d} href={`/studio?d=${d}`} className={d === days ? "on" : ""}>
              {d} Tage
            </a>
          ))}
          <a href="/studio/partners">Partner (he)</a>
          <form method="post" action="/api/studio">
            <input type="hidden" name="action" value="logout" />
            <button type="submit" className="sd-link">Abmelden</button>
          </form>
        </nav>
      </header>

      {error && <p className="sd-warn">{error}</p>}

      {s && (
        <>
          <section className="sd-kpis">
            <Kpi label="Besuche" value={s.sessions} />
            <Kpi label="Seitenaufrufe" value={s.page_views} />
            <Kpi label="In den Korb" value={s.add_to_cart} />
            <Kpi label="Zur Kasse" value={s.checkout} />
            <Kpi label="Käufe" value={s.purchase} gold />
            <Kpi label="Anfragen" value={s.leads} gold />
            <Kpi label="Anrufe (Klick)" value={s.phone_clicks} />
            <Kpi label="Video gestartet" value={s.video_plays} />
            <Kpi label="Quiz beendet" value={s.quiz_done} />
            <Kpi label="vom Handy" value={s.mobile_share === null ? "–" : `${s.mobile_share} %`} />
          </section>

          <section className="sd-card">
            <h2>Vom Besuch zum Kauf</h2>
            <div className="sd-funnel">
              <Step label="Besuche" n={s.sessions} of={s.sessions} />
              <Step label="In den Korb" n={s.add_to_cart} of={s.sessions} />
              <Step label="Zur Kasse" n={s.checkout} of={s.sessions} />
              <Step label="Gekauft" n={s.purchase} of={s.sessions} />
            </div>
            <p className="sd-note">
              Korb → Kasse: {pct(s.checkout, s.add_to_cart)} · Kasse → Kauf: {pct(s.purchase, s.checkout)}. Käufe zählen nur,
              wenn die Kundschaft nach der Zahlung auf die Dankesseite zurückkommt.
            </p>
          </section>

          <section className="sd-card">
            <h2>Besuche pro Tag</h2>
            {s.by_day.length === 0 ? (
              <p className="sd-empty">Noch keine Daten.</p>
            ) : (
              <div className="sd-bars">
                {s.by_day.map((d) => (
                  <div key={d.day} className="sd-bar" title={`${d.day}: ${d.sessions} Besuche, ${d.carts} Korb, ${d.purchases} Käufe`}>
                    <span className="sd-bar-fill" style={{ height: `${(100 * d.sessions) / maxDay}%` }} />
                    <span className="sd-bar-n">{d.sessions}</span>
                    <span className="sd-bar-d">{d.day.slice(8)}.{d.day.slice(5, 7)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="sd-grid">
            <Table title="Meistbesuchte Seiten" head={["Seite", "Aufrufe", "Besuche"]} rows={s.top_pages.map((p) => [pageName(p.path), p.views, p.sessions])} />
            <Table title="Woher die Besuche kommen" head={["Herkunft", "Besuche"]} rows={s.sources.map((r) => [r.source, r.sessions])} />
            <Table
              title="Empfehlungslinks"
              head={["Link", "Klicks", "Korb", "Käufe"]}
              rows={s.refs.map((r) => [`/r/${r.ref}`, r.clicks, r.carts, r.purchases])}
            />
            <Table title="Was in den Korb kommt" head={["Werk", "Mal"]} rows={s.products.map((p) => [MODEL[p.model ?? ""] ?? p.model ?? "?", p.carts])} />
            <Table title="Quiz: Empfehlungen" head={["Ergebnis", "Mal"]} rows={s.quiz.map((q) => [MODEL[q.result ?? ""] ?? q.result ?? "?", q.count])} />
          </div>
        </>
      )}

      <section className="sd-card" id="anfragen">
        <h2>
          Anfragen {open > 0 && <span className="sd-badge">{open} neu</span>}
        </h2>
        {leads.length === 0 ? (
          <p className="sd-empty">Noch keine Anfragen gespeichert.</p>
        ) : (
          <div className="sd-leads">
            {leads.map((l) => (
              <article key={l.id} className={`sd-lead is-${l.status}`}>
                <div className="sd-lead-head">
                  <strong>{l.name || "ohne Namen"}</strong>
                  <span>{KIND[l.kind] ?? l.kind}</span>
                  <span>{when(l.created_at)}</span>
                  {l.ref && <span className="sd-ref">über /r/{l.ref}</span>}
                </div>
                <div className="sd-lead-body">
                  {l.phone && (
                    <a href={`tel:${l.phone}`} dir="ltr">
                      {l.phone}
                    </a>
                  )}
                  {l.email && <a href={`mailto:${l.email}`}>{l.email}</a>}
                  {l.piece && <p dir="auto"><b>Werk:</b> {l.piece}</p>}
                  {l.message && <p dir="auto" className="sd-msg">{l.message}</p>}
                  {l.path && <p className="sd-note">von {pageName(l.path)}</p>}
                </div>
                <form method="post" action="/api/studio" className="sd-status">
                  <input type="hidden" name="action" value="status" />
                  <input type="hidden" name="id" value={l.id} />
                  <input type="hidden" name="days" value={days} />
                  {(["neu", "in_arbeit", "erledigt"] as const).map((st) => (
                    <button key={st} type="submit" name="status" value={st} className={l.status === st ? "on" : ""}>
                      {st === "neu" ? "neu" : st === "in_arbeit" ? "in Arbeit" : "erledigt"}
                    </button>
                  ))}
                </form>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="sd-card sd-pw" id="passwort">
        <h2>Passwort ändern</h2>
        {sp.ok === "pw" && <p className="sd-ok">Neues Passwort gespeichert. Alle anderen Geräte sind jetzt abgemeldet.</p>}
        {sp.e === "pw-kurz" && <p className="sd-warn">Bitte mindestens 8 Zeichen.</p>}
        {sp.e === "pw-ungleich" && <p className="sd-warn">Die beiden Passwörter sind nicht gleich.</p>}
        <form method="post" action="/api/studio">
          <input type="hidden" name="action" value="change_pw" />
          <input type="password" name="password" placeholder="Neues Passwort (mind. 8 Zeichen)" autoComplete="new-password" minLength={8} required />
          <input type="password" name="password2" placeholder="Neues Passwort wiederholen" autoComplete="new-password" minLength={8} required />
          <button type="submit">Speichern</button>
        </form>
        <p className="sd-note">Gilt auch für Shoshanas Seite /studio/partners. Danach sind alle anderen Geräte abgemeldet, dieses bleibt angemeldet.</p>
      </section>
    </div>
  );
}

function Kpi({ label, value, gold = false }: { label: string; value: number | string; gold?: boolean }) {
  return (
    <div className={`sd-kpi${gold ? " is-gold" : ""}`}>
      <span className="sd-kpi-n">{value}</span>
      <span className="sd-kpi-l">{label}</span>
    </div>
  );
}

function Step({ label, n, of }: { label: string; n: number; of: number }) {
  const w = of > 0 ? Math.max(4, (100 * n) / of) : 4;
  return (
    <div className="sd-step">
      <span className="sd-step-l">{label}</span>
      <span className="sd-step-bar">
        <span style={{ width: `${w}%` }} />
      </span>
      <span className="sd-step-n">{n}</span>
    </div>
  );
}

function Table({ title, head, rows }: { title: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <section className="sd-card">
      <h2>{title}</h2>
      {rows.length === 0 ? (
        <p className="sd-empty">Noch keine Daten.</p>
      ) : (
        <table className="sd-table">
          <thead>
            <tr>
              {head.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} dir="auto">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
