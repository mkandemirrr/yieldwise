"use client";
import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, Search, RefreshCw, Zap, BarChart3 } from "lucide-react";

interface Signal {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  signal: "BUY" | "SELL" | "HOLD";
  score: number;
  reason: string;
  indicators: { name: string; value: string; signal: "bullish" | "bearish" | "neutral" }[];
}

const POPULAR = ["AAPL", "MSFT", "GOOGL", "NVDA", "AMZN", "META", "TSLA", "JPM"];

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState("");

  const analyzeStock = async (sym?: string) => {
    const target = (sym || symbol).toUpperCase().trim();
    if (!target) return;
    setLoading(true);

    try {
      // Fetch quote + profile
      const [quoteRes, profileRes] = await Promise.all([
        fetch(`/api/fmp?endpoint=batch-quote&symbols=${target}`),
        fetch(`/api/fmp?endpoint=profile&symbol=${target}`),
      ]);
      const quoteData = await quoteRes.json();
      const profileData = await profileRes.json();
      const q = Array.isArray(quoteData) ? quoteData[0] : null;
      const p = Array.isArray(profileData) ? profileData[0] : null;

      if (!q) { setLoading(false); return; }

      // Use AI for analysis
      const aiRes = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Generate a trading signal for ${target}. Current price: $${q.price}. Change today: ${q.changePercentage?.toFixed(2)}%. 
52W High: $${q.yearHigh}, 52W Low: $${q.yearLow}. 50-Day MA: $${q.priceAvg50}, 200-Day MA: $${q.priceAvg200}.
Beta: ${p?.beta || 'N/A'}. PE: ${p?.pe || 'N/A'}. Last Dividend: $${p?.lastDividend || 0}.

Respond in EXACTLY this JSON format (no markdown, no code blocks, just raw JSON):
{"signal":"BUY","score":75,"reason":"Brief 1-sentence reason","indicators":[{"name":"50/200 MA","value":"Bullish Cross","signal":"bullish"},{"name":"RSI","value":"55","signal":"neutral"},{"name":"Volume","value":"Above Avg","signal":"bullish"},{"name":"Valuation","value":"Fair","signal":"neutral"}]}`,
          history: [],
        }),
      });
      const aiData = await aiRes.json();

      let parsed: any = { signal: "HOLD", score: 50, reason: "Analysis pending", indicators: [] };
      try {
        // Try to parse AI response as JSON
        const cleaned = aiData.response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        parsed = JSON.parse(cleaned);
      } catch {
        // Fallback: generate from data
        const above50 = q.price > q.priceAvg50;
        const above200 = q.price > q.priceAvg200;
        const nearHigh = q.yearHigh > 0 ? ((q.yearHigh - q.price) / q.yearHigh * 100) < 10 : false;
        const score = (above50 ? 20 : 0) + (above200 ? 20 : 0) + (q.changePercentage > 0 ? 15 : 0) + (nearHigh ? 10 : 0) + 25;
        parsed = {
          signal: score >= 70 ? "BUY" : score <= 40 ? "SELL" : "HOLD",
          score,
          reason: above50 && above200 ? "Trading above key moving averages" : "Mixed signals from technical indicators",
          indicators: [
            { name: "50-Day MA", value: above50 ? "Above" : "Below", signal: above50 ? "bullish" : "bearish" },
            { name: "200-Day MA", value: above200 ? "Above" : "Below", signal: above200 ? "bullish" : "bearish" },
            { name: "52W Position", value: `${((q.price - q.yearLow) / (q.yearHigh - q.yearLow) * 100).toFixed(0)}%`, signal: nearHigh ? "bullish" : "neutral" },
            { name: "Trend", value: q.changePercentage > 0 ? "Up" : "Down", signal: q.changePercentage > 0 ? "bullish" : "bearish" },
          ],
        };
      }

      const newSignal: Signal = {
        symbol: q.symbol, name: q.name || target,
        price: q.price, change: q.change, changePct: q.changePercentage,
        signal: parsed.signal, score: parsed.score,
        reason: parsed.reason,
        indicators: parsed.indicators || [],
      };

      setSignals(prev => {
        const filtered = prev.filter(s => s.symbol !== target);
        return [newSignal, ...filtered];
      });
    } catch { /* */ }
    setLoading(false);
    setSymbol("");
  };

  const getSignalColor = (signal: string) => {
    if (signal === "BUY") return "var(--accent)";
    if (signal === "SELL") return "var(--red)";
    return "var(--yellow)";
  };

  const getSignalIcon = (signal: string) => {
    if (signal === "BUY") return <TrendingUp size={18} />;
    if (signal === "SELL") return <TrendingDown size={18} />;
    return <Minus size={18} />;
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>AI Trading Signals</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>AI-powered buy/sell/hold signals based on real-time technical analysis</p>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <Zap size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
          <input className="input" placeholder="Enter stock symbol (e.g. AAPL)"
            value={symbol} onChange={e => setSymbol(e.target.value)}
            onKeyDown={e => e.key === "Enter" && analyzeStock()}
            style={{ flex: 1, fontSize: 14 }} />
          <button className="btn btn-primary btn-sm" onClick={() => analyzeStock()} disabled={loading || !symbol.trim()}>
            {loading ? <RefreshCw size={14} className="spin" /> : <BarChart3 size={14} />} Analyze
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Quick:</span>
          {POPULAR.map(s => (
            <button key={s} className="btn btn-ghost" style={{ fontSize: 11, padding: "2px 8px" }}
              onClick={() => analyzeStock(s)} disabled={loading}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="card" style={{ padding: 32, textAlign: "center", marginBottom: 20 }}>
          <RefreshCw size={24} className="spin" style={{ color: "var(--accent)", margin: "0 auto 12px" }} />
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Analyzing with AI + real-time data...</p>
        </div>
      )}

      {/* Signals */}
      {signals.length === 0 && !loading ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <BarChart3 size={48} style={{ color: "var(--text-muted)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No signals yet</h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Enter a stock symbol above to get AI-powered trading signals.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {signals.map(s => (
            <div key={s.symbol} className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${getSignalColor(s.signal)}20`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: getSignalColor(s.signal),
                    border: `2px solid ${getSignalColor(s.signal)}`,
                  }}>
                    {getSignalIcon(s.signal)}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20, fontWeight: 800 }}>{s.symbol}</span>
                      <span className={`badge ${s.signal === "BUY" ? "badge-green" : s.signal === "SELL" ? "badge-red" : "badge-yellow"}`}
                        style={{ fontSize: 13, fontWeight: 700 }}>
                        {s.signal}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.name}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>${s.price.toFixed(2)}</div>
                  <div style={{ fontSize: 13, color: s.changePct >= 0 ? "var(--accent)" : "var(--red)" }}>
                    {s.changePct >= 0 ? "+" : ""}{s.changePct.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* AI Score */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: "var(--text-muted)" }}>AI Score</span>
                  <span style={{ fontWeight: 700, color: getSignalColor(s.signal) }}>{s.score}/100</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "var(--bg-secondary)" }}>
                  <div style={{
                    height: "100%", borderRadius: 4,
                    width: `${s.score}%`,
                    background: `linear-gradient(90deg, ${getSignalColor(s.signal)}80, ${getSignalColor(s.signal)})`,
                    transition: "width 0.5s",
                  }} />
                </div>
              </div>

              {/* Reason */}
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.6 }}>
                💡 {s.reason}
              </p>

              {/* Indicators */}
              {s.indicators.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {s.indicators.map((ind, i) => (
                    <div key={i} style={{
                      padding: "10px 12px", borderRadius: 10,
                      background: ind.signal === "bullish" ? "rgba(16,185,129,0.08)" : ind.signal === "bearish" ? "rgba(239,68,68,0.08)" : "var(--bg-secondary)",
                      border: `1px solid ${ind.signal === "bullish" ? "rgba(16,185,129,0.2)" : ind.signal === "bearish" ? "rgba(239,68,68,0.2)" : "var(--border)"}`,
                    }}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{ind.name}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: ind.signal === "bullish" ? "var(--accent)" : ind.signal === "bearish" ? "var(--red)" : "var(--text-secondary)" }}>
                        {ind.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 20, textAlign: "center" }}>
        ⚠️ AI signals are for informational purposes only. Not financial advice. Always do your own research.
      </p>
    </div>
  );
}
