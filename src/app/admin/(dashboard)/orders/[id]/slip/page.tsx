import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderSlip } from "@/components/admin/order-slip";
import { PrintButton } from "@/components/admin/print-button";
import { ChevronLeftIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function OrderSlipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  return (
    <div>
      <div className="slip-no-print flex items-center justify-between gap-4 print:hidden">
        <Link
          href="/admin/orders"
          className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Retour aux commandes
        </Link>
        <PrintButton />
      </div>

      <div className="mx-auto mt-6 max-w-xl">
        <OrderSlip order={order} />
      </div>
    </div>
  );
}
