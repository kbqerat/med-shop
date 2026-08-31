"use client";

import { useI18n } from "@/context/i18n";
import { stockLevel } from "@/lib/stock";

/** Compact, translated urgency label for product cards. Renders nothing when stock is healthy. */
export function StockBadge({
  stock,
  className = "",
}: {
  stock: number;
  className?: string;
}) {
  const { messages, plural } = useI18n();
  const s = messages.stock;

  let label: string | null = null;
  switch (stockLevel(stock)) {
    case "out":
      label = s.soldOut;
      break;
    case "critical":
      label = stock === 1 ? s.lastOne : plural(s.onlyLeft, stock);
      break;
    case "low":
      label = s.sellingFast;
      break;
    default:
      return null;
  }

  const soldOut = stock <= 0;
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur ${
        soldOut ? "bg-background/90 text-muted" : "bg-amber-50/95 text-amber-700"
      } ${className}`}
    >
      {label}
    </span>
  );
}
