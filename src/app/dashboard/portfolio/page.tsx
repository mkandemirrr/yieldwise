"use client";
import { useState } from "react";
import { PieChart, Plus, Trash2, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, RefreshCw, Zap, X } from "lucide-react";

interface Stock {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  current: number;
  change: number;
  changePct: number;
  up: boolean;
  sector: string;
}

const DEMO_PORTFOLIO: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 50, avgCost: 185.00, current: 218.45, change: 2.01, changePct: 0.93, up: true, sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corp.", shares: 30, avgCost: 380.50, current: 452.30, change: -1.55, changePct: -0.34, up: false, sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc.", shares: 40, avgCost: 145.20, current: 178.90, change: 3.76, changePct: 2.15, up: true, sector: "Technology" },
  { symbol: "JNJ", name: "Johnson & Johnson", shares: 25, avgCost: 155.00, current: 162.80, change: 0.45, changePct: 0.28, up: true, sector: "Healthcare" },
  { symbol: "JPM", name: "JPMorgan Chase", shares: 20, avgCost: 175.40, current: 198.60, change: 1.20, changePct: 0.61, up: true, sector: "Finance" },
  { symbol: "NVDA", name: "NVIDIA Corp.", shares: 15, avgCost: 650.00, current: 892.40, change: 27.73, changePct: 3.21, up: true, sector: "Technology" },
];

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Stock[]>(DEMO_PORTFOLIO);
  const [showAdd, setShowAdd] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [newShares, setNewShares] = useState("");
  const [newCost, setNewCost] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState("");

  const totalValue = portfolio.reduce((s, p) => s + p.current * p.shares, 0);
  const totalCost = portfolio.reduce((s, p) => s + p.avgCost * p.shares, 0);
  const totalPL = totalValue - totalCost;
  const totalPLPct = ((totalPL / totalCost) * 100);

  const handleAdd = () => {
    if (!newSymbol || !newShares || !newCost) return;
    const newStock: Stock = {
      symbol: newSymbol.toUpperCase(), name: newSymbol.toUpperCase() + " Corp.",
      shares: Number(newShares), avgCost: Number(newCost), current: Number(newCost) * 1.05,
      change: 0, changePct: 0, up: true, sector: "Other",
    };
    setPortfolio([...portfolio, newStock]);
    setNewSymbol(""); setNewShares(""); setNewCost("");
    setShowAdd(false);
  };

  const removeStock = (symbol: string) => {
    setPortfolio(portfolio.filter(s => s.symbol !== symbol));
  };

  const analyzePortfolio = async () => {
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
      setAnalysis("AI analysis is available with Pro plan. Try adding more stocks to your portfolio for better diversification insights.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Portfolio Analyzer</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Track and analyze your investment portfolio with AI</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-secondary btn-sm" onClick={analyzePortfolio} disabled={analyzing}>
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
          { label: "Total Value", value: `$${totalValue.toLocaleString("en", { minimumFractionDigits: 2 })}`, sub: `${portfolio.length} holdings` },
          { label: "Total Cost", value: `$${totalCost.toLocaleString("en", { minimumFractionDigits: 2 })}`, sub: "Avg. cost basis" },
          { label: "Total P&L", value: `${totalPL >= 0 ? "+" : ""}$${totalPL.toLocaleString("en", { minimumFractionDigits: 2 })}`, sub: `${totalPLPct >= 0 ? "+" : ""}${totalPLPct.toFixed(2)}%`, up: totalPL >= 0 },
          { label: "Best Performer", value: "NVDA", sub: "+37.29%", up: true },
        ].map(c => (
          <div key={c.label} className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "up" in c ? (c.up ? "var(--accent)" : "var(--red)") : "var(--text-primary)" }}>{c.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Add Stock Modal */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 20, display: "flex", gap: 12, alignItems: "flex-end", padding: 20 }}>
          <div style={{ flex: 1 }}>
            <label className="label">Symbol</label>
            <input className="input" placeholder="AAPL" value={newSymbol} onChange={e => setNewSymbol(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Shares</label>
            <input className="input" type="number" placeholder="100" value={newShares} onChange={e => setNewShares(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Avg. Cost ($)</label>
            <input className="input" type="number" placeholder="150.00" value={newCost} onChange={e => setNewCost(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleAdd}>Add</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}><X size={16} /></button>
        </div>
      )}

      {/* AI Analysis */}
      {analysis && (
        <div className="card" style={{ marginBottom: 20, borderColor: "rgba(16,185,129,0.3)", background: "var(--accent-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Zap size={16} style={{ color: "var(--accent)" }} />
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>AI Portfolio Analysis</h3>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{analysis}</p>
        </div>
      )}

      {/* Holdings Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Holdings ({portfolio.length})</h3>
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
              const plPct = ((s.current - s.avgCost) / s.avgCost * 100);
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
                    <div style={{ fontSize: 12, color: s.up ? "var(--accent)" : "var(--red)" }}>
                      {s.up ? "+" : ""}{s.changePct.toFixed(2)}%
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
                    <button onClick={() => removeStock(s.symbol)} style={{ background: "none", color: "var(--text-muted)", padding: 4 }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
