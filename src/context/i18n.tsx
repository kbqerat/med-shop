"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import {
  LOCALE_COOKIE,
  localePath,
  splitLocale,
  type Locale,
} from "@/lib/i18n/config";
import {
  interpolate,
  plural as pluralize,
  type PluralForms,
} from "@/lib/i18n/plural";
import type { Messages } from "@/messages/en";

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
  /** Interpolate `{key}` placeholders in a message string. */
  t: (template: string, params?: Record<string, string | number>) => string;
  /** Pick the CLDR plural form for `count` and interpolate it. */
  plural: (
    forms: PluralForms,
    count: number,
    params?: Record<string, string | number>
  ) => string;
  /** Prefix an internal path for the current locale. */
  path: (path: string) => string;
  /** Switch language: set the cookie and hard-navigate so `<html dir>` updates. */
  switchLocale: (next: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const t = useCallback(
    (template: string, params: Record<string, string | number> = {}) =>
      interpolate(template, params),
    []
  );

  const plural = useCallback(
    (
      forms: PluralForms,
      count: number,
      params: Record<string, string | number> = {}
    ) => pluralize(locale, count, forms, params),
    [locale]
  );

  const path = useCallback((p: string) => localePath(p, locale), [locale]);

  const switchLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
      const { path: bare } = splitLocale(window.location.pathname);
      window.location.assign(localePath(bare, next) + window.location.search);
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, messages, t, plural, path, switchLocale }),
    [locale, messages, t, plural, path, switchLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}

export function useMessages(): Messages {
  return useI18n().messages;
}
