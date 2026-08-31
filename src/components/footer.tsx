import { getCategories } from "@/lib/categories";
import { getTranslations } from "@/lib/i18n/server";
import { LocaleLink } from "@/components/locale-link";
import { SITE } from "@/lib/site";
import {
  PhoneIcon,
  MailIcon,
  PinIcon,
  InstagramIcon,
  FacebookIcon,
  CashIcon,
  TruckIcon,
} from "@/components/icons";

const PHONE_NUMBER = "0600029060";
const PHONE_DISPLAY = "06 00 02 90 60";
const EMAIL = "bekkaoui.tarek2001@gmail.com";

export async function Footer() {
  const [categories, { messages, t: tr }] = await Promise.all([
    getCategories(),
    getTranslations(),
  ]);
  const t = messages.footer;

  return (
    <footer className="border-t border-surface-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <LocaleLink href="/" className="text-xl font-bold tracking-tight">
              {messages.brand}
            </LocaleLink>
            <p className="mt-3 max-w-xs text-sm text-muted">{t.tagline}</p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.instagram}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-muted transition-colors hover:border-foreground hover:text-foreground"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={SITE.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.facebook}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-muted transition-colors hover:border-foreground hover:text-foreground"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              {t.shopHeading}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>
                <LocaleLink
                  href="/products"
                  className="transition-colors hover:text-foreground"
                >
                  {t.allCaps}
                </LocaleLink>
              </li>
              {categories.map((category) => (
                <li key={category.slug}>
                  <LocaleLink
                    href={`/category/${category.slug}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {category.name}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              {t.contactHeading}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-foreground"
                >
                  <PhoneIcon className="h-4 w-4 flex-shrink-0 text-accent" />
                  <span dir="ltr">{PHONE_DISPLAY}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-2.5 break-all transition-colors hover:text-foreground"
                >
                  <MailIcon className="h-4 w-4 flex-shrink-0 text-accent" />
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <PinIcon className="h-4 w-4 flex-shrink-0 text-accent" />
                {t.location}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              {t.whyHeading}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex items-center gap-2.5">
                <CashIcon className="h-4 w-4 flex-shrink-0 text-accent" />
                {t.cod}
              </li>
              <li className="flex items-center gap-2.5">
                <TruckIcon className="h-4 w-4 flex-shrink-0 text-accent" />
                {t.deliveryMorocco}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-surface-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{tr(t.rights, { year: new Date().getFullYear() })}</p>
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <MailIcon className="h-4 w-4 flex-shrink-0 text-accent" />
            {t.contactDeveloper}
          </a>
        </div>
      </div>
    </footer>
  );
}
