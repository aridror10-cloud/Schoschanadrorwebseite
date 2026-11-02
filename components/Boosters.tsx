"use client";

import { useEffect, useState } from "react";
import { cartStore } from "@/lib/cart-store";
import { readRef } from "@/lib/ref";
import { track } from "@/lib/pixel";
import { trackEvent } from "@/lib/analytics";
import type { Lang } from "@/lib/content";

/**
 * Verkaufshilfen fuer die Carlebach-Seite (02.11.26). Alles ehrlich:
 * keine erfundene Knappheit, keine falschen Bewertungen. Nur Klarheit
 * und kurze Wege zur Entscheidung.
 */

const T = {
  he: {
    trust: ["תשלום מאובטח בסאמיט", "משלוח עד הבית או איסוף עצמי", "מגיע מוכן לתלייה"],
    sticky: "לבחירת הדיוקן",
    stickyFrom: "החל מ־590 ₪",
    qTitle: "יש לכם שאלה?",
    qLead: "כתבו כאן, ושושנה תחזור אליכם בהקדם.",
    qName: "שם",
    qContact: "טלפון או אימייל",
    qText: "השאלה שלכם",
    qSend: "שליחת השאלה",
    qSending: "שולח…",
    qDone: "תודה! השאלה התקבלה, ושושנה תחזור אליכם בהקדם.",
    qError: "משהו השתבש. אפשר גם להתקשר: 053-314-2341",
  },
  en: {
    trust: ["Secure payment via SUMIT", "Home delivery or self-pickup", "Arrives ready to hang"],
    sticky: "Choose your portrait",
    stickyFrom: "from ₪590",
    qTitle: "Have a question?",
    qLead: "Write it here and Shoshana will get back to you soon.",
    qName: "Name",
    qContact: "Phone or email",
    qText: "Your question",
    qSend: "Send question",
    qSending: "Sending…",
    qDone: "Thank you! Your question came through, and Shoshana will reply soon.",
    qError: "Something went wrong. You can also call +972 53-314-2341",
  },
} as const;

/** Drei kurze Zusagen unter den Kauf-Knoepfen */
export function TrustRow({ lang, dark = false, wall = true }: { lang: Lang; dark?: boolean; wall?: boolean }) {
  // "Wird aufhaengebereit geliefert" gilt nur fuer die Wandbilder
  const items = wall ? T[lang].trust : T[lang].trust.slice(0, 2);
  return (
    <ul className={`trust-row${dark ? " is-dark" : ""}`}>
      {items.map((x) => (
        <li key={x}>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {x}
        </li>
      ))}
    </ul>
  );
}

/**
 * Feste Kaufleiste unten, nur auf dem Handy: erscheint nach dem Kopf der
 * Seite, verschwindet bei den Werken selbst und wenn der Korb gefuellt ist
 * (dann steht dort schon die Korb-Leiste).
 */
export function StickyBuy({ lang }: { lang: Lang }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const choose = document.getElementById("choose");
    let inChoose = false;
    const io = choose
      ? new IntersectionObserver(([e]) => {
          inChoose = Boolean(e?.isIntersecting);
          update();
        })
      : null;
    if (choose && io) io.observe(choose);
    function update() {
      const empty = cartStore.snapshot().length === 0;
      setShow(window.scrollY > window.innerHeight * 0.9 && !inChoose && empty);
    }
    window.addEventListener("scroll", update, { passive: true });
    const unsub = cartStore.subscribe(update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      io?.disconnect();
      void unsub();
    };
  }, []);
  return (
    <div className={`sticky-buy${show ? " on" : ""}`} aria-hidden={!show}>
      <span className="sticky-buy-from">{T[lang].stickyFrom}</span>
      <a href="#choose" className="sticky-buy-btn" tabIndex={show ? 0 : -1} data-track="sticky_buy">
        {T[lang].sticky}
      </a>
    </div>
  );
}

/** Kurze Frage direkt beim Produkt, landet bei Shoshana und Bernard */
export function QuickQuestion({ lang, piece }: { lang: Lang; piece?: string }) {
  const t = T[lang];
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [text, setText] = useState("");
  const [trap, setTrap] = useState("");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !text.trim()) return;
    setState("sending");
    const isMail = contact.includes("@");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "question",
          name,
          email: isMail ? contact.trim() : "",
          phone: isMail ? "" : contact.trim(),
          piece: piece ?? "",
          message: text,
          ref: readRef(),
          lang,
          website: trap,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("Lead", { content_category: "question" });
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") return <p className="qq-done">{t.qDone}</p>;
  return (
    <details className="qq" onToggle={(e) => (e.currentTarget as HTMLDetailsElement).open && trackEvent("cta_click", { label: "question_open" })}>
      <summary>{t.qTitle}</summary>
      <form onSubmit={send}>
        <p>{t.qLead}</p>
        <input aria-label={t.qName} placeholder={t.qName} value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
        <input aria-label={t.qContact} placeholder={t.qContact} value={contact} onChange={(e) => setContact(e.target.value)} required maxLength={160} dir="auto" />
        <textarea aria-label={t.qText} placeholder={t.qText} value={text} onChange={(e) => setText(e.target.value)} required rows={3} maxLength={2000} />
        <input className="qq-trap" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} aria-hidden="true" />
        <button type="submit" disabled={state === "sending"}>
          {state === "sending" ? t.qSending : t.qSend}
        </button>
        {state === "error" && <p className="qq-error">{t.qError}</p>}
      </form>
    </details>
  );
}
