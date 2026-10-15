import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLink, Figure, SectionHead, StatusChip } from "@/components/site/Parts";
import { SiteShell } from "@/components/site/SiteShell";
import { COLLECTIONS, WORKS, brand } from "@/lib/studio";

/** Seite "יצירות וקולקציות" (Abschnitt 5): Uebersicht der vier Werkgruppen. */

export const metadata: Metadata = {
  title: WORKS.title,
  description: WORKS.paras[0],
  alternates: { canonical: "/works" },
  openGraph: { title: WORKS.title, description: WORKS.paras[0], url: "/works" },
};

export default function WorksPage() {
  return (
    <SiteShell>
      <section className="sj-page-hero is-center">
        <div className="wrap sj-narrow">
          <SectionHead as="h1" kicker={brand.slogan} title={WORKS.title} center>
            <p className="sj-lead">{WORKS.paras[0]}</p>
            <p>{WORKS.paras[1]}</p>
          </SectionHead>
        </div>
      </section>

      {COLLECTIONS.map((c, i) => {
        const href = c.href ?? `/works/${c.slug}`;
        const thumbs = c.items.slice(0, 3);
        return (
          <section key={c.slug} className={`sj-section sj-collection${i % 2 ? " sj-tint" : ""}`} id={c.slug}>
            <div className="wrap sj-split">
              <div className="sj-split-text" data-reveal>
                <p className="sj-kicker">
                  <span className="sj-letter">{c.letter}.</span> {c.title}
                </p>
                <h2 className="sj-title">{c.availability === "buy" ? c.lead : c.title}</h2>
                {c.availability !== "buy" && <p className="sj-lead">{c.lead}</p>}
                {c.paras.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
                <p>
                  <StatusChip collection={c} />
                </p>
                <ArrowLink href={href}>{c.availability === "buy" ? c.cta : WORKS.open}</ArrowLink>
              </div>
              <div className="sj-collection-media" data-reveal>
                <Link href={href} tabIndex={-1} aria-hidden="true">
                  <Figure pic={c.cover ?? c.items[0]?.image} ratio="5 / 4" sizes="(max-width: 760px) 100vw, 50vw" placeholder={c.title} />
                </Link>
                {thumbs.length > 1 && (
                  <ul className="sj-thumbs">
                    {thumbs.map((it) => (
                      <li key={it.code}>
                        <Figure pic={it.image} ratio="1 / 1" sizes="15vw" />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </SiteShell>
  );
}
