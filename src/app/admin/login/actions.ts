"use server";

import { redirect } from "next/navigation";
import { verifyAdminPassword } from "@/lib/admin-password";
import { createAdminSession } from "@/lib/admin-auth";
import {
  clientIp,
  checkRateLimit,
  recordRateHit,
  clearRateLimit,
  describeWait,
} from "@/lib/rate-limit";

export type LoginState = { error: string } | undefined;

const LOGIN_POLICY = {
  max: 5,
  windowMs: 15 * 60 * 1000,
  lockMs: 15 * 60 * 1000,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const key = `login:${await clientIp()}`;

  const gate = await checkRateLimit(key);
  if (!gate.allowed) {
    return {
      error: `Trop de tentatives. Réessayez dans ${describeWait(gate.retryAfterMs)}.`,
    };
  }

  // Fixed cost per attempt so scripted guessing can't run fast.
  await sleep(400);

  const password = String(formData.get("password") || "");
  if (!verifyAdminPassword(password)) {
    await recordRateHit(key, LOGIN_POLICY);
    return { error: "Mot de passe incorrect." };
  }

  await clearRateLimit(key);
  await createAdminSession();
  redirect("/admin");
}
