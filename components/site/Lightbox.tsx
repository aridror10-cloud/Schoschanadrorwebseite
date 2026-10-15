"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Pic } from "@/lib/studio";

/**
 * Bildergalerie mit Grossansicht.
 *
 * Die Vorschaubilder sind normale Knoepfe; ein Klick oeffnet ein
 * <dialog> mit dem Bild in voller Groesse, Weiterblaettern per Pfeiltaste
 * oder Knopf, Escape schliesst. Der Fokus kehrt danach zum angeklickten
 * Bild zurueck. Ohne JavaScript bleiben die Vorschaubilder sichtbar.
 */
export function Lightbox({
  pics,
  className = "",
  sizes = "(max-width: 760px) 100vw, 33vw",
}: {
  pics: (Pic & { caption?: string })[];
  className?: string;
  sizes?: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + pics.length) % pics.length)),
    [pics.length],
  );

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (index !== null && !el.open) el.showModal();
    if (index === null && el.open) {
      el.close();
      opener.current?.focus();
    }
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    // Im RTL-Layout zeigt "vorwaerts" nach links
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") step(1);
      if (e.key === "ArrowRight") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, step]);

  const current = index === null ? null : pics[index];

  return (
    <>
      <ul className={`lb-grid ${className}`}>
        {pics.map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              className="lb-thumb"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setIndex(i);
              }}
              aria-label={`הגדלת התמונה: ${p.alt}`}
            >
              <img src={p.src} alt={p.alt} width={p.w} height={p.h} loading="lazy" sizes={sizes} />
            </button>
            {p.caption && <p className="lb-caption">{p.caption}</p>}
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className="lb-dialog"
        aria-label={current?.alt ?? ""}
        onClose={close}
        onClick={(e) => {
          // Klick auf den abgedunkelten Rand schliesst
          if (e.target === e.currentTarget) close();
        }}
      >
        {current && (
          <figure className="lb-figure">
            <img src={current.src} alt={current.alt} width={current.w} height={current.h} />
            <figcaption>
              {current.caption ?? current.alt}
              {pics.length > 1 && (
                <span className="lb-count" dir="ltr">
                  {index! + 1} / {pics.length}
                </span>
              )}
            </figcaption>
          </figure>
        )}
        <div className="lb-controls">
          {pics.length > 1 && (
            <>
              <button type="button" className="lb-btn" onClick={() => step(-1)} aria-label="התמונה הקודמת">
                →
              </button>
              <button type="button" className="lb-btn" onClick={() => step(1)} aria-label="התמונה הבאה">
                ←
              </button>
            </>
          )}
          <button type="button" className="lb-btn lb-close" onClick={close} aria-label="סגירה">
            ✕
          </button>
        </div>
      </dialog>
    </>
  );
}
