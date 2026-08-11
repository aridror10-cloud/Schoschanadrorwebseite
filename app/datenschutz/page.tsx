import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutzerklaerung",
  description: `Informationen zur Verarbeitung personenbezogener Daten auf der Webseite von ${site.name}.`,
  alternates: { canonical: "/datenschutz" },
};

/**
 * ACHTUNG: Vorlage, keine Rechtsberatung.
 *
 * Diese Fassung beschreibt eine Seite ohne Tracking, ohne Cookies, ohne
 * eingebettete Dienste und ohne Kontaktformular - genau das, was dieses
 * Projekt aktuell ist. Sobald Analyse, Schriftarten von fremden Servern,
 * Karten, Videos oder ein Formular dazukommen, muss dieser Text erweitert
 * werden (und je nach Dienst zusaetzlich ein Einwilligungsbanner).
 */
export default function DatenschutzPage() {
  return (
    <section className="section" style={{ borderTop: "none" }}>
      <div className="container prose">
        <span className="section__label">Rechtliches</span>
        <h1>Datenschutzerklaerung</h1>

        <h3>1. Verantwortliche Stelle</h3>
        <p>
          <span className="todo">TODO</span>
          <br />
          {site.name}
          <br />
          Strasse und Hausnummer, PLZ Ort
          <br />
          E-Mail: <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
        </p>

        <h3>2. Server-Logdateien</h3>
        <p>
          Beim Aufruf dieser Webseite werden durch den Hosting-Anbieter automatisch Daten in
          Logdateien gespeichert, die Ihr Browser uebermittelt:
        </p>
        <ul>
          <li>aufgerufene Adresse und Datum sowie Uhrzeit des Zugriffs</li>
          <li>uebertragene Datenmenge und Meldung ueber erfolgreichen Abruf</li>
          <li>Browsertyp und Browserversion, verwendetes Betriebssystem</li>
          <li>IP-Adresse in gekuerzter oder anonymisierter Form</li>
        </ul>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse liegt im
          technisch fehlerfreien und sicheren Betrieb der Webseite. Eine Zusammenfuehrung dieser
          Daten mit anderen Datenquellen findet nicht statt.
        </p>

        <h3>3. Cookies und lokale Speicherung</h3>
        <p>
          Diese Webseite setzt keine Cookies zu Analyse- oder Werbezwecken. Ausschliesslich fuer die
          Auswahl zwischen hellem und dunklem Farbschema wird ein Wert im lokalen Speicher Ihres
          Browsers abgelegt (Schluessel <code>theme</code>). Dieser Wert wird nicht an einen Server
          uebertragen und laesst keinen Rueckschluss auf Ihre Person zu. Sie koennen ihn jederzeit
          ueber die Einstellungen Ihres Browsers loeschen.
        </p>

        <h3>4. Keine eingebundenen Fremddienste</h3>
        <p>
          Es werden keine Schriftarten, Karten, Videos oder Analysewerkzeuge von fremden Servern
          nachgeladen. Alle Schriftarten sind auf Ihrem Geraet bereits vorhanden. Dadurch wird Ihre
          IP-Adresse an keinen Drittanbieter uebermittelt.
        </p>

        <h3>5. Kontaktaufnahme per E-Mail</h3>
        <p>
          Wenn Sie uns per E-Mail schreiben, werden Ihre Angaben zur Bearbeitung der Anfrage
          gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO. Die Daten werden
          geloescht, sobald sie fuer den Zweck nicht mehr erforderlich sind und keine gesetzlichen
          Aufbewahrungspflichten entgegenstehen.
        </p>

        <h3>6. Hosting</h3>
        <p>
          <span className="todo">TODO</span> Namen und Anschrift des Hosting-Anbieters eintragen.
          Sitzt dieser ausserhalb der EU, ist zusaetzlich auf den Vertrag zur Auftragsverarbeitung
          und die Grundlage des Datentransfers hinzuweisen.
        </p>

        <h3>7. Ihre Rechte</h3>
        <p>Ihnen stehen gegenueber der verantwortlichen Stelle folgende Rechte zu:</p>
        <ul>
          <li>Auskunft ueber die verarbeiteten Daten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Loeschung (Art. 17 DSGVO) und Einschraenkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenuebertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          <li>Beschwerde bei einer Aufsichtsbehoerde (Art. 77 DSGVO)</li>
        </ul>

        <h3>8. Verschluesselung</h3>
        <p>
          Diese Seite wird ausschliesslich ueber eine mit TLS verschluesselte Verbindung
          ausgeliefert. Sie erkennen dies an <code>https://</code> in der Adresszeile Ihres
          Browsers.
        </p>
      </div>
    </section>
  );
}
