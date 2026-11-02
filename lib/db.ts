/**
 * Supabase (Projekt "shoshana-judaica", Frankfurt) - nur auf dem Server benutzen.
 * Speichert Anfragen (leads) und anonyme Ereignisse (events) fuer /studio.
 *
 * Umgebungsvariablen in Vercel:
 *   SUPABASE_SERVICE_ROLE_KEY  geheim, aus Supabase > Project Settings > API Keys
 *   SUPABASE_URL               optional, Standard unten
 *
 * Ohne Schluessel passiert nichts: die Website laeuft wie vorher, nur ohne
 * Speicherung. Fehler der Datenbank brechen nie ein Formular ab.
 */

const URL = process.env.SUPABASE_URL ?? "https://lgglnvvdjmwgsqbrgjdb.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const dbReady = () => Boolean(KEY);

function headers(extra: Record<string, string> = {}): Record<string, string> {
  const h: Record<string, string> = { apikey: KEY ?? "", "Content-Type": "application/json", ...extra };
  // Neue Schluessel (sb_secret_...) sind kein JWT und gehoeren nur in "apikey";
  // alte service_role-Schluessel (JWT) zusaetzlich als Bearer.
  if (KEY && !KEY.startsWith("sb_")) h.Authorization = `Bearer ${KEY}`;
  return h;
}

export async function dbInsert(table: "leads" | "events", row: Record<string, unknown>) {
  if (!KEY) return;
  try {
    const res = await fetch(`${URL}/rest/v1/${table}`, {
      method: "POST",
      headers: headers({ Prefer: "return=minimal" }),
      body: JSON.stringify(row),
      cache: "no-store",
    });
    if (!res.ok) console.error("db insert", table, res.status, await res.text().catch(() => ""));
  } catch (e) {
    console.error("db insert", table, e);
  }
}

export async function dbSelect<T>(table: string, query: string): Promise<T[]> {
  if (!KEY) return [];
  const res = await fetch(`${URL}/rest/v1/${table}?${query}`, { headers: headers(), cache: "no-store" });
  if (!res.ok) throw new Error(`db select ${table} ${res.status}`);
  return (await res.json()) as T[];
}

export async function dbUpdate(table: string, query: string, patch: Record<string, unknown>) {
  if (!KEY) return;
  const res = await fetch(`${URL}/rest/v1/${table}?${query}`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify(patch),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`db update ${table} ${res.status}`);
}

export async function dbRpc<T>(fn: string, args: Record<string, unknown>): Promise<T | null> {
  if (!KEY) return null;
  const res = await fetch(`${URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`db rpc ${fn} ${res.status}`);
  return (await res.json()) as T;
}

/** Geraet grob aus dem User-Agent, ohne ihn zu speichern */
export function deviceOf(ua: string | null): "mobile" | "tablet" | "desktop" {
  const s = ua ?? "";
  if (/iPad|Tablet/i.test(s)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(s)) return "mobile";
  return "desktop";
}
