"use client";

import { readRef } from "@/lib/ref";

/**
 * Eigene, anonyme Statistik (02.11.26). Kein Cookie: die Besuchsnummer
 * liegt nur im sessionStorage des Tabs und ist danach weg. Die Herkunft
 * (Suchmaschine, Instagram, utm_source ...) merken wir uns fuer den Besuch.
 * Alles geht per sendBeacon an /api/track und darf die Seite nie stoeren.
 */

function session(): string {
  try {
    let s = sessionStorage.getItem("sj_s");
    if (!s) {
      s = Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
      sessionStorage.setItem("sj_s", s);
    }
    return s;
  } catch {
    return "nostorage";
  }
}

function source(): string {
  try {
    const known = sessionStorage.getItem("sj_src");
    if (known !== null) return known;
    const u = new URL(window.location.href);
    let src = u.searchParams.get("utm_source") || "";
    if (!src && u.searchParams.get("fbclid")) src = "facebook";
    if (!src && document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (host && host !== window.location.hostname.replace(/^www\./, "")) src = host;
    }
    const camp = u.searchParams.get("utm_campaign");
    if (src && camp) src = `${src} / ${camp}`;
    sessionStorage.setItem("sj_src", src);
    return src;
  } catch {
    return "";
  }
}

export function trackEvent(type: string, data?: Record<string, unknown>) {
  try {
    if (navigator.webdriver) return;
    const body = JSON.stringify({
      type,
      session: session(),
      path: window.location.pathname + window.location.hash,
      ref: readRef() || null,
      source: source(),
      lang: document.documentElement.lang === "en" || window.location.pathname.startsWith("/en") ? "en" : "he",
      data: data ?? {},
    });
    const blob = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/track", blob)) {
      void fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  } catch {
    /* Statistik ist nie wichtiger als die Seite */
  }
}

/** Meta-Pixel-Namen auf unsere Namen abbilden (siehe lib/pixel.ts) */
export const PIXEL_TO_EVENT: Record<string, string> = {
  AddToCart: "add_to_cart",
  InitiateCheckout: "checkout",
  Purchase: "purchase",
  Lead: "lead",
};
