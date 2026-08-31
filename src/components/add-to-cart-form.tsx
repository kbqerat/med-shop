"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useI18n } from "@/context/i18n";
import { formatPrice } from "@/lib/format";
import { orderTotalCents, DELIVERY_FEE_CENTS } from "@/lib/cart-total";
import { stockLevel } from "@/lib/stock";

type Variant = { id: string; size: string; stock: number };

export function AddToCartForm({
  productId,
  slug,
  name,
  priceCents,
  variants,
  accentFrom,
  accentTo,
  imageUrl,
}: {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  variants: Variant[];
  accentFrom: string;
  accentTo: string;
  imageUrl?: string | null;
}) {
  const firstAvailable = variants.find((v) => v.stock > 0) ?? variants[0];
  const [variantId, setVariantId] = useState(firstAvailable?.id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { messages, plural, t, path } = useI18n();
  const router = useRouter();

  function urgencyLabel(stock: number): string | null {
    const s = messages.stock;
    switch (stockLevel(stock)) {
      case "out":
        return s.urgencyOutOfStock;
      case "critical":
        return stock === 1
          ? s.urgencyLastOne
          : plural(s.urgencyOnlyLeft, stock);
      case "low":
        return t(s.urgencySellingFast, { count: stock });
      default:
        return null;
    }
  }

  const selected = variants.find((v) => v.id === variantId);
  const allOut = variants.every((v) => v.stock <= 0);
  const selectedOut = !selected || selected.stock <= 0;
  const maxQty = selected?.stock ?? 0;
  const clampedQty = Math.min(quantity, Math.max(1, maxQty));

  function selectVariant(id: string) {
    setVariantId(id);
    setQuantity(1);
  }

  function addToCart() {
    if (!selected || selected.stock <= 0) return;
    addItem({
      productId,
      variantId: selected.id,
      slug,
      name,
      priceCents,
      size: selected.size,
      quantity: clampedQty,
      stock: selected.stock,
      accentFrom,
      accentTo,
      imageUrl,
    });
  }

  return (
    <div>
      <p className="text-sm font-semibold text-muted">{messages.common.size}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = variant.id === variantId;
          const isOut = variant.stock <= 0;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => selectVariant(variant.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-surface-border text-foreground hover:border-foreground"
              } ${isOut ? "line-through opacity-50" : ""}`}
            >
              {variant.size}
            </button>
          );
        })}
      </div>

      {!allOut && selected && (
        <>
          {selectedOut ? (
            <p className="mt-3 text-sm font-medium text-muted">
              {t(messages.product.sizeOutOfStock, { size: selected.size })}
            </p>
          ) : (
            urgencyLabel(selected.stock) && (
              <p className="mt-3 text-sm font-semibold text-amber-700">
                {urgencyLabel(selected.stock)}
              </p>
            )
          )}
        </>
      )}

      {!allOut && !selectedOut && (
        <div className="mt-6">
          <p className="text-sm font-semibold text-muted">
            {messages.common.quantity}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={clampedQty <= 1}
              className="h-9 w-9 rounded-full border border-surface-border hover:border-foreground disabled:opacity-40 disabled:hover:border-surface-border"
            >
              −
            </button>
            <span className="w-6 text-center font-medium">{clampedQty}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              disabled={clampedQty >= maxQty}
              className="h-9 w-9 rounded-full border border-surface-border hover:border-foreground disabled:opacity-40 disabled:hover:border-surface-border"
            >
              +
            </button>
            <span className="ms-2 text-sm text-muted">
              {messages.common.total}:{" "}
              <span className="font-semibold text-accent">
                {formatPrice(
                  orderTotalCents([{ priceCents, quantity: clampedQty }])
                )}
              </span>
            </span>
          </div>
        </div>
      )}

      {!allOut && (
        <p className="mt-4 rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
          {t(messages.product.bundleHint, {
            amount: formatPrice(DELIVERY_FEE_CENTS),
          })}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        {allOut ? (
          <button
            type="button"
            disabled
            className="flex-1 cursor-not-allowed rounded-full border border-surface-border px-8 py-3 font-semibold text-muted"
          >
            {messages.common.outOfStock}
          </button>
        ) : (
          <>
            <button
              type="button"
              disabled={selectedOut}
              onClick={() => {
                addToCart();
                setAdded(true);
                setTimeout(() => setAdded(false), 1500);
              }}
              className="flex-1 rounded-full bg-accent px-8 py-3 font-semibold text-accent-foreground transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {added ? messages.common.added : messages.common.addToCart}
            </button>
            <button
              type="button"
              disabled={selectedOut}
              onClick={() => {
                addToCart();
                router.push(path("/cart"));
              }}
              className="flex-1 rounded-full border border-surface-border px-8 py-3 font-semibold transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {messages.common.orderNow}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
