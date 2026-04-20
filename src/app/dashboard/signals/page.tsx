"use client";
import { TrendingUp, TrendingDown, AlertCircle, Clock, ArrowUpRight, ArrowDownRight, Newspaper, BarChart3 } from "lucide-react";

const SIGNALS = [
  { type: "bullish", symbol: "NVDA", title: "Strong Momentum Signal", desc: "MACD bullish crossover with RSI at 62. Volume surge 45% above 20-day average. AI confidence: 84%.", time: "2 min ago", confidence: 84 },
  { type: "bearish", symbol: "TSLA", title: "Bearish Divergence Detected", desc: "Price making higher highs but RSI making lower highs. Volume declining on up days. Watch support at $240.", time: "15 min ago", confidence: 71 },
  { type: "bullish", symbol: "AAPL", title: "Earnings Beat Expected", desc: "Consensus estimates upgraded by 3 analysts this week. Services revenue growing at 14% YoY. Options flow bullish.", time: "1 hr ago", confidence: 76 },
  { type: "neutral", symbol: "MSFT", title: "AI Cloud Growth Accelerating", desc: "Azure AI revenue up 60% YoY per latest report. Strong enterprise adoption. Price near resistance at $460.", time: "2 hr ago", confidence: 68 },
  { type: "bullish", symbol: "JPM", title: "Financial Sector Upgrade", desc: "Fed rate cuts expected in Q3. Net interest margin expanding. Dividend payout healthy at 27%.", time: "3 hr ago", confidence: 72 },
  { type: "bearish", symbol: "KO", title: "Consumer Spending Slowdown", desc: "Retail sales data weaker than expected. Consumer staples may face margin pressure. Watch for earnings guidance.", time: "4 hr ago", confidence: 58 },
];

const NEWS = [
  { title: "Fed Signals Possible Rate Cut in June Meeting", source: "Reuters", time: "30 min ago", sentiment: "bullish" },
  { title: "NVIDIA Announces Next-Gen AI Chip Architecture", source: "Bloomberg", time: "1 hr ago", sentiment: "bullish" },
  { title: "US-China Trade Tensions Escalate Over Tech Export Controls", source: "CNBC", time: "2 hr ago", sentiment: "bearish" },
  { title: "Tesla Q1 Deliveries Beat Expectations by 8%", source: "MarketWatch", time: "3 hr ago", sentiment: "bullish" },
  { title: "Oil Prices Drop 3% on OPEC Production Increase", source: "WSJ", time: "4 hr ago", sentiment: "bearish" },
];

export default function SignalsPage() {
  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Market Signals</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>AI-analyzed market signals and news sentiment</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Signals */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>AI Trading Signals</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SIGNALS.map((s, i) => (
              <div key={i} className="card" style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: s.type === "bullish" ? "var(--accent-light)" : s.type === "bearish" ? "var(--red-light)" : "var(--yellow-light)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: s.type === "bullish" ? "var(--accent)" : s.type === "bearish" ? "var(--red)" : "var(--yellow)",
                    }}>
                      {s.type === "bullish" ? <TrendingUp size={18} /> : s.type === "bearish" ? <TrendingDown size={18} /> : <BarChart3 size={18} />}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{s.symbol}</span>
                        <span className={`badge ${s.type === "bullish" ? "badge-green" : s.type === "bearish" ? "badge-red" : "badge-yellow"}`}>
                          {s.type.charAt(0).toUpperCase() + s.type.slice(1)}
                        </span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{s.title}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)", fontSize: 12 }}>
                    <Clock size={12} /> {s.time}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 12 }}>{s.desc}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>AI Confidence:</span>
                  <div style={{ width: 80, height: 6, background: "var(--bg-secondary)", borderRadius: 3 }}>
                    <div style={{
                      height: "100%", width: `${s.confidence}%`, borderRadius: 3,
                      background: s.confidence >= 75 ? "var(--accent)" : s.confidence >= 60 ? "var(--yellow)" : "var(--red)",
                    }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{s.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* News */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Market News</h3>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {NEWS.map((n, i) => (
              <div key={i} style={{
                padding: "16px 20px",
                borderBottom: i < NEWS.length - 1 ? "1px solid var(--border)" : "none",
                cursor: "pointer", transition: "background 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-card-hover)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", marginTop: 6, flexShrink: 0,
                    background: n.sentiment === "bullish" ? "var(--accent)" : "var(--red)",
                  }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5, marginBottom: 6 }}>{n.title}</div>
                    <div style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
                      <span>{n.source}</span>
                      <span>•</span>
                      <span>{n.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
