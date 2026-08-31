/**
 * Every listed price has a flat 50 dh delivery baked into it, but delivery is
 * only charged once per order — not per cap. So a multi-item order gets 50 dh
 * knocked off for each unit beyond the first.
 *
 *   1 cap  (150)        -> 150
 *   2 caps (150 + 150)  -> 250
 *   3 caps (150 + 200)  -> 300
 */
export const DELIVERY_FEE_CENTS = 5000;

export function orderTotalCents(
  items: { priceCents: number; quantity: number }[]
): number {
  const rawSum = items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );
  const units = items.reduce((sum, item) => sum + item.quantity, 0);
  if (units <= 1) return rawSum;
  return Math.max(0, rawSum - DELIVERY_FEE_CENTS * (units - 1));
}
