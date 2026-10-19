import type { Metadata } from "next";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { SectionHead } from "@/components/site/Parts";
import { SiteShell } from "@/components/site/SiteShell";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";
import { CONTACT, brand } from "@/lib/studio";

/** Seite "יצירת קשר" mit den drei Anfragearten (Abschnitt 8). */

export const metadata: Metadata = {
  title: CONTACT.kicker,
  description: CONTACT.lead,
  alternates: { canonical: "/contact" },
  openGraph: { title: CONTACT.kicker, description: CONTACT.lead, url: "/contact" },
};

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="sj-page-hero">
        <div className="wrap sj-contact">
          <div className="sj-contact-side">
            <SectionHead as="h1" kicker={CONTACT.kicker} title={CONTACT.title}>
              <p className="sj-lead">{CONTACT.lead}</p>
              <p>{CONTACT.hint}</p>
            </SectionHead>
            <dl className="sj-direct" data-reveal>
              <div>
                <dt>{CONTACT.phoneLabel}</dt>
                <dd>
                  <a href={`tel:${PHONE_TEL}`} dir="ltr">
                    {PHONE_DISPLAY}
                  </a>
                </dd>
              </div>
              <div>
                <dt>{CONTACT.emailLabel}</dt>
                <dd>
                  <a href={`mailto:${brand.email}`} dir="ltr">
                    {brand.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <div data-reveal>
            <EnquiryForm kinds={["business", "order", "interest"]} showCarlebachHint />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
