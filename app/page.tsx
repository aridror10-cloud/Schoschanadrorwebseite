import { site, siteUrl } from "@/lib/site";

/**
 * Strukturierte Daten fuer Suchmaschinen (schema.org).
 * Ergaenzen, sobald Beruf und Profile feststehen: jobTitle, sameAs, image ...
 */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: siteUrl,
  description: site.description,
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* ---------------------------------------------------------------- */}
      <section className="container hero">
        <p className="hero__eyebrow">Willkommen</p>
        <h1>{site.name}</h1>
        <p className="hero__lead">
          {/* TODO: Ein bis zwei Saetze, die klar sagen, wer du bist und was du machst. */}
          <span className="todo">TODO</span> Hier steht ein kurzer Einleitungssatz: wer du bist,
          womit du dich beschaeftigst und wofuer man dich ansprechen kann.
        </p>

        <div className="hero__actions">
          <a className="button button--primary" href="#kontakt">
            Kontakt aufnehmen
          </a>
          <a className="button button--ghost" href="#ueber-mich">
            Mehr erfahren
          </a>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="section" id="ueber-mich">
        <div className="container prose">
          <span className="section__label">Ueber mich</span>
          <h2>Kurz vorgestellt</h2>
          <p>
            <span className="todo">TODO</span> Zwei bis drei Absaetze zum Werdegang, zur Motivation
            und zu den Schwerpunkten. Kurze Absaetze lesen sich am Bildschirm deutlich angenehmer
            als ein langer Block.
          </p>
          <p>
            Ein zweiter Absatz kann konkrete Stationen oder Projekte nennen und damit belegen, was
            im ersten Absatz behauptet wird.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="section" id="arbeit">
        <div className="container">
          <div className="prose">
            <span className="section__label">Arbeit</span>
            <h2>Schwerpunkte</h2>
            <p>
              <span className="todo">TODO</span> Diese drei Karten mit echten Taetigkeiten,
              Leistungen oder Projekten fuellen - oder den ganzen Abschnitt entfernen.
            </p>
          </div>

          <div className="card-grid">
            {[1, 2, 3].map((n) => (
              <article className="card" key={n}>
                <h3 className="card__title">Schwerpunkt {n}</h3>
                <p className="card__text">
                  Eine kurze Beschreibung von zwei bis drei Zeilen. Konkret formulieren, keine
                  Allgemeinplaetze.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="section" id="kontakt">
        <div className="container prose">
          <span className="section__label">Kontakt</span>
          <h2>Schreib mir gerne</h2>
          <p>
            Der einfachste Weg ist eine E-Mail. Ein Kontaktformular wurde bewusst weggelassen: Es
            verarbeitet personenbezogene Daten und braucht dann Einwilligung, Spamschutz und einen
            Eintrag in der Datenschutzerklaerung.
          </p>

          <dl className="contact-list">
            <div>
              <dt>E-Mail</dt>
              <dd>
                {/* TODO: echte Adresse in lib/site.ts eintragen */}
                <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
