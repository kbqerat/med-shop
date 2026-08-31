import { LocaleLink } from "@/components/locale-link";
import { ProductArt } from "@/components/product-art";
import { ArrowUpRightIcon } from "@/components/icons";
import { getTranslations } from "@/lib/i18n/server";
import type { CategorySummary } from "@/lib/categories";

export async function CategoryTile({
  name,
  slug,
  count,
  imageUrl,
}: CategorySummary) {
  const { messages, plural } = await getTranslations();

  return (
    <LocaleLink
      href={`/category/${slug}`}
      className="group block overflow-hidden rounded-3xl border border-surface-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-xl"
    >
      <div className="relative overflow-hidden">
        <ProductArt
          imageUrl={imageUrl}
          className="aspect-square w-full transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <span className="absolute end-3 top-3 flex h-9 w-9 -translate-y-2 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRightIcon className="h-4 w-4" />
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-bold transition-colors group-hover:text-accent">{name}</h3>
        <p className="mt-1 text-sm text-muted">
          {plural(messages.listing.caps, count)}
        </p>
      </div>
    </LocaleLink>
  );
}
