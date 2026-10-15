import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import { MetaPixel } from "@/components/MetaPixel";
import { HOME, brand } from "@/lib/studio";
import { isTestPhase, siteUrl } from "@/lib/site";
import "./globals.css";
import "./order-form.css";
import "./brand-fx.css";
import "./charity.css";
import "./toda.css";
import "./studio.css";

/**
 * Schriften wie in der Design-Vorlage (Heebo + Frank Ruhl Libre).
 * next/font laedt sie beim Build herunter und liefert sie von der eigenen
 * Domain aus - zur Laufzeit geht keine Anfrage an Google.
 */
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-heebo",
  display: "swap",
  // Kein Vorabladen: sonst holt jede Sprachfassung beide Zeichensaetze und
  // draengelt sich im <head> vor das Hero-Bild. Die unicode-range in der
  // erzeugten CSS entscheidet dann selbst, was wirklich gebraucht wird.
  preload: false,
});

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-frank",
  display: "swap",
  preload: false,
});

/*
 * Grundeinstellungen fuer die ganze Website "שושנה יודאיקה".
 * Jede Seite setzt Titel, Beschreibung, kanonische Adresse und
 * Vorschaubild selbst; der Titel bekommt automatisch den Markennamen
 * angehaengt. Die Carlebach-Seiten verwenden ihre bisherigen Titel
 * unveraendert (title.absolute).
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: { default: `${brand.name} | ${brand.slogan}`, template: `%s | ${brand.name}` },
  description: HOME.hero.sub,
  authors: [{ name: "Shoshana Dror" }],
  creator: "Shoshana Dror",

  openGraph: {
    type: "website",
    locale: "he_IL",
    url: siteUrl,
    siteName: brand.name,
    title: `${brand.name} | ${brand.slogan}`,
    description: HOME.hero.sub,
    images: [{ url: "/studio/og-brand.jpg", width: 1200, height: 630 }],
  },

  twitter: {
    card: "summary_large_image",
    title: `${brand.name} | ${brand.slogan}`,
    description: HOME.hero.sub,
    images: ["/studio/og-brand.jpg"],
  },

  // In der Testphase fuer alle Suchmaschinen gesperrt (siehe lib/site.ts)
  robots: isTestPhase
    ? { index: false, follow: false, nocache: true }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2e2e2e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: die englische Seite stellt lang/dir per
    // Inline-Skript um, bevor React uebernimmt (analog zum Theme-Skript-Muster)
    <html lang="he" dir="rtl" className={`${heebo.variable} ${frankRuhl.variable}`} suppressHydrationWarning>
      <body>
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}
