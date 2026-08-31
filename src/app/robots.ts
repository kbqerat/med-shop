import type { MetadataRoute } from "next";
import { absoluteUrl, SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private / transactional routes with nothing to index — including the
      // /fr and /en locale-prefixed variants.
      disallow: [
        "/admin",
        "/checkout",
        "/cart",
        "/fr/checkout",
        "/fr/cart",
        "/en/checkout",
        "/en/cart",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE.url,
  };
}
