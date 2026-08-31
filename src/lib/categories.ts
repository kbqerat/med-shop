import { prisma } from "@/lib/prisma";

export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
  count: number;
  imageUrl: string | null;
};

export async function getCategories(): Promise<CategorySummary[]> {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { products: { where: { archived: false } } } },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    count: category._count.products,
    imageUrl: category.imageUrl,
  }));
}
