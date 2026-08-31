export function formatPrice(cents: number): string {
  // Whole dirhams render clean ("150dh"); stray cents keep two decimals
  // ("149.50dh") instead of being silently rounded away.
  const hasFraction = Math.round(cents) % 100 !== 0;
  return `${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  })}dh`;
}
