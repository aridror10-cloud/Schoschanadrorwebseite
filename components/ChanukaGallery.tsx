"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChanukaPic } from "@/lib/chanuka-pics";
import { CHANUKA_PIC_EVENT, CHANUKA_THUMB_EVENT } from "@/components/ChanukaColorBuy";

type Labels = { enlarge: string; show: string; prev: string; next: string; close: string };

/**
 * Produktfotos der Chanukkia: ein grosses Bild, darunter die anderen klein.
 * Klick auf ein kleines Bild macht es zum grossen; Klick auf das grosse
 * oeffnet die Vollansicht, in der man durch alle Fotos blaettert.
 */
export function ChanukaGallery({
  pics,
  lang,
  labels,
  dir,
}: {
  pics: ChanukaPic[];
  lang: "he" | "en";
  labels: Labels;
  dir: "rtl" | "ltr";
}) {
  const [main, setMain] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setOpen(null), []);

  /* Farbwahl unter dem Preis zeigt das Foto der Farbe gross (04.11.26) */
  useEffect(() => {
    const onPic = (e: Event) => {
      const i = (e as CustomEvent<number>).detail;
      if (typeof i === "number" && i >= 0 && i < pics.length) setMain(i);
    };
    window.addEventListener(CHANUKA_PIC_EVENT, onPic);
    return () => window.removeEventListener(CHANUKA_PIC_EVENT, onPic);
  }, [pics.length]);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + pics.length) % pics.length)),
    [pics.length],
  );

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open !== null && !el.open) el.showModal();
    if (open === null && el.open) {
      el.close();
      opener.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const fwd = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === fwd) step(1);
      if (e.key === back) step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, step, dir]);

  const big = pics[main];
  if (!big) return null;
  const current = open === null ? null : pics[open];

  return (
    <div className="chanuka-gallery">
      <button
        type="button"
        className="chanuka-main"
        onClick={(e) => {
          opener.current = e.currentTarget;
          setOpen(main);
        }}
        aria-label={`${labels.enlarge}: ${big.alt[lang]}`}
      >
        <img src={big.src} alt={big.alt[lang]} width={big.w} height={big.h} loading="lazy" />
        <span className="home-zoom" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6" />
            <path d="M15 15l5 5M10.5 8v5M8 10.5h5" />
          </svg>
        </span>
      </button>
      {pics.length > 1 && (
        <div className="chanuka-thumbs">
          {pics.map((p, i) => (
            <button
              key={p.src}
              type="button"
              className={`chanuka-thumb${i === main ? " is-on" : ""}`}
              onClick={() => {
                setMain(i);
                window.dispatchEvent(new CustomEvent(CHANUKA_THUMB_EVENT, { detail: i }));
              }}
              aria-label={`${labels.show}: ${p.alt[lang]}`}
              aria-pressed={i === main}
            >
              <img src={p.src} alt="" width={p.w} height={p.h} loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <dialog
        ref={dialog}
        className="lb-dialog"
        dir={dir}
        aria-label={current?.alt[lang] ?? ""}
        onClose={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {current && (
          <figure className="lb-figure">
            <img src={current.src} alt={current.alt[lang]} width={current.w} height={current.h} />
            <figcaption>
              {current.alt[lang]}
              <span className="lb-count" dir="ltr">
                {open! + 1} / {pics.length}
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
    </div>
  );
}
