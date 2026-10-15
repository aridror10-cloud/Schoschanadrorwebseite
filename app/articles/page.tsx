import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLink, Figure, SectionHead } from "@/components/site/Parts";
import { SiteShell } from "@/components/site/SiteShell";
import { ARTICLES, formatDate } from "@/lib/articles";
import { ARTICLES_PAGE } from "@/lib/studio";

/**
 * Uebersicht "מאמרים ותהליכי יצירה" (Abschnitt 7).
 * Ohne Artikel: kurzer Hinweis auf die Themen, nicht im Menue und nicht
 * fuer Suchmaschinen.
 */

const empty = ARTICLES.length === 0;

export const metadata: Metadata = {
  title: ARTICLES_PAGE.title,
  description: ARTICLES_PAGE.lead,
  alternates: { canonical: "/articles" },
  ...(empty ? { robots: { index: false, follow: true } } : {}),
};

export default function ArticlesPage() {
  return (
    <SiteShell>
      <section className="sj-page-hero">
        <div className="wrap sj-narrow">
          <SectionHead as="h1" title={ARTICLES_PAGE.title}>
            <p className="sj-lead">{ARTICLES_PAGE.lead}</p>
            {empty && <p>המאמרים הראשונים יעסקו ב{ARTICLES_PAGE.topics}</p>}
          </SectionHead>
          {empty && (
            <div className="sj-after">
              <ArrowLink href="/design">{ARTICLES_PAGE.serviceCta}</ArrowLink>
            </div>
          )}
        </div>
      </section>

      {!empty && (
        <section className="sj-section">
          <div className="wrap">
            <div className="sj-article-grid" data-reveal-group>
              {ARTICLES.map((a) => (
                <Link key={a.slug} href={`/articles/${a.slug}`} className="sj-article-card">
                  <Figure pic={a.cover} ratio="3 / 2" sizes="(max-width: 760px) 100vw, 33vw" />
                  <time dateTime={a.date}>{formatDate(a.date)}</time>
                  <h2>{a.title}</h2>
                  <p>{a.excerpt}</p>
                  <span className="sj-project-more">{ARTICLES_PAGE.read} ←</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteShell>
  );
}
