"use client";

import { useEffect, useState } from "react";
import type { Order, OrderItem, Product } from "@prisma/client";
import { OrderSlip } from "@/components/admin/order-slip";
import { DownloadIcon } from "@/components/icons";

type SlipOrder = Order & {
  items: (OrderItem & { product: Product })[];
};

export function SlipButton({ order }: { order: SlipOrder }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex-shrink-0 text-sm font-medium text-accent hover:underline"
      >
        Bon
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-neutral-950/60 p-4 backdrop-blur-sm sm:items-center sm:p-8"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Bon de livraison ${order.number}`}
            onClick={(event) => event.stopPropagation()}
            className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-surface shadow-2xl ring-1 ring-black/10"
          >
            <div className="slip-no-print flex items-center justify-between gap-3 border-b border-surface-border px-5 py-3">
              <p className="text-sm font-semibold">Bon de livraison</p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground transition-opacity hover:opacity-90"
                >
                  <DownloadIcon className="h-3.5 w-3.5" />
                  Imprimer / PDF
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fermer"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-muted transition-colors hover:bg-background hover:text-foreground"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="max-h-[80vh] overflow-y-auto bg-neutral-100 p-5">
              <OrderSlip order={order} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
