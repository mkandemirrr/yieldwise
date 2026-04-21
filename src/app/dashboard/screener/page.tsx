"use client";
import { useState } from "react";
import { Search, Filter, TrendingUp, TrendingDown, Star, RefreshCw } from "lucide-react";

interface ScreenerStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  marketCap: number;
  pe: number;
  dividend: number;
  yield: number;
  sector: string;
  beta: number;
  volume: number;
}

const WATCHLISTS: Record<string, string[]> = {
  "Tech Giants": ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "AVGO", "CRM", "AMD"],
  "Dividend Kings": ["JNJ", "KO", "PG", "PEP", "MCD", "XOM", "ABBV", "T", "VZ", "O"],
  "Growth Stocks": ["NVDA", "PLTR", "SHOP", "SQ", "SNOW", "NET", "CRWD", "DDOG", "COIN", "MARA"],
  "S&P 500 Top": ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "BRK.B", "JPM", "V", "UNH"],
  "Healthcare": ["JNJ", "UNH", "LLY", "ABBV", "MRK", "PFE", "TMO", "ABT", "DHR", "BMY"],
  "Finance": ["JPM", "V", "MA", "BAC", "GS", "MS", "AXP", "SCHW", "BLK", "SPGI"],
};

export default function ScreenerPage() {
  const [stocks, setStocks] = useState<ScreenerStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedList, setSelectedList] = useState("");
  const [customSymbols, setCustomSymbols] = useState("");
  const [sortBy, setSortBy] = useState<string>("marketCap");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const fetchStocks = async (symbols: string[]) => {
    setLoading(true);
    try {
      const sym = symbols.join(",");
      const [quoteRes, ...profileResponses] = await Promise.all([
        fetch(`/api/fmp?endpoint=batch-quote&symbols=${sym}`),
        ...symbols.map(s => fetch(`/api/fmp?endpoint=profile&symbol=${s}`)),
      ]);
      const quoteData = await quoteRes.json();
      const profiles: any[] = [];
      for (const pr of profileResponses) {
        try {
          const pd = await pr.json();
          if (Array.isArray(pd) && pd[0]) profiles.push(pd[0]);
        } catch { /* skip */ }
      }

      if (Array.isArray(quoteData)) {
        const result: ScreenerStock[] = quoteData.map((q: any) => {
          const profile = profiles.find(p => p.symbol === q.symbol) || {};
          return {
            symbol: q.symbol, name: q.name || q.symbol,
            price: q.price, change: q.change, changePct: q.changePercentage,
            marketCap: q.marketCap || 0,
            pe: profile.pe || 0,
            dividend: profile.lastDividend || 0,
            yield: profile.lastDividend && q.price ? (profile.lastDividend / q.price * 100) : 0,
            sector: profile.sector || "N/A",
            beta: profile.beta || 0,
            volume: q.volume || 0,
          };
        });
        setStocks(result);
      }
    } catch { /* */ }
    setLoading(false);
  };

  const loadWatchlist = (name: string) => {
    setSelectedList(name);
    fetchStocks(WATCHLISTS[name]);
  };

  const searchCustom = () => {
    if (!customSymbols.trim()) return;
    const symbols = customSymbols.toUpperCase().split(",").map(s => s.trim()).filter(Boolean);
    setSelectedList("Custom");
    fetchStocks(symbols);
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    const aVal = (a as any)[sortBy] || 0;
    const bVal = (b as any)[sortBy] || 0;
    return sortDir === "desc" ? bVal - aVal : aVal - bVal;
  });

  const toggleSort = (col: string) => {
    if (sortBy === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const formatMCap = (n: number) => {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
    return `$${n}`;
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Stock Screener</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Screen stocks with real-time data from major indices</p>
      </div>

      {/* Watchlists */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {Object.keys(WATCHLISTS).map(name => (
          <button key={name} className={`btn ${selectedList === name ? "btn-primary" : "btn-secondary"} btn-sm`}
            onClick={() => loadWatchlist(name)} disabled={loading}>
            {name}
          </button>
        ))}
      </div>

      {/* Custom Search */}
      <div className="card" style={{ padding: 16, marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
        <Search size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        <input className="input" placeholder="Enter symbols separated by commas (e.g. AAPL, MSFT, GOOGL)"
          value={customSymbols} onChange={e => setCustomSymbols(e.target.value)}
          onKeyDown={e => e.key === "Enter" && searchCustom()}
          style={{ flex: 1, fontSize: 14 }} />
        <button className="btn btn-primary btn-sm" onClick={searchCustom} disabled={loading}>
          {loading ? <RefreshCw size={14} className="spin" /> : <Search size={14} />} Screen
        </button>
      </div>

      {/* Results */}
      {stocks.length === 0 && !loading ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <Filter size={48} style={{ color: "var(--text-muted)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Select a Watchlist or Search</h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Choose a preset watchlist above or enter custom symbols to screen stocks.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{selectedList || "Results"} ({sortedStocks.length})</h3>
            {loading && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Loading...</span>}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {[
                    { key: "symbol", label: "Symbol" },
                    { key: "price", label: "Price" },
                    { key: "changePct", label: "Change" },
                    { key: "marketCap", label: "Market Cap" },
                    { key: "pe", label: "P/E" },
                    { key: "yield", label: "Div Yield" },
                    { key: "beta", label: "Beta" },
                    { key: "sector", label: "Sector" },
                  ].map(h => (
                    <th key={h.key} onClick={() => toggleSort(h.key)}
                      style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textAlign: "left", cursor: "pointer", userSelect: "none" }}>
                      {h.label} {sortBy === h.key ? (sortDir === "desc" ? "↓" : "↑") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedStocks.map(s => (
                  <tr key={s.symbol} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-card-hover)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{s.symbol}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600 }}>${s.price.toFixed(2)}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span className={`badge ${s.changePct >= 0 ? "badge-green" : "badge-red"}`}>
                        {s.changePct >= 0 ? "+" : ""}{s.changePct.toFixed(2)}%
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 14 }}>{formatMCap(s.marketCap)}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14 }}>{s.pe > 0 ? s.pe.toFixed(1) : "—"}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, color: s.yield > 0 ? "var(--accent)" : "var(--text-muted)" }}>
                      {s.yield > 0 ? `${s.yield.toFixed(2)}%` : "—"}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 14, color: s.beta > 1.2 ? "var(--red)" : s.beta < 0.8 ? "var(--accent)" : "var(--text-secondary)" }}>
                      {s.beta > 0 ? s.beta.toFixed(2) : "—"}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--text-muted)" }}>{s.sector}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
