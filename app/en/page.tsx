import type { Metadata } from "next";
import { Landing } from "@/components/Landing";
import { content } from "@/lib/content";
import { siteUrl } from "@/lib/site";

const en = content.en.meta;

export const metadata: Metadata = {
  title: en.title,
  description: en.description,

  alternates: {
    canonical: "/en",
    languages: { he: "/", en: "/en", "x-default": "/" },
  },

  openGraph: {
    type: "website",
    locale: en.ogLocale,
    alternateLocale: content.he.meta.ogLocale,
    url: `${siteUrl}/en`,
    siteName: "Shoshana Dror",
    title: en.title,
    description: en.ogDescription,
    images: [{ url: "/carlebach/hero.jpg" }],
  },

  twitter: {
    card: "summary_large_image",
    title: en.title,
    description: en.ogDescription,
    images: ["/carlebach/hero.jpg"],
  },
};

/**
 * Stellt lang/dir am <html>-Element um, bevor die Seite gezeichnet wird.
 * Der eigentliche Inhalt ist zusaetzlich in <div lang="en" dir="ltr">
 * verpackt und damit auch ohne JavaScript korrekt gerichtet.
 */
const langFix = `document.documentElement.lang="en";document.documentElement.dir="ltr";`;

/** Englische Seite (LTR) unter /en. */
export default function EnglishPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: langFix }} />
      <Landing lang="en" />
    </>
  );
}
