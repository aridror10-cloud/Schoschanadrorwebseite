"use client";

import { useEffect } from "react";
import { track } from "@/lib/pixel";

/**
 * Meldet auf der Dankesseite einen Kauf an den Meta Pixel.
 *
 * SUMIT leitet nach der Zahlung hierher zurueck, gibt aber weder Betrag
 * noch Produkt mit - deshalb ein Kauf ohne Wert. Fuer Reichweiten- und
 * Retargeting-Zwecke reicht das. Je Seitenaufruf nur einmal.
 */
export function PurchaseEvent() {
  useEffect(() => {
    track("Purchase", { currency: "ILS" });
  }, []);
  return null;
}
