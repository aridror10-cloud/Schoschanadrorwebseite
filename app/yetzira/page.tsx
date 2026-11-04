import type { Metadata } from "next";
import { CreationFunnel } from "@/components/site/CreationFunnel";
import { SiteShell } from "@/components/site/SiteShell";
import { RELATED, YETZIRA, type RelatedWork } from "@/lib/journey";
import { COLLECTIONS, PROJECTS } from "@/lib/studio";
import "./yetzira.css";

/** Fragenweg "יצירה משלכם" (04.11.26), siehe lib/journey.ts und CreationFunnel. */

export const metadata: Metadata = {
  title: YETZIRA.metaTitle,
  description: YETZIRA.metaDescription,
  alternates: { canonical: "/yetzira" },
  openGraph: { title: YETZIRA.metaTitle, description: YETZIRA.metaDescription, url: "/yetzira" },
};

/** Verwandte Werke als kleine Karten, nur aus echten Projekten und Kollektionen */
function relatedWorks(): Record<string, RelatedWork> {
  const out: Record<string, RelatedWork> = {};
  for (const href of new Set(Object.values(RELATED))) {
    const design = href.match(/^\/design\/(.+)$/);
    const works = href.match(/^\/works\/(.+)$/);
    if (design) {
      const p = PROJECTS.find((x) => x.slug === design[1]);
      if (p?.images[0]) out[href] = { href, title: p.title, sub: p.subtitle, img: p.images[0].src };
    } else if (works) {
      const c = COLLECTIONS.find((x) => x.slug === works[1]);
      const img = c?.cover?.src ?? c?.items[0]?.image?.src;
      if (c && img) out[href] = { href, title: c.title, sub: c.lead.length > 80 ? `${c.lead.slice(0, 78)}…` : c.lead, img };
    } else if (href === "/carlebach") {
      out[href] = { href, title: "חנוכיה ודיוקנאות קרליבך", sub: "יצירות מתכת בהשראת ר׳ שלמה קרליבך", img: "/carlebach/chanuka-1.webp" };
    } else if (href === "/works") {
      out[href] = { href, title: "יצירות וקולקציות", sub: "דיוקנאות, מגזרות ויצירות מתכת", img: "/carlebach/set.webp" };
    }
  }
  return out;
}

export default function YetziraPage() {
  return (
    <SiteShell>
      <section className="yz-section">
        <CreationFunnel related={relatedWorks()} />
      </section>
    </SiteShell>
  );
}
