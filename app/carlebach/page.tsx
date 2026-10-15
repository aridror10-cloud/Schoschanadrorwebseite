import type { Metadata } from "next";
import { Landing } from "@/components/Landing";
import { content } from "@/lib/content";
import { siteUrl } from "@/lib/site";

/**
 * Carlebach-Verkaufsseite, Hebraeisch (bis 15.10.26 die Startseite "/").
 *
 * Seit der Erweiterung zur Website "שושנה יודאיקה" lebt sie hier. Korb,
 * Kasse und Formular sind unveraendert. Alte Links auf "/#choose",
 * "/#sukkot" usw. leitet die Startseite hierher weiter (app/page.tsx).
 */

const he = content.he.meta;

export const metadata: Metadata = {
  title: { absolute: he.title },
  description: he.description,
  alternates: {
    canonical: "/carlebach",
    languages: { he: "/carlebach", en: "/en" },
  },
  openGraph: {
    type: "website",
    locale: he.ogLocale,
    alternateLocale: content.en.meta.ogLocale,
    url: `${siteUrl}/carlebach`,
    siteName: "Shoshana Dror",
    title: he.title,
    description: he.ogDescription,
    images: [{ url: "/carlebach/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: he.title,
    description: he.ogDescription,
    images: ["/carlebach/og.jpg"],
  },
};

export default function CarlebachPage() {
  return <Landing lang="he" />;
}
