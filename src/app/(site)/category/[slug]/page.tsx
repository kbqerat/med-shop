import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/lib/categories";
import { toProductCardData } from "@/lib/product-card-data";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";
import { ProductCard } from "@/components/product-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryFilterBar } from "@/components/category-filter-bar";
import { FilterSelect } from "@/components/filter-select";
import { SearchBar } from "@/components/search-bar";
import { Pagination } from "@/components/pagination";
import { getDictionary, getLocale, getTranslations } from "@/lib/i18n/server";
import { interpolate } from "@/lib/i18n/plural";
import {
  PRICE_OPTIONS,
  SIZE_OPTIONS,
  SORT_OPTIONS,
  applyFilters,
} from "@/lib/product-filters";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 30;

// Shared by generateMetadata and the page so the lookup runs once per request.
const getCategory = cache((slug: string) =>
  prisma.category.findUnique({ where: { slug } })
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};

  const t = getDictionary(await getLocale()).meta;
  return {
    title: interpolate(t.categoryTitle, { name: category.name }),
    description: interpolate(t.categoryDescription, { name: category.name }),
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sort?: string;
    size?: string;
    price?: string;
    q?: string;
    page?: string;
  }>;
}) {
  const { slug } = await params;
  const { sort, size, price, q, page: pageParam } = await searchParams;

  const [{ messages, plural }, category, categories] = await Promise.all([
    getTranslations(),
    getCategory(slug),
    getCategories(),
  ]);

  if (!category) notFound();
  const m = messages.listing;

  const allProducts = await prisma.product.findMany({
    where: { categoryId: category.id, archived: false },
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  const filtered = applyFilters(allProducts, { sort, size, price, search: q });
  const currentParams = { sort, size, price, q };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const products = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const sortOptions = SORT_OPTIONS.map((o) => ({
    value: o.value,
    label: o.value === "price-asc" ? m.sortPriceAsc : m.sortPriceDesc,
  }));
  const priceOptions = PRICE_OPTIONS.map((o) => ({
    value: o.value,
    label: m.priceUnder.replace("{price}", o.value),
  }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <JsonLd
        data={breadcrumbSchema([
          { name: messages.breadcrumb.home, path: "/" },
          { name: messages.breadcrumb.shop, path: "/products" },
          { name: category.name, path: `/category/${slug}` },
        ])}
      />
      <Breadcrumbs
        items={[
          { label: messages.breadcrumb.home, href: "/" },
          { label: messages.breadcrumb.shop, href: "/products" },
          { label: category.name },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold">{category.name}</h1>
      <p className="mt-2 text-muted">
        {q
          ? plural(m.resultsFor, filtered.length, { query: q })
          : plural(m.countOfTotal, filtered.length, { total: allProducts.length })}
      </p>

      <div className="mt-6">
        <CategoryFilterBar categories={categories} activeSlug={slug} />
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-surface-border pt-6 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchBar
          basePath={`/category/${slug}`}
          query={q}
          hiddenParams={{ sort, size, price }}
        />
        <div className="flex items-center gap-4 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          <FilterSelect
            label={m.filterSort}
            paramName="sort"
            options={sortOptions}
            activeValue={sort}
            basePath={`/category/${slug}`}
            currentParams={currentParams}
            allLabel={m.allSort}
          />
          <FilterSelect
            label={m.filterPrice}
            paramName="price"
            options={priceOptions}
            activeValue={price}
            basePath={`/category/${slug}`}
            currentParams={currentParams}
            allLabel={m.allPrices}
          />
          <FilterSelect
            label={m.filterSize}
            paramName="size"
            options={SIZE_OPTIONS}
            activeValue={size}
            basePath={`/category/${slug}`}
            currentParams={currentParams}
            allLabel={m.allSizes}
          />
        </div>
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-muted">{m.noMatchTitle}</p>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={toProductCardData(product)} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={`/category/${slug}`}
            currentParams={currentParams}
          />
        </>
      )}
    </div>
  );
}
