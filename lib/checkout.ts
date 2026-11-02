"use client";

import { cartTotal, type CartLine } from "@/lib/cart";
import type { Lang } from "@/lib/content";
import { rememberCart } from "@/lib/ref";

/**
 * Uebergabe an SUMIT: /api/cart legt den Warenkorb an und liefert die
 * Adresse der fertigen Zahlseite, wir schicken die Kundschaft dorthin.
 *
 * Wird von der Korb-Leiste und vom Direktkauf-Knopf benutzt - beide
 * gehen denselben Weg, damit es nur eine Stelle gibt, die schiefgehen
 * kann (und nur eine, die zu pruefen ist).
 *
 * Seit 02.11.26 mit einer ruhigen Zwischenseite ("Sie werden zur sicheren
 * Zahlung weitergeleitet"), damit der Wechsel zu SUMIT nicht wie ein
 * Bruch wirkt. Eine eingebettete Zahlseite geht nicht zuverlaessig:
 * SUMIT braucht ein Cookie, das Safari und Chrome im iframe sperren.
 */

const TEXT = {
  he: { title: "מעבירים אתכם לתשלום מאובטח", sub: "דף התשלום של סאמיט נפתח עוד רגע. אחרי התשלום תחזרו לכאן.", total: "לתשלום" },
  en: { title: "Taking you to secure payment", sub: "SUMIT's payment page opens in a moment. After paying you'll come back here.", total: "Total" },
} as const;

function showOverlay(lang: Lang, total: number) {
  const t = TEXT[lang];
  const el = document.createElement("div");
  el.className = "pay-overlay";
  el.setAttribute("role", "status");
  el.setAttribute("dir", lang === "he" ? "rtl" : "ltr");
  el.innerHTML = `
    <div class="pay-overlay-card">
      <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      <p class="pay-overlay-title"></p>
      <p class="pay-overlay-sub"></p>
      <p class="pay-overlay-total"></p>
      <span class="pay-overlay-dots" aria-hidden="true"><i></i><i></i><i></i></span>
    </div>`;
  el.querySelector(".pay-overlay-title")!.textContent = t.title;
  el.querySelector(".pay-overlay-sub")!.textContent = t.sub;
  el.querySelector(".pay-overlay-total")!.textContent = `${t.total}: ₪${total.toLocaleString("en-US")}`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("on"));
  return () => el.remove();
}

export async function goToCheckout(lines: CartLine[], lang: Lang) {
  rememberCart(lines);
  const hide = showOverlay(lang, cartTotal(lines));
  try {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines, lang }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const { url } = (await res.json()) as { url: string };
    // Zurueck-Knopf des Browsers: Zwischenseite wieder wegnehmen
    window.addEventListener("pageshow", (e) => e.persisted && hide(), { once: true });
    window.location.assign(url);
  } catch (e) {
    hide();
    throw e;
  }
}
