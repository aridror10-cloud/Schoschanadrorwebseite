import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeScript } from "@/components/ThemeScript";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  // Basis fuer alle relativen URLs in Metadaten (og:image, canonical ...)
  metadataBase: new URL(siteUrl),

  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,

  alternates: { canonical: "/" },

  // Vorschau beim Teilen in WhatsApp, LinkedIn, Facebook ...
  openGraph: {
    type: "website",
    locale: site.locale,
    url: siteUrl,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },

  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
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
  // Faerbt die Adressleiste auf dem Handy passend zum Farbschema
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#16171a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: das Theme-Skript setzt data-theme, bevor React uebernimmt
    <html lang={site.lang} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <a className="skip-link" href="#inhalt">
          Zum Inhalt springen
        </a>

        <SiteHeader />

        <main id="inhalt">{children}</main>

        <SiteFooter />
      </body>
    </html>
  );
}
