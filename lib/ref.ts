"use client";

import type { CartLine } from "@/lib/cart";
import { cartTotal } from "@/lib/cart";

/**
 * Empfehlungslinks (Shoshana, 19.10.26): Partnerinnen bekommen eine eigene
 * Adresse wie /r/<name>. Die setzt ein Cookie "sj_ref" (60 Tage, siehe
 * app/r/[code]/route.ts). Hier wird es gelesen:
 * - Anfrageformulare schicken die Herkunft mit, sie steht in der Mail.
 * - Vor dem Wechsel zu SUMIT merken wir uns den Korb.
 * - Die Dankesseite meldet einen abgeschlossenen Kauf samt Korb per Mail,
 *   damit Shoshana die Provision zuordnen kann.
 * Ohne Cookie passiert nichts. Kein Fremddienst, keine Kosten.
 */

export function readRef(): string {
  const m = document.cookie.match(/(?:^|;\s*)sj_ref=([a-z0-9-]{2,40})/);
  return m?.[1] ?? "";
}

const CART_KEY = "sj_last_cart";

export function rememberCart(lines: CartLine[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify({ lines, total: cartTotal(lines), at: Date.now() }));
  } catch {
    /* Speicher gesperrt: dann eben ohne Korbangaben */
  }
}

export function reportReferralPurchase() {
  const ref = readRef();
  if (!ref) return;
  try {
    // Pro Kauf nur einmal melden, auch wenn die Dankesseite neu geladen wird
    if (sessionStorage.getItem("sj_ref_reported")) return;
    sessionStorage.setItem("sj_ref_reported", "1");
  } catch {
    /* ohne sessionStorage melden wir trotzdem */
  }
  let cart: unknown = null;
  try {
    cart = JSON.parse(localStorage.getItem(CART_KEY) ?? "null");
    localStorage.removeItem(CART_KEY);
  } catch {
    cart = null;
  }
  void fetch("/api/referral", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ref, cart }),
    keepalive: true,
  }).catch(() => {});
}
