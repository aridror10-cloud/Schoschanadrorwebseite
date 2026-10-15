import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { Lightbox } from "@/components/site/Lightbox";
import { ArrowLink, SectionHead, StatusChip } from "@/components/site/Parts";
import { SiteShell } from "@/components/site/SiteShell";
import { COLLECTIONS, WORKS } from "@/lib/studio";

/**
 * Galerie einer Werkgruppe (feste Vorlage): Einleitung, Werke mit
 * Grossansicht, und je nach Gruppe Bestellanfrage oder Interesse.
 * Jeder Werk-Knopf traegt Titel und Kennung ins Formular darunter ein.
 * Carlebach hat eine eigene Verkaufsseite und keine Galerie hier.
 */

const GALLERY = COLLECTIONS.filter((c) => !c.href);

export function generateStaticParams() {
  return GALLERY.map((c) => ({ collection: c.slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ collection: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await params;
  const c = GALLERY.find((x) => x.slug === collection);
  if (!c) return {};
  return {
    title: c.title,
    description: c.lead,
    alternates: { canonical: `/works/${c.slug}` },
    openGraph: {
      title: c.title,
      description: c.lead,
      url: `/works/${c.slug}`,
      ...(c.items[0] ? { images: [{ url: c.items[0].image.src }] } : {}),
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { collection } = await params;
  const c = GALLERY.find((x) => x.slug === collection);
  if (!c) notFound();
  const kind = c.availability === "order" ? "order" : "interest";
  const ask = kind === "order" ? WORKS.pieceAsk.order : WORKS.pieceAsk.interest;

  return (
    <SiteShell>
      <section className="sj-page-hero">
        <div className="wrap sj-narrow">
          <nav className="sj-crumbs" aria-label="מיקום בעמוד">
            <Link href="/works">{WORKS.title}</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{c.title}</span>
          </nav>
          <SectionHead as="h1" title={c.title}>
            <p className="sj-lead">{c.lead}</p>
            {c.paras.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p>
              <StatusChip collection={c} />
            </p>
          </SectionHead>
        </div>
      </section>

      <section className="sj-section sj-gallery-section">
        <div className="wrap">
          <ul className="sj-works-grid" data-reveal-group>
            {c.items.map((it) => (
              <li key={it.code} className="sj-work">
                <Lightbox
                  pics={[{ ...it.image, caption: `${it.title} · ${it.code}` }]}
                  className="is-single"
                  sizes="(max-width: 760px) 50vw, 25vw"
                />
                <div className="sj-work-meta">
                  <h2 className="sj-work-title">{it.title}</h2>
                  <span className="sj-work-code" dir="ltr">
                    {it.code}
                  </span>
                </div>
                <a
                  href="#enquiry"
                  className="sj-work-ask"
                  data-piece={`${it.title} (${it.code})`}
                  data-kind={kind}
                  aria-label={`${ask}: ${it.title}`}
                >
                  {ask}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sj-section sj-tint">
        <div className="wrap sj-narrow">
          <SectionHead title={c.cta} center>{c.note && <p className="sj-note">{c.note}</p>}</SectionHead>
          <div data-reveal>
            <EnquiryForm kinds={[kind]} anchor="enquiry" />
          </div>
          <div className="sj-after">
            <ArrowLink href="/works">{WORKS.back}</ArrowLink>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
