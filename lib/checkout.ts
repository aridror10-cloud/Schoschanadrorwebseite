"use client";

import type { CartLine } from "@/lib/cart";
import type { Lang } from "@/lib/content";
import { readRef, rememberCart } from "@/lib/ref";

/** Zweite Kasse PayPlus (02.11.26), nur wenn in Vercel eingeschaltet. Sonst SUMIT wie bisher. */
const USE_PAYPLUS = process.env.NEXT_PUBLIC_CHECKOUT === "payplus";

/**
 * Uebergabe an SUMIT: /api/cart legt den Warenkorb an und liefert die
 * Adresse der fertigen Zahlseite, wir schicken die Kundschaft dorthin.
 *
 * Wird von der Korb-Leiste und vom Direktkauf-Knopf benutzt - beide
 * gehen denselben Weg, damit es nur eine Stelle gibt, die schiefgehen
 * kann (und nur eine, die zu pruefen ist).
 */
export async function goToCheckout(lines: CartLine[], lang: Lang) {
  rememberCart(lines);
  const res = USE_PAYPLUS
    ? await fetch("/api/payplus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, lang, ref: readRef() }),
      })
    : await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, lang }),
      });
  if (!res.ok) throw new Error(String(res.status));
  const { url } = (await res.json()) as { url: string };
  window.location.assign(url);
}
