import { SearchIcon } from "@/components/icons";
import { getTranslations } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";

export async function SearchBar({
  basePath,
  query,
  hiddenParams,
}: {
  basePath: string;
  query?: string;
  hiddenParams: Record<string, string | undefined>;
}) {
  const { locale, messages } = await getTranslations();
  const t = messages.listing;

  return (
    <form
      action={localePath(basePath, locale)}
      method="GET"
      className="flex w-full flex-shrink-0 items-center gap-2 rounded-full border border-surface-border px-4 py-2 transition-colors focus-within:border-foreground sm:w-64"
    >
      <SearchIcon className="h-4 w-4 flex-shrink-0 text-muted" />
      <input
        type="search"
        name="q"
        defaultValue={query}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchLabel}
        className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted"
      />
      {Object.entries(hiddenParams).map(([key, value]) =>
        value ? <input key={key} type="hidden" name={key} value={value} /> : null
      )}
    </form>
  );
}
