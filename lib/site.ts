/**
 * Zentrale Konfiguration der Webseite.
 * Die Domain kommt aus der Umgebungsvariable NEXT_PUBLIC_SITE_URL,
 * damit Vorschau- und Produktivumgebung unterschiedliche URLs nutzen koennen.
 */

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const site = {
  name: "שושנה דרור",
  nameLatin: "Shoshana Dror",
} as const;
