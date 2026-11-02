import { cookies } from "next/headers";
import { dbRpc } from "@/lib/db";

/**
 * Zugang zu /studio (seit 02.11.26 ohne Passwort in Vercel):
 * Beim ersten Besuch legt Bernard selbst ein Passwort fest. Supabase
 * speichert nur dessen bcrypt-Abdruck und gibt nach der Anmeldung eine
 * zufaellige Sitzungsnummer zurueck, die 30 Tage im Cookie liegt.
 */
export const STUDIO_COOKIE = "sj_studio";

export async function studioToken(): Promise<string | null> {
  return (await cookies()).get(STUDIO_COOKIE)?.value || null;
}

export async function hasPassword(): Promise<boolean> {
  return Boolean(await dbRpc<boolean>("studio_has_password", {}));
}
