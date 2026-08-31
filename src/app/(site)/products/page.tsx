import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryFilterBar } from "@/components/category-filter-bar";
import { FilterSelect } from "@/components/filter-select";
import { SearchBar } from "@/components/search-bar";
import { SearchIcon } from "@/components/icons";
import { getCategories } from "@/lib/categories";
import { toProductCardData } from "@/lib/product-card-data";
import { Pagination } from "@/components/pagination";
import { getDictionary, getLocale, getTranslations } from "@/lib/i18n/server";
import {
  PRICE_OPTIONS,
  SIZE_OPTIONS,
  SORT_OPTIONS,
  applyFilters,
} from "@/lib/product-filters";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 30;

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale()).meta;
  return { title: t.shopTitle, description: t.shopDescription };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    sort?: string;
    size?: string;
    price?: string;
    q?: string;
    page?: string;
  }>;
}) {
  const { sort, size, price, q, page: pageParam } = await searchParams;
  const [{ messages, plural }, allProducts, categories] = await Promise.all([
    getTranslations(),
    prisma.product.findMany({
      where: { archived: false },
      orderBy: { createdAt: "desc" },
      include: { category: true, variants: true },
    }),
    getCategories(),
  ]);
  const m = messages.listing;

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
      <Breadcrumbs
        items={[
          { label: messages.breadcrumb.home, href: "/" },
          { label: messages.breadcrumb.shop },
        ]}
      />
      <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-accent">
        {m.collectionKicker}
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">{m.allCapsTitle}</h1>
      <p className="mt-2 text-muted">
        {q
          ? plural(m.resultsFor, filtered.length, { query: q })
          : plural(m.countOfTotal, filtered.length, { total: allProducts.length })}
      </p>

      <div className="mt-6">
        <CategoryFilterBar categories={categories} activeSlug={null} />
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-surface-border bg-surface p-4 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchBar
          basePath="/products"
          query={q}
          hiddenParams={{ sort, size, price }}
        />
        <div className="flex items-center gap-4 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          <FilterSelect
            label={m.filterSort}
            paramName="sort"
            options={sortOptions}
            activeValue={sort}
            basePath="/products"
            currentParams={currentParams}
            allLabel={m.allSort}
          />
          <FilterSelect
            label={m.filterPrice}
            paramName="price"
            options={priceOptions}
            activeValue={price}
            basePath="/products"
            currentParams={currentParams}
            allLabel={m.allPrices}
          />
          <FilterSelect
            label={m.filterSize}
            paramName="size"
            options={SIZE_OPTIONS}
            activeValue={size}
            basePath="/products"
            currentParams={currentParams}
            allLabel={m.allSizes}
          />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-surface-border py-20 text-center">
          <SearchIcon className="h-8 w-8 text-surface-border" />
          <p className="font-semibold">{m.noMatchTitle}</p>
          <p className="text-sm text-muted">{m.noMatchSubtitle}</p>
        </div>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={toProductCardData(product)} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/products"
            currentParams={currentParams}
          />
        </>
      )}
    </div>
  );
}
