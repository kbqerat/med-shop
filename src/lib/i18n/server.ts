import { headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";
import { interpolate, plural, type PluralForms } from "@/lib/i18n/plural";
import { en, type Messages } from "@/messages/en";
import { fr } from "@/messages/fr";
import { ar } from "@/messages/ar";

const DICTIONARIES: Record<Locale, Messages> = { ar, fr, en };

export function getDictionary(locale: Locale): Messages {
  return DICTIONARIES[locale];
}

/**
 * Server-component translation bundle: the active locale, its message
 * dictionary, and `t` / `plural` helpers bound to that locale.
 */
export async function getTranslations() {
  const locale = await getLocale();
  const messages = getDictionary(locale);
  return {
    locale,
    messages,
    t: (template: string, params: Record<string, string | number> = {}) =>
      interpolate(template, params),
    plural: (
      forms: PluralForms,
      count: number,
      params: Record<string, string | number> = {}
    ) => plural(locale, count, forms, params),
  };
}

/** Active locale for this request, from the `x-locale` header set by the proxy. */
export async function getLocale(): Promise<Locale> {
  const value = (await headers()).get("x-locale");
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Canonical (locale-stripped) pathname for this request, e.g. `/products/foo`. */
export async function getCanonicalPath(): Promise<string> {
  return (await headers()).get("x-pathname") || "/";
}
