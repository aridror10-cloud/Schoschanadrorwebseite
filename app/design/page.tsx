import type { Metadata } from "next";
import Link from "next/link";
import { CallBand, Figure, ProjectCard, SectionHead } from "@/components/site/Parts";
import { SiteShell } from "@/components/site/SiteShell";
import { DESIGN, PROJECTS } from "@/lib/studio";
import { DESIGN_PICS } from "@/lib/studio-pics";

/** Seite "עיצוב ופיתוח מוצרים" (Abschnitt 4), mit Projektgalerie. */

export const metadata: Metadata = {
  title: DESIGN.kicker,
  description: DESIGN.paras[2],
  alternates: { canonical: "/design" },
  openGraph: { title: DESIGN.kicker, description: DESIGN.paras[2], url: "/design" },
};

export default function DesignPage() {
  return (
    <SiteShell>
      <section className="sj-page-hero">
        <div className="wrap sj-split">
          <div className="sj-split-text" data-reveal>
            <p className="sj-kicker">{DESIGN.kicker}</p>
            <h1 className="sj-title sj-title-xl">{DESIGN.title}</h1>
            <p className="sj-lead">{DESIGN.paras[0]}</p>
            {DESIGN.paras.slice(1).map((t) => (
              <p key={t.slice(0, 20)}>{t}</p>
            ))}
          </div>
          <div data-reveal>
            <Figure pic={DESIGN_PICS.hero} ratio="4 / 3" priority sizes="(max-width: 760px) 100vw, 45vw" />
          </div>
        </div>
      </section>

      <section className="sj-section sj-tint" id="projects">
        <div className="wrap">
          <SectionHead title={DESIGN.gallery.title}>
            <p className="sj-lead">{DESIGN.gallery.text}</p>
          </SectionHead>
          <div className="sj-project-grid" data-reveal-group>
            {PROJECTS.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="sj-section">
        <div className="wrap">
          <SectionHead title={DESIGN.process.title} center />
          <ol className="sj-steps" data-reveal-group>
            {DESIGN.process.steps.map((st) => (
              <li key={st.label} className="sj-step">
                <span className="sj-step-label">{st.label}</span>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sj-section sj-tint">
        <div className="wrap sj-narrow">
          <SectionHead title={DESIGN.audience.title} center>
            <p className="sj-lead">{DESIGN.audience.text}</p>
          </SectionHead>
        </div>
      </section>

      <CallBand title={DESIGN.closing.title} text={DESIGN.closing.text}>
        <Link href="/contact?type=business" className="sj-btn">
          {DESIGN.closing.cta}
        </Link>
      </CallBand>
    </SiteShell>
  );
}
