import type { Product } from "@prisma/client";

export type ProductFilters = {
  sort?: string;
  size?: string;
  price?: string;
  search?: string;
};

export const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export const PRICE_OPTIONS = [
  { value: "150", label: "150dh and under" },
  { value: "250", label: "250dh and under" },
  { value: "350", label: "350dh and under" },
  { value: "450", label: "450dh and under" },
  { value: "550", label: "550dh and under" },
];

export const SIZE_OPTIONS = [
  { value: "Standard", label: "Standard" },
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
];

type FilterableProduct = Product & {
  variants: { size: string; stock: number }[];
};

/** "S/M" on a variant counts as both "S" and "M" for filtering. */
function variantSizeTokens(variants: { size: string }[]): string[] {
  return variants
    .flatMap((variant) => variant.size.split("/"))
    .map((token) => token.trim())
    .filter(Boolean);
}

export function applyFilters<T extends FilterableProduct>(
  products: T[],
  filters: ProductFilters
): T[] {
  let result = products;

  if (filters.search?.trim()) {
    const target = filters.search.trim().toLowerCase();
    result = result.filter((product) =>
      product.name.toLowerCase().includes(target)
    );
  }

  if (filters.size) {
    result = result.filter((product) =>
      variantSizeTokens(product.variants).includes(filters.size!)
    );
  }

  if (filters.price) {
    const maxCents = Number(filters.price) * 100;
    result = result.filter((product) => product.priceCents <= maxCents);
  }

  result = [...result];
  if (filters.sort === "price-asc") {
    result.sort((a, b) => a.priceCents - b.priceCents);
  } else if (filters.sort === "price-desc") {
    result.sort((a, b) => b.priceCents - a.priceCents);
  } else {
    result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  return result;
}
