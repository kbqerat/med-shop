import { describe, it, expect } from "vitest";
import { localePath, splitLocale } from "./config";
import { plural, interpolate } from "./plural";

describe("localePath", () => {
  it("leaves the default locale unprefixed", () => {
    expect(localePath("/products", "ar")).toBe("/products");
    expect(localePath("/", "ar")).toBe("/");
  });

  it("prefixes non-default locales", () => {
    expect(localePath("/products", "fr")).toBe("/fr/products");
    expect(localePath("/", "en")).toBe("/en");
  });
});

describe("splitLocale", () => {
  it("detects a locale prefix", () => {
    expect(splitLocale("/fr/products")).toEqual({
      locale: "fr",
      path: "/products",
      hadPrefix: true,
    });
  });

  it("returns the default locale for unprefixed paths", () => {
    expect(splitLocale("/products")).toEqual({
      locale: "ar",
      path: "/products",
      hadPrefix: false,
    });
  });

  it("handles a bare locale prefix", () => {
    expect(splitLocale("/en")).toEqual({
      locale: "en",
      path: "/",
      hadPrefix: true,
    });
  });
});

describe("plural (CLDR)", () => {
  const forms = {
    one: "قطعة واحدة",
    two: "قطعتان",
    few: "{count} قطع",
    many: "{count} قطعة",
    other: "{count} قطعة",
  };

  it("selects Arabic categories by count", () => {
    expect(plural("ar", 1, forms)).toBe("قطعة واحدة");
    expect(plural("ar", 2, forms)).toBe("قطعتان");
    expect(plural("ar", 3, forms)).toBe("3 قطع");
    expect(plural("ar", 11, forms)).toBe("11 قطعة");
    expect(plural("ar", 100, forms)).toBe("100 قطعة");
  });

  it("falls back to `other` when a category form is missing", () => {
    expect(plural("en", 2, { one: "one item", other: "{count} items" })).toBe(
      "2 items"
    );
  });
});

describe("interpolate", () => {
  it("replaces known placeholders and leaves unknown ones", () => {
    expect(interpolate("{a} and {b}", { a: "x" })).toBe("x and {b}");
  });
});
