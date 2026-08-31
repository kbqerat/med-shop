import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";
import { Pagination } from "@/components/pagination";
import { PlusIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 8;

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; page?: string }>;
}) {
  const { error, page: pageParam } = await searchParams;

  const totalCount = await prisma.category.count();
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);

  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { products: true } } },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">Catalogue</p>
      <div className="mt-1 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catégories</h1>
          <p className="mt-1 text-sm text-muted">
            {totalCount} {totalCount === 1 ? "catégorie" : "catégories"}
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
        >
          <PlusIcon className="h-4 w-4" />
          Ajouter une catégorie
        </Link>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="group relative overflow-hidden rounded-2xl border border-surface-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <Link href={`/admin/categories/${category.id}/edit`}>
              <div className="relative flex h-28 items-end bg-background p-4">
                {category.imageUrl && (
                  <Image
                    src={category.imageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 288px, 50vw"
                    className="object-cover"
                  />
                )}
                <span className="relative rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                  {category._count.products}{" "}
                  {category._count.products === 1 ? "produit" : "produits"}
                </span>
              </div>
              <div className="bg-surface p-4">
                <p className="font-bold">{category.name}</p>
                <p className="mt-0.5 text-xs text-muted">/{category.slug}</p>
              </div>
            </Link>
            <div className="absolute right-3 top-3">
              <DeleteCategoryButton categoryId={category.id} categoryName={category.name} />
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <p className="col-span-full p-8 text-center text-sm text-muted">
            Aucune catégorie pour le moment. Ajoutez la première.
          </p>
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/categories" />
    </div>
  );
}
