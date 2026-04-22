/**
 * Lemon Squeezy subscription helper
 * Stores plan info in localStorage (client) and verifies via API (server)
 */

export type PlanTier = "free" | "pro" | "premium";

export interface Subscription {
  plan: PlanTier;
  variantId: number | null;
  customerId: string | null;
  subscriptionId: string | null;
  expiresAt: string | null;
  status: string;
}

const STORAGE_KEY = "yw_subscription";

// Plan limits
export const PLAN_LIMITS = {
  free: {
    portfolioStocks: 3,
    aiChatsPerDay: 3,
    alerts: 1,
    signals: false,
    dividends: false,
    fullScreener: false,
  },
  pro: {
    portfolioStocks: Infinity,
    aiChatsPerDay: 50,
    alerts: Infinity,
    signals: true,
    dividends: true,
    fullScreener: true,
  },
  premium: {
    portfolioStocks: Infinity,
    aiChatsPerDay: Infinity,
    alerts: Infinity,
    signals: true,
    dividends: true,
    fullScreener: true,
  },
};

export function getSubscription(): Subscription {
  if (typeof window === "undefined") {
    return { plan: "free", variantId: null, customerId: null, subscriptionId: null, expiresAt: null, status: "free" };
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { plan: "free", variantId: null, customerId: null, subscriptionId: null, expiresAt: null, status: "free" };
  }
  try {
    return JSON.parse(stored);
  } catch {
    return { plan: "free", variantId: null, customerId: null, subscriptionId: null, expiresAt: null, status: "free" };
  }
}

export function setSubscription(sub: Subscription) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sub));
  }
}

export function clearSubscription() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function getPlanFromVariantId(variantId: number): PlanTier {
  const proId = parseInt(process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_VARIANT_ID || "0");
  const premiumId = parseInt(process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PREMIUM_VARIANT_ID || "0");
  if (variantId === premiumId) return "premium";
  if (variantId === proId) return "pro";
  return "free";
}

export function canAccess(plan: PlanTier, feature: keyof typeof PLAN_LIMITS["free"]): boolean {
  const limits = PLAN_LIMITS[plan];
  const value = limits[feature];
  if (typeof value === "boolean") return value;
  return value > 0;
}

export function getRemainingUsage(plan: PlanTier, feature: "aiChatsPerDay" | "portfolioStocks" | "alerts", currentUsage: number): number {
  const limit = PLAN_LIMITS[plan][feature];
  if (limit === Infinity) return Infinity;
  return Math.max(0, limit - currentUsage);
}
