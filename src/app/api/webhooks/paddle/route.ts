import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * POST /api/webhooks/paddle — handles Paddle subscription events
 * Paddle sends webhooks for subscription lifecycle events
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const secret = process.env.PADDLE_WEBHOOK_SECRET;

    // Verify webhook signature
    if (secret) {
      const sig = request.headers.get("paddle-signature");
      if (sig) {
        // Paddle uses ts=timestamp;h1=hash format
        const parts = sig.split(";");
        const tsStr = parts.find(p => p.startsWith("ts="))?.replace("ts=", "") || "";
        const h1 = parts.find(p => p.startsWith("h1="))?.replace("h1=", "") || "";

        const payload = `${tsStr}:${rawBody}`;
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(payload);
        const digest = hmac.digest("hex");

        if (h1 !== digest) {
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
      }
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload?.event_type;
    const data = payload?.data;

    console.log(`[Paddle Webhook] Event: ${eventType}`);

    if (eventType === "subscription.created" || eventType === "subscription.updated") {
      const status = data?.status; // active, canceled, past_due, etc.
      const priceId = data?.items?.[0]?.price?.id;
      const customerId = data?.customer_id;
      const nextBilledAt = data?.next_billed_at;
      const userId = data?.custom_data?.user_id;

      console.log(`[Paddle] Subscription ${status}: price=${priceId}, customer=${customerId}, next_billed=${nextBilledAt}, user=${userId}`);
    }

    if (eventType === "subscription.canceled") {
      const userId = data?.custom_data?.user_id;
      console.log(`[Paddle] Subscription canceled for user: ${userId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
