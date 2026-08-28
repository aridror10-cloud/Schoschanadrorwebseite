/**
 * Sammel-Bestellung: die vier kaufbaren Produkte mit Preis (fuer die
 * Korb-Leiste) - die SUMIT-Produktnummern liegen bewusst nur in der
 * API-Route, der Browser bekommt sie nie zu sehen.
 */
export const CART_ITEMS = {
  simcha: { price: 550 },
  regesh: { price: 550 },
  shrika: { price: 550 },
  set: { price: 1350 },
} as const;

export type CartKey = keyof typeof CART_ITEMS;

export const isCartKey = (k: string): k is CartKey => k in CART_ITEMS;
