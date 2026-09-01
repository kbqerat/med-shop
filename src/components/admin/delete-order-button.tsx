"use client";

import { TrashIcon } from "@/components/icons";
import { deleteOrder } from "@/app/admin/(dashboard)/orders/actions";

export function DeleteOrderButton({
  orderId,
  orderLabel,
}: {
  orderId: string;
  orderLabel: string;
}) {
  return (
    <form
      action={deleteOrder}
      className="flex-shrink-0"
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Supprimer la commande ${orderLabel} ? Cette action est irréversible.`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={orderId} />
      <button
        type="submit"
        aria-label={`Supprimer la commande ${orderLabel}`}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </form>
  );
}
