"use client";
import { useState, useEffect } from "react";
import { DollarSign, RefreshCw, Search, Plus, X, Calendar, TrendingUp } from "lucide-react";

interface DividendStock {
  symbol: string;
  name: string;
  price: number;
  dividend: number;
  yield: number;
  shares: number;
  annualIncome: number;
  sector: string;
}

const POPULAR_DIVIDEND = ["JNJ", "KO", "PG", "PEP", "MCD", "XOM", "ABBV", "T", "VZ", "O"];

export default function DividendsPage() {
  const [stocks, setStocks] = useState<DividendStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [newShares, setNewShares] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("yw_dividends");
    if (saved) {
      try { setStocks(JSON.parse(saved)); } catch { /* */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("yw_dividends", JSON.stringify(stocks));
  }, [stocks]);

  const lookupStock = async () => {
    if (!newSymbol.trim()) return;
    setSearching(true); setSearchResult(null);
    try {
      const [quoteRes, profileRes] = await Promise.all([
        fetch(`/api/fmp?endpoint=batch-quote&symbols=${newSymbol.toUpperCase()}`),
        fetch(`/api/fmp?endpoint=profile&symbol=${newSymbol.toUpperCase()}`),
      ]);
      const quoteData = await quoteRes.json();
      const profileData = await profileRes.json();
      const q = Array.isArray(quoteData) ? quoteData[0] : null;
      const p = Array.isArray(profileData) ? profileData[0] : null;
      if (q) {
        setSearchResult({
          symbol: q.symbol, name: q.name,
          price: q.price,
          dividend: p?.lastDividend || 0,
          yield: p?.lastDividend && q.price ? ((p.lastDividend / q.price) * 100) : 0,
          sector: p?.sector || "Other",
        });
      }
    } catch { /* */ }
    setSearching(false);
  };

  const addStock = () => {
    if (!searchResult || !newShares) return;
    if (stocks.find(s => s.symbol === searchResult.symbol)) { alert("Already added"); return; }
    const shares = Number(newShares);
    const newStock: DividendStock = {
      symbol: searchResult.symbol, name: searchResult.name,
      price: searchResult.price, dividend: searchResult.dividend,
      yield: searchResult.yield, shares,
      annualIncome: searchResult.dividend * shares,
      sector: searchResult.sector,
    };
    setStocks([...stocks, newStock]);
    setNewSymbol(""); setNewShares(""); setSearchResult(null); setShowAdd(false);
  };

  const removeStock = (symbol: string) => {
    setStocks(stocks.filter(s => s.symbol !== symbol));
  };

  const refreshAll = async () => {
    if (stocks.length === 0) return;
    setLoading(true);
    const symbols = stocks.map(s => s.symbol).join(",");
    try {
      const res = await fetch(`/api/fmp?endpoint=batch-quote&symbols=${symbols}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setStocks(prev => prev.map(stock => {
          const q = data.find((d: any) => d.symbol === stock.symbol);
          if (q) return { ...stock, price: q.price, yield: stock.dividend > 0 ? (stock.dividend / q.price * 100) : stock.yield };
          return stock;
        }));
      }
    } catch { /* */ }
    setLoading(false);
  };

  useEffect(() => { if (stocks.length > 0) refreshAll(); }, []); // eslint-disable-line

  const totalAnnualIncome = stocks.reduce((s, d) => s + d.annualIncome, 0);
  const totalValue = stocks.reduce((s, d) => s + d.price * d.shares, 0);
  const avgYield = totalValue > 0 ? (totalAnnualIncome / totalValue * 100) : 0;
  const monthlyIncome = totalAnnualIncome / 12;

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Dividend Tracker</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Track dividend income from your holdings</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={refreshAll} disabled={loading || stocks.length === 0}>
            <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Add Stock
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Annual Income", value: `$${totalAnnualIncome.toFixed(2)}`, icon: "💰", color: "var(--accent)" },
          { label: "Monthly Income", value: `$${monthlyIncome.toFixed(2)}`, icon: "📅", color: "var(--blue)" },
          { label: "Avg. Yield", value: `${avgYield.toFixed(2)}%`, icon: "📈", color: "var(--yellow)" },
          { label: "Portfolio Value", value: `$${totalValue.toLocaleString("en", { minimumFractionDigits: 2 })}`, icon: "💎", color: "var(--text-primary)" },
        ].map(c => (
          <div key={c.label} className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{c.icon} {c.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Add Stock */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 20, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Add Dividend Stock</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => { setShowAdd(false); setSearchResult(null); }}><X size={16} /></button>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label className="label">Symbol</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="input" placeholder="KO" value={newSymbol}
                  onChange={e => setNewSymbol(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && lookupStock()} />
                <button className="btn btn-secondary btn-sm" onClick={lookupStock} disabled={searching}>
                  <Search size={14} /> {searching ? "..." : "Look Up"}
                </button>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Shares Owned</label>
              <input className="input" type="number" placeholder="100" value={newShares} onChange={e => setNewShares(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={addStock} disabled={!searchResult || !newShares}>
              <Plus size={14} /> Add
            </button>
          </div>
          {searchResult && (
            <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, background: "var(--accent-light)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 13 }}>
              ✅ <strong>{searchResult.symbol}</strong> — {searchResult.name} — Price: ${searchResult.price.toFixed(2)} — Dividend: ${searchResult.dividend.toFixed(2)}/yr — Yield: {searchResult.yield.toFixed(2)}%
            </div>
          )}
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginRight: 4 }}>Popular:</span>
            {POPULAR_DIVIDEND.map(s => (
              <button key={s} className="btn btn-ghost" style={{ fontSize: 11, padding: "2px 8px" }}
                onClick={() => { setNewSymbol(s); setTimeout(() => { setNewSymbol(s); }, 100); }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {stocks.length === 0 && !showAdd && (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <DollarSign size={48} style={{ color: "var(--text-muted)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No dividend stocks yet</h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>
            Add dividend-paying stocks to track your passive income.
          </p>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Add Your First Dividend Stock
          </button>
        </div>
      )}

      {/* Holdings */}
      {stocks.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Dividend Holdings ({stocks.length})</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Stock", "Price", "Shares", "Dividend/Yr", "Yield", "Annual Income", "Monthly", ""].map(h => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stocks.map(s => (
                <tr key={s.symbol} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-card-hover)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.symbol}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.name}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 14 }}>${s.price.toFixed(2)}</td>
                  <td style={{ padding: "14px 16px", fontSize: 14 }}>{s.shares}</td>
                  <td style={{ padding: "14px 16px", fontSize: 14 }}>${s.dividend.toFixed(2)}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span className={`badge ${s.yield >= 3 ? "badge-green" : s.yield >= 1.5 ? "badge-blue" : "badge-yellow"}`}>
                      {s.yield.toFixed(2)}%
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "var(--accent)" }}>${s.annualIncome.toFixed(2)}</td>
                  <td style={{ padding: "14px 16px", fontSize: 14, color: "var(--text-muted)" }}>${(s.annualIncome / 12).toFixed(2)}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <button onClick={() => removeStock(s.symbol)}
                      style={{ background: "none", color: "var(--text-muted)", padding: 4, border: "none", cursor: "pointer" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--red)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                      <X size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
