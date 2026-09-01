import { formatOrderNumber } from "@/lib/order-number";
import { formatPrice } from "@/lib/format";

/** Enough of an order for the owner to start fulfilling it straight from the message. */
export type OrderNotification = {
  id: string;
  number: number;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  itemCount: number;
  totalCents: number;
};

/** Deep link into the admin order list, filtered to this order. Null when ADMIN_URL isn't set. */
function adminOrderUrl(number: number): string | null {
  const base = process.env.ADMIN_URL?.trim().replace(/\/+$/, "");
  if (!base) return null;
  return `${base}/admin/orders?q=${encodeURIComponent(formatOrderNumber(number))}`;
}

function summary(order: OrderNotification): string {
  const items = `${order.itemCount} ${order.itemCount === 1 ? "item" : "items"}`;
  const url = adminOrderUrl(order.number);
  const addressLine = [order.address, order.city, order.country]
    .filter(Boolean)
    .join(", ");
  return [
    `🧢 New order ${formatOrderNumber(order.number)}`,
    order.fullName,
    order.phone,
    addressLine,
    `${items} · ${formatPrice(order.totalCents)}`,
    url ? `→ ${url}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendEmail(order: OrderNotification, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ORDER_NOTIFY_EMAIL_FROM?.trim();
  const to = process.env.ORDER_NOTIFY_EMAIL_TO?.trim();
  if (!apiKey || !from || !to) return;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: to.split(",").map((address) => address.trim()).filter(Boolean),
      subject: `New order ${formatOrderNumber(order.number)} — ${formatPrice(order.totalCents)}`,
      text,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend emails ${res.status}: ${await res.text()}`);
  }
}

/**
 * Best-effort "you have a new order" email to the shop owner. It's a no-op until
 * the Resend env vars are set, and a failure never affects the order itself —
 * call this from `after()` so a slow or down provider can't hold up checkout.
 */
export async function notifyNewOrder(order: OrderNotification): Promise<void> {
  const text = summary(order);
  try {
    await sendEmail(order, text);
  } catch (error) {
    console.error("[notify-order] email failed:", error);
  }
}
