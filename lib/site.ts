/**
 * Zentrale Konfiguration der Webseite.
 * Die Domain kommt aus der Umgebungsvariable NEXT_PUBLIC_SITE_URL,
 * damit Vorschau- und Produktivumgebung unterschiedliche URLs nutzen koennen.
 */

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  // Auf Vercel automatisch die Produktions-Domain verwenden
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const site = {
  name: "שושנה דרור",
  nameLatin: "Shoshana Dror",
} as const;
