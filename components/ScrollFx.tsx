"use client";

import { useEffect } from "react";

/**
 * Aktiviert die Einblend-Animationen beim Scrollen.
 *
 * Ohne JavaScript (oder bei reduzierter Bewegung) wird die Klasse "fx" nie
 * gesetzt - dann ist alles sofort sichtbar und nichts animiert.
 */
export function ScrollFx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("fx");

    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Galerie-Moment: kurz nach dem Erscheinen entpuppt sich das
            // Set-Foto als gerahmtes Bild an der Wand
            if (entry.target.hasAttribute("data-frame")) {
              timers.push(window.setTimeout(() => entry.target.classList.add("framed"), 900));
            }
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    const els = document.querySelectorAll("[data-reveal], [data-reveal-group], [data-cut]");
    els.forEach((el) => io.observe(el));

    const nav = document.querySelector("header.nav");
    const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
