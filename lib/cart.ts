/**
 * Sammel-Bestellung: die vier Werke, jeweils in zwei Fassungen (mit oder
 * ohne Pasuk) und mit frei waehlbarer Stueckzahl.
 *
 * Warum die Fassung zum Artikel gehoert und nicht zu einem Textfeld auf
 * der Zahlseite: SUMIT nimmt keine vorbelegten Feldwerte ueber die
 * Adresszeile an (geprueft am 28.08.26) und kennt keine Notiz je Zeile.
 * Jede Fassung ist deshalb ein eigenes Produkt bei SUMIT - so steht auf
 * der Bestellung schwarz auf weiss, was gefertigt werden soll.
 *
 * Die SUMIT-Produktnummern liegen bewusst nur in der API-Route; der
 * Browser bekommt sie nie zu sehen.
 */

export const MODELS = {
  simcha: { price: 590 },
  regesh: { price: 590 },
  shrika: { price: 590 },
  set: { price: 1490 },
  /** Sonderedition zu Sukkot: "Simcha" mit dem Sukkot-Segen statt des Pasuk */
  sukkot: { price: 590 },
  /** Sukkot-Serie: die drei Werke plus ein typografischer Pasuk */
  sukkotSet: { price: 1890 },
} as const;

export type ModelKey = keyof typeof MODELS;
export type Version = "with" | "without";

/**
 * Welche Werke es bei SUMIT auch ohne Pasuk als eigenes Produkt gibt.
 * Steht hier eines auf false, blendet die Karte die Fassungswahl gar
 * nicht erst ein - die Seite verspricht dann nichts, was die Bestellung
 * nicht festhaelt.
 */
export const HAS_PLAIN: Record<ModelKey, boolean> = {
  simcha: true,
  regesh: true,
  shrika: true,
  set: true,
  sukkot: false,
  sukkotSet: false,
};

/**
 * Was sich ueberhaupt in den Korb legen laesst. Ein Werk, das bei SUMIT
 * noch kein Produkt hat, bekommt statt der Korb-Knoepfe einen Verweis
 * auf das Anfrageformular - lieber ein Umweg als eine Fehlermeldung an
 * der Kasse.
 */
export const ORDERABLE: Record<ModelKey, boolean> = {
  simcha: true,
  regesh: true,
  shrika: true,
  set: true,
  sukkot: true,
  sukkotSet: true,
};

/** Eine Zeile im Korb: Werk, Fassung, Stueckzahl */
export interface CartLine {
  model: ModelKey;
  version: Version;
  qty: number;
}

export const MAX_QTY = 10;

export const isModelKey = (k: string): k is ModelKey => k in MODELS;
export const isVersion = (v: string): v is Version => v === "with" || v === "without";

/** Zeilen derselben Fassung fassen wir zusammen, statt sie zu doppeln. */
export const lineId = (model: ModelKey, version: Version) => `${model}:${version}`;

export const cartTotal = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + MODELS[l.model].price * l.qty, 0);
