import { LocaleLink } from "@/components/locale-link";
import { BasketIcon } from "@/components/icons";
import { getTranslations } from "@/lib/i18n/server";

// Storefront 404 — rendered inside the site layout, so header/footer stay.
// Covers `notFound()` from product, category, and order-confirmation pages.
export default async function SiteNotFound() {
  const { messages } = await getTranslations();
  const t = messages.errorPages;

  return (
    <div className="mx-auto max-w-6xl px-6 py-24 text-center">
      <BasketIcon className="mx-auto h-16 w-16 text-surface-border" />
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-accent">
        {t.notFoundCode}
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">{t.notFoundTitle}</h1>
      <p className="mt-3 text-muted">{t.notFoundSubtitle}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <LocaleLink
          href="/products"
          className="rounded-full bg-accent px-8 py-3 font-semibold text-accent-foreground transition-transform hover:scale-105"
        >
          {t.browseAllCaps}
        </LocaleLink>
        <LocaleLink
          href="/"
          className="rounded-full border border-surface-border px-8 py-3 font-semibold transition-colors hover:border-foreground"
        >
          {t.home}
        </LocaleLink>
      </div>
    </div>
  );
}
