"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Zap, X, RefreshCw, TrendingUp, Search } from "lucide-react";

interface Stock {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  current: number;
  change: number;
  changePct: number;
  sector: string;
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Stock[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [newShares, setNewShares] = useState("");
  const [newCost, setNewCost] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [searchResult, setSearchResult] = useState<{ symbol: string; name: string; price: number; sector: string } | null>(null);
  const [searching, setSearching] = useState(false);

  // Load portfolio from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("yw_portfolio");
    if (saved) {
      try {
        setPortfolio(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }, []);

  // Save portfolio to localStorage
  useEffect(() => {
    if (portfolio.length > 0) {
      localStorage.setItem("yw_portfolio", JSON.stringify(portfolio));
    }
  }, [portfolio]);

  // Refresh live prices
  const refreshPrices = async () => {
    if (portfolio.length === 0) return;
    setRefreshing(true);
    try {
      const symbols = portfolio.map(s => s.symbol).join(",");
      const res = await fetch(`/api/fmp?endpoint=batch-quote&symbols=${symbols}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPortfolio(prev => prev.map(stock => {
          const quote = data.find((q: any) => q.symbol === stock.symbol);
          if (quote) {
            return { ...stock, current: quote.price, change: quote.change, changePct: quote.changePercentage, name: quote.name || stock.name };
          }
          return stock;
        }));
      }
    } catch { /* ignore */ }
    setRefreshing(false);
  };

  // Auto-refresh on mount
  useEffect(() => {
    if (portfolio.length > 0) refreshPrices();
  }, []); // eslint-disable-line

  // Search stock when symbol typed
  const searchStock = async () => {
    if (!newSymbol.trim()) return;
    setSearching(true);
    setSearchResult(null);
    try {
      const res = await fetch(`/api/fmp?endpoint=batch-quote&symbols=${newSymbol.toUpperCase()}`);
      const data = await res.json();
      if (Array.isArray(data) && data[0]) {
        const q = data[0];
        setSearchResult({ symbol: q.symbol, name: q.name, price: q.price, sector: "" });
        if (!newCost) setNewCost(q.price.toFixed(2));
      }
    } catch { /* ignore */ }
    setSearching(false);
  };

  const handleAdd = () => {
    if (!newSymbol || !newShares || !newCost) return;
    const sym = newSymbol.toUpperCase();
    // Check if already exists
    if (portfolio.find(s => s.symbol === sym)) {
      alert(`${sym} is already in your portfolio`);
      return;
    }
    const newStock: Stock = {
      symbol: sym,
      name: searchResult?.name || sym,
      shares: Number(newShares),
      avgCost: Number(newCost),
      current: searchResult?.price || Number(newCost),
      change: 0,
      changePct: 0,
      sector: searchResult?.sector || "Other",
    };
    setPortfolio([...portfolio, newStock]);
    setNewSymbol(""); setNewShares(""); setNewCost("");
    setSearchResult(null);
    setShowAdd(false);
    // Refresh to get live price
    setTimeout(refreshPrices, 500);
  };

  const removeStock = (symbol: string) => {
    const updated = portfolio.filter(s => s.symbol !== symbol);
    setPortfolio(updated);
    if (updated.length === 0) localStorage.removeItem("yw_portfolio");
  };

  const analyzePortfolio = async () => {
    if (portfolio.length === 0) { setAnalysis("Add stocks to your portfolio first!"); return; }
    setAnalyzing(true);
    setAnalysis("");
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio: portfolio.map(s => ({ symbol: s.symbol, shares: s.shares, avgCost: s.avgCost, current: s.current, sector: s.sector })) }),
      });
      const data = await res.json();
      setAnalysis(data.analysis || "Analysis complete.");
    } catch {
      setAnalysis("AI analysis temporarily unavailable. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const totalValue = portfolio.reduce((s, p) => s + p.current * p.shares, 0);
  const totalCost = portfolio.reduce((s, p) => s + p.avgCost * p.shares, 0);
  const totalPL = totalValue - totalCost;
  const totalPLPct = totalCost > 0 ? ((totalPL / totalCost) * 100) : 0;
  const bestPerformer = portfolio.length > 0
    ? portfolio.reduce((best, s) => ((s.current - s.avgCost) / s.avgCost > (best.current - best.avgCost) / best.avgCost ? s : best))
    : null;

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Portfolio Tracker</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Track your investments with real-time data + AI analysis</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={refreshPrices} disabled={refreshing || portfolio.length === 0}>
            <RefreshCw size={16} className={refreshing ? "spin" : ""} /> Refresh
          </button>
          <button className="btn btn-secondary btn-sm" onClick={analyzePortfolio} disabled={analyzing || portfolio.length === 0}>
            <Zap size={16} /> {analyzing ? "Analyzing..." : "AI Analyze"}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Add Stock
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Value", value: portfolio.length > 0 ? `$${totalValue.toLocaleString("en", { minimumFractionDigits: 2 })}` : "$0.00", sub: `${portfolio.length} holdings` },
          { label: "Total Cost", value: portfolio.length > 0 ? `$${totalCost.toLocaleString("en", { minimumFractionDigits: 2 })}` : "$0.00", sub: "Cost basis" },
          { label: "Total P&L", value: portfolio.length > 0 ? `${totalPL >= 0 ? "+" : ""}$${totalPL.toLocaleString("en", { minimumFractionDigits: 2 })}` : "$0.00", sub: `${totalPLPct >= 0 ? "+" : ""}${totalPLPct.toFixed(2)}%`, up: totalPL >= 0 },
          { label: "Best Performer", value: bestPerformer?.symbol || "—", sub: bestPerformer ? `${(((bestPerformer.current - bestPerformer.avgCost) / bestPerformer.avgCost) * 100).toFixed(2)}%` : "—", up: true },
        ].map(c => (
          <div key={c.label} className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "up" in c ? (c.up ? "var(--accent)" : "var(--red)") : "var(--text-primary)" }}>{c.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Add Stock Panel */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 20, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Add Stock to Portfolio</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => { setShowAdd(false); setSearchResult(null); }}><X size={16} /></button>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label className="label">Ticker Symbol</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="input" placeholder="AAPL" value={newSymbol}
                  onChange={e => setNewSymbol(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && searchStock()} />
                <button className="btn btn-secondary btn-sm" onClick={searchStock} disabled={searching}>
                  <Search size={14} /> {searching ? "..." : "Look Up"}
                </button>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Shares</label>
              <input className="input" type="number" placeholder="100" value={newShares} onChange={e => setNewShares(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Avg. Cost ($)</label>
              <input className="input" type="number" step="0.01" placeholder="150.00" value={newCost} onChange={e => setNewCost(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={!newSymbol || !newShares || !newCost}>
              <Plus size={14} /> Add
            </button>
          </div>
          {searchResult && (
            <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, background: "var(--accent-light)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 13 }}>
              ✅ <strong>{searchResult.symbol}</strong> — {searchResult.name} — Current Price: <strong>${searchResult.price.toFixed(2)}</strong>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {portfolio.length === 0 && !showAdd && (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <TrendingUp size={48} style={{ color: "var(--text-muted)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No stocks yet</h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>
            Add stocks to track your portfolio performance with real-time prices and AI analysis.
          </p>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Add Your First Stock
          </button>
        </div>
      )}

      {/* AI Analysis */}
      {analysis && (
        <div className="card" style={{ marginBottom: 20, borderColor: "rgba(16,185,129,0.3)", background: "var(--accent-light)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Zap size={16} style={{ color: "var(--accent)" }} />
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>AI Portfolio Analysis</h3>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setAnalysis("")}><X size={14} /></button>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{analysis}</p>
        </div>
      )}

      {/* Holdings Table */}
      {portfolio.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Holdings ({portfolio.length})</h3>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Symbol", "Shares", "Avg Cost", "Current", "Value", "P&L", "P&L %", ""].map(h => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {portfolio.map(s => {
                const val = s.current * s.shares;
                const pl = (s.current - s.avgCost) * s.shares;
                const plPct = s.avgCost > 0 ? ((s.current - s.avgCost) / s.avgCost * 100) : 0;
                return (
                  <tr key={s.symbol} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-card-hover)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{s.symbol}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.name}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 14 }}>{s.shares}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14 }}>${s.avgCost.toFixed(2)}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14 }}>
                      <div>${s.current.toFixed(2)}</div>
                      <div style={{ fontSize: 12, color: s.changePct >= 0 ? "var(--accent)" : "var(--red)" }}>
                        {s.changePct >= 0 ? "+" : ""}{s.changePct.toFixed(2)}%
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600 }}>${val.toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: pl >= 0 ? "var(--accent)" : "var(--red)" }}>
                      {pl >= 0 ? "+" : ""}${pl.toLocaleString("en", { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span className={`badge ${plPct >= 0 ? "badge-green" : "badge-red"}`}>
                        {plPct >= 0 ? "+" : ""}{plPct.toFixed(2)}%
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => removeStock(s.symbol)} style={{ background: "none", color: "var(--text-muted)", padding: 4, cursor: "pointer", border: "none" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--red)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
