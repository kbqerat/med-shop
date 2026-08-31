"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useI18n } from "@/context/i18n";

type LinkProps = ComponentProps<typeof Link>;

/**
 * Drop-in for `next/link` that prefixes internal absolute paths with the active
 * locale (`/products` → `/fr/products`). External URLs and anchors pass through.
 */
export function LocaleLink({ href, ...rest }: LinkProps) {
  const { path } = useI18n();
  const localized =
    typeof href === "string" && href.startsWith("/") ? path(href) : href;
  return <Link href={localized} {...rest} />;
}
