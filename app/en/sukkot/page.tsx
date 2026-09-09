import type { Metadata } from "next";
import { SharePoster } from "@/components/SharePoster";
import { siteUrl } from "@/lib/site";

/**
 * Englischer Teil-Link fuer Gruppen und soziale Netze (Shoshana, 09.09.26).
 * Gegenstueck zu /sukkot: gleiche Mechanik, englisches Plakat, Vorschau
 * und Sprungziel in der englischen Fassung.
 */

const TITLE = "Some figures stay with us | The Rabbi Shlomo Carlebach Portrait Series";
const DESCRIPTION =
  "Sukkot edition: “Simcha” with the verse, or a festive set of all three portraits plus a separate verse artwork. Orders through September 17.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
  alternates: { canonical: "/en/sukkot" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteUrl}/en/sukkot`,
    siteName: "Shoshana Dror",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/carlebach/og-sukkot-en.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/carlebach/og-sukkot-en.jpg"],
  },
};

export default function SukkotSharePageEn() {
  return (
    <div className="page" lang="en" dir="ltr">
      <SharePoster
        src="/carlebach/share-sukkot-en.webp"
        alt="Some figures stay with us. The Rabbi Shlomo Carlebach metal portrait series, Sukkot edition"
        href="/en#sukkot"
        label="View the Collection & Sukkot Editions"
        /* Balken im Bild 1024x1536: x 232-793, y 1326-1405, plus Rand */
        hot={{ left: "21%", top: "85.2%", width: "58%", height: "7.2%" }}
      />
    </div>
  );
}
