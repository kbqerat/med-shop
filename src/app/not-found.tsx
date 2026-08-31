import { LocaleLink } from "@/components/locale-link";
import { getTranslations } from "@/lib/i18n/server";

// Global fallback: unmatched URLs across the whole app, plus any `notFound()`
// call without a closer not-found.tsx (e.g. the admin edit pages).
export default async function NotFound() {
  const { messages } = await getTranslations();
  const t = messages.errorPages;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">
        {t.notFoundCode}
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">{t.notFoundTitle}</h1>
      <p className="mt-3 text-muted">{t.notFoundSubtitle}</p>
      <LocaleLink
        href="/"
        className="mt-8 inline-block rounded-full bg-accent px-8 py-3 font-semibold text-accent-foreground transition-transform hover:scale-105"
      >
        {t.home}
      </LocaleLink>
    </div>
  );
}
