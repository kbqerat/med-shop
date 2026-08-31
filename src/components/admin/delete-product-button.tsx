"use client";

import { TrashIcon } from "@/components/icons";
import { deleteProduct } from "@/app/admin/(dashboard)/products/actions";

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!window.confirm(`Supprimer « ${productName} » ? Cette action est irréversible.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        aria-label={`Supprimer ${productName}`}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </form>
  );
}
