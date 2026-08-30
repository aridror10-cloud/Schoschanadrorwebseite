"use client";

import { useSyncExternalStore } from "react";
import { type CartLine, MAX_QTY, type ModelKey, type Version, lineId } from "@/lib/cart";

/**
 * Kleiner Korb-Speicher ausserhalb von React.
 *
 * Die Bedienelemente sitzen an den Werkkarten, die Korb-Leiste steht am
 * unteren Rand - beide brauchen denselben Stand, ohne dass die Seite
 * dafuer in einen Anbieter eingewickelt werden muss (die Landingpage
 * bleibt so eine Server-Komponente).
 */

let lines: CartLine[] = [];
const listeners = new Set<() => void>();

function emit() {
  lines = [...lines];
  listeners.forEach((l) => l());
}

export const cartStore = {
  add(model: ModelKey, version: Version, qty: number) {
    const id = lineId(model, version);
    const found = lines.find((l) => lineId(l.model, l.version) === id);
    if (found) {
      found.qty = Math.min(MAX_QTY, found.qty + qty);
    } else {
      lines.push({ model, version, qty: Math.min(MAX_QTY, qty) });
    }
    emit();
  },
  remove(model: ModelKey, version: Version) {
    const id = lineId(model, version);
    lines = lines.filter((l) => lineId(l.model, l.version) !== id);
    emit();
  },
  clear() {
    lines = [];
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  snapshot: () => lines,
};

/** Serverseitig ist der Korb immer leer - dieselbe Kennung fuer jeden Aufruf */
const EMPTY: CartLine[] = [];

export function useCart() {
  return useSyncExternalStore(cartStore.subscribe, cartStore.snapshot, () => EMPTY);
}
