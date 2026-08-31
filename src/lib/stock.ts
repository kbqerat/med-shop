export const LOW_STOCK_THRESHOLD = 5;
export const CRITICAL_STOCK_THRESHOLD = 3;

export type StockLevel = "out" | "critical" | "low" | "ok";

export function stockLevel(stock: number): StockLevel {
  if (stock <= 0) return "out";
  if (stock <= CRITICAL_STOCK_THRESHOLD) return "critical";
  if (stock <= LOW_STOCK_THRESHOLD) return "low";
  return "ok";
}

/**
 * Customer-facing urgency copy. Returns null when stock is healthy — nothing
 * urgent to say, so nothing should be shown.
 */
export function stockUrgencyLabel(stock: number): string | null {
  switch (stockLevel(stock)) {
    case "out":
      return "Out of stock";
    case "critical":
      return stock === 1 ? "Last one — order now" : `Only ${stock} left`;
    case "low":
      return `Selling fast — ${stock} left`;
    default:
      return null;
  }
}

/** Compact urgency copy for tight spaces like product cards. */
export function stockBadgeLabel(stock: number): string | null {
  switch (stockLevel(stock)) {
    case "out":
      return "Sold out";
    case "critical":
      return stock === 1 ? "Last one" : `Only ${stock} left`;
    case "low":
      return "Selling fast";
    default:
      return null;
  }
}

/**
 * Admin-facing status. Always returns a label so every row reads at a glance,
 * keeping the exact count for restocking decisions.
 */
export function stockAdminLabel(stock: number): string {
  switch (stockLevel(stock)) {
    case "out":
      return "Rupture de stock";
    case "critical":
    case "low":
      return `Faible · ${stock} restant`;
    default:
      return `${stock} en stock`;
  }
}
