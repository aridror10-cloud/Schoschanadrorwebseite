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
  simcha: { price: 550 },
  regesh: { price: 550 },
  shrika: { price: 550 },
  set: { price: 1350 },
} as const;

export type ModelKey = keyof typeof MODELS;
export type Version = "with" | "without";

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
