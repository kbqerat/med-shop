import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/category-form";
import { updateCategory } from "../../actions";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div className="max-w-lg">
      <Link href="/admin/categories" className="text-sm font-medium text-muted hover:text-foreground">
        ← Catégories
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Modifier la catégorie</h1>

      <CategoryForm
        action={updateCategory.bind(null, category.id)}
        submitLabel="Enregistrer les modifications"
        initialValues={{
          name: category.name,
          imageUrl: category.imageUrl,
        }}
      />
    </div>
  );
}
