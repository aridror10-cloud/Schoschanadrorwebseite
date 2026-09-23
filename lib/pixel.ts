"use client";

/**
 * Meta Pixel (Facebook) - Ereignisse aus der Website melden.
 *
 * Pixel-ID vom Marketing-Betreuer Shoshanas (23.09.26). Der Pixel selbst
 * wird in components/MetaPixel.tsx geladen; hier nur die Meldungen.
 * Ohne geladenen Pixel (Werbeblocker, Tracking-Schutz) passiert nichts -
 * die Website funktioniert unabhaengig davon.
 */
export { PIXEL_ID } from "@/lib/pixel-id";

type Fbq = (cmd: "track", event: string, params?: Record<string, unknown>) => void;

/**
 * Der Pixel laedt erst nach dem Sichtbarwerden der Seite. Ein Ereignis
 * direkt beim Laden (Kauf auf der Dankesseite) kaeme sonst zu frueh -
 * deshalb bis zu fuenf Sekunden nachwarten, dann aufgeben.
 */
export function track(event: string, params?: Record<string, unknown>, tries = 25) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq !== "function") {
    if (tries > 0) setTimeout(() => track(event, params, tries - 1), 200);
    return;
  }
  try {
    fbq("track", event, params);
  } catch {
    /* Meldung ist nie wichtiger als die Seite selbst */
  }
}
