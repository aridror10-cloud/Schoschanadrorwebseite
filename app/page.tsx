import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLink, Figure, ProjectCard, SectionHead } from "@/components/site/Parts";
import { SiteShell } from "@/components/site/SiteShell";
import { Rosette } from "@/components/site/Ornaments";
import { YahrzeitBand } from "@/components/site/YahrzeitBand";
import { ARTICLES, formatDate } from "@/lib/articles";
import { COLLECTIONS, HOME, PROJECTS, brand } from "@/lib/studio";
import { HOME_PICS } from "@/lib/studio-pics";

/**
 * Startseite "שושנה יודאיקה" (Abschnitt 3 des Konzepts, 15.10.26).
 *
 * Bis zu diesem Tag war "/" die Carlebach-Verkaufsseite; sie lebt jetzt
 * unter /carlebach. Wer noch einen alten Link wie "/#choose" hat, wird
 * vom Skript unten sofort dorthin weitergeleitet, bevor etwas gezeichnet
 * wird.
 */

export const metadata: Metadata = {
  title: { absolute: `${brand.name} | ${brand.slogan}` },
  description: HOME.hero.sub,
  alternates: { canonical: "/" },
};

const ANCHOR_REDIRECT = `(function(){var h=location.hash.slice(1);if(["meet","choose","sukkot","order","contact"].indexOf(h)>-1){location.replace("/carlebach#"+h)}})();`;

export default function HomePage() {
  const featured = PROJECTS.filter((p) => p.featured).slice(0, 3);
  const latest = ARTICLES.slice(0, 3);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: ANCHOR_REDIRECT }} />
      <SiteShell top={<YahrzeitBand />}>
        {/* ===== Eroeffnung ===== */}
        <section className="sj-hero">
          <div className="wrap sj-hero-inner">
            <Rosette className="is-hero" />
            <p className="sj-hero-brand">{brand.name}</p>
            <h1 className="sj-hero-title">{brand.slogan}</h1>
            <p className="sj-hero-tagline">{HOME.hero.tagline}</p>
            {HOME.hero.paras.map((t) => (
              <p key={t.slice(0, 20)} className="sj-hero-sub">
                {t}
              </p>
            ))}
            <div className="sj-hero-cta">
              <Link href="/contact?type=business" className="sj-btn">
                {HOME.hero.cta}
              </Link>
            </div>
          </div>

          <div className="wrap sj-doors">
            <Link href="/design" className="sj-door">
              <Figure pic={HOME_PICS.doorDesign} ratio="4 / 3" priority sizes="(max-width: 760px) 100vw, 50vw" />
              <span className="sj-door-label">
                עיצוב ופיתוח מוצרים
                <span className="sj-arrow-mark" aria-hidden="true">
                  ←
                </span>
              </span>
            </Link>
            <Link href="/works" className="sj-door">
              <Figure pic={HOME_PICS.doorWorks} ratio="4 / 3" priority sizes="(max-width: 760px) 100vw, 50vw" />
              <span className="sj-door-label">
                יצירות וקולקציות
                <span className="sj-arrow-mark" aria-hidden="true">
                  ←
                </span>
              </span>
            </Link>
          </div>
        </section>

        {/* ===== Vom Gedanken zum Produkt: vier Leistungen (19.10.26) ===== */}
        <section className="sj-section">
          <div className="wrap">
            <SectionHead title={HOME.services.title} ornament>
              <p className="sj-lead">{HOME.services.paras[0]}</p>
              <p>{HOME.services.paras[1]}</p>
            </SectionHead>
            <ol className="sj-service-grid" data-reveal-group>
              {HOME.services.cards.map((c, i) => (
                <li key={c.title} className="sj-service">
                  <span className="sj-service-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </li>
              ))}
            </ol>
            <div className="sj-after" data-reveal>
              <ArrowLink href="/design">{HOME.services.cta}</ArrowLink>
            </div>
          </div>
        </section>

        {/* ===== Ideen, die zu Produkten wurden ===== */}
        <section className="sj-section sj-tint">
          <div className="wrap">
            <SectionHead title={HOME.projects.title} ornament />
            <div className="sj-project-grid" data-reveal-group>
              {featured.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
            <div className="sj-after" data-reveal>
              <ArrowLink href="/design#projects">{HOME.projects.cta}</ArrowLink>
            </div>
          </div>
        </section>

        {/* ===== Werke und Kollektionen ===== */}
        <section className="sj-section sj-dark">
          <div className="wrap">
            <div className="sj-split sj-split-top">
              <div className="sj-split-text" data-reveal>
                <h2 className="sj-title">{HOME.works.title}</h2>
                <p className="sj-lead">{HOME.works.text}</p>
                <ArrowLink href="/works">{HOME.works.cta}</ArrowLink>
              </div>
            </div>
            <ul className="sj-collection-strip" data-reveal-group>
              {COLLECTIONS.map((c) => (
                <li key={c.slug}>
                  <Link href={c.href ?? `/works/${c.slug}`} className="sj-strip-item">
                    <Figure pic={c.cover ?? c.items[0]?.image} ratio="1 / 1" sizes="(max-width: 760px) 50vw, 25vw" placeholder={c.title} />
                    <span>{c.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== Hinter dem Werk (erscheint mit dem ersten Artikel) ===== */}
        {latest.length > 0 && (
          <section className="sj-section">
            <div className="wrap">
              <SectionHead title={HOME.behind.title}>
                <p className="sj-lead">{HOME.behind.text}</p>
                <p>{HOME.behind.sub}</p>
              </SectionHead>
              <div className="sj-article-grid" data-reveal-group>
                {latest.map((a) => (
                  <Link key={a.slug} href={`/articles/${a.slug}`} className="sj-article-card">
                    <Figure pic={a.cover} ratio="3 / 2" sizes="(max-width: 760px) 100vw, 33vw" />
                    <time dateTime={a.date}>{formatDate(a.date)}</time>
                    <h3>{a.title}</h3>
                    <p>{a.excerpt}</p>
                  </Link>
                ))}
              </div>
              <div className="sj-after" data-reveal>
                <ArrowLink href="/articles">{HOME.behind.cta}</ArrowLink>
              </div>
            </div>
          </section>
        )}

        {/* ===== Kennenlernen und Kontakt ===== */}
        <section className="sj-section sj-meet">
          <div className="wrap sj-meet-inner" data-reveal>
            <h2 className="sj-title">{HOME.meet.title}</h2>
            <p className="sj-lead">{HOME.meet.text}</p>
            <div className="sj-meet-actions">
              <Link href="/contact?type=business" className="sj-btn">
                {HOME.meet.business}
              </Link>
              <Link href="/contact?type=order" className="sj-btn sj-btn-ghost">
                {HOME.meet.work}
              </Link>
              <ArrowLink href="/about">{HOME.meet.about}</ArrowLink>
            </div>
          </div>
        </section>
      </SiteShell>
    </>
  );
}
