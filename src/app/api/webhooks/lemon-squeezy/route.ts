import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * POST /api/webhooks/lemon-squeezy — handles subscription events
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

    // Verify webhook signature
    if (secret) {
      const sig = request.headers.get("x-signature");
      if (sig) {
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(rawBody);
        const digest = hmac.digest("hex");
        if (sig !== digest) {
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
      }
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload?.meta?.event_name;
    const data = payload?.data;
    const userId = payload?.meta?.custom_data?.user_id;

    console.log(`[LemonSqueezy Webhook] Event: ${eventName}, User: ${userId}`);

    // We rely on client-side localStorage for plan status
    // In production, you'd update a database here
    // For now, the webhook just logs the event

    if (eventName === "subscription_created" || eventName === "subscription_updated") {
      const status = data?.attributes?.status; // active, cancelled, expired, etc.
      const variantId = data?.attributes?.variant_id;
      const customerId = data?.attributes?.customer_id;
      const renewsAt = data?.attributes?.renews_at;

      console.log(`[LemonSqueezy] Subscription ${status}: variant=${variantId}, customer=${customerId}, renews=${renewsAt}`);
    }

    if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
      console.log(`[LemonSqueezy] Subscription ended for user: ${userId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
