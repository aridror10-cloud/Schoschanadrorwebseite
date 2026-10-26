"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type HomeShot = {
  img: string;
  w: number;
  h: number;
  alt: string;
  /** Modellname, in Gold */
  name: string;
  /** Raum, leiser daneben */
  room: string;
  /** Sprung zur passenden Werkkarte */
  href: string;
  linkLabel: string;
};

type Labels = { enlarge: string; prev: string; next: string; close: string };

/**
 * Raumfotos der Portraets: ein grosses Bild mit dem ganzen Set, darunter
 * drei Einzelwerke. Klick vergroessert (ganzes Bild, ohne Beschnitt),
 * Pfeiltasten blaettern, Escape schliesst.
 */
export function HomesGallery({ items, labels, dir }: { items: HomeShot[]; labels: Labels; dir: "rtl" | "ltr" }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length],
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
    // "Weiter" zeigt in Leserichtung: RTL nach links, LTR nach rechts
    const fwd = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === fwd) step(1);
      if (e.key === back) step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, step, dir]);

  const current = index === null ? null : items[index];

  const shot = (h: HomeShot, i: number, feature: boolean) => (
    <figure className={`home-shot${feature ? " is-feature" : ""}`} key={h.img}>
      <button
        type="button"
        className="home-frame"
        onClick={(e) => {
          opener.current = e.currentTarget;
          setIndex(i);
        }}
        aria-label={`${labels.enlarge}: ${h.alt}`}
      >
        <img src={h.img} alt={h.alt} width={h.w} height={h.h} loading="lazy" />
        <span className="home-zoom" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6" />
            <path d="M15 15l5 5M10.5 8v5M8 10.5h5" />
          </svg>
        </span>
      </button>
      <figcaption>
        <span className="home-name">{h.name}</span>
        <span className="home-room">{h.room}</span>
        <a href={h.href} className="home-link">
          {h.linkLabel}
        </a>
      </figcaption>
    </figure>
  );

  const [first, ...rest] = items;

  return (
    <>
      {first && (
        <div className="homes-feature" data-reveal>
          {shot(first, 0, true)}
        </div>
      )}
      <div className="homes-row" data-reveal-group>
        {rest.map((h, i) => shot(h, i + 1, false))}
      </div>

      <dialog
        ref={dialog}
        className="lb-dialog"
        dir={dir}
        aria-label={current?.alt ?? ""}
        onClose={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {current && (
          <figure className="lb-figure">
            <img src={current.img} alt={current.alt} width={current.w} height={current.h} />
            <figcaption>
              {current.name}, {current.room}
              <span className="lb-count" dir="ltr">
                {index! + 1} / {items.length}
              </span>
            </figcaption>
          </figure>
        )}
        <div className="lb-controls">
          <button type="button" className="lb-btn" onClick={() => step(-1)} aria-label={labels.prev}>
            {dir === "rtl" ? "→" : "←"}
          </button>
          <button type="button" className="lb-btn" onClick={() => step(1)} aria-label={labels.next}>
            {dir === "rtl" ? "←" : "→"}
          </button>
          <button type="button" className="lb-btn lb-close" onClick={close} aria-label={labels.close}>
            ✕
          </button>
        </div>
      </dialog>
    </>
  );
}
