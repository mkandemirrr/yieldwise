import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/checkout — returns Paddle price ID for client-side checkout
 * Paddle uses client-side Paddle.js for overlay checkout, so we just validate the user
 * and return the necessary data for the frontend to open the checkout.
 */
export async function POST(request: Request) {
  try {
    const { priceId } = await request.json();
    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Paddle checkout is handled client-side via Paddle.js
    // We return user info so the frontend can pre-fill the checkout
    return NextResponse.json({
      priceId,
      customerEmail: user.email,
      customData: { user_id: user.id },
      successUrl: "https://yieldwise.ai/dashboard/settings?upgraded=true",
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
