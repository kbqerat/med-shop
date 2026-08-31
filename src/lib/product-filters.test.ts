import { describe, it, expect } from "vitest";
import { applyFilters, type ProductFilters } from "./product-filters";

type TestProduct = {
  id: string;
  name: string;
  priceCents: number;
  createdAt: Date;
  variants: { size: string; stock: number }[];
};

// applyFilters only reads the fields modelled above; the real signature wants a
// full Prisma Product, so narrow it here for readable fixtures.
const filter = applyFilters as unknown as (
  products: TestProduct[],
  filters: ProductFilters
) => TestProduct[];

function make(overrides: Partial<TestProduct> & { id: string }): TestProduct {
  return {
    name: "Cap",
    priceCents: 20000,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    variants: [{ size: "Standard", stock: 5 }],
    ...overrides,
  };
}

const ids = (products: TestProduct[]) => products.map((p) => p.id);

describe("applyFilters", () => {
  it("matches search against the name, case-insensitively and partially", () => {
    const products = [
      make({ id: "a", name: "Navy Trucker" }),
      make({ id: "b", name: "Black Beanie" }),
    ];
    expect(ids(filter(products, { search: "truck" }))).toEqual(["a"]);
    expect(ids(filter(products, { search: "  BEANIE " }))).toEqual(["b"]);
  });

  it("filters by size, splitting combined variant sizes like 'S/M'", () => {
    const products = [
      make({ id: "a", variants: [{ size: "S/M", stock: 1 }] }),
      make({ id: "b", variants: [{ size: "L", stock: 1 }] }),
    ];
    expect(ids(filter(products, { size: "M" }))).toEqual(["a"]);
    expect(ids(filter(products, { size: "L" }))).toEqual(["b"]);
  });

  it("treats price as an inclusive dirham ceiling", () => {
    const products = [
      make({ id: "cheap", priceCents: 15000 }),
      make({ id: "exact", priceCents: 25000 }),
      make({ id: "pricey", priceCents: 25001 }),
    ];
    expect(ids(filter(products, { price: "250" }))).toEqual(["cheap", "exact"]);
  });

  it("sorts by price ascending and descending on request", () => {
    const products = [
      make({ id: "mid", priceCents: 20000 }),
      make({ id: "low", priceCents: 10000 }),
      make({ id: "high", priceCents: 30000 }),
    ];
    expect(ids(filter(products, { sort: "price-asc" }))).toEqual([
      "low",
      "mid",
      "high",
    ]);
    expect(ids(filter(products, { sort: "price-desc" }))).toEqual([
      "high",
      "mid",
      "low",
    ]);
  });

  it("defaults to newest-first by createdAt", () => {
    const products = [
      make({ id: "old", createdAt: new Date("2025-01-01") }),
      make({ id: "new", createdAt: new Date("2026-06-01") }),
      make({ id: "mid", createdAt: new Date("2025-09-01") }),
    ];
    expect(ids(filter(products, {}))).toEqual(["new", "mid", "old"]);
  });

  it("does not mutate the input array", () => {
    const products = [
      make({ id: "b", priceCents: 20000 }),
      make({ id: "a", priceCents: 10000 }),
    ];
    filter(products, { sort: "price-asc" });
    expect(ids(products)).toEqual(["b", "a"]);
  });

  it("applies search and price together", () => {
    const products = [
      make({ id: "hit", name: "Green Cap", priceCents: 18000 }),
      make({ id: "tooPricey", name: "Green Cap", priceCents: 40000 }),
      make({ id: "wrongName", name: "Blue Cap", priceCents: 18000 }),
    ];
    expect(ids(filter(products, { search: "green", price: "250" }))).toEqual([
      "hit",
    ]);
  });
});
