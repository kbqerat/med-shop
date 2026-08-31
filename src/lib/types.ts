export type CartItem = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  priceCents: number;
  size: string;
  quantity: number;
  stock: number;
  accentFrom: string;
  accentTo: string;
  imageUrl?: string | null;
};
