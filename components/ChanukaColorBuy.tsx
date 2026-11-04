"use client";

import { useEffect, useState } from "react";
import { CHANUKA_COLORS, type ChanukaModel } from "@/lib/chanuka-pics";
import { PieceControls } from "@/components/PieceControls";
import type { Lang } from "@/lib/content";

/**
 * Farbwahl der Chanukkia (Shoshana, 04.11.26): kleine Metallplaettchen,
 * darunter Stueckzahl und Korb. Jede Farbe ist ein eigenes Produkt im
 * Korb (und bei SUMIT), damit die Farbe auf der Bestellung steht.
 *
 * Mit der Galerie spricht die Wahl ueber zwei Fensterereignisse:
 * "chanuka-pic" zeigt das Foto der gewaehlten Farbe gross, und tippt
 * jemand in der Galerie ein Farbfoto an ("chanuka-thumb"), springt die
 * Wahl mit. Ohne JavaScript bleibt die Grundfarbe gewaehlt.
 */
export const CHANUKA_PIC_EVENT = "chanuka-pic";
export const CHANUKA_THUMB_EVENT = "chanuka-thumb";

export function ChanukaColorBuy({ lang }: { lang: Lang }) {
  const [model, setModel] = useState<ChanukaModel>("chanuka");
  const current = CHANUKA_COLORS.find((c) => c.model === model) ?? CHANUKA_COLORS[0];

  useEffect(() => {
    const onThumb = (e: Event) => {
      const i = (e as CustomEvent<number>).detail;
      const hit = CHANUKA_COLORS.find((c) => c.pic === i);
      if (hit) setModel(hit.model);
    };
    window.addEventListener(CHANUKA_THUMB_EVENT, onThumb);
    return () => window.removeEventListener(CHANUKA_THUMB_EVENT, onThumb);
  }, []);

  function pick(m: ChanukaModel, pic: number) {
    setModel(m);
    window.dispatchEvent(new CustomEvent(CHANUKA_PIC_EVENT, { detail: pic }));
  }

  return (
    <>
      <div className="cc">
        <p className="cc-label">
          {lang === "he" ? "גוון" : "Finish"}: <span className="cc-name">{current[lang]}</span>
        </p>
        <div className="cc-swatches" role="radiogroup" aria-label={lang === "he" ? "בחירת גוון" : "Choose a finish"}>
          {CHANUKA_COLORS.map((c) => (
            <button
              key={c.model}
              type="button"
              role="radio"
              aria-checked={c.model === model}
              className={`cc-swatch${c.model === model ? " is-on" : ""}`}
              onClick={() => pick(c.model, c.pic)}
              title={c[lang]}
            >
              <span className="cc-chip" style={{ background: c.swatch }} aria-hidden="true" />
              <span className="cc-text">{c[lang]}</span>
            </button>
          ))}
        </div>
      </div>
      <PieceControls model={model} lang={lang} />
    </>
  );
}
