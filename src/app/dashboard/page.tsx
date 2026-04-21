"use client";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, ArrowUpRight, ArrowDownRight, Plus, Search, Star, Zap, RefreshCw } from "lucide-react";

interface Quote {
  symbol: string;
  name: string;
  price: number;
  changePercentage: number;
  change: number;
  volume: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  open: number;
  previousClose: number;
}

const WATCHLIST_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "NVDA", "AMZN", "TSLA"];
const MARKET_SYMBOLS = ["SPY", "QQQ", "DIA", "IWM"];
const MARKET_NAMES: Record<string, string> = {
  SPY: "S&P 500",
  QQQ: "NASDAQ 100",
  DIA: "Dow Jones",
  IWM: "Russell 2000",
};

const AI_INSIGHTS = [
  { type: "alert", title: "AAPL earnings report in 3 days", desc: "Historical volatility increases 15% around earnings. Consider adjusting position size.", color: "var(--yellow)" },
  { type: "tip", title: "Portfolio is tech-heavy (68%)", desc: "Consider adding healthcare or consumer staples for better diversification.", color: "var(--blue)" },
  { type: "signal", title: "NVDA shows strong momentum", desc: "RSI at 62, MACD bullish crossover. AI confidence: 78%.", color: "var(--accent)" },
];

const SECTOR_DATA = [
  { name: "Technology", pct: 45, color: "var(--accent)" },
  { name: "Healthcare", pct: 15, color: "var(--blue)" },
  { name: "Finance", pct: 12, color: "var(--purple)" },
  { name: "Consumer", pct: 10, color: "var(--yellow)" },
  { name: "Energy", pct: 8, color: "var(--red)" },
  { name: "Other", pct: 10, color: "var(--text-muted)" },
];

function formatMarketCap(n: number) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
}

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [watchlist, setWatchlist] = useState<Quote[]>([]);
  const [market, setMarket] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [watchRes, marketRes] = await Promise.all([
        fetch(`/api/fmp?endpoint=batch-quote&symbols=${WATCHLIST_SYMBOLS.join(",")}`),
        fetch(`/api/fmp?endpoint=batch-quote&symbols=${MARKET_SYMBOLS.join(",")}`),
      ]);
      const watchData = await watchRes.json();
      const marketData = await marketRes.json();

      if (Array.isArray(watchData)) setWatchlist(watchData);
      if (Array.isArray(marketData)) setMarket(marketData);
      setLastUpdated(new Date());
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Calculate portfolio stats from watchlist (demo: equal shares)
  const totalValue = watchlist.reduce((sum, s) => sum + s.price * 10, 0);
  const totalChange = watchlist.reduce((sum, s) => sum + s.change * 10, 0);
  const totalChangePct = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0;

  const PORTFOLIO_STATS = [
    { label: "Portfolio Value", value: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: `${totalChange >= 0 ? "+" : ""}$${totalChange.toFixed(2)}`, pct: `${totalChange >= 0 ? "+" : ""}${totalChangePct.toFixed(2)}%`, up: totalChange >= 0, icon: <BarChart3 size={20} /> },
    { label: "Daily P&L", value: `${totalChange >= 0 ? "+" : ""}$${totalChange.toFixed(2)}`, change: "Today", pct: `${totalChange >= 0 ? "+" : ""}${totalChangePct.toFixed(2)}%`, up: totalChange >= 0, icon: <TrendingUp size={20} /> },
    { label: "Dividend Income", value: "$4,820/yr", change: "$401.67/mo", pct: "3.78% yield", up: true, icon: <DollarSign size={20} /> },
    { label: "AI Health Score", value: "87/100", change: "Strong", pct: "Well Diversified", up: true, icon: <Zap size={20} /> },
  ];

  const filteredWatchlist = searchTerm
    ? watchlist.filter(s => s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : watchlist;

  return (
    <div style={{ padding: "28px 32px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
            Welcome back! Here&apos;s your financial overview.
            {lastUpdated && (
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input className="input" placeholder="Search stocks..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: 240, paddingLeft: 38, fontSize: 13 }} />
          </div>
          <button className="btn btn-ghost btn-sm" onClick={fetchData} title="Refresh">
            <RefreshCw size={16} className={loading ? "spin" : ""} />
          </button>
          <button className="btn btn-primary btn-sm">
            <Plus size={16} /> Add Stock
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 28 }}>
        {PORTFOLIO_STATS.map(s => (
          <div key={s.label} className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.label}</span>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: s.up ? "var(--accent-light)" : "var(--red-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: s.up ? "var(--accent)" : "var(--red)",
              }}>
                {s.icon}
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>{loading ? "—" : s.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: s.up ? "var(--accent)" : "var(--red)",
                display: "flex", alignItems: "center", gap: 2,
              }}>
                {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {s.pct}
              </span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Watchlist */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{
            padding: "16px 20px", borderBottom: "1px solid var(--border)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              Watchlist
              <span className="badge badge-green" style={{ fontSize: 11 }}>LIVE</span>
            </h3>
            <button className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
              <Plus size={14} /> Add
            </button>
          </div>
          <div>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                Loading live data...
              </div>
            ) : filteredWatchlist.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                No stocks found
              </div>
            ) : (
              filteredWatchlist.map((stock, i) => (
                <div key={stock.symbol} style={{
                  padding: "14px 20px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  borderBottom: i < filteredWatchlist.length - 1 ? "1px solid var(--border)" : "none",
                  cursor: "pointer", transition: "background 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-card-hover)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: "var(--bg-secondary)", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: "var(--accent)",
                    }}>
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{stock.symbol}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{stock.name}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>${stock.price.toFixed(2)}</div>
                    <div style={{
                      fontSize: 12, fontWeight: 500,
                      color: stock.change >= 0 ? "var(--accent)" : "var(--red)",
                      display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2,
                    }}>
                      {stock.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercentage >= 0 ? "+" : ""}{stock.changePercentage.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Market Overview */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Market Overview</h3>
              <span className="badge badge-green" style={{ fontSize: 11 }}>LIVE</span>
            </div>
            {loading ? (
              <div style={{ padding: 30, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
            ) : (
              market.map((m, i) => (
                <div key={m.symbol} style={{
                  padding: "12px 20px", display: "flex", justifyContent: "space-between",
                  borderBottom: i < market.length - 1 ? "1px solid var(--border)" : "none",
                }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{MARKET_NAMES[m.symbol] || m.symbol}</span>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>${m.price.toFixed(2)}</span>
                    <span style={{
                      fontSize: 12,
                      color: m.changePercentage >= 0 ? "var(--accent)" : "var(--red)",
                      fontWeight: 500,
                    }}>
                      {m.changePercentage >= 0 ? "+" : ""}{m.changePercentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sector Allocation */}
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Sector Allocation</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SECTOR_DATA.map(s => (
                <div key={s.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: 6, background: "var(--bg-secondary)", borderRadius: 3 }}>
                    <div style={{
                      height: "100%", width: `${s.pct}%`,
                      background: s.color, borderRadius: 3,
                      transition: "width 0.5s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{
          padding: "16px 20px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Zap size={16} style={{ color: "var(--accent)" }} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>AI Insights</h3>
          <span className="badge badge-green" style={{ marginLeft: 8, fontSize: 11 }}>Live</span>
        </div>
        {AI_INSIGHTS.map((insight, i) => (
          <div key={i} style={{
            padding: "16px 20px", display: "flex", gap: 14,
            borderBottom: i < AI_INSIGHTS.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: insight.color, marginTop: 6, flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{insight.title}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{insight.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
