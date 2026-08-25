import type { MetadataRoute } from "next";
import { isTestPhase, siteUrl } from "@/lib/site";

/** Erzeugt /sitemap.xml beim Build. In der Testphase bewusst leer. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (isTestPhase) return [];

  const lastModified = new Date();
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/en`, lastModified, changeFrequency: "monthly", priority: 0.9 },
  ];
}
