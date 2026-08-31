"use client";

import { TrashIcon } from "@/components/icons";
import { deleteCategory } from "@/app/admin/(dashboard)/categories/actions";

export function DeleteCategoryButton({
  categoryId,
  categoryName,
}: {
  categoryId: string;
  categoryName: string;
}) {
  return (
    <form
      action={deleteCategory}
      onSubmit={(e) => {
        if (!window.confirm(`Supprimer « ${categoryName} » ? Cette action est irréversible.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="categoryId" value={categoryId} />
      <button
        type="submit"
        aria-label={`Supprimer ${categoryName}`}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-muted shadow-sm backdrop-blur transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </form>
  );
}
