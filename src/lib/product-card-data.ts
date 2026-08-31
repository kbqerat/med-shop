import type { Product, Category } from "@prisma/client";
import type { ProductCardData } from "@/components/product-card";

export function toProductCardData(
  product: Product & {
    category: Category;
    variants: { stock: number }[];
  }
): ProductCardData {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category.name,
    priceCents: product.priceCents,
    stock: product.variants.reduce((total, variant) => total + variant.stock, 0),
    accentFrom: product.accentFrom,
    accentTo: product.accentTo,
    imageUrl: product.imageUrl,
  };
}
