"use client";

import { useEffect, useRef, useState } from "react";
import { HAS_PLAIN, MAX_QTY, type ModelKey, type Version } from "@/lib/cart";
import { cartStore } from "@/lib/cart-store";
import { goToCheckout } from "@/lib/checkout";
import { content, type Lang } from "@/lib/content";

/**
 * Bedienelemente einer Werkkarte: Fassung (mit/ohne Pasuk), Stueckzahl,
 * "In den Korb".
 *
 * Die Fassung wird hier gewaehlt und nicht erst auf der Zahlseite - jede
 * Fassung ist bei SUMIT ein eigenes Produkt, damit auf der Bestellung
 * steht, was gefertigt werden soll.
 *
 * Der Direktkauf-Knopf daneben bleibt im Server-Markup ein gewoehnlicher
 * Link auf die Fassung mit Pasuk (so kauft auch ohne JavaScript niemand
 * ins Leere). Sobald hier eine andere Fassung oder mehr als ein Stueck
 * gewaehlt ist, faengt diese Komponente den Klick ab und schickt die
 * Bestellung ueber denselben Weg wie die Korb-Leiste.
 */
export function PieceControls({ model, lang }: { model: ModelKey; lang: Lang }) {
  const t = content[lang].cart;
  const [version, setVersion] = useState<Version>("with");
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  /* Der Klick-Abfang liest den Stand beim Klicken, nicht beim Anmelden */
  const stateRef = useRef({ version, qty });
  stateRef.current = { version, qty };

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  useEffect(() => {
    const card = rootRef.current?.closest(".piece-body, .buy-all");
    const link = card?.querySelector<HTMLAnchorElement>("a[data-buy-href]");
    if (!link) return;

    const onClick = (e: MouseEvent) => {
      const cur = stateRef.current;
      // Fassung mit Pasuk, ein Stueck: der Link tut es selbst
      if (cur.version === "with" && cur.qty === 1) return;
      e.preventDefault();
      setFailed(false);
      goToCheckout([{ model, version: cur.version, qty: cur.qty }]).catch(() =>
        setFailed(true),
      );
    };

    link.addEventListener("click", onClick);
    return () => link.removeEventListener("click", onClick);
  }, [model]);

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

      {failed && <p className="pc-error" role="alert">{t.error}</p>}
    </div>
  );
}
