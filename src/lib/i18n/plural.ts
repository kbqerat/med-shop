import type { Locale } from "@/lib/i18n/config";

/** A message that varies by count. `other` is required; the rest are CLDR categories. */
export type PluralForms = {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
};

const rulesCache = new Map<Locale, Intl.PluralRules>();

function rulesFor(locale: Locale): Intl.PluralRules {
  let rules = rulesCache.get(locale);
  if (!rules) {
    rules = new Intl.PluralRules(locale);
    rulesCache.set(locale, rules);
  }
  return rules;
}

/**
 * Pick the right plural form for `count` in `locale` (full CLDR categories —
 * matters for Arabic) and interpolate `{count}` plus any extra `params`.
 */
export function plural(
  locale: Locale,
  count: number,
  forms: PluralForms,
  params: Record<string, string | number> = {}
): string {
  const category = rulesFor(locale).select(count);
  const template = forms[category] ?? forms.other;
  return interpolate(template, { count, ...params });
}

/** Replace `{key}` placeholders. Unknown keys are left untouched. */
export function interpolate(
  template: string,
  params: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match
  );
}
