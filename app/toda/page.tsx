import type { Metadata } from "next";
import Link from "next/link";

/**
 * Dankesseite nach erfolgreicher Zahlung.
 *
 * Diese Adresse wird in den Einstellungen jeder SUMIT-Zahlseite als
 * Rueckkehradresse eingetragen. Weil eine Zahlseite nur eine einzige
 * Rueckkehradresse kennt, die Kundschaft aber aus beiden Sprachraeumen
 * kommt, ist die Seite zweisprachig - hebraeisch zuerst.
 *
 * Bewusst ohne Bestelldetails: Beleg und Bestaetigung verschickt SUMIT
 * selbst, hier geht es nur um den Moment der Gewissheit.
 */

export const metadata: Metadata = {
  title: "תודה על ההזמנה | שושנה דרור",
  description: "אישור קבלת התשלום",
  robots: { index: false, follow: false },
};

export default function TodaPage() {
  return (
    <div className="page" lang="he" dir="rtl">
      <main className="toda">
        <div className="toda-card">
          <svg className="of-check" width="64" height="64" viewBox="0 0 58 58" aria-hidden="true">
            <circle cx="29" cy="29" r="27" />
            <path d="M18 30l8 8 15-17" />
          </svg>

          <div className="kicker">קולקציית קרליבך</div>
          <h1>התשלום התקבל — תודה רבה!</h1>
          <p>הקבלה נשלחה לאימייל שלכם. אחזור אליכם בהקדם לתיאום האספקה.</p>
          <Link href="/" className="toda-back">
            חזרה לאתר
          </Link>

          <div className="toda-en" lang="en" dir="ltr">
            <h2>Payment received — thank you!</h2>
            <p>Your receipt is on its way by email. I&rsquo;ll be in touch shortly to arrange delivery.</p>
            <Link href="/en" className="toda-back">
              Back to the site
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
