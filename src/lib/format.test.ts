import { describe, it, expect } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("renders whole dirhams with no decimals", () => {
    expect(formatPrice(0)).toBe("0dh");
    expect(formatPrice(15000)).toBe("150dh");
  });

  it("adds a thousands separator", () => {
    expect(formatPrice(120000)).toBe("1,200dh");
    expect(formatPrice(1234500)).toBe("12,345dh");
  });

  it("keeps two decimals for stray cents instead of rounding them off", () => {
    expect(formatPrice(14950)).toBe("149.50dh");
    expect(formatPrice(14999)).toBe("149.99dh");
    expect(formatPrice(14901)).toBe("149.01dh");
  });
});
