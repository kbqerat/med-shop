/**
 * Locale config shared by the proxy, server helpers, and client context.
 * Pure and dependency-free so the proxy can import it.
 */

export const LOCALES = ["ar", "fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Arabic is the primary language and lives at the unprefixed root. */
export const DEFAULT_LOCALE: Locale = "ar";

export const RTL_LOCALES: readonly Locale[] = ["ar"];

/** Persists the visitor's choice so the switcher and future visits agree. */
export const LOCALE_COOKIE = "volt-lang";

/** OpenGraph `og:locale` value per app locale. */
export const OG_LOCALE: Record<Locale, string> = {
  ar: "ar_MA",
  fr: "fr_MA",
  en: "en_US",
};

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  );
}

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

/**
 * Prefix a site-absolute path for a locale. The default locale is never
 * prefixed (`/products`); others are (`/fr/products`).
 */
export function localePath(path: string, locale: Locale): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/**
 * Split a pathname into its locale prefix (if any) and the canonical
 * unprefixed path. `/fr/products` → { locale: "fr", path: "/products",
 * hadPrefix: true }; `/products` → { locale: DEFAULT, path: "/products" }.
 */
export function splitLocale(pathname: string): {
  locale: Locale;
  path: string;
  hadPrefix: boolean;
} {
  const segments = pathname.split("/");
  const maybe = segments[1];
  if (isLocale(maybe)) {
    const rest = `/${segments.slice(2).join("/")}`.replace(/\/+$/, "");
    return { locale: maybe, path: rest || "/", hadPrefix: true };
  }
  return { locale: DEFAULT_LOCALE, path: pathname, hadPrefix: false };
}
