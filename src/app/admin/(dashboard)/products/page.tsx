import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/lib/categories";
import { ProductArt } from "@/components/product-art";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { AdminListFilters } from "@/components/admin/list-filters";
import { Pagination } from "@/components/pagination";
import { PlusIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import { stockAdminLabel, stockLevel, LOW_STOCK_THRESHOLD } from "@/lib/stock";
import { toggleProductArchived } from "./actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 6;

const STOCK_OPTIONS = [
  { value: "in", label: "En stock" },
  { value: "low", label: "Stock faible" },
  { value: "out", label: "Rupture de stock" },
];

const VISIBILITY_OPTIONS = [
  { value: "visible", label: "Visible" },
  { value: "archived", label: "Archivé" },
];

function stockBadgeClass(stock: number): string {
  const level = stockLevel(stock);
  if (level === "out") return "bg-red-50 text-red-600";
  if (level === "ok") return "bg-background text-muted";
  return "bg-amber-50 text-amber-600";
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    q?: string;
    category?: string;
    stock?: string;
    visibility?: string;
    page?: string;
  }>;
}) {
  const { error, q, category, stock, visibility, page: pageParam } =
    await searchParams;

  const where: Prisma.ProductWhereInput = {};
  if (q?.trim()) {
    where.name = { contains: q.trim() };
  }
  if (category) {
    where.category = { slug: category };
  }
  if (stock === "out") {
    where.variants = { every: { stock: { lte: 0 } } };
  } else if (stock === "low") {
    where.variants = { some: { stock: { gt: 0, lte: LOW_STOCK_THRESHOLD } } };
  } else if (stock === "in") {
    where.variants = { some: { stock: { gt: 0 } } };
  }
  if (visibility === "visible") {
    where.archived = false;
  } else if (visibility === "archived") {
    where.archived = true;
  }

  const [totalCount, categories] = await Promise.all([
    prisma.product.count({ where }),
    getCategories(),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const filtered = Boolean(q?.trim() || category || stock || visibility);

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { category: true, variants: { select: { stock: true } } },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">Catalogue</p>
      <div className="mt-1 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produits</h1>
          <p className="mt-1 text-sm text-muted">
            {totalCount} {totalCount === 1 ? "produit" : "produits"}
            {filtered ? (totalCount === 1 ? " correspondant" : " correspondants") : ""}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
        >
          <PlusIcon className="h-4 w-4" />
          Ajouter un produit
        </Link>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <AdminListFilters
        searchPlaceholder="Rechercher par nom ou couleur"
        values={{ q, category, stock, visibility }}
        selects={[
          {
            name: "category",
            label: "Marque",
            allLabel: "Toutes les marques",
            options: categories.map((c) => ({ value: c.slug, label: c.name })),
          },
          {
            name: "stock",
            label: "Stock",
            allLabel: "Tout stock",
            options: STOCK_OPTIONS,
          },
          {
            name: "visibility",
            label: "Visibilité",
            allLabel: "Tous les produits",
            options: VISIBILITY_OPTIONS,
          },
        ]}
      />

      <div className="mt-6 divide-y divide-surface-border rounded-2xl border border-surface-border bg-surface shadow-sm">
        {products.map((product) => {
          const totalStock = product.variants.reduce(
            (sum, variant) => sum + variant.stock,
            0
          );
          return (
          <div
            key={product.id}
            className={`flex flex-wrap items-center gap-x-4 gap-y-3 p-4 transition-colors hover:bg-background lg:flex-nowrap ${
              product.archived ? "opacity-60" : ""
            }`}
          >
            <ProductArt
              accentFrom={product.accentFrom}
              accentTo={product.accentTo}
              imageUrl={product.imageUrl}
              className="h-14 w-14 flex-shrink-0 rounded-xl"
            />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate font-semibold">
                {product.name}
                {product.archived && (
                  <span className="flex-shrink-0 rounded-full bg-neutral-200 px-2 py-0.5 text-[11px] font-semibold text-neutral-600">
                    Archivé
                  </span>
                )}
              </p>
              <p className="text-sm text-muted">{product.category.name}</p>
            </div>
            <span className="flex-shrink-0 text-sm font-semibold text-accent">
              {formatPrice(product.priceCents)}
            </span>
            <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:justify-end">
              <span className="flex flex-shrink-0 flex-col items-start gap-0.5 lg:items-end">
                <span
                  className={`w-28 rounded-full px-2.5 py-1 text-center text-xs font-semibold ${stockBadgeClass(
                    totalStock
                  )}`}
                >
                  {stockAdminLabel(totalStock)}
                </span>
                {product.variants.length > 1 && (
                  <span className="text-[11px] text-muted">
                    {product.variants.length} tailles
                  </span>
                )}
              </span>
              <div className="flex items-center gap-4">
                <form action={toggleProductArchived} className="flex-shrink-0">
                  <input type="hidden" name="id" value={product.id} />
                  <button
                    type="submit"
                    className="text-sm font-medium text-muted hover:text-foreground"
                  >
                    {product.archived ? "Désarchiver" : "Archiver"}
                  </button>
                </form>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  Modifier
                </Link>
                <DeleteProductButton
                  productId={product.id}
                  productName={product.name}
                />
              </div>
            </div>
          </div>
          );
        })}

        {products.length === 0 && (
          <p className="p-8 text-center text-sm text-muted">
            {filtered
              ? "Aucun produit ne correspond à ces filtres."
              : "Aucun produit pour le moment. Ajoutez le premier."}
          </p>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/admin/products"
        currentParams={{ q, category, stock, visibility }}
      />
    </div>
  );
}
