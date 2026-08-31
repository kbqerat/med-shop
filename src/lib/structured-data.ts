import { SITE, absoluteUrl } from "@/lib/site";

type Node = Record<string, unknown>;

/** Store identity — emitted once, on the home page. */
export function organizationSchema(): Node {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": absoluteUrl("/#store"),
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    image: absoluteUrl("/opengraph-image"),
    telephone: SITE.phoneE164,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.addressLocality,
      addressCountry: SITE.addressCountry,
    },
    areaServed: { "@type": "Country", name: "Morocco" },
    paymentAccepted: "Cash on Delivery",
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  };
}

/** Enables the search box in Google results. */
export function webSiteSchema(): Node {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/products?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[]
): Node {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productSchema(product: {
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  brand: string;
  inStock: boolean;
  image?: string | null;
}): Node {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.brand,
    brand: { "@type": "Brand", name: product.brand },
    // Real product photo when there is one; otherwise the branded site card
    // (the per-product OG route is only reachable via a hashed URL we can't
    // build here).
    image: product.image
      ? absoluteUrl(product.image)
      : absoluteUrl("/opengraph-image"),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: "MAD",
      price: (product.priceCents / 100).toFixed(2),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": absoluteUrl("/#store") },
    },
  };
}
