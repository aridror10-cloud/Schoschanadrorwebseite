import type { MetadataRoute } from "next";
import { isTestPhase, siteUrl } from "@/lib/site";

/** Erzeugt /robots.txt beim Build. In der Testphase komplett gesperrt. */
export default function robots(): MetadataRoute.Robots {
  if (isTestPhase) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
