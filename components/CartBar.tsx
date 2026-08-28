"use client";

import { useEffect, useState } from "react";
import { CART_ITEMS, type CartKey, isCartKey } from "@/lib/cart";
import { content, type Lang } from "@/lib/content";

/**
 * Sammel-Bestellung auf der Seite selbst.
 *
 * Die "In den Korb"-Knoepfe stehen als data-cart-add-Attribute im
 * Server-Markup (gleiche Bauart wie die data-model-Vorauswahl des
 * Formulars); diese Komponente hoert auf die Klicks, fuehrt die Auswahl
 * und zeigt unten die Korb-Leiste. "Zur Kasse" laesst /api/cart den
 * SUMIT-Warenkorb bauen und leitet auf die fertige Zahlseite weiter.
 */
export function CartBar({ lang }: { lang: Lang }) {
  const t = content[lang].cart;
  const [items, setItems] = useState<CartKey[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement | null)?.closest("[data-cart-add]");
      const key = btn?.getAttribute("data-cart-add");
      if (!key || !isCartKey(key)) return;
      e.preventDefault();
      setStatus("idle");
      setItems((cur) => (cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  /* Knoepfe im Server-Markup spiegeln die Auswahl (Text + Zustand) */
  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-cart-add]").forEach((btn) => {
      const key = btn.getAttribute("data-cart-add");
      if (!key || !isCartKey(key)) return;
      const sel = items.includes(key);
      btn.classList.toggle("in-cart", sel);
      btn.setAttribute("aria-pressed", String(sel));
      const label = btn.querySelector(".cart-add-label");
      if (label) label.textContent = sel ? t.inCart : t.add;
    });
  }, [items, t]);

  async function checkout() {
    if (status === "sending" || items.length === 0) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const { url } = (await res.json()) as { url: string };
      window.location.assign(url);
    } catch {
      setStatus("error");
    }
  }

  if (items.length === 0) return null;

  const total = items.reduce((sum, k) => sum + CART_ITEMS[k].price, 0);

  return (
    <div className="cart-bar" role="region" aria-live="polite">
      <div className="cart-bar-info">
        <span className="cart-bar-names">{items.map((k) => t.names[k]).join(" · ")}</span>
        <span className="cart-bar-total">₪{total.toLocaleString("en-US")}</span>
        {status === "error" && <span className="cart-bar-error">{t.error}</span>}
      </div>
      <button type="button" className="cart-bar-go" onClick={checkout}>
        {status === "sending" ? t.sending : t.checkout}
      </button>
      <button type="button" className="cart-bar-clear" onClick={() => setItems([])} aria-label={t.clear}>
        ✕
      </button>
    </div>
  );
}
