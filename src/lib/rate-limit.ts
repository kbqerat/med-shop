import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export type RatePolicy = { max: number; windowMs: number; lockMs: number };

export type RateGate = { allowed: true } | { allowed: false; retryAfterMs: number };

/** Best-effort caller IP. Behind a proxy this needs a trustworthy X-Forwarded-For. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || "unknown";
}

export async function checkRateLimit(key: string): Promise<RateGate> {
  const row = await prisma.rateLimit.findUnique({ where: { key } });
  if (!row?.lockedUntil) return { allowed: true };

  const remaining = row.lockedUntil.getTime() - Date.now();
  if (remaining <= 0) return { allowed: true };
  return { allowed: false, retryAfterMs: remaining };
}

/** Count one attempt against the key; locks the key once `policy.max` is reached. */
export async function recordRateHit(key: string, policy: RatePolicy): Promise<void> {
  const now = new Date();
  const row = await prisma.rateLimit.findUnique({ where: { key } });

  if (!row || now.getTime() - row.firstHitAt.getTime() > policy.windowMs) {
    await prisma.rateLimit.upsert({
      where: { key },
      create: { key, hits: 1, firstHitAt: now, lockedUntil: null },
      update: { hits: 1, firstHitAt: now, lockedUntil: null },
    });
    return;
  }

  const hits = row.hits + 1;
  await prisma.rateLimit.update({
    where: { key },
    data: {
      hits,
      lockedUntil:
        hits >= policy.max ? new Date(now.getTime() + policy.lockMs) : null,
    },
  });
}

export async function clearRateLimit(key: string): Promise<void> {
  await prisma.rateLimit.deleteMany({ where: { key } });
}

export function describeWait(ms: number): string {
  const minutes = Math.ceil(ms / 60000);
  if (minutes >= 2) return `${minutes} minutes`;
  if (minutes === 1) return "une minute";
  return `${Math.ceil(ms / 1000)} secondes`;
}
