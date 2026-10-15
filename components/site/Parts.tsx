import Link from "next/link";
import type { ReactNode } from "react";
import type { Collection, Pic, Project } from "@/lib/studio";
import { WORKS } from "@/lib/studio";

/**
 * Wiederkehrende Bausteine der Website. Bewusst schlicht: die Werke
 * sollen wirken, nicht die Effekte (Abschnitt 9 des Konzepts).
 */

/** Bild mit reserviertem Platz; ohne Bild eine ruhige Flaeche. */
export function Figure({
  pic,
  ratio,
  priority = false,
  className = "",
  sizes,
  placeholder,
}: {
  pic?: Pic;
  ratio?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  /** Beschriftung, solange das Foto noch fehlt */
  placeholder?: string;
}) {
  return (
    <div className={`sj-fig ${className}${pic ? "" : " is-empty"}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      {!pic && (
        <span className="sj-fig-wait">
          {placeholder && <span className="sj-fig-wait-title">{placeholder}</span>}
          <span className="sj-fig-wait-note">התמונה תתווסף בקרוב</span>
        </span>
      )}
      {pic && (
        <img
          src={pic.src}
          alt={pic.alt}
          width={pic.w}
          height={pic.h}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          sizes={sizes}
        />
      )}
    </div>
  );
}

/** Kopf eines Abschnitts: kleine Zeile, Titel, optional Einleitung. */
export function SectionHead({
  kicker,
  title,
  children,
  as: Tag = "h2",
  center = false,
}: {
  kicker?: string;
  title: string;
  children?: ReactNode;
  as?: "h1" | "h2";
  center?: boolean;
}) {
  return (
    <div className={`sj-head${center ? " is-center" : ""}`} data-reveal>
      {kicker && <p className="sj-kicker">{kicker}</p>}
      <Tag className="sj-title">{title}</Tag>
      {children}
    </div>
  );
}

/** Pfeil-Link im Stil der Seite (zeigt in RTL nach links). */
export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`sj-arrow ${className}`}>
      <span>{children}</span>
      <span className="sj-arrow-mark" aria-hidden="true">
        ←
      </span>
    </Link>
  );
}

/** Kachel eines Projekts in der Galerie. */
export function ProjectCard({
  project,
  headingLevel = 3,
  ratio = "4 / 5",
}: {
  project: Project;
  headingLevel?: 2 | 3;
  ratio?: string;
}) {
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <article className="sj-project">
      <Link href={`/design/${project.slug}`} className="sj-project-link">
        <Figure pic={project.images[0]} ratio={ratio} sizes="(max-width: 760px) 100vw, 33vw" placeholder={project.title} />
        <div className="sj-project-text">
          <H className="sj-project-title">
            {project.title}
            <span className="sj-project-client"> | {project.client}</span>
          </H>
          <p>{project.summary}</p>
          <span className="sj-project-more" aria-hidden="true">
            לפרטי הפרויקט ←
          </span>
        </div>
      </Link>
    </article>
  );
}

/** Kleines Etikett: kaufbar, auf Anfrage, nicht im Verkauf. */
export function StatusChip({ collection }: { collection: Collection }) {
  return <span className={`sj-chip is-${collection.availability}`}>{WORKS.status[collection.availability]}</span>;
}

/** Ruhiger Abschluss mit Aufforderung zum Kontakt. */
export function CallBand({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <section className="sj-band">
      <div className="wrap sj-band-inner" data-reveal>
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="sj-band-actions">{children}</div>
      </div>
    </section>
  );
}
