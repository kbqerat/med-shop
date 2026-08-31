import { LocaleLink } from "@/components/locale-link";
import { buildQuery } from "@/lib/query";
import { getTranslations } from "@/lib/i18n/server";
import { isRtl } from "@/lib/i18n/config";

function buildPageList(current: number, total: number): (number | "...")[] {
  const delta = 1;
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  return pages;
}

export async function Pagination({
  currentPage,
  totalPages,
  basePath,
  currentParams = {},
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  currentParams?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const { locale, messages } = await getTranslations();
  const t = messages.listing;
  const prevGlyph = isRtl(locale) ? "›" : "‹";
  const nextGlyph = isRtl(locale) ? "‹" : "›";

  const pageHref = (page: number) =>
    `${basePath}${buildQuery(currentParams, { page: page > 1 ? String(page) : undefined })}`;

  const pages = buildPageList(currentPage, totalPages);

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label={t.pagination}>
      {currentPage > 1 ? (
        <LocaleLink
          href={pageHref(currentPage - 1)}
          aria-label={t.prevPage}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-sm font-medium text-foreground transition-colors hover:border-foreground"
        >
          {prevGlyph}
        </LocaleLink>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-sm font-medium text-surface-border">
          {prevGlyph}
        </span>
      )}

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-muted">
            …
          </span>
        ) : (
          <LocaleLink
            key={page}
            href={pageHref(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-foreground text-background"
                : "text-foreground hover:bg-surface"
            }`}
          >
            {page}
          </LocaleLink>
        )
      )}

      {currentPage < totalPages ? (
        <LocaleLink
          href={pageHref(currentPage + 1)}
          aria-label={t.nextPage}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-sm font-medium text-foreground transition-colors hover:border-foreground"
        >
          {nextGlyph}
        </LocaleLink>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-sm font-medium text-surface-border">
          {nextGlyph}
        </span>
      )}
    </nav>
  );
}
