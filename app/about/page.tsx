import type { Metadata } from "next";
import Link from "next/link";
import { CallBand, Figure } from "@/components/site/Parts";
import { SiteShell } from "@/components/site/SiteShell";
import { ABOUT, brand } from "@/lib/studio";
import { ABOUT_PICS } from "@/lib/studio-pics";

/** Seite "אודות" (Abschnitt 6), Text woertlich aus dem Konzept. */

export const metadata: Metadata = {
  title: ABOUT.title,
  description: ABOUT.intro,
  alternates: { canonical: "/about" },
  openGraph: { title: `${ABOUT.title} | ${brand.person}`, description: ABOUT.intro, url: "/about" },
};

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="sj-page-hero">
        <div className="wrap sj-split">
          <div className="sj-split-text" data-reveal>
            <p className="sj-kicker">{brand.slogan}</p>
            <h1 className="sj-title sj-title-xl">{ABOUT.title}</h1>
            <p className="sj-lead">{ABOUT.intro}</p>
          </div>
          <div data-reveal>
            <Figure pic={ABOUT_PICS.hero} ratio="16 / 9" priority sizes="(max-width: 760px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      {ABOUT.sections.map((s, i) => (
        <section key={s.title} className={`sj-section sj-about${i % 2 ? "" : " sj-tint"}`}>
          <div className="wrap sj-about-row">
            <h2 className="sj-title" data-reveal>
              {s.title}
            </h2>
            <div className="sj-about-copy" data-reveal>
              {s.paras.map((p, j) => (
                <p key={p.slice(0, 24)} className={s.title === "יצירה מקורית" && j === s.paras.length - 1 ? "sj-credo" : undefined}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      ))}

      <CallBand title={ABOUT.invite.title} text={ABOUT.invite.text}>
        <Link href="/contact" className="sj-btn">
          {ABOUT.invite.cta}
        </Link>
      </CallBand>
    </SiteShell>
  );
}
