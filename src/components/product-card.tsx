import { LocaleLink } from "@/components/locale-link";
import { ProductArt } from "@/components/product-art";
import { StockBadge } from "@/components/stock-badge";
import { ArrowUpRightIcon, FlameIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";

export type ProductCardData = {
  slug: string;
  name: string;
  category: string;
  priceCents: number;
  stock: number;
  accentFrom: string;
  accentTo: string;
  imageUrl?: string | null;
};

export function ProductCard({
  product,
  badge,
}: {
  product: ProductCardData;
  badge?: string;
}) {
  return (
    <LocaleLink
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-3xl border border-surface-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-xl"
    >
      <div className="relative overflow-hidden">
        <ProductArt
          accentFrom={product.accentFrom}
          accentTo={product.accentTo}
          imageUrl={product.imageUrl}
          className="aspect-square w-full transition-transform duration-500 ease-out group-hover:scale-110"
        />
        {badge && (
          <span className="absolute start-3 top-3 flex items-center gap-1 rounded-full bg-foreground/90 px-2.5 py-1 text-[11px] font-semibold text-background shadow-sm backdrop-blur">
            <FlameIcon className="h-3 w-3 text-accent" />
            {badge}
          </span>
        )}
        <span className="absolute end-3 top-3 flex h-9 w-9 -translate-y-2 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRightIcon className="h-4 w-4" />
        </span>
        <StockBadge stock={product.stock} className="absolute bottom-3 start-3" />
      </div>
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          {product.category}
        </p>
        <h3 className="mt-1.5 truncate font-bold transition-colors group-hover:text-accent">
          {product.name}
        </h3>
        <p className="mt-2 text-sm font-semibold text-accent">
          {formatPrice(product.priceCents)}
        </p>
      </div>
    </LocaleLink>
  );
}
