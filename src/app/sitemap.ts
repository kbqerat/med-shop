import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/site";
import { LOCALES, localePath } from "@/lib/i18n/config";

// Re-crawled on each request rather than frozen at build time, so new products
// and brands show up without a redeploy.
export const dynamic = "force-dynamic";

/** One sitemap entry per canonical path, with hreflang alternates for every locale. */
function entry(
  path: string,
  lastModified: Date,
  changeFrequency: "daily" | "weekly",
  priority: number
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, absoluteUrl(localePath(path, l))])
      ),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { archived: false },
      select: { slug: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      select: { slug: true, createdAt: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const now = new Date();

  return [
    entry("/", now, "daily", 1),
    entry("/products", now, "daily", 0.9),
    ...categories.map((c) => entry(`/category/${c.slug}`, c.createdAt, "weekly", 0.7)),
    ...products.map((p) => entry(`/products/${p.slug}`, p.createdAt, "weekly", 0.8)),
  ];
}
