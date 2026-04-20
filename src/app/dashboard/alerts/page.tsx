"use client";
import { useState } from "react";
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, X, Check } from "lucide-react";

interface Alert {
  id: number;
  symbol: string;
  type: "above" | "below";
  target: number;
  current: number;
  active: boolean;
  createdAt: string;
}

const DEMO_ALERTS: Alert[] = [
  { id: 1, symbol: "AAPL", type: "above", target: 225.00, current: 218.45, active: true, createdAt: "2026-04-18" },
  { id: 2, symbol: "NVDA", type: "above", target: 950.00, current: 892.40, active: true, createdAt: "2026-04-19" },
  { id: 3, symbol: "TSLA", type: "below", target: 230.00, current: 245.60, active: true, createdAt: "2026-04-17" },
  { id: 4, symbol: "MSFT", type: "above", target: 460.00, current: 452.30, active: true, createdAt: "2026-04-20" },
  { id: 5, symbol: "GOOGL", type: "below", target: 170.00, current: 178.90, active: false, createdAt: "2026-04-15" },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(DEMO_ALERTS);
  const [showAdd, setShowAdd] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [newType, setNewType] = useState<"above" | "below">("above");
  const [newTarget, setNewTarget] = useState("");

  const addAlert = () => {
    if (!newSymbol || !newTarget) return;
    const a: Alert = {
      id: Date.now(), symbol: newSymbol.toUpperCase(), type: newType,
      target: Number(newTarget), current: 0, active: true,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAlerts([a, ...alerts]);
    setNewSymbol(""); setNewTarget(""); setShowAdd(false);
  };

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const removeAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const activeCount = alerts.filter(a => a.active).length;

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Price Alerts</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{activeCount} active alerts monitoring</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> New Alert
        </button>
      </div>

      {showAdd && (
        <div className="card" style={{ marginBottom: 20, display: "flex", gap: 12, alignItems: "flex-end", padding: 20 }}>
          <div style={{ flex: 1 }}>
            <label className="label">Symbol</label>
            <input className="input" placeholder="AAPL" value={newSymbol} onChange={e => setNewSymbol(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Condition</label>
            <select className="input" value={newType} onChange={e => setNewType(e.target.value as "above" | "below")} style={{ cursor: "pointer" }}>
              <option value="above">Price goes above</option>
              <option value="below">Price drops below</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Target Price ($)</label>
            <input className="input" type="number" placeholder="250.00" value={newTarget} onChange={e => setNewTarget(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={addAlert}>Create</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}><X size={16} /></button>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Your Alerts</h3>
        </div>
        {alerts.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
            <Bell size={40} style={{ marginBottom: 16, opacity: 0.3 }} />
            <p>No alerts yet. Create one to get notified when prices hit your targets.</p>
          </div>
        ) : (
          alerts.map((a, i) => {
            const pctAway = a.current > 0 ? ((a.target - a.current) / a.current * 100) : 0;
            return (
              <div key={a.id} style={{
                padding: "16px 20px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: i < alerts.length - 1 ? "1px solid var(--border)" : "none",
                opacity: a.active ? 1 : 0.5,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: a.type === "above" ? "var(--accent-light)" : "var(--red-light)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: a.type === "above" ? "var(--accent)" : "var(--red)",
                  }}>
                    {a.type === "above" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{a.symbol}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      {a.type === "above" ? "Alert when price ≥" : "Alert when price ≤"} ${a.target.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {a.current > 0 && (
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>Current: ${a.current.toFixed(2)}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {Math.abs(pctAway).toFixed(1)}% {a.type === "above" ? "below target" : "above target"}
                      </div>
                    </div>
                  )}
                  <span className={`badge ${a.active ? "badge-green" : "badge-yellow"}`}>
                    {a.active ? "Active" : "Paused"}
                  </span>
                  <button onClick={() => toggleAlert(a.id)} style={{
                    background: "none", color: "var(--text-muted)", padding: 4,
                  }}>
                    {a.active ? <Bell size={16} /> : <Check size={16} />}
                  </button>
                  <button onClick={() => removeAlert(a.id)} style={{
                    background: "none", color: "var(--text-muted)", padding: 4,
                  }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
