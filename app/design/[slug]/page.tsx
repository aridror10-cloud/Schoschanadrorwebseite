import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lightbox } from "@/components/site/Lightbox";
import { ArrowLink, CallBand, Figure } from "@/components/site/Parts";
import { SiteShell } from "@/components/site/SiteShell";
import { DESIGN, PROJECTS } from "@/lib/studio";

/**
 * Projektseite (feste Vorlage fuer alle Projekte): Titel, Hersteller,
 * Titelbild, Beschreibung, Beitrag und Credits, weitere Bilder.
 */

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return {};
  const title = `${p.title} | ${p.subtitle}`;
  return {
    title,
    description: p.summary,
    alternates: { canonical: `/design/${p.slug}` },
    openGraph: {
      title,
      description: p.summary,
      url: `/design/${p.slug}`,
      ...(p.images[0] ? { images: [{ url: p.images[0].src }] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((x) => x.slug === slug);
  if (index < 0) notFound();
  const p = PROJECTS[index]!;
  const next = PROJECTS[(index + 1) % PROJECTS.length]!;
  const [cover, ...more] = p.images;

  return (
    <SiteShell>
      <article className="sj-project-page">
        <div className="wrap">
          <nav className="sj-crumbs" aria-label="מיקום בעמוד">
            <Link href="/design">{DESIGN.kicker}</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{p.title}</span>
          </nav>

          <header className="sj-project-head" data-reveal>
            <h1 className="sj-title sj-title-xl">{p.title}</h1>
            <p className="sj-project-by">{p.subtitle}</p>
          </header>

          <div className="sj-project-layout">
            <div className="sj-project-media" data-reveal>
              <Figure
                pic={cover}
                priority
                sizes="(max-width: 900px) 100vw, 60vw"
                className={cover ? "is-natural" : ""}
                ratio={cover ? undefined : "4 / 3"}
                placeholder={p.title}
              />
              {cover?.caption && <p className="sj-fig-caption">{cover.caption}</p>}
            </div>

            <div className="sj-project-copy" data-reveal>
              {p.body.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
              {p.closing && (
                <p className="sj-closing">
                  {p.closing.text}{" "}
                  <img
                    src={p.closing.logo.src}
                    alt={p.closing.logo.alt}
                    width={p.closing.logo.w}
                    height={p.closing.logo.h}
                    className="sj-closing-logo"
                  />
                </p>
              )}
              {p.link && (
                <p>
                  <a href={p.link.href} className="sj-arrow" target="_blank" rel="noopener">
                    <span>{p.link.label}</span>
                    <span className="sj-arrow-mark" aria-hidden="true">
                      ←
                    </span>
                  </a>
                </p>
              )}
              <dl className="sj-credits">
                <div className="sj-credits-title">{DESIGN.project.credits}</div>
                {p.credits.map((c) => (
                  <div key={c.role}>
                    <dt>{c.role}</dt>
                    <dd>{c.name}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {p.aside && (
            <aside className="sj-aside" data-reveal>
              <h2>{p.aside.title}</h2>
              {p.aside.paras.map((t) => (
                <p key={t.slice(0, 24)}>{t}</p>
              ))}
              {p.aside.link && (
                <a href={p.aside.link.href} className="sj-btn sj-btn-ghost" target="_blank" rel="noopener">
                  {p.aside.link.label}
                </a>
              )}
            </aside>
          )}

          {more.length > 0 && (
            <div className="sj-project-more-pics" data-reveal>
              <Lightbox pics={more} />
            </div>
          )}

          <nav className="sj-project-nav" aria-label="ניווט בין פרויקטים">
            <ArrowLink href="/design#projects">{DESIGN.project.back}</ArrowLink>
            <Link href={`/design/${next.slug}`} className="sj-next">
              <span className="sj-next-label">{DESIGN.project.next}</span>
              <span className="sj-next-title">
                {next.title} | {next.client}
              </span>
            </Link>
          </nav>
        </div>
      </article>

      <CallBand title={DESIGN.cta.title} text={DESIGN.cta.text}>
        <Link href="/design#enquiry" className="sj-btn">
          {DESIGN.project.contact}
        </Link>
      </CallBand>
    </SiteShell>
  );
}
