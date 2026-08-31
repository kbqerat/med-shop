import { LocaleLink } from "@/components/locale-link";
import { ChevronRightIcon } from "@/components/icons";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <LocaleLink
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </LocaleLink>
              ) : (
                <span
                  className={isLast ? "font-medium text-foreground" : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRightIcon className="h-3.5 w-3.5 flex-shrink-0 text-surface-border rtl:-scale-x-100" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
