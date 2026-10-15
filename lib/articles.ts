import type { Pic } from "@/lib/studio";

/**
 * Artikel fuer "מאמרים ותהליכי יצירה" (Abschnitt 7 des Konzepts).
 *
 * Jeder Artikel hat Titel, Titelbild, Text mit eingestreuten Bildern,
 * verwandte Artikel und einen Weg zum Angebot oder zum Kontakt. Ein neuer
 * Artikel ist ein neuer Eintrag in dieser Liste; Uebersicht, Menuepunkt,
 * Startseiten-Abschnitt und Sitemap erscheinen dann von selbst.
 *
 * Solange die Liste leer ist, bleiben Menuepunkt und Startseiten-Abschnitt
 * verborgen (siehe components/site/SiteShell.tsx).
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string }
  | { type: "img"; pic: Pic; caption?: string }
  | { type: "list"; items: string[] };

export interface Article {
  slug: string;
  title: string;
  /** ISO-Datum, z. B. "2026-10-20" */
  date: string;
  /** Ein bis zwei Saetze fuer Uebersicht und Vorschau */
  excerpt: string;
  cover: Pic;
  body: Block[];
  /** Slugs verwandter Artikel */
  related?: string[];
  /** Wohin der Artikel am Ende fuehrt */
  cta?: "design" | "contact";
}

export const ARTICLES: Article[] = [];

export function articleBySlug(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Datum in hebraeischer Schreibweise, z. B. "20 באוקטובר 2026" */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${iso}T12:00:00`),
  );
}
