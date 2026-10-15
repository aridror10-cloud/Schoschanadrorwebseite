import type { ReactNode } from "react";
import { ScrollFx } from "@/components/ScrollFx";
import { ARTICLES } from "@/lib/articles";
import { NAV } from "@/lib/studio";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/**
 * Menue, wie es auf der Seite erscheint.
 *
 * Der Punkt "מאמרים ותהליכי יצירה" erscheint erst, wenn es mindestens
 * einen Artikel gibt. Ein Menuepunkt, der auf eine leere Seite fuehrt,
 * wirkt unfertig; mit dem ersten Artikel taucht er von selbst auf.
 */
export function visibleNav() {
  return NAV.filter((item) => item.href !== "/articles" || ARTICLES.length > 0);
}

/** Rahmen fuer alle Seiten der Website ausser der Carlebach-Verkaufsseite. */
export function SiteShell({ children, top }: { children: ReactNode; top?: ReactNode }) {
  const items = visibleNav();
  return (
    <div className="page studio" lang="he" dir="rtl">
      <ScrollFx lang="he" dir="rtl" />
      <a href="#main" className="skip-link">
        דילוג לתוכן
      </a>
      {top}
      <SiteHeader items={items} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter items={items} />
    </div>
  );
}
