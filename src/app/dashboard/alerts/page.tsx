"use client";
import { useState, useEffect } from "react";
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, X, Search, BellOff, CheckCircle2, AlertTriangle } from "lucide-react";

interface Alert {
  id: number;
  symbol: string;
  name: string;
  type: "above" | "below";
  target: number;
  current: number;
  active: boolean;
  triggered: boolean;
  createdAt: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [newType, setNewType] = useState<"above" | "below">("above");
  const [newTarget, setNewTarget] = useState("");
  const [searching, setSearching] = useState(false);
  const [stockInfo, setStockInfo] = useState<{ symbol: string; name: string; price: number } | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("yw_alerts");
    if (saved) {
      try { setAlerts(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("yw_alerts", JSON.stringify(alerts));
  }, [alerts]);

  // Refresh prices and check triggers
  const refreshPrices = async () => {
    if (alerts.length === 0) return;
    const symbols = [...new Set(alerts.map(a => a.symbol))].join(",");
    try {
      const res = await fetch(`/api/fmp?endpoint=batch-quote&symbols=${symbols}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setAlerts(prev => prev.map(alert => {
          const quote = data.find((q: any) => q.symbol === alert.symbol);
          if (quote) {
            const triggered = alert.active && (
              (alert.type === "above" && quote.price >= alert.target) ||
              (alert.type === "below" && quote.price <= alert.target)
            );
            return { ...alert, current: quote.price, name: quote.name || alert.name, triggered: triggered || alert.triggered };
          }
          return alert;
        }));
      }
    } catch { /* ignore */ }
  };

  useEffect(() => {
    refreshPrices();
    const interval = setInterval(refreshPrices, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  const lookupStock = async () => {
    if (!newSymbol.trim()) return;
    setSearching(true);
    setStockInfo(null);
    try {
      const res = await fetch(`/api/fmp?endpoint=batch-quote&symbols=${newSymbol.toUpperCase()}`);
      const data = await res.json();
      if (Array.isArray(data) && data[0]) {
        setStockInfo({ symbol: data[0].symbol, name: data[0].name, price: data[0].price });
      }
    } catch { /* ignore */ }
    setSearching(false);
  };

  const addAlert = () => {
    if (!newSymbol || !newTarget) return;
    const a: Alert = {
      id: Date.now(),
      symbol: newSymbol.toUpperCase(),
      name: stockInfo?.name || newSymbol.toUpperCase(),
      type: newType,
      target: Number(newTarget),
      current: stockInfo?.price || 0,
      active: true,
      triggered: false,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAlerts([a, ...alerts]);
    setNewSymbol(""); setNewTarget(""); setShowAdd(false); setStockInfo(null);
  };

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active, triggered: false } : a));
  };

  const removeAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const dismissTriggered = (id: number) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, triggered: false, active: false } : a));
  };

  const activeCount = alerts.filter(a => a.active).length;
  const triggeredCount = alerts.filter(a => a.triggered).length;

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Price Alerts</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {activeCount} active alert{activeCount !== 1 ? "s" : ""} monitoring
            {triggeredCount > 0 && <span style={{ color: "var(--accent)", fontWeight: 600 }}> • {triggeredCount} triggered!</span>}
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> New Alert
        </button>
      </div>

      {/* Triggered Alerts Banner */}
      {triggeredCount > 0 && (
        <div className="card" style={{ marginBottom: 20, padding: 16, borderColor: "rgba(16,185,129,0.4)", background: "var(--accent-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <AlertTriangle size={18} style={{ color: "var(--accent)" }} />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--accent)" }}>🎯 Alert{triggeredCount > 1 ? "s" : ""} Triggered!</h3>
          </div>
          {alerts.filter(a => a.triggered).map(a => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <span style={{ fontSize: 14 }}>
                <strong>{a.symbol}</strong> hit ${a.target.toFixed(2)} target (now ${a.current.toFixed(2)})
              </span>
              <button className="btn btn-ghost btn-sm" onClick={() => dismissTriggered(a.id)} style={{ fontSize: 12 }}>
                <CheckCircle2 size={14} /> Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Alert Panel */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 20, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Create Price Alert</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => { setShowAdd(false); setStockInfo(null); }}><X size={16} /></button>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label className="label">Symbol</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="input" placeholder="AAPL" value={newSymbol}
                  onChange={e => setNewSymbol(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && lookupStock()} />
                <button className="btn btn-secondary btn-sm" onClick={lookupStock} disabled={searching}>
                  <Search size={14} /> {searching ? "..." : "Look Up"}
                </button>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Condition</label>
              <select className="input" value={newType} onChange={e => setNewType(e.target.value as "above" | "below")} style={{ cursor: "pointer" }}>
                <option value="above">📈 Price goes above</option>
                <option value="below">📉 Price drops below</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Target Price ($)</label>
              <input className="input" type="number" step="0.01" placeholder="250.00" value={newTarget} onChange={e => setNewTarget(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={addAlert} disabled={!newSymbol || !newTarget}>
              <Bell size={14} /> Create
            </button>
          </div>
          {stockInfo && (
            <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, background: "var(--accent-light)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 13 }}>
              ✅ <strong>{stockInfo.symbol}</strong> — {stockInfo.name} — Current: <strong>${stockInfo.price.toFixed(2)}</strong>
              {newTarget && (
                <span style={{ marginLeft: 12, color: "var(--text-muted)" }}>
                  ({((Number(newTarget) - stockInfo.price) / stockInfo.price * 100).toFixed(1)}% {Number(newTarget) > stockInfo.price ? "above" : "below"} current)
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Alerts List */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Your Alerts ({alerts.length})</h3>
        </div>
        {alerts.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
            <Bell size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No alerts yet</h3>
            <p style={{ fontSize: 14 }}>Create price alerts to get notified when stocks hit your target prices.</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => setShowAdd(true)}>
              <Plus size={14} /> Create Your First Alert
            </button>
          </div>
        ) : (
          alerts.map((a, i) => {
            const pctAway = a.current > 0 ? ((a.target - a.current) / a.current * 100) : 0;
            const isClose = Math.abs(pctAway) < 3; // within 3%
            return (
              <div key={a.id} style={{
                padding: "16px 20px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: i < alerts.length - 1 ? "1px solid var(--border)" : "none",
                opacity: a.active ? 1 : 0.5,
                background: a.triggered ? "rgba(16,185,129,0.05)" : "transparent",
                transition: "all 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: a.triggered ? "var(--accent-light)" : a.type === "above" ? "rgba(59,130,246,0.1)" : "var(--red-light)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: a.triggered ? "var(--accent)" : a.type === "above" ? "var(--blue)" : "var(--red)",
                    border: a.triggered ? "2px solid var(--accent)" : "none",
                  }}>
                    {a.triggered ? <CheckCircle2 size={18} /> : a.type === "above" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                      {a.symbol}
                      <span style={{ fontSize: 12, fontWeight: 400, color: "var(--text-muted)" }}>{a.name}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      {a.type === "above" ? "Alert when ≥" : "Alert when ≤"} <strong>${a.target.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {a.current > 0 && (
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>${a.current.toFixed(2)}</div>
                      <div style={{ fontSize: 12, color: isClose ? "var(--yellow)" : "var(--text-muted)", fontWeight: isClose ? 600 : 400 }}>
                        {Math.abs(pctAway).toFixed(1)}% {pctAway > 0 ? "to target" : "past target"}
                        {isClose && !a.triggered && " ⚡"}
                      </div>
                    </div>
                  )}
                  <span className={`badge ${a.triggered ? "badge-green" : a.active ? "badge-blue" : "badge-yellow"}`}>
                    {a.triggered ? "🎯 Triggered" : a.active ? "Active" : "Paused"}
                  </span>
                  <button onClick={() => toggleAlert(a.id)}
                    style={{ background: "none", color: "var(--text-muted)", padding: 4, border: "none", cursor: "pointer" }}
                    title={a.active ? "Pause" : "Resume"}>
                    {a.active ? <BellOff size={16} /> : <Bell size={16} />}
                  </button>
                  <button onClick={() => removeAlert(a.id)}
                    style={{ background: "none", color: "var(--text-muted)", padding: 4, border: "none", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--red)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
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
