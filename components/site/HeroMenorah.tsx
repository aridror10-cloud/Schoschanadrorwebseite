"use client";

import { useEffect, useRef } from "react";

/**
 * Gold im Titel der Startseite (04.11.26, Wunsch Bernard): Faehrt die Maus
 * ueber den Titel, werden die Buchstaben rund um den Zeiger weich zu Gold,
 * wie Blattgold im Licht. Darin liegt gross die Menora (Shoshanas Zeichen +
 * Spiegelbild, public/studio/menorah-licht.svg): ihre Boegen ziehen als
 * hellere Goldbaender durch die Buchstaben und gleiten kaum merklich mit
 * dem Zeiger. Verlaesst die Maus den Titel, wird alles weich wieder dunkel.
 *
 * Technik: eine deckungsgleiche Kopie des Titels ueber dem echten, deren
 * Buchstaben Gold + Menora als Hintergrund zeigen (background-clip: text),
 * sichtbar nur im weichen Kreis um den Zeiger. Ohne Maus oder bei
 * "Bewegung reduzieren" bleibt der Titel unveraendert.
 */
export function TitleWindow({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const area = el?.closest(".sj-hero-inner") as HTMLElement | null;
    if (!el || !area) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    // aktuell / Ziel: Oeffnung a (0..1), Zeiger x/y in px relativ zum Titel
    let a = 0, ta = 0;
    let x = 0, y = 0, tx = 0, ty = 0;
    let raf = 0;

    const draw = () => {
      a += (ta - a) * (ta > a ? 0.06 : 0.05);
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      const w = el.offsetWidth || 1;
      el.style.setProperty("--wa", a.toFixed(4));
      el.style.setProperty("--wx", `${x.toFixed(1)}px`);
      el.style.setProperty("--wy", `${y.toFixed(1)}px`);
      // Menora gleitet leicht gegen den Zeiger: wirkt wie in der Tiefe
      el.style.setProperty("--wp", `${((x / w - 0.5) * -34).toFixed(2)}px`);
      const busy = Math.abs(ta - a) > 0.001 || Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3;
      raf = busy ? requestAnimationFrame(draw) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (a < 0.02) {
        x = tx;
        y = ty;
      }
      // voll ueber dem Titel, weich auslaufend bis 120 px darueber/darunter
      const d = Math.max(0, r.top - e.clientY, e.clientY - r.bottom);
      ta = d < 120 ? 1 - (d / 120) ** 2 : 0;
      kick();
    };
    const onLeave = () => {
      ta = 0;
      kick();
    };

    // erst nach dem Aufbau der Eroeffnung
    const start = window.setTimeout(() => {
      area.addEventListener("pointermove", onMove);
      area.addEventListener("pointerleave", onLeave);
    }, 2200);

    return () => {
      window.clearTimeout(start);
      cancelAnimationFrame(raf);
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <span className="sj-title-window" ref={ref} aria-hidden="true">
      {text}
    </span>
  );
}
