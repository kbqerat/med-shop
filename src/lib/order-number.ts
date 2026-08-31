const PREFIX = "MED-";

/** First order is MED-1001 — starting above zero so numbers never look brand new. */
export const ORDER_NUMBER_START = 1001;
export const ORDER_COUNTER_NAME = "order";

export function formatOrderNumber(number: number): string {
  return `${PREFIX}${number}`;
}

/** Parse a customer-typed reference ("MED-1042", "med 1042", "1042") back to a number. */
export function parseOrderNumber(input: string): number | null {
  // Tolerate any letter prefix + separator so older refs (KSK-, KASKITI-) still resolve.
  const digits = input.trim().toUpperCase().replace(/^[A-Z]*[\s-]*/, "").trim();
  if (!/^\d+$/.test(digits)) return null;
  const number = Number(digits);
  return number >= ORDER_NUMBER_START ? number : null;
}
