"use server";

import { after } from "next/server";

import { prisma } from "@/lib/prisma";
import type { CartItem } from "@/lib/types";
import { ORDER_COUNTER_NAME, ORDER_NUMBER_START } from "@/lib/order-number";
import { orderTotalCents } from "@/lib/cart-total";
import { signOrderId } from "@/lib/order-token";
import { notifyNewOrder } from "@/lib/notify-order";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { interpolate, plural } from "@/lib/i18n/plural";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/messages/en";
import { clientIp, checkRateLimit, recordRateHit } from "@/lib/rate-limit";

export type CheckoutInput = {
  phone: string;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  items: CartItem[];
  /** Honeypot — real customers never fill this. */
  company?: string;
};

export type CheckoutResult =
  | { ok: true; orderId: string; token: string }
  | { ok: false; error: string };

class OrderError extends Error {}

const ORDER_POLICY = {
  max: 6,
  windowMs: 15 * 60 * 1000,
  lockMs: 15 * 60 * 1000,
};

const MAX_LINE_ITEMS = 50;
const MAX_QUANTITY = 99;

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function validateDetails(
  input: CheckoutInput,
  e: Messages["checkoutErrors"]
): string | null {
  const fullName = clean(input.fullName);
  const phone = clean(input.phone);
  const address = clean(input.address);
  const city = clean(input.city);
  const postalCode = clean(input.postalCode);
  const country = clean(input.country);

  if (fullName.length < 2 || fullName.length > 120) return e.invalidName;
  if (!/^\+?[0-9][0-9\s-]{5,19}$/.test(phone)) return e.invalidPhone;
  if (address.length < 3 || address.length > 300) return e.invalidAddress;
  if (city.length < 2 || city.length > 80) return e.invalidCity;
  if (postalCode.length > 20) return e.invalidPostalCode;
  if (country.length < 2 || country.length > 60) return e.invalidCountry;
  return null;
}

/** Localised "wait N minutes / seconds" phrase for the rate-limit message. */
function describeWait(ms: number, locale: Locale, w: Messages["waitUnits"]): string {
  const minutes = Math.ceil(ms / 60000);
  if (minutes >= 1) return plural(locale, minutes, w.minutes);
  return plural(locale, Math.ceil(ms / 1000), w.seconds);
}

export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const e = dict.checkoutErrors;

  // Silently accept-then-drop obvious bots.
  if (clean(input.company)) {
    return { ok: false, error: e.generic };
  }

  if (input.items.length === 0) {
    return { ok: false, error: e.cartEmpty };
  }
  if (input.items.length > MAX_LINE_ITEMS) {
    return { ok: false, error: e.tooManyItems };
  }

  const detailError = validateDetails(input, e);
  if (detailError) {
    return { ok: false, error: detailError };
  }

  const key = `order:${await clientIp()}`;
  const gate = await checkRateLimit(key);
  if (!gate.allowed) {
    return {
      ok: false,
      error: interpolate(e.rateLimited, {
        wait: describeWait(gate.retryAfterMs, locale, dict.waitUnits),
      }),
    };
  }

  // Collapse duplicate lines for the same variant so stock is checked once.
  const quantities = new Map<string, number>();
  for (const item of input.items) {
    quantities.set(
      item.variantId,
      (quantities.get(item.variantId) ?? 0) + item.quantity
    );
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const lineItems: {
        variantId: string;
        productId: string;
        size: string;
        quantity: number;
        priceCents: number;
      }[] = [];

      for (const [variantId, quantity] of quantities) {
        if (!Number.isInteger(quantity) || quantity <= 0 || quantity > MAX_QUANTITY) {
          throw new OrderError(e.invalidQuantity);
        }

        const variant = await tx.productVariant.findUnique({
          where: { id: variantId },
          include: { product: true },
        });
        if (!variant || variant.product.archived) {
          throw new OrderError(e.itemUnavailable);
        }

        // Atomic guard: only decrements if enough stock is still there.
        const decremented = await tx.productVariant.updateMany({
          where: { id: variantId, stock: { gte: quantity } },
          data: { stock: { decrement: quantity } },
        });
        if (decremented.count === 0) {
          throw new OrderError(
            interpolate(e.notEnoughStock, {
              product: variant.product.name,
              size: variant.size,
            })
          );
        }

        lineItems.push({
          variantId,
          productId: variant.productId,
          size: variant.size,
          quantity,
          priceCents: variant.product.priceCents,
        });
      }

      const totalCents = orderTotalCents(lineItems);

      const counter = await tx.counter.upsert({
        where: { name: ORDER_COUNTER_NAME },
        create: { name: ORDER_COUNTER_NAME, value: ORDER_NUMBER_START },
        update: { value: { increment: 1 } },
      });

      return tx.order.create({
        data: {
          number: counter.value,
          phone: clean(input.phone),
          fullName: clean(input.fullName),
          address: clean(input.address),
          city: clean(input.city),
          postalCode: clean(input.postalCode),
          country: clean(input.country),
          totalCents,
          items: { create: lineItems },
        },
      });
    });

    await recordRateHit(key, ORDER_POLICY);

    // Ping the shop owner without making the customer wait on it.
    const itemCount = [...quantities.values()].reduce((sum, qty) => sum + qty, 0);
    after(() =>
      notifyNewOrder({
        id: order.id,
        number: order.number,
        fullName: clean(input.fullName),
        phone: clean(input.phone),
        address: clean(input.address),
        city: clean(input.city),
        postalCode: clean(input.postalCode),
        country: clean(input.country),
        itemCount,
        totalCents: order.totalCents,
      })
    );

    return { ok: true, orderId: order.id, token: signOrderId(order.id) };
  } catch (error) {
    if (error instanceof OrderError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: e.placeFailed };
  }
}
