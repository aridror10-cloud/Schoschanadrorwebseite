/**
 * Supabase (Projekt "shoshana-judaica", Frankfurt) - nur auf dem Server benutzen.
 * Speichert Anfragen (leads) und anonyme Ereignisse (events) fuer /studio.
 *
 * Seit 02.11.26 ohne geheimen Schluessel: Die Tabellen sind fuer alle
 * gesperrt. Die Website ruft nur Datenbank-Funktionen auf (log_event,
 * log_lead, studio_*), die selbst pruefen, was hinein darf. Lesen geht
 * nur mit einer Studio-Sitzung, die man mit dem Passwort bekommt.
 * Der Schluessel unten ist der oeffentliche "publishable" Schluessel,
 * der ausdruecklich offen liegen darf.
 *
 * Fehler der Datenbank brechen nie ein Formular ab.
 */

const URL = process.env.SUPABASE_URL ?? "https://lgglnvvdjmwgsqbrgjdb.supabase.co";
const KEY = process.env.SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_GwaOUZPdeWmx3nvr6ggDTA_dbw518Jb";

export async function dbRpc<T>(fn: string, args: Record<string, unknown>): Promise<T | null> {
  const res = await fetch(`${URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`db ${fn} ${res.status} ${(await res.text().catch(() => "")).slice(0, 200)}`);
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : null;
}

/** Speichern ohne Risiko fuer das Formular: Fehler landen nur im Log */
export async function dbInsert(table: "leads" | "events", row: Record<string, unknown>) {
  try {
    await dbRpc(table === "leads" ? "log_lead" : "log_event", { p: row });
  } catch (e) {
    console.error("db insert", table, e);
  }
}

/** Geraet grob aus dem User-Agent, ohne ihn zu speichern */
export function deviceOf(ua: string | null): "mobile" | "tablet" | "desktop" {
  const s = ua ?? "";
  if (/iPad|Tablet/i.test(s)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(s)) return "mobile";
  return "desktop";
}
