"use client";

import { useRouter } from "next/navigation";
import { buildQuery } from "@/lib/query";
import { useI18n } from "@/context/i18n";

type Option = { value: string; label: string };

export function FilterSelect({
  label,
  paramName,
  options,
  activeValue,
  basePath,
  currentParams,
  allLabel = "All",
}: {
  label: string;
  paramName: string;
  options: Option[];
  activeValue?: string;
  basePath: string;
  currentParams: Record<string, string | undefined>;
  allLabel?: string;
}) {
  const router = useRouter();
  const { path } = useI18n();

  return (
    <label className="flex flex-shrink-0 items-center gap-2 text-sm font-medium text-muted">
      {label}
      <select
        value={activeValue ?? ""}
        onChange={(e) => {
          const qs = buildQuery(currentParams, {
            [paramName]: e.target.value || undefined,
          });
          router.push(path(`${basePath}${qs}`));
        }}
        className="rounded-lg border border-surface-border bg-background px-3 py-2 text-sm font-medium text-foreground outline-none focus:border-foreground"
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
