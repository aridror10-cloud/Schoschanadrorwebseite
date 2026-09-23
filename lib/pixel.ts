"use client";

/**
 * Meta Pixel (Facebook) - Ereignisse aus der Website melden.
 *
 * Pixel-ID vom Marketing-Betreuer Shoshanas (23.09.26). Der Pixel selbst
 * wird in components/MetaPixel.tsx geladen; hier nur die Meldungen.
 * Ohne geladenen Pixel (Werbeblocker, Tracking-Schutz) passiert nichts -
 * die Website funktioniert unabhaengig davon.
 */
export const PIXEL_ID = "1037484335987383";

type Fbq = (cmd: "track", event: string, params?: Record<string, unknown>) => void;

export function track(event: string, params?: Record<string, unknown>) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq !== "function") return;
  try {
    fbq("track", event, params);
  } catch {
    /* Meldung ist nie wichtiger als die Seite selbst */
  }
}
