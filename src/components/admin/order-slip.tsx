import type { Order, OrderItem, Product } from "@prisma/client";
import { formatPrice } from "@/lib/format";
import { formatOrderNumber } from "@/lib/order-number";

type SlipOrder = Order & {
  items: (OrderItem & { product: Product })[];
};

export function OrderSlip({ order }: { order: SlipOrder }) {
  const orderNumber = formatOrderNumber(order.number);
  const orderDate = order.createdAt.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="slip-print border border-neutral-200 bg-white p-8 text-black">
      <div className="flex items-start justify-between">
        <p className="text-xl font-bold tracking-tight text-black">
          Med Shop
        </p>
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Bon de livraison
        </p>
      </div>

      <div className="mt-6 flex items-baseline justify-between border-b border-neutral-300 pb-3">
        <p className="text-lg font-bold">{orderNumber}</p>
        <p className="text-sm text-neutral-600">{orderDate}</p>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Livrer à
        </p>
        <p className="mt-2 text-base font-semibold">{order.fullName}</p>
        <p className="text-base">{order.phone}</p>
        <p className="mt-1 text-sm text-neutral-700">
          {order.address}
          <br />
          {order.city} {order.postalCode}
          <br />
          {order.country}
        </p>
      </div>

      <div className="mt-5 border-t border-neutral-300 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Articles
        </p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span>
                {item.product.name}
                <span className="text-neutral-500"> — {item.size}</span>
              </span>
              <span className="flex-shrink-0 font-medium">× {item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex items-center justify-between border-2 border-black px-4 py-3">
        <span className="text-sm font-bold uppercase tracking-wide">
          Montant à encaisser (paiement à la livraison)
        </span>
        <span className="text-xl font-bold">{formatPrice(order.totalCents)}</span>
      </div>

      <p className="mt-4 text-xs text-neutral-500">
        Mode de paiement : paiement à la livraison. Encaissez le montant ci-dessus
        avant de remettre le colis.
      </p>
    </div>
  );
}
