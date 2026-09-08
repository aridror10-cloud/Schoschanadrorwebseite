"use client";

import type { CartLine } from "@/lib/cart";
import type { Lang } from "@/lib/content";

/**
 * Uebergabe an SUMIT: /api/cart legt den Warenkorb an und liefert die
 * Adresse der fertigen Zahlseite, wir schicken die Kundschaft dorthin.
 *
 * Wird von der Korb-Leiste und vom Direktkauf-Knopf benutzt - beide
 * gehen denselben Weg, damit es nur eine Stelle gibt, die schiefgehen
 * kann (und nur eine, die zu pruefen ist).
 */
export async function goToCheckout(lines: CartLine[], lang: Lang) {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lines, lang }),
  });
  if (!res.ok) throw new Error(String(res.status));
  const { url } = (await res.json()) as { url: string };
  window.location.assign(url);
}
