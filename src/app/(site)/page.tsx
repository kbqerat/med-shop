import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, webSiteSchema } from "@/lib/structured-data";
import { ProductCard } from "@/components/product-card";
import {
  TruckIcon,
  BadgeCheckIcon,
  FlameIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { Testimonials } from "@/components/testimonials";
import { toProductCardData } from "@/lib/product-card-data";
import { getDictionary, getLocale, getTranslations } from "@/lib/i18n/server";
import heroMain from "@/images/landing/img3.jpeg";
import heroAccent from "@/images/landing/img1.jpeg";

export const dynamic = "force-dynamic";

/** Owner's order line — WhatsApp uses the international form, the label stays local. */
const ORDER_PHONE_INTL = "212600029060";
const ORDER_PHONE_DISPLAY = "0600029060";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale()).meta;
  return {
    // Home owns the brand title outright — no "%s | Med Shop" template.
    title: { absolute: t.homeTitle },
    description: t.homeDescription,
  };
}

export default async function Home() {
  const [{ messages }, categoryGroups] = await Promise.all([
    getTranslations(),
    prisma.category.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        products: {
          where: { archived: false },
          orderBy: { createdAt: "desc" },
          include: { category: true, variants: true },
        },
      },
    }),
  ]);
  const populatedGroups = categoryGroups.filter(
    (group) => group.products.length > 0
  );
  const m = messages.home;
  const [titleBefore, titleAfter] = m.heroTitle.split("{brand}");

  return (
    <div>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={webSiteSchema()} />

      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -end-24 -top-24 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
            <div className="absolute -bottom-32 -start-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="relative grid gap-12 p-6 sm:p-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/80 ring-1 ring-white/15">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {m.heroBadge}
              </p>
              <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {titleBefore}
                <span className="text-accent">{m.heroTitleBrands}</span>
                {titleAfter}
              </h1>
              <p className="mt-4 max-w-md text-base text-white/70 sm:text-lg">
                {m.heroSubtitle}
              </p>

              <div className="mt-7 max-w-md rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10 backdrop-blur-sm sm:p-5">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
                  <FlameIcon className="h-4 w-4 flex-shrink-0 text-accent" />
                  {m.offersKicker}
                </p>
                <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
                  {m.offers.map((offer, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2.5 rounded-xl bg-white/5 px-3 py-2.5 text-white sm:gap-3 sm:px-4 sm:py-3"
                    >
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold sm:h-7 sm:w-7 sm:text-sm">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium">{offer.label}</span>
                      <span className="h-px flex-1 bg-white/15" />
                      <span className="whitespace-nowrap text-sm font-bold sm:text-base">
                        {offer.price}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 flex items-center gap-2 text-sm font-medium text-white/80 sm:mt-4">
                  <TruckIcon className="h-4 w-4 flex-shrink-0 text-accent" />
                  <span>{m.freeDeliveryBadge} 🇲🇦</span>
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
                <a
                  href={`https://wa.me/${ORDER_PHONE_INTL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-accent-foreground transition-transform hover:scale-105 sm:w-auto"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  {messages.common.orderNow}
                </a>
                <a
                  href={`tel:+${ORDER_PHONE_INTL}`}
                  dir="ltr"
                  className="inline-flex items-center gap-2 self-start text-sm font-semibold text-white hover:text-accent"
                >
                  <PhoneIcon className="h-4 w-4 flex-shrink-0 text-accent" />
                  {ORDER_PHONE_DISPLAY}
                </a>
              </div>
              <p className="mt-3 text-sm text-white/60">{m.orderNote}</p>
            </div>

            <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
                <Image
                  src={heroMain}
                  alt={m.heroMainAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 88%" }}
                />
                <div className="absolute start-3 top-3 flex items-center gap-2 rounded-full bg-black/55 px-3.5 py-2 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur-sm sm:start-4 sm:top-4">
                  <TruckIcon className="h-4 w-4 flex-shrink-0" />
                  {m.codBadge}
                </div>
              </div>

              <div className="absolute -bottom-4 -start-4 w-20 -rotate-6 overflow-hidden rounded-xl border-[3px] border-background shadow-2xl transition-transform hover:rotate-0 sm:-bottom-8 sm:-start-8 sm:w-40 sm:rounded-2xl sm:border-4">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={heroAccent}
                    alt={m.heroAccentAlt}
                    fill
                    sizes="160px"
                    className="object-cover"
                    style={{ objectPosition: "50% 55%" }}
                  />
                </div>
              </div>

              <div className="absolute -end-3 -top-3 hidden items-center gap-2.5 rounded-2xl bg-background px-4 py-3 shadow-2xl sm:flex sm:-end-6 sm:-top-6">
                <BadgeCheckIcon className="h-6 w-6 flex-shrink-0 text-accent" />
                <div className="text-xs leading-tight">
                  <p className="font-semibold text-foreground">
                    {m.authenticTitle}
                  </p>
                  <p className="text-muted">{m.authenticSubtitle}</p>
                </div>
              </div>

              <div className="absolute -bottom-3 -end-3 hidden items-center gap-2.5 rounded-2xl bg-accent px-4 py-3 text-accent-foreground shadow-2xl ring-1 ring-black/5 sm:-bottom-5 sm:-end-5 sm:flex">
                <TruckIcon className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-bold leading-tight">
                  {m.freeDeliveryBadge}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-surface-border bg-surface p-5 text-sm sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <TruckIcon className="h-5 w-5 flex-shrink-0 text-accent" />
            {m.trustCod}
          </div>
          <div className="flex items-center gap-3 sm:border-x sm:border-surface-border sm:px-4">
            <TruckIcon className="h-5 w-5 flex-shrink-0 text-accent" />
            {m.trustDelivery}
          </div>
          <div className="flex items-center gap-3">
            <BadgeCheckIcon className="h-5 w-5 flex-shrink-0 text-accent" />
            {m.trustAuthentic}
          </div>
        </div>
      </section>

      {populatedGroups.map((group, index) => (
        <section
          key={group.id}
          className={
            index % 2 === 0
              ? "py-20"
              : "border-y border-surface-border bg-surface py-20"
          }
        >
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-6 text-3xl font-bold tracking-tight">
              {group.name}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {group.products.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={toProductCardData(product)}
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      <Testimonials />
    </div>
  );
}
