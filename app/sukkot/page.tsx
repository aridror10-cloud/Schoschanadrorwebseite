import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Teil-Link fuer Gruppen und soziale Netze (Shoshana, 08.09.26).
 *
 * Wer diese Adresse in WhatsApp, Facebook oder per Mail teilt, bekommt
 * ihr Plakat als Vorschau, nicht das allgemeine Bild der Startseite.
 * Die Seite selbst zeigt das Plakat gross und fuehrt mit einem Klick zur
 * Sukkot-Sektion. Bewusst nicht fuer Suchmaschinen: sie soll geteilt,
 * nicht gefunden werden - gefunden wird die Startseite.
 */

const TITLE = "יש דמויות שנשארות איתנו | סדרת דיוקנאות רבי שלמה קרליבך";
const DESCRIPTION =
  "מהדורה מיוחדת לסוכות: דגם „שמחה” בשילוב הפסוק, או סט שלושת הדיוקנאות בתוספת יצירת הפסוק. הזמנות עד ו׳ בתשרי | 17.9";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
  alternates: { canonical: "/sukkot" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: `${siteUrl}/sukkot`,
    siteName: "Shoshana Dror",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/carlebach/og-sukkot.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/carlebach/og-sukkot.jpg"],
  },
};

export default function SukkotSharePage() {
  return (
    <div className="page" lang="he" dir="rtl">
      <main className="share">
        <div className="share-card">
          {/* Das Plakat ist die ganze Seite. Der schwarze Balken im Plakat
              ("לצפייה בסדרה ובמהדורת סוכות") ist der Knopf: ein unsichtbarer
              Anker liegt genau ueber diesem Bereich (Masse in Prozent der
              Plakatflaeche, gemessen am Bild 1024x1536: x 260-763, y 1332-1405).
              Normaler Anker statt Router-Link: die Startseite laedt voll und
              der Browser springt selbst zu #sukkot, auch in den In-App-
              Browsern von WhatsApp und Facebook. */}
          <div className="share-poster">
            <img
              src="/carlebach/share-sukkot.webp"
              alt="יש דמויות שנשארות איתנו — סדרת דיוקנאות רבי שלמה קרליבך, מהדורת סוכות"
              width={1024}
              height={1536}
              fetchPriority="high"
            />
            <a href="/#sukkot" className="share-hot" aria-label="לצפייה בסדרה ובמהדורת סוכות" />
          </div>
        </div>
      </main>
    </div>
  );
}
