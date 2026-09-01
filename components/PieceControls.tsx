"use client";

import { useEffect, useRef, useState } from "react";
import { HAS_PLAIN, MAX_QTY, type ModelKey, type Version } from "@/lib/cart";
import { cartStore } from "@/lib/cart-store";
import { content, type Lang } from "@/lib/content";

/**
 * Bedienelemente einer Werkkarte: Fassung (mit/ohne Pasuk), Stueckzahl,
 * "In den Korb".
 *
 * Die Fassung wird hier gewaehlt und nicht erst auf der Zahlseite - jede
 * Fassung ist bei SUMIT ein eigenes Produkt, damit auf der Bestellung
 * steht, was gefertigt werden soll.
 *
 * Seit dem 01.09.26 fuehrt nur noch ein Weg zur Kasse: der Korb. Der
 * zweite Kauf-Knopf je Karte ist auf Shoshanas Wunsch entfallen, weil
 * zwei Wege nebeneinander mehr Fragen aufwarfen als sie beantworteten.
 */
export function PieceControls({ model, lang }: { model: ModelKey; lang: Lang }) {
  const t = content[lang].cart;
  const [version, setVersion] = useState<Version>("with");
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function add() {
    cartStore.add(model, version, qty);
    setJustAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 1800);
  }

  const versions: { key: Version; label: string }[] = [
    { key: "with", label: t.versionWith },
    { key: "without", label: t.versionWithout },
  ];

  return (
    <div className="pc">
      {HAS_PLAIN[model] && (
        <div className="pc-versions" role="group" aria-label={t.versionLabel}>
          {versions.map((v) => (
            <button
              key={v.key}
              type="button"
              className={`pc-ver${version === v.key ? " sel" : ""}`}
              onClick={() => setVersion(v.key)}
              aria-pressed={version === v.key}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <div className="pc-buy">
        <div className="pc-qty" role="group" aria-label={t.qtyLabel}>
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label={t.less}
          >
            −
          </button>
          <span className="pc-qty-num" aria-live="polite">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
            disabled={qty >= MAX_QTY}
            aria-label={t.more}
          >
            +
          </button>
        </div>
        <button type="button" className={`pc-add${justAdded ? " done" : ""}`} onClick={add}>
          {justAdded ? t.added : t.add}
        </button>
      </div>

    </div>
  );
}
