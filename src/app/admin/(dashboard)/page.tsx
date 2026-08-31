import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { formatOrderNumber } from "@/lib/order-number";
import {
  BoxIcon,
  TagIcon,
  ReceiptIcon,
  FlameIcon,
  CashIcon,
} from "@/components/icons";
import { LOW_STOCK_THRESHOLD } from "@/lib/stock";

export const dynamic = "force-dynamic";

const CHART_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const chartStart = startOfDay(new Date(now.getTime() - (CHART_DAYS - 1) * DAY_MS));

  const [
    productCount,
    categoryCount,
    orderCount,
    revenueAgg,
    monthAgg,
    lowStockProducts,
    recentOrders,
    windowOrders,
    salesByProduct,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalCents: true } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: monthStart } },
      _sum: { totalCents: true },
      _count: true,
    }),
    prisma.product.findMany({
      where: {
        archived: false,
        variants: { some: { stock: { lte: LOW_STOCK_THRESHOLD } } },
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        variants: { select: { size: true, stock: true } },
      },
    }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.order.findMany({
      where: { createdAt: { gte: chartStart } },
      select: { createdAt: true },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const revenueCents = revenueAgg._sum.totalCents ?? 0;
  const monthRevenueCents = monthAgg._sum.totalCents ?? 0;
  const monthOrders = monthAgg._count;

  // Orders per day for the trend chart.
  const dayBuckets = Array.from({ length: CHART_DAYS }, (_, i) => {
    const date = new Date(chartStart.getTime() + i * DAY_MS);
    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
      count: 0,
    };
  });
  const bucketByKey = new Map(dayBuckets.map((bucket) => [bucket.key, bucket]));
  for (const order of windowOrders) {
    const bucket = bucketByKey.get(startOfDay(order.createdAt).toISOString().slice(0, 10));
    if (bucket) bucket.count += 1;
  }
  const maxCount = Math.max(1, ...dayBuckets.map((bucket) => bucket.count));

  // Top sellers: units from groupBy, revenue summed from their order items.
  const topIds = salesByProduct.map((row) => row.productId);
  const [topProducts, topItems] = await Promise.all([
    topIds.length
      ? prisma.product.findMany({
          where: { id: { in: topIds } },
          select: { id: true, name: true },
        })
      : Promise.resolve([]),
    topIds.length
      ? prisma.orderItem.findMany({
          where: { productId: { in: topIds } },
          select: { productId: true, quantity: true, priceCents: true },
        })
      : Promise.resolve([]),
  ]);
  const nameById = new Map(topProducts.map((p) => [p.id, p.name]));
  const revenueById = new Map<string, number>();
  for (const item of topItems) {
    revenueById.set(
      item.productId,
      (revenueById.get(item.productId) ?? 0) + item.quantity * item.priceCents
    );
  }
  const topSellers = salesByProduct.map((row) => ({
    id: row.productId,
    name: nameById.get(row.productId) ?? "Produit supprimé",
    units: row._sum.quantity ?? 0,
    revenueCents: revenueById.get(row.productId) ?? 0,
  }));

  const stats = [
    {
      label: "Chiffre d’affaires",
      value: formatPrice(revenueCents),
      caption: "toutes commandes confondues",
      icon: CashIcon,
      href: "/admin/orders",
    },
    { label: "Commandes", value: String(orderCount), icon: ReceiptIcon, href: "/admin/orders" },
    { label: "Produits", value: String(productCount), icon: BoxIcon, href: "/admin/products" },
    { label: "Catégories", value: String(categoryCount), icon: TagIcon, href: "/admin/categories" },
  ];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">Aperçu</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight">Tableau de bord</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted">{stat.label}</p>
              <stat.icon className="h-5 w-5 text-accent" />
            </div>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
            {stat.caption && <p className="mt-0.5 text-xs text-muted">{stat.caption}</p>}
          </Link>
        ))}
      </div>

      <p className="mt-4 text-sm text-muted">
        Ce mois-ci :{" "}
        <span className="font-semibold text-foreground">
          {monthOrders} {monthOrders === 1 ? "commande" : "commandes"}
        </span>{" "}
        ·{" "}
        <span className="font-semibold text-foreground">
          {formatPrice(monthRevenueCents)}
        </span>
      </p>

      {lowStockProducts.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <p className="flex items-center gap-2 font-semibold">
            <FlameIcon className="h-4 w-4 flex-shrink-0" />
            {lowStockProducts.length}{" "}
            {lowStockProducts.length === 1
              ? "produit à réapprovisionner"
              : "produits à réapprovisionner"}
          </p>
          <ul className="mt-2 space-y-1">
            {lowStockProducts.map((product) => {
              const multiSize = product.variants.length > 1;
              const detail = product.variants
                .filter((variant) => variant.stock <= LOW_STOCK_THRESHOLD)
                .map(
                  (variant) =>
                    (multiSize ? `${variant.size}: ` : "") +
                    (variant.stock === 0 ? "épuisé" : `${variant.stock} restant`)
                )
                .join(", ");
              return (
                <li
                  key={product.id}
                  className="flex items-center justify-between gap-3"
                >
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="truncate hover:underline"
                  >
                    {product.name}
                  </Link>
                  <span className="flex-shrink-0 font-medium">{detail}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold">Commandes — {CHART_DAYS} derniers jours</h2>
            <span className="text-sm text-muted">{windowOrders.length} au total</span>
          </div>
          <div className="mt-5 flex h-32 items-end gap-1">
            {dayBuckets.map((bucket) => (
              <div
                key={bucket.key}
                className="flex-1 rounded-t bg-accent/80"
                style={{
                  height:
                    bucket.count === 0
                      ? "2px"
                      : `${(bucket.count / maxCount) * 100}%`,
                }}
                title={`${bucket.label} : ${bucket.count} ${
                  bucket.count === 1 ? "commande" : "commandes"
                }`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted">
            <span>{dayBuckets[0].label}</span>
            <span>{dayBuckets[dayBuckets.length - 1].label}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm">
          <h2 className="text-lg font-bold">Meilleures ventes</h2>
          {topSellers.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Aucune vente pour le moment.</p>
          ) : (
            <ol className="mt-4 space-y-3">
              {topSellers.map((product, index) => (
                <li key={product.id} className="flex items-center gap-3 text-sm">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-background text-xs font-bold text-muted">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {product.name}
                  </span>
                  <span className="flex-shrink-0 text-muted">
                    {product.units} vendus
                  </span>
                  <span className="w-20 flex-shrink-0 text-right font-semibold text-accent">
                    {formatPrice(product.revenueCents)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Commandes récentes</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-accent hover:underline">
            Voir tout
          </Link>
        </div>

        <div className="mt-4 divide-y divide-surface-border rounded-2xl border border-surface-border bg-surface shadow-sm">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between gap-4 p-4 text-sm">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted">
                  {formatOrderNumber(order.number)}
                </p>
                <p className="truncate font-semibold">{order.fullName}</p>
                <p className="text-muted">{order.phone}</p>
              </div>
              <span className="font-semibold text-accent">{formatPrice(order.totalCents)}</span>
              <span className="w-24 flex-shrink-0 text-right text-muted">
                {order.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              </span>
            </div>
          ))}

          {recentOrders.length === 0 && (
            <p className="p-8 text-center text-sm text-muted">Aucune commande pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
