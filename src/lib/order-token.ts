import { createHmac, timingSafeEqual } from "crypto";

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) {
    throw new Error("ADMIN_SESSION_SECRET environment variable is not set");
  }
  return value;
}

/** Short HMAC that gates the customer-facing order confirmation page. */
export function signOrderId(orderId: string): string {
  return createHmac("sha256", secret()).update(orderId).digest("hex").slice(0, 32);
}

export function verifyOrderToken(orderId: string, token: string | undefined): boolean {
  if (!token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(signOrderId(orderId));
  return a.length === b.length && timingSafeEqual(a, b);
}
