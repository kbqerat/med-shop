import { LocaleLink } from "@/components/locale-link";
import { getTranslations } from "@/lib/i18n/server";
import type { CategorySummary } from "@/lib/categories";

export async function CategoryFilterBar({
  categories,
  activeSlug,
}: {
  categories: CategorySummary[];
  activeSlug: string | null;
}) {
  const { messages } = await getTranslations();

  const pillClass = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? "border-foreground bg-foreground text-background"
        : "border-surface-border text-foreground hover:border-foreground"
    }`;

  return (
    <div className="flex flex-wrap gap-2">
      <LocaleLink href="/products" className={pillClass(activeSlug === null)}>
        {messages.common.all}
      </LocaleLink>
      {categories.map((category) => (
        <LocaleLink
          key={category.slug}
          href={`/category/${category.slug}`}
          className={pillClass(category.slug === activeSlug)}
        >
          {category.name}
        </LocaleLink>
      ))}
    </div>
  );
}
