import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Zugang zu /studio: ein Passwort in Vercel (STUDIO_PASSWORD).
 * Nach der Anmeldung liegt nur ein daraus abgeleiteter Wert im Cookie,
 * nie das Passwort selbst. Neues Passwort = alle sind abgemeldet.
 */
const COOKIE = "sj_studio";

function token(): string | null {
  const pw = process.env.STUDIO_PASSWORD;
  if (!pw) return null;
  return createHmac("sha256", pw).update("shoshana-studio-v1").digest("hex");
}

export function passwordMatches(input: string): boolean {
  const pw = process.env.STUDIO_PASSWORD;
  if (!pw) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(pw);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isStudioUser(): Promise<boolean> {
  const t = token();
  if (!t) return false;
  const c = (await cookies()).get(COOKIE)?.value ?? "";
  const a = Buffer.from(c);
  const b = Buffer.from(t);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const studioCookie = () => ({ name: COOKIE, value: token() ?? "" });
