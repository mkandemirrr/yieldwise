"use client";
import { useState } from "react";
import { DollarSign, Calendar, TrendingUp, ArrowUpRight, Filter } from "lucide-react";

const DIVIDENDS = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 50, divPerShare: 1.00, frequency: "Quarterly", yield: 0.46, exDate: "2026-05-09", payDate: "2026-05-15", annual: 50.00 },
  { symbol: "MSFT", name: "Microsoft Corp.", shares: 30, divPerShare: 3.32, frequency: "Quarterly", yield: 0.73, exDate: "2026-05-14", payDate: "2026-06-12", annual: 99.60 },
  { symbol: "JNJ", name: "Johnson & Johnson", shares: 25, divPerShare: 5.08, frequency: "Quarterly", yield: 3.12, exDate: "2026-05-22", payDate: "2026-06-03", annual: 127.00 },
  { symbol: "JPM", name: "JPMorgan Chase", shares: 20, divPerShare: 5.00, frequency: "Quarterly", yield: 2.52, exDate: "2026-07-05", payDate: "2026-07-31", annual: 100.00 },
  { symbol: "KO", name: "Coca-Cola Co.", shares: 60, divPerShare: 2.00, frequency: "Quarterly", yield: 2.88, exDate: "2026-06-12", payDate: "2026-07-01", annual: 120.00 },
  { symbol: "PG", name: "Procter & Gamble", shares: 35, divPerShare: 4.03, frequency: "Quarterly", yield: 2.38, exDate: "2026-07-17", payDate: "2026-08-15", annual: 141.05 },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Simulated monthly dividend income
const MONTHLY_INCOME = [42, 55, 42, 55, 98, 42, 120, 55, 42, 98, 42, 55];

export default function DividendPage() {
  const totalAnnual = DIVIDENDS.reduce((s, d) => s + d.annual, 0);
  const totalMonthly = totalAnnual / 12;
  const avgYield = DIVIDENDS.reduce((s, d) => s + d.yield, 0) / DIVIDENDS.length;
  const maxBar = Math.max(...MONTHLY_INCOME);

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Dividend Tracker</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Track your dividend income and upcoming payments</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Annual Income", value: `$${totalAnnual.toFixed(2)}`, icon: <DollarSign size={20} />, color: "var(--accent)" },
          { label: "Monthly Average", value: `$${totalMonthly.toFixed(2)}`, icon: <Calendar size={20} />, color: "var(--blue)" },
          { label: "Avg. Yield", value: `${avgYield.toFixed(2)}%`, icon: <TrendingUp size={20} />, color: "var(--purple)" },
          { label: "Next Payout", value: "May 15", icon: <ArrowUpRight size={20} />, color: "var(--yellow)" },
        ].map(c => (
          <div key={c.label} className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{c.label}</span>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${c.color}15`, display: "flex", alignItems: "center", justifyContent: "center",
                color: c.color,
              }}>{c.icon}</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Monthly Income Chart */}
      <div className="card" style={{ marginBottom: 24, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24 }}>Monthly Dividend Income Projection</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 180 }}>
          {MONTHLY_INCOME.map((val, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)" }}>${val}</span>
              <div style={{
                width: "100%", maxWidth: 48,
                height: `${(val / maxBar) * 140}px`,
                background: i === new Date().getMonth() ? "var(--gradient-green)" : "var(--accent-light)",
                borderRadius: "6px 6px 0 0",
                border: i === new Date().getMonth() ? "none" : "1px solid rgba(16,185,129,0.15)",
                transition: "height 0.5s ease",
              }} />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{MONTHS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dividend Holdings Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Dividend Holdings</h3>
          <button className="btn btn-ghost btn-sm"><Filter size={14} /> Filter</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Stock", "Shares", "Div/Share", "Yield", "Frequency", "Annual Income", "Ex-Date", "Pay Date"].map(h => (
                <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DIVIDENDS.map(d => (
              <tr key={d.symbol} style={{ borderBottom: "1px solid var(--border)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-card-hover)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{d.symbol}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{d.name}</div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 14 }}>{d.shares}</td>
                <td style={{ padding: "14px 16px", fontSize: 14 }}>${d.divPerShare.toFixed(2)}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span className="badge badge-green">{d.yield.toFixed(2)}%</span>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{d.frequency}</td>
                <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "var(--accent)" }}>${d.annual.toFixed(2)}</td>
                <td style={{ padding: "14px 16px", fontSize: 13 }}>{d.exDate}</td>
                <td style={{ padding: "14px 16px", fontSize: 13 }}>{d.payDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
