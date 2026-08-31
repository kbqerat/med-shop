"use client";

import { useEffect } from "react";
import { LocaleLink } from "@/components/locale-link";
import { useMessages } from "@/context/i18n";

export default function SiteError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useMessages().errorPages;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">
        {t.errorKicker}
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">{t.errorTitle}</h1>
      <p className="mt-3 text-muted">{t.errorSubtitle}</p>
      {error.digest && (
        <p className="mt-2 text-xs text-muted">
          {t.reference.replace("{digest}", error.digest)}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-full bg-accent px-8 py-3 font-semibold text-accent-foreground transition-transform hover:scale-105"
        >
          {t.tryAgain}
        </button>
        <LocaleLink
          href="/products"
          className="rounded-full border border-surface-border px-8 py-3 font-semibold transition-colors hover:border-foreground"
        >
          {t.backToShop}
        </LocaleLink>
      </div>
    </div>
  );
}
