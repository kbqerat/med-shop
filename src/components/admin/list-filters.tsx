"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SearchIcon } from "@/components/icons";

type SelectFilter = {
  name: string;
  label: string;
  allLabel: string;
  options: { value: string; label: string }[];
};

function buildHref(
  base: string,
  values: Record<string, string | undefined>,
  updates: Record<string, string | null>
): string {
  const params = new URLSearchParams();
  const merged: Record<string, string | null | undefined> = { ...values, ...updates };
  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function AdminListFilters({
  searchName = "q",
  searchPlaceholder,
  values,
  selects = [],
}: {
  searchName?: string;
  searchPlaceholder: string;
  /** Current filter param values — excludes `page`, so any change resets paging. */
  values: Record<string, string | undefined>;
  selects?: SelectFilter[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(values[searchName] ?? "");

  useEffect(() => {
    const handle = setTimeout(() => {
      if (search === (values[searchName] ?? "")) return;
      router.replace(buildHref(pathname, values, { [searchName]: search || null }));
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const hasActive = Object.values(values).some(Boolean) || search !== "";

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex w-full flex-shrink-0 items-center gap-2 rounded-full border border-surface-border bg-surface px-4 py-2 transition-colors focus-within:border-foreground sm:w-72">
        <SearchIcon className="h-4 w-4 flex-shrink-0 text-muted" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </div>

      {selects.map((select) => (
        <select
          key={select.name}
          value={values[select.name] ?? ""}
          onChange={(event) =>
            router.push(
              buildHref(pathname, values, { [select.name]: event.target.value || null })
            )
          }
          aria-label={select.label}
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm font-medium text-foreground outline-none focus:border-foreground"
        >
          <option value="">{select.allLabel}</option>
          {select.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}

      {hasActive && (
        <button
          type="button"
          onClick={() => {
            setSearch("");
            router.push(pathname);
          }}
          className="text-sm font-medium text-accent hover:underline"
        >
          Effacer
        </button>
      )}
    </div>
  );
}
