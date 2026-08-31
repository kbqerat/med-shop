"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

/** Flip an order between "new" and "typed into the courier system". */
export async function toggleOrderEntered(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const order = await prisma.order.findUnique({
    where: { id },
    select: { enteredAt: true },
  });
  if (!order) return;

  await prisma.order.update({
    where: { id },
    data: { enteredAt: order.enteredAt ? null : new Date() },
  });

  revalidatePath("/admin/orders");
}
