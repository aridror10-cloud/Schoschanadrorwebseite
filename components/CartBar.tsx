"use client";

import { useState } from "react";
import { HAS_PLAIN, cartTotal } from "@/lib/cart";
import { cartStore, useCart } from "@/lib/cart-store";
import { goToCheckout } from "@/lib/checkout";
import { content, type Lang } from "@/lib/content";

/**
 * Korb-Leiste am unteren Rand.
 *
 * Zeigt jede Zeile mit Fassung und Stueckzahl - die Kundschaft soll vor
 * dem Bezahlen sehen, was sie bestellt, gerade weil "mit Pasuk" und
 * "ohne Pasuk" sich im Preis nicht unterscheiden. "Zur Kasse" laesst
 * /api/cart den SUMIT-Warenkorb bauen und leitet auf die Zahlseite.
 */
export function CartBar({ lang }: { lang: Lang }) {
  const t = content[lang].cart;
  const lines = useCart();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function checkout() {
    if (status === "sending" || lines.length === 0) return;
    setStatus("sending");
    try {
      await goToCheckout(lines);
    } catch {
      setStatus("error");
    }
  }

  if (lines.length === 0) return null;

  return (
    <div className="cart-bar" role="region" aria-label={t.title}>
      <div className="cart-bar-lines" aria-live="polite">
        {lines.map((l) => (
          <span className="cart-line" key={`${l.model}:${l.version}`}>
            <span className="cart-line-name">{t.names[l.model]}</span>
            {/* Die Fassung nur nennen, wo sie auch wirklich waehlbar ist -
                sonst verspricht die Leiste etwas, das die Bestellung gar
                nicht festhaelt. */}
            {HAS_PLAIN[l.model] && (
              <span className="cart-line-ver">
                {l.version === "with" ? t.versionWith : t.versionWithout}
              </span>
            )}
            {l.qty > 1 && <span className="cart-line-qty">×{l.qty}</span>}
            <button
              type="button"
              className="cart-line-x"
              onClick={() => cartStore.remove(l.model, l.version)}
              aria-label={`${t.remove}: ${t.names[l.model]}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <div className="cart-bar-end">
        <span className="cart-bar-total">₪{cartTotal(lines).toLocaleString("en-US")}</span>
        <button type="button" className="cart-bar-go" onClick={checkout}>
          {status === "sending" ? t.sending : t.checkout}
        </button>
        <button
          type="button"
          className="cart-bar-clear"
          onClick={() => { cartStore.clear(); setStatus("idle"); }}
          aria-label={t.clear}
        >
          ✕
        </button>
      </div>

      {status === "error" && <p className="cart-bar-error" role="alert">{t.error}</p>}
    </div>
  );
}
