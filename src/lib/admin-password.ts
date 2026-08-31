import { timingSafeEqual } from "crypto";

/**
 * Constant-time comparison of the submitted password against ADMIN_PASSWORD.
 * Kept out of admin-session.ts so the Edge middleware bundle never pulls in
 * node:crypto.
 */
export function verifyAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("ADMIN_PASSWORD environment variable is not set");
  }

  const a = Buffer.from(input, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
