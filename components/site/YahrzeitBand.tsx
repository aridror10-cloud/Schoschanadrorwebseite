"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Hinweisband auf der Startseite bis zum Yahrzeit von Reb Shlomo
 * (ט״ז בחשוון = 27.10.2026). Bis dahin laufen die Bestellungen mit 10 %
 * fuer Zedaka; danach verschwindet das Band von selbst, auch ohne neuen
 * Build (Pruefung im Browser).
 *
 * Grund: Werbung und geteilte Links zeigen oft auf die Startseite. Seit
 * dem 15.10.26 ist das nicht mehr die Verkaufsseite - das Band fuehrt
 * diese Besucher mit einem Klick zum Kauf.
 */
const ENDS = Date.UTC(2026, 9, 27, 22, 0, 0); // 28.10.2026 00:00 Israelzeit

export function YahrzeitBand() {
  const [show, setShow] = useState(Date.now() < ENDS);
  useEffect(() => setShow(Date.now() < ENDS), []);
  if (!show) return null;
  return (
    <aside className="sj-yahrzeit" aria-label="דיוקנאות קרליבך">
      <div className="wrap sj-yahrzeit-inner">
        <p>
          לקראת היארצייט של רבי שלמה קרליבך: דיוקנאות המתכת זמינים להזמנה עד ט״ז בחשוון, ו־10% מהרווחים יוקדשו לצדקה.
        </p>
        <Link href="/carlebach">
          לדיוקנאות ולהזמנה <span aria-hidden="true">←</span>
        </Link>
      </div>
    </aside>
  );
}
