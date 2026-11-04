"use client";

import { useEffect, useRef } from "react";

/**
 * Hintergrund des dunklen Werk-Bands (03.11.26): Muster aus Shoshanas
 * Zeichen (public/studio/muster.svg, Zeichen + Spiegelbild = drei Boegen
 * mit zwei Tropfen, jede zweite Reihe kopfueber). Darueber liegt dasselbe
 * Muster heller, sichtbar nur in einem weichen Lichtkreis.
 *
 * Mit Maus: das Licht folgt dem Zeiger, weich nachgezogen.
 * Ohne Maus (Handy): das Licht gleitet einmal quer durch, wenn das Band
 * ins Bild kommt, und verblasst dann.
 * Bei "Bewegung reduzieren" bleibt nur das ruhige Grundmuster.
 *
 * variant "wellen" (Schlussband der Unterseiten, 04.11.26): Wellenmuster
 * aus gespiegelten Boegen, je mit dem Tropfen als Flamme (muster-wellen.svg).
 */
export function LightPattern({ variant = "menora" }: { variant?: "menora" | "wellen" }) {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glow.current;
    const band = el?.parentElement?.parentElement;
    if (!el || !band) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0.5, y = 0.45, tx = x, ty = y; // Lichtmitte relativ zum Band (0..1)
    let a = 0, ta = 0; // Helligkeit
    let raf = 0;

    const draw = () => {
      x += (tx - x) * 0.085;
      y += (ty - y) * 0.085;
      a += (ta - a) * 0.06;
      el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
      el.style.opacity = a.toFixed(3);
      const moving = Math.abs(tx - x) > 0.0005 || Math.abs(ty - y) > 0.0005 || Math.abs(ta - a) > 0.002;
      raf = moving ? requestAnimationFrame(draw) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const hover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups: Array<() => void> = [];

    if (hover) {
      const onMove = (e: PointerEvent) => {
        const r = band.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width;
        ty = (e.clientY - r.top) / r.height;
        if (ta === 0) {
          x = tx;
          y = ty;
        }
        ta = 1;
        kick();
      };
      const onLeave = () => {
        ta = 0;
        kick();
      };
      band.addEventListener("pointermove", onMove);
      band.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        band.removeEventListener("pointermove", onMove);
        band.removeEventListener("pointerleave", onLeave);
      });
    } else {
      // einmaliger Lichtzug von rechts nach links (Leserichtung)
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io.disconnect();
          const t0 = performance.now();
          const D = 4200;
          const step = (now: number) => {
            const p = Math.min(1, (now - t0) / D);
            const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
            tx = 1.05 - e * 1.1;
            ty = 0.3 + Math.sin(p * Math.PI) * 0.25;
            ta = p < 0.75 ? 1 : 0;
            kick();
            if (p < 1) requestAnimationFrame(step);
          };
          x = 1.05;
          y = 0.3;
          requestAnimationFrame(step);
        },
        { threshold: 0.25 },
      );
      io.observe(band);
      cleanups.push(() => io.disconnect());
    }

    return () => {
      cancelAnimationFrame(raf);
      cleanups.forEach((f) => f());
    };
  }, []);

  return (
    <div className={`sj-pattern${variant === "wellen" ? " is-wellen" : ""}`} aria-hidden="true">
      <div className="sj-pattern-glow" ref={glow} />
    </div>
  );
}
