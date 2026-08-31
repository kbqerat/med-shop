"use client";

import { useCart } from "@/context/cart-context";
import { useI18n } from "@/context/i18n";
import { LocaleLink } from "@/components/locale-link";
import { ProductArt } from "@/components/product-art";
import { BasketIcon, CashIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, hydrated, removeItem, updateQuantity, totalCents } = useCart();
  const { messages, plural } = useI18n();
  const t = messages.cart;

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="h-9 w-28 animate-pulse rounded bg-surface" />
        <div className="mt-8 space-y-4">
          <div className="h-44 animate-pulse rounded-2xl bg-surface" />
          <div className="h-52 animate-pulse rounded-2xl bg-surface" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <BasketIcon className="mx-auto h-16 w-16 text-surface-border" />
        <h1 className="mt-6 text-3xl font-bold">{t.emptyTitle}</h1>
        <p className="mt-2 text-muted">{t.emptySubtitle}</p>
        <LocaleLink
          href="/products"
          className="mt-8 inline-block rounded-full bg-accent px-8 py-3 font-semibold text-accent-foreground transition-transform hover:scale-105"
        >
          {messages.common.shopCaps}
        </LocaleLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold">{t.title}</h1>
      <p className="mt-1 text-sm text-muted">{plural(t.items, items.length)}</p>

      <div className="mt-8 flex flex-col gap-8">
        <div className="divide-y divide-surface-border rounded-2xl border border-surface-border bg-surface">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4 sm:flex-nowrap sm:p-5"
            >
              <ProductArt
                accentFrom={item.accentFrom}
                accentTo={item.accentTo}
                imageUrl={item.imageUrl}
                className="h-20 w-20 flex-shrink-0 rounded-xl"
              />
              <div className="min-w-0 flex-1">
                <LocaleLink
                  href={`/products/${item.slug}`}
                  className="font-bold hover:text-accent"
                >
                  {item.name}
                </LocaleLink>
                <p className="text-sm text-muted">
                  {messages.common.size} {item.size}
                </p>
                <p className="mt-1 text-sm font-semibold text-accent">
                  {formatPrice(item.priceCents)}
                </p>
              </div>
              <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(item.variantId, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  className="h-9 w-9 flex-shrink-0 rounded-full border border-surface-border hover:border-foreground disabled:opacity-40 disabled:hover:border-surface-border"
                >
                  −
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(item.variantId, item.quantity + 1)
                  }
                  disabled={item.quantity >= item.stock}
                  className="h-9 w-9 flex-shrink-0 rounded-full border border-surface-border hover:border-foreground disabled:opacity-40 disabled:hover:border-surface-border"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.variantId)}
                  className="ms-2 flex-shrink-0 text-sm font-medium text-muted hover:text-foreground"
                >
                  {t.remove}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full rounded-2xl border border-surface-border bg-surface p-6">
          <h2 className="text-lg font-bold">{messages.common.summary}</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-muted">
            <span>{messages.common.subtotal}</span>
            <span className="font-semibold text-foreground">
              {formatPrice(totalCents)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-muted">
            <span>{messages.common.delivery}</span>
            <span className="font-semibold text-accent">
              {messages.common.free}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-surface-border pt-4">
            <span className="font-bold">{messages.common.total}</span>
            <span className="text-lg font-semibold text-accent">
              {formatPrice(totalCents)}
            </span>
          </div>

          <LocaleLink
            href="/checkout"
            className="mt-6 block rounded-full bg-accent px-8 py-3 text-center font-semibold text-accent-foreground transition-transform hover:scale-105"
          >
            {messages.common.checkout}
          </LocaleLink>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-background px-4 py-3 text-sm text-muted">
            <CashIcon className="h-5 w-5 flex-shrink-0" />
            {t.codNote}
          </div>
        </div>
      </div>
    </div>
  );
}
