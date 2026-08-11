import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** Erzeugt /robots.txt beim Build. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
