"use client";
import { useState } from "react";
import { Search, Filter, ArrowUpRight, ArrowDownRight, Star, ChevronDown } from "lucide-react";

interface StockResult {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  up: boolean;
  marketCap: string;
  pe: number;
  divYield: number;
  beta: number;
  sector: string;
  aiScore: number;
}

const SAMPLE_STOCKS: StockResult[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 218.45, change: 2.01, changePct: 0.93, up: true, marketCap: "$3.35T", pe: 28.5, divYield: 0.46, beta: 1.21, sector: "Technology", aiScore: 82 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 452.30, change: -1.55, changePct: -0.34, up: false, marketCap: "$3.36T", pe: 34.2, divYield: 0.73, beta: 0.89, sector: "Technology", aiScore: 88 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 892.40, change: 27.73, changePct: 3.21, up: true, marketCap: "$2.20T", pe: 62.1, divYield: 0.02, beta: 1.68, sector: "Technology", aiScore: 91 },
  { symbol: "JNJ", name: "Johnson & Johnson", price: 162.80, change: 0.45, changePct: 0.28, up: true, marketCap: "$392B", pe: 18.3, divYield: 3.12, beta: 0.55, sector: "Healthcare", aiScore: 75 },
  { symbol: "JPM", name: "JPMorgan Chase", price: 198.60, change: 1.20, changePct: 0.61, up: true, marketCap: "$572B", pe: 12.4, divYield: 2.52, beta: 1.12, sector: "Finance", aiScore: 79 },
  { symbol: "KO", name: "Coca-Cola Co.", price: 69.40, change: -0.22, changePct: -0.32, up: false, marketCap: "$300B", pe: 24.6, divYield: 2.88, beta: 0.58, sector: "Consumer", aiScore: 72 },
  { symbol: "XOM", name: "Exxon Mobil", price: 118.50, change: 2.40, changePct: 2.07, up: true, marketCap: "$480B", pe: 14.1, divYield: 3.25, beta: 0.88, sector: "Energy", aiScore: 68 },
  { symbol: "PG", name: "Procter & Gamble", price: 169.20, change: 0.85, changePct: 0.50, up: true, marketCap: "$399B", pe: 26.8, divYield: 2.38, beta: 0.42, sector: "Consumer", aiScore: 74 },
  { symbol: "V", name: "Visa Inc.", price: 298.70, change: 3.10, changePct: 1.05, up: true, marketCap: "$612B", pe: 30.9, divYield: 0.72, beta: 0.95, sector: "Finance", aiScore: 85 },
  { symbol: "UNH", name: "UnitedHealth Group", price: 542.10, change: -4.30, changePct: -0.79, up: false, marketCap: "$498B", pe: 22.1, divYield: 1.42, beta: 0.72, sector: "Healthcare", aiScore: 77 },
];

export default function ScreenerPage() {
  const [search, setSearch] = useState("");
  const [minYield, setMinYield] = useState("");
  const [maxPE, setMaxPE] = useState("");
  const [sector, setSector] = useState("All");
  const [sortBy, setSortBy] = useState("aiScore");

  const filtered = SAMPLE_STOCKS
    .filter(s => !search || s.symbol.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()))
    .filter(s => !minYield || s.divYield >= Number(minYield))
    .filter(s => !maxPE || s.pe <= Number(maxPE))
    .filter(s => sector === "All" || s.sector === sector)
    .sort((a, b) => (b as any)[sortBy] - (a as any)[sortBy]);

  const scoreColor = (score: number) => score >= 80 ? "var(--accent)" : score >= 65 ? "var(--yellow)" : "var(--red)";

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Smart Stock Screener</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Filter and discover stocks with AI-powered scoring</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 24, display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap", padding: 20 }}>
        <div style={{ flex: 2 }}>
          <label className="label">Search</label>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input className="input" placeholder="Search by symbol or name..."
              value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <label className="label">Min Div Yield %</label>
          <input className="input" type="number" placeholder="0" value={minYield} onChange={e => setMinYield(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <label className="label">Max P/E Ratio</label>
          <input className="input" type="number" placeholder="50" value={maxPE} onChange={e => setMaxPE(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <label className="label">Sector</label>
          <select className="input" value={sector} onChange={e => setSector(e.target.value)}
            style={{ cursor: "pointer" }}>
            {["All", "Technology", "Healthcare", "Finance", "Consumer", "Energy"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>{filtered.length} Results</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Sort by:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 8px", color: "var(--text-primary)", fontSize: 12, cursor: "pointer" }}>
              <option value="aiScore">AI Score</option>
              <option value="divYield">Dividend Yield</option>
              <option value="pe">P/E Ratio</option>
              <option value="marketCap">Market Cap</option>
            </select>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Stock", "Price", "Change", "Market Cap", "P/E", "Div Yield", "Beta", "Sector", "AI Score"].map(h => (
                <th key={h} style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.symbol} style={{ borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-card-hover)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding: "14px 14px" }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.symbol}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.name}</div>
                </td>
                <td style={{ padding: "14px 14px", fontSize: 14, fontWeight: 500 }}>${s.price.toFixed(2)}</td>
                <td style={{ padding: "14px 14px" }}>
                  <span style={{ fontSize: 13, color: s.up ? "var(--accent)" : "var(--red)", display: "flex", alignItems: "center", gap: 2 }}>
                    {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {s.changePct > 0 ? "+" : ""}{s.changePct.toFixed(2)}%
                  </span>
                </td>
                <td style={{ padding: "14px 14px", fontSize: 13 }}>{s.marketCap}</td>
                <td style={{ padding: "14px 14px", fontSize: 13 }}>{s.pe.toFixed(1)}</td>
                <td style={{ padding: "14px 14px" }}><span className="badge badge-green">{s.divYield.toFixed(2)}%</span></td>
                <td style={{ padding: "14px 14px", fontSize: 13 }}>{s.beta.toFixed(2)}</td>
                <td style={{ padding: "14px 14px", fontSize: 12, color: "var(--text-secondary)" }}>{s.sector}</td>
                <td style={{ padding: "14px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 40, height: 6, background: "var(--bg-secondary)", borderRadius: 3 }}>
                      <div style={{ height: "100%", width: `${s.aiScore}%`, background: scoreColor(s.aiScore), borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor(s.aiScore) }}>{s.aiScore}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
