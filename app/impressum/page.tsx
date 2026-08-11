import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum und Anbieterkennzeichnung von ${site.name}.`,
  alternates: { canonical: "/impressum" },
};

/**
 * Pflichtangaben nach § 5 DDG (frueher § 5 TMG).
 *
 * ACHTUNG: Vorlage, keine Rechtsberatung. Alle Platzhalter muessen durch
 * echte Angaben ersetzt werden - ein unvollstaendiges Impressum ist
 * abmahnfaehig. Bei Unsicherheit anwaltlich pruefen lassen.
 */
export default function ImpressumPage() {
  return (
    <section className="section" style={{ borderTop: "none" }}>
      <div className="container prose">
        <span className="section__label">Rechtliches</span>
        <h1>Impressum</h1>

        <h3>Angaben gemaess § 5 DDG</h3>
        <p>
          <span className="todo">TODO</span>
          <br />
          {site.name}
          <br />
          Strasse und Hausnummer
          <br />
          PLZ Ort
          <br />
          Deutschland
        </p>

        <h3>Kontakt</h3>
        <p>
          E-Mail: <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          <br />
          Telefon: <span className="todo">TODO</span>
        </p>

        <h3>Verantwortlich fuer den Inhalt nach § 18 Abs. 2 MStV</h3>
        <p>
          <span className="todo">TODO</span> Name und vollstaendige Anschrift - bei
          journalistisch-redaktionellen Inhalten verpflichtend.
        </p>

        <h3>Umsatzsteuer-Identifikationsnummer</h3>
        <p>
          <span className="todo">TODO</span> USt-IdNr. nach § 27 a UStG angeben, falls vorhanden.
          Rein private Seiten ohne geschaeftlichen Zweck brauchen diesen Punkt nicht.
        </p>

        <h3>Streitschlichtung</h3>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <h3>Haftung fuer Inhalte</h3>
        <p>
          Als Diensteanbieter sind wir fuer eigene Inhalte auf diesen Seiten nach den allgemeinen
          Gesetzen verantwortlich. Wir sind jedoch nicht verpflichtet, uebermittelte oder
          gespeicherte fremde Informationen zu ueberwachen oder nach Umstaenden zu forschen, die auf
          eine rechtswidrige Taetigkeit hinweisen.
        </p>

        <h3>Haftung fuer Links</h3>
        <p>
          Unser Angebot enthaelt gegebenenfalls Links zu externen Webseiten Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Fuer diese fremden Inhalte kann keine Gewaehr
          uebernommen werden. Bei Bekanntwerden von Rechtsverletzungen werden entsprechende Links
          umgehend entfernt.
        </p>

        <h3>Urheberrecht</h3>
        <p>
          Die durch die Seitenbetreiberin erstellten Inhalte und Werke auf diesen Seiten unterliegen
          dem deutschen Urheberrecht. Beitraege Dritter sind als solche gekennzeichnet.
        </p>
      </div>
    </section>
  );
}
