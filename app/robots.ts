import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Account/utility pages have no search value; the lesson API serves
        // gated content and shouldn't be crawled.
        disallow: ["/api/", "/dashboard", "/profile", "/admin", "/auth"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
