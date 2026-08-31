import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LocaleLink } from "@/components/locale-link";
import { ProductArt } from "@/components/product-art";
import { formatPrice } from "@/lib/format";
import { formatOrderNumber } from "@/lib/order-number";
import { verifyOrderToken } from "@/lib/order-token";
import { getDictionary, getLocale, getTranslations } from "@/lib/i18n/server";
import {
  CashIcon,
  TruckIcon,
  PinIcon,
  PhoneIcon,
  MailIcon,
  WhatsAppIcon,
} from "@/components/icons";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: getDictionary(await getLocale()).meta.orderConfirmedTitle,
    robots: { index: false, follow: false },
  };
}

const PHONE_NUMBER = "0600029060";
const PHONE_DISPLAY = "06 00 02 90 60";
const EMAIL = "bekkaoui.tarek2001@gmail.com";
const WHATSAPP_NUMBER = "212600029060";

// Arabic version shows the order date in French, per the owner's preference.
const DATE_LOCALE = { ar: "fr-MA", fr: "fr-MA", en: "en-GB" } as const;

export default async function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { orderId } = await params;
  const { t: token } = await searchParams;

  if (!verifyOrderToken(orderId, token)) notFound();

  const [{ locale, messages, t: tr }, order] = await Promise.all([
    getTranslations(),
    prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    }),
  ]);

  if (!order) notFound();
  const s = messages.success;

  const orderDate = order.createdAt.toLocaleDateString(DATE_LOCALE[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const orderNumber = formatOrderNumber(order.number);
  const whatsappMessage = tr(s.whatsappMessage, { number: orderNumber });
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="text-sm font-semibold text-accent">{s.kicker}</p>
      <h1 className="mt-3 text-4xl font-bold">
        {tr(s.thanks, { name: order.fullName.split(" ")[0] })}
      </h1>
      <p className="mt-4 text-muted">
        {tr(s.confirmedLine, { number: orderNumber, phone: order.phone })}
      </p>

      <div className="mt-10 grid gap-4 text-start sm:grid-cols-2">
        <div className="rounded-2xl border border-surface-border bg-surface p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
            {s.orderDetailsHeading}
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="flex-shrink-0 text-muted">{s.orderNumber}</dt>
              <dd className="truncate font-medium" dir="ltr">
                {orderNumber}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{s.date}</dt>
              <dd className="font-medium">{orderDate}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{s.payment}</dt>
              <dd className="font-medium">{s.cod}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-surface-border bg-surface p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
            {s.deliveryToHeading}
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{s.name}</dt>
              <dd className="font-medium">{order.fullName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{s.phone}</dt>
              <dd className="font-medium" dir="ltr">
                {order.phone}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{s.address}</dt>
              <dd className="text-end font-medium">
                {order.address}, {order.city} {order.postalCode}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <h2 className="mt-10 text-start text-xs font-semibold uppercase tracking-wide text-muted">
        {s.itemsHeading}
      </h2>
      <div className="mt-3 divide-y divide-surface-border border-y border-surface-border text-start">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-3">
            <ProductArt
              accentFrom={item.product.accentFrom}
              accentTo={item.product.accentTo}
              imageUrl={item.product.imageUrl}
              className="h-12 w-12 flex-shrink-0 rounded-lg"
            />
            <div className="flex-1 text-sm">
              <p className="font-medium">{item.product.name}</p>
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
      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold">{messages.common.total}</span>
        <span className="text-lg font-semibold text-accent">
          {formatPrice(order.totalCents)}
        </span>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-xl bg-surface px-4 py-3 text-start text-sm text-muted">
        <TruckIcon className="h-5 w-5 flex-shrink-0" />
        {s.deliveryLine}
      </div>

      <div className="mt-10 rounded-2xl border border-surface-border bg-surface p-6 text-start">
        <h2 className="text-lg font-bold">{s.questionsTitle}</h2>
        <p className="mt-1 text-sm text-muted">{s.questionsSubtitle}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {s.chatWhatsApp}
          </a>
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="flex items-center gap-2 rounded-full border border-surface-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-foreground"
          >
            <PhoneIcon className="h-4 w-4 text-accent" />
            <span dir="ltr">{PHONE_DISPLAY}</span>
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-2 rounded-full border border-surface-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-foreground"
          >
            <MailIcon className="h-4 w-4 text-accent" />
            {EMAIL}
          </a>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted">
          <PinIcon className="h-3.5 w-3.5 flex-shrink-0 text-accent" />
          {s.location}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
        <CashIcon className="h-4 w-4 flex-shrink-0" />
        {s.payOnArrival}
      </div>

      <LocaleLink
        href="/products"
        className="mt-10 inline-block rounded-full bg-accent px-8 py-3 font-semibold text-accent-foreground transition-transform hover:scale-105"
      >
        {messages.common.keepShopping}
      </LocaleLink>
    </div>
  );
}
