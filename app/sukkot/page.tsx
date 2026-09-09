import type { Metadata } from "next";
import { SharePoster } from "@/components/SharePoster";
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
      <SharePoster
        src="/carlebach/share-sukkot.webp"
        alt="יש דמויות שנשארות איתנו — סדרת דיוקנאות רבי שלמה קרליבך, מהדורת סוכות"
        href="/#sukkot"
        label="לצפייה בסדרה ובמהדורת סוכות"
        /* Balken im Bild 1024x1536: x 260-763, y 1332-1405, plus Rand */
        hot={{ left: "23.5%", top: "85.6%", width: "53%", height: "6.6%" }}
      />
    </div>
  );
}
