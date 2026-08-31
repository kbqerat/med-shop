import { describe, it, expect } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases and joins words with hyphens", () => {
    expect(slugify("Classic Dad Hat")).toBe("classic-dad-hat");
  });

  it("collapses punctuation and whitespace runs into a single hyphen", () => {
    expect(slugify("  VOLT — Cap  #1!  ")).toBe("volt-cap-1");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("--Hello--")).toBe("hello");
  });

  it("returns an empty string when nothing survives", () => {
    expect(slugify("!!!")).toBe("");
  });

  it("treats accented and non-ascii characters as separators", () => {
    expect(slugify("Café Noir")).toBe("caf-noir");
  });
});
