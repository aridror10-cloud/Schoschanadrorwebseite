"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

/**
 * Zaehlt Seitenaufrufe und die wichtigen Klicks fuer /studio:
 * Telefon, Mail, Video, Grossansicht, Knoepfe mit data-track="..."
 * und ob jemand eine Seite zu drei Vierteln gelesen hat.
 */
export function Analytics() {
  const path = usePathname();

  useEffect(() => {
    if (path?.startsWith("/studio")) return;
    trackEvent("page_view", { title: document.title.slice(0, 120) });

    let sent = false;
    const onScroll = () => {
      if (sent) return;
      const h = document.documentElement;
      if ((h.scrollTop + window.innerHeight) / h.scrollHeight > 0.75) {
        sent = true;
        trackEvent("scroll_75");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [path]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("a,button,[data-track]");
      if (!el) return;
      const href = el.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) return trackEvent("phone_click");
      if (href.startsWith("mailto:")) return trackEvent("mail_click");
      if (el.classList.contains("yt-poster")) return trackEvent("video_play");
      if (el.classList.contains("home-frame") || el.classList.contains("chanuka-main") || el.classList.contains("lb-thumb"))
        return trackEvent("lightbox_open");
      const label = el.getAttribute("data-track");
      if (label) trackEvent("cta_click", { label: label.slice(0, 60) });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
