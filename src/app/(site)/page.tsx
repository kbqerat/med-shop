import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, webSiteSchema } from "@/lib/structured-data";
import { LocaleLink } from "@/components/locale-link";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { CategoryTile } from "@/components/category-tile";
import {
  CashIcon,
  TruckIcon,
  BadgeCheckIcon,
  ArrowUpRightIcon,
  StarIcon,
} from "@/components/icons";
import { Testimonials } from "@/components/testimonials";
import { getCategories } from "@/lib/categories";
import { toProductCardData } from "@/lib/product-card-data";
import { getDictionary, getLocale, getTranslations } from "@/lib/i18n/server";
import heroMain from "@/images/landing/img3.jpeg";
import heroAccent from "@/images/landing/img1.jpeg";
import showroomBanner from "@/images/landing/img2.jpeg";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale()).meta;
  return {
    // Home owns the brand title outright — no "%s | Med Shop" template.
    title: { absolute: t.homeTitle },
    description: t.homeDescription,
  };
}

async function getBestSellers(limit: number): Promise<ProductCardData[]> {
  const sales = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  const ranked = sales.length
    ? await prisma.product.findMany({
        where: {
          id: { in: sales.map((row) => row.productId) },
          archived: false,
        },
        include: { category: true, variants: true },
      })
    : [];
  const rankedById = new Map(ranked.map((product) => [product.id, product]));
  const bestSellers = sales
    .map((row) => rankedById.get(row.productId))
    .filter((product): product is (typeof ranked)[number] => Boolean(product));

  if (bestSellers.length < limit) {
    const fallback = await prisma.product.findMany({
      where: {
        archived: false,
        ...(bestSellers.length
          ? { id: { notIn: bestSellers.map((product) => product.id) } }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit - bestSellers.length,
      include: { category: true, variants: true },
    });
    bestSellers.push(...fallback);
  }

  return bestSellers.map(toProductCardData);
}

export default async function Home() {
  const [{ messages }, categories, newArrivalsRaw, bestSellers] =
    await Promise.all([
      getTranslations(),
      getCategories(),
      prisma.product.findMany({
        where: { archived: false },
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { category: true, variants: true },
      }),
      getBestSellers(4),
    ]);
  const newArrivals = newArrivalsRaw.map(toProductCardData);
  const m = messages.home;
  const [titleBefore, titleAfter] = m.heroTitle.split("{brands}");

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

          <div className="relative grid gap-12 p-8 sm:p-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
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
              <p className="mt-5 max-w-md text-base text-white/70 sm:text-lg">
                {m.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <LocaleLink
                  href="/products"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-semibold text-accent-foreground transition-transform hover:scale-105"
                >
                  {messages.common.shopAllCaps}
                  <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" />
                </LocaleLink>
                <div className="flex items-center gap-1.5 text-sm text-white/70">
                  <span className="flex text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4" />
                    ))}
                  </span>
                  {m.heroRating}
                </div>
              </div>
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
                  <CashIcon className="h-4 w-4 flex-shrink-0" />
                  {m.codBadge}
                </div>
              </div>

              <div className="absolute -bottom-6 -start-6 w-32 -rotate-6 overflow-hidden rounded-2xl border-4 border-background shadow-2xl transition-transform hover:rotate-0 sm:-bottom-8 sm:-start-8 sm:w-40">
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
            <CashIcon className="h-5 w-5 flex-shrink-0 text-accent" />
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

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {m.browseKicker}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          {m.browseTitle}
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
          {categories.map((category) => (
            <CategoryTile key={category.slug} {...category} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="relative h-56 overflow-hidden rounded-3xl sm:h-72">
          <Image
            src={showroomBanner}
            alt={m.showroomAlt}
            fill
            sizes="(min-width: 1024px) 1152px, 100vw"
            className="object-cover"
            style={{ objectPosition: "50% 78%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent rtl:bg-gradient-to-l" />
          <div className="relative z-10 flex h-full flex-col justify-center p-8 sm:p-14">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
              {m.showroomKicker}
            </p>
            <h2 className="mt-3 max-w-sm text-2xl font-bold text-white sm:text-3xl">
              {m.showroomTitle}
            </h2>
          </div>
        </div>
      </section>

      <section className="border-y border-surface-border bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                {m.bestSellersKicker}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                {m.bestSellersTitle}
              </h2>
            </div>
            <LocaleLink
              href="/products"
              className="text-sm font-medium text-muted hover:text-foreground"
            >
              {messages.common.viewAll}
            </LocaleLink>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                badge={m.bestsellerBadge}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {m.newArrivalsKicker}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              {m.newArrivalsTitle}
            </h2>
          </div>
          <LocaleLink
            href="/products"
            className="text-sm font-medium text-muted hover:text-foreground"
          >
            {messages.common.viewAll}
          </LocaleLink>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <Testimonials />
    </div>
  );
}
