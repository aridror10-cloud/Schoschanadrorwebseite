import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLink, CallBand, Figure } from "@/components/site/Parts";
import { SiteShell } from "@/components/site/SiteShell";
import { ARTICLES, articleBySlug, formatDate } from "@/lib/articles";
import { ARTICLES_PAGE, brand } from "@/lib/studio";

/** Artikelseite (feste Vorlage): Titel, Titelbild, Text, Verwandtes, Weg zum Angebot. */

export function generateStaticParams() {
  // Next braucht mindestens einen Eintrag fuer den statischen Export;
  // ohne Artikel liefert der Platzhalter einfach "nicht gefunden".
  return ARTICLES.length ? ARTICLES.map((a) => ({ slug: a.slug })) : [{ slug: "_" }];
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/articles/${a.slug}` },
    openGraph: {
      type: "article",
      title: a.title,
      description: a.excerpt,
      url: `/articles/${a.slug}`,
      images: [{ url: a.cover.src }],
      publishedTime: a.date,
      authors: [brand.person],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) notFound();
  const related = (a.related ?? []).map(articleBySlug).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <SiteShell>
      <article className="sj-article">
        <div className="wrap sj-narrow">
          <nav className="sj-crumbs" aria-label="מיקום בעמוד">
            <Link href="/articles">{ARTICLES_PAGE.title}</Link>
          </nav>
          <header className="sj-article-head">
            <h1 className="sj-title sj-title-xl">{a.title}</h1>
            <p className="sj-article-meta">
              {brand.person} · <time dateTime={a.date}>{formatDate(a.date)}</time>
            </p>
          </header>
        </div>
        <div className="wrap sj-article-cover">
          <Figure pic={a.cover} priority sizes="(max-width: 1100px) 100vw, 1100px" className="is-natural" />
        </div>
        <div className="wrap sj-narrow sj-article-body">
          {a.body.map((b, i) => {
            switch (b.type) {
              case "p":
                return <p key={i}>{b.text}</p>;
              case "h":
                return <h2 key={i}>{b.text}</h2>;
              case "quote":
                return <blockquote key={i}>{b.text}</blockquote>;
              case "list":
                return (
                  <ul key={i}>
                    {b.items.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                );
              case "img":
                return (
                  <figure key={i}>
                    <Figure pic={b.pic} className="is-natural" />
                    {b.caption && <figcaption>{b.caption}</figcaption>}
                  </figure>
                );
              default:
                return null;
            }
          })}
        </div>
        {related.length > 0 && (
          <div className="wrap sj-narrow sj-related">
            <h2>{ARTICLES_PAGE.related}</h2>
            <ul>
              {related.map((r) => (
                <li key={r.slug}>
                  <ArrowLink href={`/articles/${r.slug}`}>{r.title}</ArrowLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      <CallBand title={ARTICLES_PAGE.service} text="">
        <Link href={a.cta === "contact" ? "/contact" : "/design"} className="sj-btn">
          {a.cta === "contact" ? ARTICLES_PAGE.contactCta : ARTICLES_PAGE.serviceCta}
        </Link>
        <ArrowLink href="/articles">{ARTICLES_PAGE.back}</ArrowLink>
      </CallBand>
    </SiteShell>
  );
}
