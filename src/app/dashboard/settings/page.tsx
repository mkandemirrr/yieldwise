"use client";
import { useState, useEffect } from "react";
import { User, CreditCard, Bell, Trash2, Check, Database, LogOut, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState({ priceAlerts: true, dividends: true, signals: true, news: false });
  const [currency, setCurrency] = useState("USD");
  const router = useRouter();

  useEffect(() => {
    // Load user info from Supabase
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        setName(user.user_metadata?.full_name || user.user_metadata?.name || "");
      }
    };
    loadUser();

    // Load preferences from localStorage
    const prefs = localStorage.getItem("yw_settings");
    if (prefs) {
      try {
        const p = JSON.parse(prefs);
        if (p.notifications) setNotifications(p.notifications);
        if (p.currency) setCurrency(p.currency);
        if (p.name) setName(p.name);
      } catch { /* */ }
    }
  }, []);

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

  const portfolioCount = (() => {
    try { return JSON.parse(localStorage.getItem("yw_portfolio") || "[]").length; } catch { return 0; }
  })();
  const alertsCount = (() => {
    try { return JSON.parse(localStorage.getItem("yw_alerts") || "[]").length; } catch { return 0; }
  })();
  const dividendsCount = (() => {
    try { return JSON.parse(localStorage.getItem("yw_dividends") || "[]").length; } catch { return 0; }
  })();

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
          <Check size={16} /> Settings saved successfully!
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
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: 16, background: "var(--bg-secondary)", borderRadius: 10,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Free Plan</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Unlimited stocks, AI chat, portfolio tracking</div>
          </div>
          <span className="badge badge-green">Active</span>
        </div>
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
