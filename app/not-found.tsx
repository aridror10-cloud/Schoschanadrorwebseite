import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  // Fehlerseiten gehoeren nicht in den Suchindex
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="container error-page">
      <p className="error-page__code">404</p>
      <h1>Diese Seite gibt es nicht</h1>
      <p className="hero__lead">
        Vielleicht wurde sie verschoben oder die Adresse enthaelt einen Tippfehler.
      </p>
      <div className="hero__actions">
        <Link className="button button--primary" href="/">
          Zur Startseite
        </Link>
      </div>
    </section>
  );
}
