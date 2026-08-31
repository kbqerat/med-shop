import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { formatOrderNumber } from "@/lib/order-number";
import { buildOrderWhere } from "@/lib/order-filters";
import { toggleOrderEntered } from "./actions";
import { AdminListFilters } from "@/components/admin/list-filters";
import { SlipButton } from "@/components/admin/slip-button";
import { Pagination } from "@/components/pagination";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 6;

const ENTERED_OPTIONS = [
  { value: "typed", label: "Saisies" },
  { value: "all", label: "Toutes les commandes" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; entered?: string; page?: string }>;
}) {
  const { q, entered, page: pageParam } = await searchParams;

  const where = buildOrderWhere({ q, entered });

  const totalCount = await prisma.order.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const plural = totalCount === 1 ? "" : "s";
  const scope =
    entered === "typed"
      ? ` saisie${plural}`
      : entered === "all"
        ? ""
        : ` nouvelle${plural}`;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">Traitement</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight">Commandes</h1>
      <p className="mt-1 text-sm text-muted">
        {totalCount} commande{plural}
        {scope}
        {q?.trim() ? ` correspondant${plural} à la recherche` : ""}
      </p>

      <AdminListFilters
        searchPlaceholder="Rechercher par nom, téléphone ou numéro KSK"
        values={{ q, entered }}
        selects={[
          {
            name: "entered",
            label: "Afficher",
            allLabel: "Nouvelles uniquement",
            options: ENTERED_OPTIONS,
          },
        ]}
      />

      <div className="mt-6 divide-y divide-surface-border rounded-2xl border border-surface-border bg-surface shadow-sm">
        {orders.map((order) => {
          const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
          return (
            <div
              key={order.id}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 p-4 text-sm transition-colors hover:bg-background"
            >
              <div className="min-w-[10rem] flex-1">
                <p className="text-xs font-medium text-muted">
                  {formatOrderNumber(order.number)}
                </p>
                <p className="font-semibold">{order.fullName}</p>
                <p className="text-muted">{order.phone}</p>
              </div>
              <div className="min-w-[11rem] flex-1 text-muted">
                {order.address}, {order.city}
              </div>
              <div className="w-16 flex-shrink-0 text-muted">
                {itemCount} {itemCount === 1 ? "article" : "articles"}
              </div>
              <div className="w-20 flex-shrink-0 font-semibold text-accent">
                {formatPrice(order.totalCents)}
              </div>
              <div className="w-24 flex-shrink-0 text-right text-muted">
                {order.createdAt.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <SlipButton order={order} />
              <form action={toggleOrderEntered} className="flex-shrink-0">
                <input type="hidden" name="id" value={order.id} />
                <button
                  type="submit"
                  className={
                    order.enteredAt
                      ? "rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
                      : "rounded-full border border-surface-border px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-foreground"
                  }
                >
                  {order.enteredAt ? "Saisie ✓" : "Marquer saisie"}
                </button>
              </form>
            </div>
          );
        })}

        {orders.length === 0 && (
          <p className="p-8 text-center text-sm text-muted">
            {q?.trim()
              ? "Aucune commande ne correspond à votre recherche."
              : entered === "typed"
                ? "Aucune commande saisie pour le moment."
                : entered === "all"
                  ? "Aucune commande pour le moment."
                  : "Aucune nouvelle commande — tout est à jour."}
          </p>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/admin/orders"
        currentParams={{ q, entered }}
      />
    </div>
  );
}
