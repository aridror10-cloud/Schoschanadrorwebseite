import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";
import { isTestPhase, siteUrl } from "@/lib/site";
import { COLLECTIONS, PROJECTS } from "@/lib/studio";

/** Erzeugt /sitemap.xml beim Build. In der Testphase bewusst leer. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (isTestPhase) return [];

  const lastModified = new Date();
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  });

  return [
    page("/", 1),
    page("/design", 0.9),
    page("/works", 0.9),
    page("/carlebach", 0.9),
    page("/en", 0.8),
    ...PROJECTS.map((p) => page(`/design/${p.slug}`, 0.7)),
    ...COLLECTIONS.filter((c) => !c.href && c.items.length > 0).map((c) => page(`/works/${c.slug}`, 0.7)),
    ...(ARTICLES.length ? [page("/articles", 0.6)] : []),
    ...ARTICLES.map((a) => page(`/articles/${a.slug}`, 0.6)),
    page("/about", 0.6),
    page("/contact", 0.6),
  ];
}
