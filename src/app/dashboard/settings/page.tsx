"use client";
import { useState, useEffect, Suspense } from "react";
import { User, CreditCard, Bell, Trash2, Check, Database, LogOut, Shield, Crown, Zap, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { getSubscription, setSubscription, type PlanTier } from "@/lib/lemonsqueezy";

function SettingsContent() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState({ priceAlerts: true, dividends: true, signals: true, news: false });
  const [currency, setCurrency] = useState("USD");
  const [plan, setPlan] = useState<PlanTier>("free");
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        setName(user.user_metadata?.full_name || user.user_metadata?.name || "");
      }
    };
    loadUser();

    const prefs = localStorage.getItem("yw_settings");
    if (prefs) {
      try {
        const p = JSON.parse(prefs);
        if (p.notifications) setNotifications(p.notifications);
        if (p.currency) setCurrency(p.currency);
        if (p.name) setName(p.name);
      } catch { /* */ }
    }

    // Load subscription
    const sub = getSubscription();
    setPlan(sub.plan);

    // Check if just upgraded
    if (searchParams.get("upgraded") === "true") {
      setSaved(true);
      setTimeout(() => setSaved(false), 5000);
    }
  }, [searchParams]);

  const save = () => {
    localStorage.setItem("yw_settings", JSON.stringify({ notifications, currency, name }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const clearData = (key: string, label: string) => {
    if (confirm(`Are you sure you want to clear all ${label} data?`)) {
      localStorage.removeItem(key);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleUpgrade = async (variantId: string, planName: string) => {
    setUpgrading(planName);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: parseInt(variantId) }),
      });
      const data = await res.json();
      if (data.url) {
        // Save plan optimistically
        setSubscription({
          plan: planName as PlanTier,
          variantId: parseInt(variantId),
          customerId: null,
          subscriptionId: null,
          expiresAt: null,
          status: "pending",
        });
        window.location.href = data.url;
      } else {
        alert("Failed to create checkout. Please try again.");
      }
    } catch {
      alert("An error occurred. Please try again.");
    }
    setUpgrading(null);
  };

  const portfolioCount = (() => {
    try { return JSON.parse(localStorage.getItem("yw_portfolio") || "[]").length; } catch { return 0; }
  })();
  const alertsCount = (() => {
    try { return JSON.parse(localStorage.getItem("yw_alerts") || "[]").length; } catch { return 0; }
  })();
  const dividendsCount = (() => {
    try { return JSON.parse(localStorage.getItem("yw_dividends") || "[]").length; } catch { return 0; }
  })();

  const proVariantId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_VARIANT_ID || "";
  const premiumVariantId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PREMIUM_VARIANT_ID || "";

  return (
    <div style={{ padding: "28px 32px", maxWidth: 700 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Settings</h1>
      <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 32 }}>Manage your account and preferences</p>

      {saved && (
        <div style={{
          background: "var(--accent-light)", border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 13, color: "var(--accent)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Check size={16} /> {searchParams.get("upgraded") === "true" ? "🎉 Welcome to your new plan!" : "Settings saved successfully!"}
        </div>
      )}

      {/* Profile */}
      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <User size={18} style={{ color: "var(--accent)" }} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Profile</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label className="label">Display Name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={email} disabled style={{ opacity: 0.6 }} />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <Shield size={18} style={{ color: "var(--blue)" }} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Preferences</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label className="label">Currency</label>
            <select className="input" value={currency} onChange={e => setCurrency(e.target.value)} style={{ cursor: "pointer" }}>
              <option value="USD">🇺🇸 USD — US Dollar</option>
              <option value="EUR">🇪🇺 EUR — Euro</option>
              <option value="GBP">🇬🇧 GBP — British Pound</option>
              <option value="TRY">🇹🇷 TRY — Turkish Lira</option>
              <option value="JPY">🇯🇵 JPY — Japanese Yen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <CreditCard size={18} style={{ color: "var(--blue)" }} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Subscription</h3>
        </div>

        {/* Current Plan */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: 16, background: "var(--bg-secondary)", borderRadius: 10, marginBottom: 16,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
              {plan === "premium" && <Crown size={16} style={{ color: "#f59e0b" }} />}
              {plan === "pro" && <Zap size={16} style={{ color: "var(--accent)" }} />}
              {plan === "free" && <Star size={16} style={{ color: "var(--text-muted)" }} />}
              {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {plan === "free" && "3 stocks, 3 AI chats/day, basic features"}
              {plan === "pro" && "Unlimited stocks, 50 AI chats/day, full features"}
              {plan === "premium" && "Everything unlimited, priority AI, API access"}
            </div>
          </div>
          <span className={`badge ${plan === "free" ? "badge-yellow" : "badge-green"}`}>
            {plan === "free" ? "Free" : "Active"}
          </span>
        </div>

        {/* Upgrade Options */}
        {plan === "free" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{
              padding: 20, borderRadius: 12,
              border: "2px solid var(--accent)",
              background: "rgba(16,185,129,0.05)",
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <Zap size={16} style={{ color: "var(--accent)" }} /> Pro
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                $9.99<span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-muted)" }}>/mo</span>
              </div>
              <ul style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 2, listStyle: "none", padding: 0, marginBottom: 16 }}>
                <li>✅ Unlimited portfolio stocks</li>
                <li>✅ 50 AI chats per day</li>
                <li>✅ AI Trading Signals</li>
                <li>✅ Dividend tracker</li>
                <li>✅ Full stock screener</li>
                <li>✅ Email alerts</li>
              </ul>
              <button className="btn btn-primary" style={{ width: "100%", fontSize: 13 }}
                onClick={() => handleUpgrade(proVariantId, "pro")}
                disabled={!!upgrading}>
                {upgrading === "pro" ? "Redirecting..." : "Upgrade to Pro →"}
              </button>
            </div>

            <div style={{
              padding: 20, borderRadius: 12,
              border: "2px solid #f59e0b",
              background: "rgba(245,158,11,0.05)",
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <Crown size={16} style={{ color: "#f59e0b" }} /> Premium
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                $29.99<span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-muted)" }}>/mo</span>
              </div>
              <ul style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 2, listStyle: "none", padding: 0, marginBottom: 16 }}>
                <li>✅ Everything in Pro</li>
                <li>✅ Unlimited AI chats</li>
                <li>✅ Real-time price alerts</li>
                <li>✅ Priority AI responses</li>
                <li>✅ API access</li>
                <li>✅ Portfolio reports (PDF)</li>
              </ul>
              <button className="btn" style={{
                width: "100%", fontSize: 13,
                background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white",
                border: "none", padding: "10px 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer",
              }}
                onClick={() => handleUpgrade(premiumVariantId, "premium")}
                disabled={!!upgrading}>
                {upgrading === "premium" ? "Redirecting..." : "Go Premium →"}
              </button>
            </div>
          </div>
        )}

        {plan === "pro" && (
          <div style={{
            padding: 20, borderRadius: 12,
            border: "2px solid #f59e0b",
            background: "rgba(245,158,11,0.05)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <Crown size={16} style={{ color: "#f59e0b" }} /> Upgrade to Premium
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  Unlimited AI chats, priority responses, API access, PDF reports
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 800 }}>$29.99<span style={{ fontSize: 12, fontWeight: 400 }}>/mo</span></div>
                <button className="btn" style={{
                  fontSize: 12, marginTop: 8,
                  background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white",
                  border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer",
                }}
                  onClick={() => handleUpgrade(premiumVariantId, "premium")}
                  disabled={!!upgrading}>
                  {upgrading === "premium" ? "Redirecting..." : "Upgrade →"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <Bell size={18} style={{ color: "var(--yellow)" }} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Notifications</h3>
        </div>
        {[
          { key: "priceAlerts", label: "Price Alerts", desc: "Get notified when stocks hit your targets" },
          { key: "dividends", label: "Dividend Alerts", desc: "Upcoming ex-dividend and payment dates" },
          { key: "signals", label: "AI Signals", desc: "AI-generated trading signals" },
          { key: "news", label: "Market News", desc: "Breaking market news and events" },
        ].map((n, i) => (
          <div key={n.key} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{n.label}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{n.desc}</div>
            </div>
            <button onClick={() => setNotifications({ ...notifications, [n.key]: !(notifications as any)[n.key] })}
              style={{
                width: 44, height: 24, borderRadius: 12, padding: 2, border: "none", cursor: "pointer",
                background: (notifications as any)[n.key] ? "var(--accent)" : "var(--border-light)",
                transition: "background 0.2s", display: "flex", alignItems: "center",
                justifyContent: (notifications as any)[n.key] ? "flex-end" : "flex-start",
              }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "white", transition: "all 0.2s" }} />
            </button>
          </div>
        ))}
      </div>

      {/* Data Management */}
      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <Database size={18} style={{ color: "var(--text-muted)" }} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Data Management</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { key: "yw_portfolio", label: "Portfolio", count: portfolioCount },
            { key: "yw_alerts", label: "Alerts", count: alertsCount },
            { key: "yw_dividends", label: "Dividends", count: dividendsCount },
          ].map(d => (
            <div key={d.key} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 14px", background: "var(--bg-secondary)", borderRadius: 8,
            }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{d.label}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 8 }}>({d.count} items)</span>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 12, color: "var(--red)" }}
                onClick={() => clearData(d.key, d.label)}>
                <Trash2 size={12} /> Clear
              </button>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" onClick={save} style={{ width: "100%", marginBottom: 12 }}>Save Changes</button>

      <button className="btn btn-ghost" onClick={handleLogout}
        style={{ width: "100%", color: "var(--red)", border: "1px solid rgba(239,68,68,0.2)" }}>
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32 }}>Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
