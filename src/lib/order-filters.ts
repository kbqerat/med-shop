import { Prisma } from "@prisma/client";

/**
 * Where-builder for the admin orders list.
 * `entered`: undefined/"new" → not yet typed into the courier system (default),
 * "typed" → already typed in, "all" → no filter on that.
 */
export function buildOrderWhere({
  q,
  entered,
}: {
  q?: string;
  entered?: string;
}): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = {};

  if (q?.trim()) {
    const term = q.trim();
    const digits = term.replace(/\D/g, "");
    where.OR = [
      { fullName: { contains: term } },
      { phone: { contains: term } },
      ...(digits ? [{ number: Number(digits) }] : []),
    ];
  }

  if (entered === "typed") {
    where.enteredAt = { not: null };
  } else if (entered !== "all") {
    where.enteredAt = null;
  }

  return where;
}
