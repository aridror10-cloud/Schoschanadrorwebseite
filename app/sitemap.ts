import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** Erzeugt /sitemap.xml beim Build. Neue Seiten hier eintragen. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/en`, lastModified, changeFrequency: "monthly", priority: 0.9 },
  ];
}
