import type { Metadata } from "next";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { Figure, ProjectCard, SectionHead } from "@/components/site/Parts";
import { SiteShell } from "@/components/site/SiteShell";
import { DESIGN, PROJECTS } from "@/lib/studio";
import { DESIGN_PICS } from "@/lib/studio-pics";

/** Seite "עיצוב ופיתוח מוצרים" (Abschnitt 4), mit Projektgalerie. */

export const metadata: Metadata = {
  title: DESIGN.kicker,
  description: DESIGN.paras[1],
  alternates: { canonical: "/design" },
  openGraph: { title: DESIGN.kicker, description: DESIGN.paras[1], url: "/design" },
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
            <p>{DESIGN.paras[1]}</p>
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
        <div className="wrap sj-narrow">
          <SectionHead title={DESIGN.together.title} center>
            <p className="sj-lead">{DESIGN.together.text}</p>
          </SectionHead>
          <ul className="sj-tags" data-reveal-group>
            {DESIGN.together.tags.map((t) => (
              <li key={t} dir="auto">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sj-section sj-tint" id="contact-business">
        <div className="wrap sj-narrow">
          <SectionHead title={DESIGN.cta.title} center>
            <p className="sj-lead">{DESIGN.cta.text}</p>
          </SectionHead>
          <div data-reveal>
            <EnquiryForm kinds={["business"]} anchor="enquiry" />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
