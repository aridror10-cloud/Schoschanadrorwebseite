"use client";

import { useEffect, useState } from "react";

/**
 * Zwei Ansichten der Sukkot-Serie im ruhigen Wechsel: Foto auf weisser
 * Wand und Darstellung in der Sukka (Shoshana, 07.09.26: "Bilder wechseln
 * zwischen Darstellung in der Sukka und Foto auf weisser Wand").
 *
 * Beide Bilder liegen uebereinander, nur die Deckkraft wechselt - so gibt
 * es nie einen leeren Moment. Wer Bewegung reduziert haben moechte, sieht
 * dauerhaft das Foto auf weisser Wand.
 */
export function SukkotSlides({ images, alts }: { images: string[]; alts: string[] }) {
  const [aktiv, setAktiv] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const takt = setInterval(() => setAktiv((i) => (i + 1) % images.length), 4800);
    return () => clearInterval(takt);
  }, [images.length]);

  return (
    <div className="ph sukkot-slides" aria-live="off">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alts[i] ?? ""}
          loading="lazy"
          className={i === aktiv ? "is-aktiv" : ""}
          aria-hidden={i !== aktiv}
        />
      ))}
    </div>
  );
}
