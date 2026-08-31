import Link from "next/link";
import { CategoryForm } from "@/components/admin/category-form";
import { createCategory } from "../actions";

export default function NewCategoryPage() {
  return (
    <div className="max-w-lg">
      <Link href="/admin/categories" className="text-sm font-medium text-muted hover:text-foreground">
        ← Catégories
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Ajouter une catégorie</h1>

      <CategoryForm action={createCategory} submitLabel="Ajouter une catégorie" />
    </div>
  );
}
