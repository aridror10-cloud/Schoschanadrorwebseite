import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import { content } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import "./globals.css";

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
});

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-frank",
  display: "swap",
});

const he = content.he.meta;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: he.title,
  description: he.description,
  authors: [{ name: "Shoshana Dror" }],
  creator: "Shoshana Dror",

  alternates: {
    canonical: "/",
    languages: { he: "/", en: "/en", "x-default": "/" },
  },

  openGraph: {
    type: "website",
    locale: he.ogLocale,
    alternateLocale: content.en.meta.ogLocale,
    url: siteUrl,
    siteName: "Shoshana Dror",
    title: he.title,
    description: he.ogDescription,
    images: [{ url: "/carlebach/og.jpg" }],
  },

  twitter: {
    card: "summary_large_image",
    title: he.title,
    description: he.ogDescription,
    images: ["/carlebach/og.jpg"],
  },

  robots: {
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
      <body>{children}</body>
    </html>
  );
}
