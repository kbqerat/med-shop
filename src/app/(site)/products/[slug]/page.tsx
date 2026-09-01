import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductGallery } from "@/components/product-gallery";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LocaleLink } from "@/components/locale-link";
import { ProductCard } from "@/components/product-card";
import { JsonLd } from "@/components/json-ld";
import { TruckIcon } from "@/components/icons";
import { breadcrumbSchema, productSchema } from "@/lib/structured-data";
import { formatPrice } from "@/lib/format";
import { toProductCardData } from "@/lib/product-card-data";
import { getTranslations } from "@/lib/i18n/server";

// Show every product in the same category; if that's fewer than this, top up
// with newest products from other categories so the section never looks thin.
const MIN_RELATED_COUNT = 20;

// Shared by generateMetadata and the page so the lookup runs once per request.
const getProduct = cache((slug: string) =>
  prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { position: "asc" } },
    },
  })
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product || product.archived) return {};

  const description =
    product.description.length > 160
      ? `${product.description.slice(0, 157).trimEnd()}…`
      : product.description;

  // Canonical + hreflang are set by the root layout from the request path.
  return {
    title: `${product.name} — ${product.category.name}`,
    description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [{ messages }, product] = await Promise.all([
    getTranslations(),
    getProduct(slug),
  ]);

  if (!product || product.archived) notFound();

  const galleryImages = product.images.length
    ? product.images.map((image) => image.url)
    : product.imageUrl
      ? [product.imageUrl]
      : [];

  const sameCategoryProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      archived: false,
      NOT: { id: product.id },
    },
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  let similarProducts = sameCategoryProducts;
  if (similarProducts.length < MIN_RELATED_COUNT) {
    const otherProducts = await prisma.product.findMany({
      where: {
        archived: false,
        NOT: { id: { in: [product.id, ...similarProducts.map((p) => p.id)] } },
      },
      include: { category: true, variants: true },
      orderBy: { createdAt: "desc" },
      take: MIN_RELATED_COUNT - similarProducts.length,
    });
    similarProducts = [...similarProducts, ...otherProducts];
  }

  const totalStock = product.variants.reduce(
    (sum, variant) => sum + variant.stock,
    0
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <JsonLd
        data={productSchema({
          name: product.name,
          slug: product.slug,
          description: product.description,
          priceCents: product.priceCents,
          brand: product.category.name,
          inStock: totalStock > 0,
          image: galleryImages[0] ?? null,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: messages.breadcrumb.home, path: "/" },
          { name: messages.breadcrumb.shop, path: "/products" },
          {
            name: product.category.name,
            path: `/category/${product.category.slug}`,
          },
          { name: product.name, path: `/products/${product.slug}` },
        ])}
      />
      <Breadcrumbs
        items={[
          { label: messages.breadcrumb.home, href: "/" },
          { label: messages.breadcrumb.shop, href: "/products" },
          {
            label: product.category.name,
            href: `/category/${product.category.slug}`,
          },
          { label: product.name },
        ]}
      />
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <ProductGallery
          images={galleryImages}
          video={product.videoUrl}
          accentFrom={product.accentFrom}
          accentTo={product.accentTo}
          className="aspect-square w-full rounded-2xl"
        />

        <div className="min-w-0">
          <LocaleLink
            href={`/category/${product.category.slug}`}
            className="text-sm font-medium text-muted hover:text-foreground"
          >
            {product.category.name}
          </LocaleLink>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-xl font-semibold text-accent">
            {formatPrice(product.priceCents)}
          </p>
          <p className="mt-6 text-muted">{product.description}</p>

          <div className="mt-8">
            <AddToCartForm
              productId={product.id}
              slug={product.slug}
              name={product.name}
              priceCents={product.priceCents}
              variants={product.variants.map((variant) => ({
                id: variant.id,
                size: variant.size,
                stock: variant.stock,
              }))}
              accentFrom={product.accentFrom}
              accentTo={product.accentTo}
              imageUrl={product.imageUrl}
            />

            <p className="mt-4 flex items-center gap-2.5 rounded-xl bg-accent/5 px-4 py-3 text-sm font-medium text-accent ring-1 ring-inset ring-accent/10">
              <TruckIcon className="h-4 w-4 flex-shrink-0" />
              {messages.product.freeDelivery}
            </p>
          </div>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="mt-24">
          <h2 className="text-2xl font-bold">{messages.product.similarTitle}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {similarProducts.map((related) => (
              <ProductCard
                key={related.slug}
                product={toProductCardData(related)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
