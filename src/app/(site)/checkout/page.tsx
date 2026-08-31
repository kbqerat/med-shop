"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useI18n } from "@/context/i18n";
import { ProductArt } from "@/components/product-art";
import { CashIcon, TruckIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import { MOROCCAN_CITIES } from "@/lib/moroccan-cities";
import { createOrder } from "./actions";

type DeliveryDetails = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  company: string;
};

export default function CheckoutPage() {
  const { items, hydrated, totalCents, clearCart } = useCart();
  const { messages, path } = useI18n();
  const t = messages.checkout;
  const router = useRouter();
  const [step, setStep] = useState<"details" | "review">("details");
  const [details, setDetails] = useState<DeliveryDetails | null>(null);
  const [phoneDigits, setPhoneDigits] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDetailsSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setDetails({
      fullName: String(form.get("fullName")),
      phone: `+212${phoneDigits}`,
      address: String(form.get("address")),
      city: String(form.get("city")),
      company: String(form.get("company") || ""),
    });
    setStep("review");
  }

  async function handleConfirm() {
    if (!details) return;
    setError(null);
    setSubmitting(true);
    try {
      const result = await createOrder({
        phone: details.phone,
        fullName: details.fullName,
        address: details.address,
        city: details.city,
        country: "Morocco",
        company: details.company,
        items,
      });
      if (!result.ok) {
        setError(result.error);
        setSubmitting(false);
        return;
      }
      clearCart();
      router.push(path(`/checkout/success/${result.orderId}?t=${result.token}`));
    } catch {
      setError(t.genericError);
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="h-9 w-40 animate-pulse rounded bg-surface" />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-2xl bg-surface" />
          <div className="h-72 animate-pulse rounded-2xl bg-surface" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">{messages.cart.emptyTitle}</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold">{t.title}</h1>
      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
        <CashIcon />
        {t.codPill}
      </div>

      <div className="mt-8 flex items-center gap-3 text-sm font-medium">
        <div
          className={`flex items-center gap-2 ${
            step === "details" ? "text-foreground" : "text-muted"
          }`}
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              step === "details"
                ? "bg-accent text-accent-foreground"
                : "bg-surface-border text-foreground"
            }`}
          >
            1
          </span>
          {t.stepDetails}
        </div>
        <div className="h-px w-8 bg-surface-border" />
        <div
          className={`flex items-center gap-2 ${
            step === "review" ? "text-foreground" : "text-muted"
          }`}
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              step === "review"
                ? "bg-accent text-accent-foreground"
                : "bg-surface-border text-muted"
            }`}
          >
            2
          </span>
          {t.stepConfirm}
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {step === "details" ? (
          <div className="rounded-2xl border border-surface-border bg-surface p-6 sm:p-8">
            <h2 className="text-lg font-bold">{t.detailsHeading}</h2>
            <p className="mt-1 text-sm text-muted">{t.guestNote}</p>

            <form onSubmit={handleDetailsSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                defaultValue={details?.company}
              />
              <input
                name="fullName"
                type="text"
                required
                defaultValue={details?.fullName}
                placeholder={t.fullName}
                className="w-full rounded-lg border border-surface-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
              />
              <div className="flex items-stretch overflow-hidden rounded-lg border border-surface-border bg-background focus-within:border-accent">
                <span
                  dir="ltr"
                  className="flex items-center gap-1.5 border-e border-surface-border bg-surface px-3 text-sm font-medium text-muted"
                >
                  <span aria-hidden="true">🇲🇦</span>
                  +212
                </span>
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  required
                  dir="ltr"
                  pattern="[0-9]{9}"
                  title={t.phoneHint}
                  maxLength={9}
                  value={phoneDigits}
                  onChange={(e) =>
                    setPhoneDigits(
                      e.target.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 9)
                    )
                  }
                  placeholder={t.phonePlaceholder}
                  className="w-full bg-transparent px-4 py-3 text-sm outline-none"
                />
              </div>
              <input
                name="address"
                type="text"
                required
                defaultValue={details?.address}
                placeholder={t.address}
                className="w-full rounded-lg border border-surface-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
              />
              <div>
                <input
                  name="city"
                  type="text"
                  required
                  list="moroccan-cities"
                  autoComplete="off"
                  defaultValue={details?.city}
                  placeholder={t.city}
                  className="w-full rounded-lg border border-surface-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
                />
                <datalist id="moroccan-cities">
                  {MOROCCAN_CITIES.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-accent px-8 py-3 font-semibold text-accent-foreground transition-transform hover:scale-105"
              >
                {t.reviewCta}
              </button>
            </form>
          </div>
        ) : (
          <div className="rounded-2xl border border-surface-border bg-surface p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">{t.confirmHeading}</h2>
                <p className="mt-1 text-sm text-muted">{t.confirmNote}</p>
              </div>
              <button
                type="button"
                onClick={() => setStep("details")}
                className="flex-shrink-0 text-sm font-medium text-accent hover:underline"
              >
                {messages.common.edit}
              </button>
            </div>

            {details && (
              <dl className="mt-6 space-y-3 rounded-xl bg-background p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">{t.name}</dt>
                  <dd className="text-end font-medium">{details.fullName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">{t.phone}</dt>
                  <dd className="text-end font-medium" dir="ltr">
                    {details.phone}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">{t.address}</dt>
                  <dd className="text-end font-medium">
                    {details.address}, {details.city}
                  </dd>
                </div>
              </dl>
            )}

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting}
              className="mt-6 w-full rounded-full bg-accent px-8 py-3 font-semibold text-accent-foreground transition-transform hover:scale-105 disabled:opacity-50"
            >
              {submitting ? t.placing : t.confirmCta}
            </button>
          </div>
        )}

        <div className="h-fit rounded-2xl border border-surface-border bg-surface p-6 sm:sticky sm:top-24 sm:p-8">
          <h2 className="text-lg font-bold">{t.orderSummary}</h2>
          <div className="mt-4 divide-y divide-surface-border">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex items-center gap-3 py-3"
              >
                <ProductArt
                  accentFrom={item.accentFrom}
                  accentTo={item.accentTo}
                  imageUrl={item.imageUrl}
                  className="h-12 w-12 flex-shrink-0 rounded-lg"
                />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted">
                    {item.size} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-semibold text-accent">
                  {formatPrice(item.priceCents * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-surface-border pt-4">
            <span className="font-bold">{messages.common.total}</span>
            <span className="text-lg font-semibold text-accent">
              {formatPrice(totalCents)}
            </span>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-xl bg-background px-4 py-3 text-sm text-muted">
            <TruckIcon className="h-5 w-5 flex-shrink-0" />
            {t.deliveryNote}
          </div>
        </div>
      </div>
    </div>
  );
}
