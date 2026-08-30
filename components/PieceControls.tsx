"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_QTY, type ModelKey, type Version } from "@/lib/cart";
import { cartStore } from "@/lib/cart-store";
import { content, type Lang } from "@/lib/content";

/**
 * Bedienelemente einer Werkkarte: Fassung (mit/ohne Pasuk), Stueckzahl,
 * "In den Korb".
 *
 * Die Fassung wird hier gewaehlt und nicht erst auf der Zahlseite - so
 * steht auf der Bestellung, was gefertigt werden soll (jede Fassung ist
 * bei SUMIT ein eigenes Produkt). Der Direktkauf-Knopf daneben wird
 * mitgefuehrt: er zeigt immer auf die Zahlseite der gewaehlten Fassung.
 */
export function PieceControls({
  model,
  lang,
  payHref,
}: {
  model: ModelKey;
  lang: Lang;
  /** Zahlseiten der beiden Fassungen; ohne zweite Fassung entfaellt die Wahl */
  payHref: { with: string; without?: string };
}) {
  const t = content[lang].cart;
  const [version, setVersion] = useState<Version>("with");
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  /*
   * Der Direktkauf-Knopf steht als Geschwister im Server-Markup. Statt ihn
   * hierher zu ziehen, fuehren wir nur seine Adresse nach - so bleibt er
   * ohne JavaScript ein gewoehnlicher Link auf die Fassung mit Pasuk.
   */
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const href = version === "without" ? payHref.without : payHref.with;
    if (!href) return;
    const card = rootRef.current?.closest(".piece-body, .buy-all");
    card?.querySelector<HTMLAnchorElement>("a[data-buy-href]")?.setAttribute("href", href);
  }, [version, payHref]);

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
    <div className="pc" ref={rootRef}>
      {payHref.without && (
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
