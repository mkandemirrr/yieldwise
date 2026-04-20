"use client";
import { useState } from "react";
import { Settings, User, CreditCard, Bell, Moon, Globe, Shield, Check } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("Mustafa");
  const [email] = useState("mustafa@yieldwise.ai");
  const [notifications, setNotifications] = useState({ priceAlerts: true, dividends: true, signals: true, news: false });

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

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
            <label className="label">Full Name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={email} disabled style={{ opacity: 0.6 }} />
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
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>3 stocks, 3 AI chats/day, basic screener</div>
          </div>
          <button className="btn btn-primary btn-sm">Upgrade to Pro</button>
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
          { key: "signals", label: "AI Signals", desc: "AI-generated trading signals and insights" },
          { key: "news", label: "Market News", desc: "Breaking market news and events" },
        ].map(n => (
          <div key={n.key} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 0", borderBottom: "1px solid var(--border)",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{n.label}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{n.desc}</div>
            </div>
            <button onClick={() => setNotifications({ ...notifications, [n.key]: !(notifications as any)[n.key] })}
              style={{
                width: 44, height: 24, borderRadius: 12, padding: 2,
                background: (notifications as any)[n.key] ? "var(--accent)" : "var(--border-light)",
                transition: "background 0.2s", display: "flex", alignItems: "center",
                justifyContent: (notifications as any)[n.key] ? "flex-end" : "flex-start",
              }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "white", transition: "all 0.2s" }} />
            </button>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" onClick={save} style={{ width: "100%" }}>Save Changes</button>
    </div>
  );
}
