"use client";

import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useI18n } from "@/context/i18n";
import { LocaleLink } from "@/components/locale-link";
import { splitLocale } from "@/lib/i18n/config";
import { BasketIcon, PhoneIcon, InstagramIcon, FacebookIcon } from "@/components/icons";
import { LanguageSwitch } from "@/components/language-switch";
import { SITE } from "@/lib/site";

const PHONE_NUMBER = "0600029060";

export function Header() {
  const { itemCount } = useCart();
  const { messages } = useI18n();
  const pathname = usePathname();
  const { path } = splitLocale(pathname ?? "/");
  const shopActive = path.startsWith("/products") || path.startsWith("/category");

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <LocaleLink
          href="/"
          className="group flex items-center text-xl font-bold tracking-tight"
        >
          {messages.brand}
        </LocaleLink>
        <nav className="flex items-center gap-2 sm:gap-4">
          <LocaleLink
            href="/products"
            className={`group relative px-1 py-2 text-base font-medium transition-colors ${
              shopActive ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {messages.nav.shop}
            <span
              className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-accent transition-transform duration-300 group-hover:scale-x-100 ${
                shopActive ? "scale-x-100" : ""
              }`}
            />
          </LocaleLink>

          <div className="hidden h-5 w-px bg-surface-border sm:block" />

          <a
            href={`tel:${PHONE_NUMBER}`}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground sm:flex"
          >
            <PhoneIcon className="h-4 w-4" />
            {messages.nav.phone}
          </a>

          <div className="hidden items-center gap-1 rounded-full bg-surface p-1 sm:flex">
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={messages.footer.instagram}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-background hover:text-foreground"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={SITE.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={messages.footer.facebook}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-background hover:text-foreground"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
          </div>

          <LanguageSwitch />

          <LocaleLink
            href="/cart"
            aria-label={messages.nav.cart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <BasketIcon />
            {itemCount > 0 && (
              <span className="absolute end-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                {itemCount}
              </span>
            )}
          </LocaleLink>
        </nav>
      </div>
    </header>
  );
}
