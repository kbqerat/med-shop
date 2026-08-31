import { describe, it, expect } from "vitest";
import { orderTotalCents, DELIVERY_FEE_CENTS } from "./cart-total";

const cap = (dh: number, quantity = 1) => ({ priceCents: dh * 100, quantity });

describe("orderTotalCents", () => {
  it("is zero for an empty cart", () => {
    expect(orderTotalCents([])).toBe(0);
  });

  it("charges the listed price for a single cap", () => {
    expect(orderTotalCents([cap(150)])).toBe(15000);
  });

  it("counts the baked-in delivery once, not per cap", () => {
    // 2 × 150 = 300, minus one extra delivery (50) = 250
    expect(orderTotalCents([cap(150, 2)])).toBe(25000);
    // 3 × 150 = 450, minus two extra deliveries (100) = 350
    expect(orderTotalCents([cap(150, 3)])).toBe(35000);
  });

  it("applies the single delivery across different products in one order", () => {
    // 150 + 200 = 350, minus one extra delivery (50) = 300
    expect(orderTotalCents([cap(150), cap(200)])).toBe(30000);
    // (2 × 150) + (1 × 200) = 500, three units → minus 2 × 50 = 400
    expect(orderTotalCents([cap(150, 2), cap(200)])).toBe(40000);
  });

  it("never goes below zero on odd data", () => {
    expect(orderTotalCents([{ priceCents: 1000, quantity: 20 }])).toBe(
      Math.max(0, 20000 - DELIVERY_FEE_CENTS * 19)
    );
    expect(orderTotalCents([{ priceCents: 1000, quantity: 20 }])).toBe(0);
  });
});
