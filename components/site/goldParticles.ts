/**
 * Goldstaub fuer den Rechenmoment im Fragenweg (04.11.26). Reines Canvas 2D,
 * keine Bibliothek: Die Menora (Zeichen + Spiegelbild) wird unsichtbar
 * gezeichnet, daraus werden Zielpunkte abgetastet. Die Teilchen fliegen von
 * der Seite der Fragen herein und setzen sich auf die Arme, die inneren
 * zuerst, wie ein Faecher. Laeuft einmal (gut 2 s), danach ist das Canvas
 * leer und es laeuft nichts mehr. Nur auf Desktop mit Maus und ohne
 * "Bewegung reduzieren" (entscheidet der Aufrufer).
 */
import { BANDS } from "./Ornaments";

/** muss zur viewBox der Buehne passen */
export const STAGE_VIEW = { x: -262, y: -96, w: 524, h: 496 };

interface P {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  cx: number;
  cy: number;
  delay: number;
  r: number;
  hue: number;
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function runGoldParticles(canvas: HTMLCanvasElement, count = 1000, duration = 2300): Promise<void> {
  return new Promise((resolve) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return resolve();
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const W = Math.max(1, Math.round(rect.width * dpr));
    const H = Math.max(1, Math.round(rect.height * dpr));
    canvas.width = W;
    canvas.height = H;

    // viewBox auf das Canvas abbilden (wie preserveAspectRatio xMidYMid meet)
    const s = Math.min(W / STAGE_VIEW.w, H / STAGE_VIEW.h);
    const ox = (W - STAGE_VIEW.w * s) / 2 - STAGE_VIEW.x * s;
    const oy = (H - STAGE_VIEW.h * s) / 2 - STAGE_VIEW.y * s;

    // Form unsichtbar zeichnen und abtasten
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const o = off.getContext("2d");
    if (!o) return resolve();
    const path = new Path2D(BANDS);
    o.setTransform(s, 0, 0, s, ox - s, oy);
    o.fill(path);
    o.setTransform(-s, 0, 0, s, ox + s, oy);
    o.fill(path);
    const px = o.getImageData(0, 0, W, H).data;

    const pts: P[] = [];
    let tries = 0;
    // fester Startwert, damit es jedes Mal gleich schoen aussieht
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    while (pts.length < count && tries < count * 40) {
      tries++;
      const x = Math.floor(rnd() * W);
      const y = Math.floor(rnd() * H);
      if ((px[(y * W + x) * 4 + 3] ?? 0) < 128) continue;
      // Start rechts (Seite der Fragen in RTL) und unten, Bogen als Kontrollpunkt
      const fromRight = rnd() < 0.72;
      const sx = fromRight ? W + rnd() * W * 0.25 : rnd() * W;
      const sy = fromRight ? rnd() * H : H + rnd() * H * 0.2;
      // Faecher: Verzoegerung nach Abstand zur Mittelachse (innen zuerst)
      const ux = (x - ox) / s;
      const uy = (y - oy) / s;
      const dist = Math.hypot(ux, uy - 64);
      pts.push({
        sx,
        sy,
        tx: x,
        ty: y,
        cx: (sx + x) / 2 + (rnd() - 0.5) * W * 0.5,
        cy: Math.min(sy, y) - rnd() * H * 0.35,
        delay: Math.min(0.42, dist / 600) + rnd() * 0.12,
        r: (0.7 + rnd() * 1.5) * dpr,
        hue: rnd(),
      });
    }

    const t0 = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const t = (now - t0) / duration;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      const fadeOut = t > 0.82 ? Math.max(0, 1 - (t - 0.82) / 0.18) : 1;
      for (const p of pts) {
        const k = Math.max(0, Math.min(1, (t - p.delay) / 0.55));
        if (k <= 0) continue;
        const e = ease(k);
        const a = 1 - e;
        const x = a * a * p.sx + 2 * a * e * p.cx + e * e * p.tx;
        const y = a * a * p.sy + 2 * a * e * p.cy + e * e * p.ty;
        const alpha = Math.min(1, k * 3) * fadeOut;
        const g = p.hue < 0.5 ? "214, 178, 96" : "235, 207, 138";
        ctx.fillStyle = `rgba(${g}, ${0.16 * alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${g}, ${0.85 * alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (t < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, W, H);
        cancelAnimationFrame(raf);
        resolve();
      }
    };
    raf = requestAnimationFrame(frame);
  });
}
