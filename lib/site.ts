/**
 * Zentrale Konfiguration der Webseite.
 *
 * Alle mit TODO markierten Werte muessen vor dem Livegang ersetzt werden.
 * Die Domain kommt aus der Umgebungsvariable NEXT_PUBLIC_SITE_URL,
 * damit Vorschau- und Produktivumgebung unterschiedliche URLs nutzen koennen.
 */

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const site = {
  name: "Schoschana Dror",
  /** Erscheint im Browser-Tab und in Suchergebnissen (max. ~60 Zeichen) */
  title: "Schoschana Dror",
  /** Erscheint als Beschreibung in Suchergebnissen (max. ~155 Zeichen) */
  description:
    "Persoenliche Webseite von Schoschana Dror. Ueber mich, meine Arbeit und Kontaktmoeglichkeiten.",
  locale: "de_DE",
  lang: "de",
  url: siteUrl,

  /** TODO: echte Kontaktdaten eintragen */
  contact: {
    email: "TODO@example.com",
    phone: "",
  },

  /** TODO: eigene Profile ergaenzen oder Eintraege loeschen */
  social: [] as { label: string; href: string }[],
} as const;

export const navigation = [
  { label: "Ueber mich", href: "/#ueber-mich" },
  { label: "Arbeit", href: "/#arbeit" },
  { label: "Kontakt", href: "/#kontakt" },
] as const;

export const legalNavigation = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
] as const;
