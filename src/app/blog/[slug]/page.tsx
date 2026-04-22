"use client";
import Link from "next/link";
import { TrendingUp, Calendar, Clock, ArrowLeft, Tag } from "lucide-react";

const POSTS: Record<string, {
  title: string; date: string; readTime: string; category: string; categoryColor: string;
  content: string;
}> = {
  "best-dividend-stocks-2026": {
    title: "7 Best Dividend Stocks to Buy in 2026",
    date: "April 22, 2026",
    readTime: "6 min read",
    category: "Dividends",
    categoryColor: "var(--accent)",
    content: `
Dividend investing remains one of the most reliable ways to generate passive income in 2026. With interest rates stabilizing and corporate earnings showing resilience, several companies stand out as exceptional income generators.

## Why Dividend Stocks Matter in 2026

The Federal Reserve's recent pivot toward rate cuts has made dividend stocks more attractive than ever. As bond yields decrease, investors are rotating back into high-quality dividend payers. The key is finding companies with **sustainable payout ratios**, **consistent growth**, and **strong free cash flow**.

## Our Top 7 Picks

### 1. Johnson & Johnson (JNJ) — Yield: 3.1%
With 62 consecutive years of dividend increases, JNJ is the gold standard of dividend reliability. Their pharmaceutical pipeline, led by oncology and immunology drugs, provides the cash flow needed to sustain and grow dividends for decades.

**Why we like it:** Defensive healthcare play with best-in-class dividend safety. The post-Kenvue split has created a more focused, higher-margin company.

### 2. Procter & Gamble (PG) — Yield: 2.4%
PG has increased dividends for 68 straight years. Their portfolio of essential brands (Tide, Gillette, Pampers) generates recession-proof revenue. In inflationary environments, their pricing power is a massive advantage.

**Why we like it:** Ultimate defensive stock. Consumer staples demand doesn't disappear during downturns.

### 3. Realty Income (O) — Yield: 5.3%
Known as "The Monthly Dividend Company," Realty Income pays dividends every single month. Their portfolio of 13,000+ properties generates stable rental income, and their investment-grade tenants (Walmart, Dollar General, FedEx) minimize risk.

**Why we like it:** Monthly income + 5%+ yield. Perfect for income-focused portfolios.

### 4. Apple (AAPL) — Yield: 0.5%
While Apple's yield looks tiny, don't dismiss it. Apple generates over $100B in annual free cash flow and has been aggressively growing its dividend by 5-7% annually. Combined with buybacks, total shareholder return is exceptional.

**Why we like it:** Growth + income combo. The services segment is a cash machine.

### 5. Broadcom (AVGO) — Yield: 1.6%
Broadcom has become a semiconductor powerhouse, and their dividend growth has been extraordinary — more than doubling over the past five years. Their AI infrastructure chips are driving the next wave of growth.

**Why we like it:** AI tailwind + aggressive dividend growth trajectory.

### 6. NextEra Energy (NEE) — Yield: 2.8%
The largest renewable energy producer in the world, NextEra benefits from the global shift to clean energy. Regulated utility revenue provides baseline stability, while their renewable subsidiary (NextEra Energy Partners) offers growth.

**Why we like it:** Clean energy megatrend + utility stability = reliable income growth.

### 7. JPMorgan Chase (JPM) — Yield: 2.2%
Under Jamie Dimon's leadership, JPM has become the most well-run bank in America. Their diversified revenue streams (investment banking, consumer banking, asset management) and fortress balance sheet make the dividend extremely safe.

**Why we like it:** Best-of-breed financials with growing dividends and consistent buybacks.

## How to Build a Dividend Portfolio

The ideal dividend portfolio combines:
- **High-yield stalwarts** (Realty Income, JNJ) for current income
- **Dividend growers** (Apple, Broadcom) for future income growth
- **Sector diversification** across healthcare, tech, utilities, financials, and REITs

A portfolio equally weighted across these 7 stocks would yield approximately **2.6% blended**, growing at **6-8% annually** through dividend increases alone.

## Track Your Dividends with AI

Want to see exactly how much dividend income your portfolio generates? YieldWise AI's **Dividend Tracker** calculates your projected annual income, flags upcoming ex-dividend dates, and suggests higher-yielding alternatives — all powered by artificial intelligence.

---

*This article is for educational purposes only and does not constitute financial advice. Always conduct your own research before making investment decisions.*
    `,
  },
  "ai-stock-analysis-guide": {
    title: "How AI Is Changing Stock Analysis Forever",
    date: "April 20, 2026",
    readTime: "8 min read",
    category: "AI & Tech",
    categoryColor: "var(--blue)",
    content: `
Artificial intelligence isn't just a buzzword in finance — it's fundamentally reshaping how investors analyze stocks, manage risk, and identify opportunities. What used to require a team of analysts and expensive Bloomberg terminals is now accessible to anyone with a smartphone.

## The Traditional Problem

For decades, retail investors were at a disadvantage. Institutional investors had access to:
- Real-time data feeds costing thousands per month
- Teams of analysts producing detailed research reports
- Quantitative models running on expensive infrastructure
- Sentiment analysis from proprietary news feeds

The average retail investor? They had Yahoo Finance and gut instinct.

## Enter AI-Powered Analysis

Modern AI tools have democratized financial analysis in three major ways:

### 1. Natural Language Processing (NLP)

AI can now read and interpret thousands of earnings calls, SEC filings, and news articles in seconds. Instead of spending hours reading a 10-K filing, you can ask an AI assistant: *"What are the biggest risks mentioned in Apple's latest annual report?"*

NLP models can also detect **sentiment shifts** in analyst commentary. When an analyst subtly changes their tone from "cautiously optimistic" to "maintaining our position," AI catches these nuances that humans might miss.

### 2. Pattern Recognition

Machine learning models excel at identifying patterns in historical price data, volume trends, and technical indicators. While no model can predict the future with certainty, AI can identify:

- **Unusual volume patterns** that may signal institutional buying
- **Technical indicator convergence** (RSI, MACD, moving averages)
- **Correlation breakdowns** between assets that historically move together
- **Seasonal patterns** in specific sectors or stocks

### 3. Portfolio Optimization

AI takes Modern Portfolio Theory to the next level. Instead of simple mean-variance optimization, AI models can:

- Factor in **non-linear correlations** between assets
- Adjust for **regime changes** (bull market vs. bear market behavior)
- Optimize for **multiple objectives** simultaneously (return, risk, income, tax efficiency)
- Stress-test portfolios against **thousands of scenarios**

## Real-World Applications

### Earnings Analysis
Before an earnings report, AI can analyze revenue trends, margin trajectory, and guidance expectations across an entire sector. After the report, it can instantly compare results to consensus and historical patterns.

### Risk Assessment
AI can calculate your portfolio's true risk exposure by analyzing correlations that shift during market stress. Your portfolio might look diversified in normal times, but AI can reveal hidden concentration risks.

### Dividend Safety Scoring
By analyzing payout ratios, free cash flow trends, debt levels, and industry dynamics, AI can score dividend safety on a scale from 0-100 — helping you avoid dividend traps before they cut.

## The Human + AI Advantage

The smartest approach isn't to blindly follow AI — it's to use AI as a **force multiplier** for your own research. AI handles the data processing and pattern recognition; you bring judgment, context, and an understanding of your personal financial goals.

Think of AI as your research analyst that works 24/7, reads everything, and never gets tired. But you're still the portfolio manager making the final calls.

## Getting Started with AI Analysis

YieldWise AI combines all of these capabilities into a single platform. Ask questions in plain English, get real-time analysis powered by live market data, and make more informed investment decisions — all for free.

---

*This article is for educational purposes only and does not constitute financial advice.*
    `,
  },
  "portfolio-diversification-strategy": {
    title: "The Complete Guide to Portfolio Diversification",
    date: "April 18, 2026",
    readTime: "7 min read",
    category: "Strategy",
    categoryColor: "var(--purple)",
    content: `
"Don't put all your eggs in one basket" is investing's most famous advice. But true diversification is more nuanced than simply owning lots of stocks. Here's a data-driven approach to building a resilient portfolio.

## What Diversification Really Means

Diversification isn't just about the number of holdings — it's about **reducing correlated risk**. Owning 20 tech stocks isn't diversified. Owning 10 stocks across 8 sectors, 3 market caps, and 2 geographies? That's diversification.

The goal is to combine assets that don't all move in the same direction at the same time, so when one part of your portfolio struggles, another part holds steady or gains.

## The Five Dimensions of Diversification

### 1. Sector Diversification
The S&P 500 has 11 sectors. A well-diversified portfolio should have meaningful exposure to at least 6-7:

| Sector | Role in Portfolio |
|--------|------------------|
| Technology | Growth engine |
| Healthcare | Defensive + innovation |
| Financials | Economic cycle exposure |
| Consumer Staples | Recession protection |
| Industrials | Economic growth proxy |
| Utilities/REITs | Income generation |
| Energy | Inflation hedge |

### 2. Market Cap Diversification
Don't ignore smaller companies. Historically, small-cap stocks have outperformed large-caps over long periods, albeit with higher volatility.

- **Large-cap (70%):** Stability, dividends, lower volatility
- **Mid-cap (20%):** Growth potential with moderate risk
- **Small-cap (10%):** High growth potential, higher volatility

### 3. Geographic Diversification
The U.S. represents about 60% of global stock market capitalization. That means 40% of opportunities exist outside the U.S. Consider allocating 15-25% of your equity portfolio internationally.

### 4. Asset Class Diversification
Stocks alone aren't enough. A robust portfolio includes:
- **Stocks (60-80%):** Primary growth driver
- **Bonds (10-25%):** Stability and income
- **REITs (5-10%):** Real estate exposure and income
- **Alternatives (0-5%):** Gold, commodities, or crypto

### 5. Time Diversification (Dollar-Cost Averaging)
Don't invest everything at once. Systematic investing over time smooths out volatility and removes the emotional pressure of market timing.

## The Magic Number: How Many Stocks?

Research shows that **15-25 stocks** across different sectors capture about 90% of diversification benefits. Beyond 30 stocks, the marginal benefit of adding another holding approaches zero.

However, if you prefer simplicity, a **3-fund portfolio** (U.S. total market + International + Bonds) provides instant diversification with minimal effort.

## Common Diversification Mistakes

1. **Over-diversification:** Owning 100+ stocks dilutes your best ideas
2. **Fake diversification:** Owning 10 tech stocks isn't diversified
3. **Home country bias:** Only investing in your home market
4. **Ignoring correlations:** Two stocks in different sectors can still be highly correlated
5. **Set and forget:** Diversification needs periodic rebalancing

## How AI Can Help

YieldWise AI's **Portfolio Analyzer** instantly evaluates your diversification across all five dimensions. It identifies concentration risks, suggests rebalancing opportunities, and scores your portfolio's overall health on a 0-100 scale.

Upload your holdings and get a professional-grade diversification analysis in seconds — completely free.

---

*This article is for educational purposes only and does not constitute financial advice.*
    `,
  },
  "pe-ratio-explained": {
    title: "P/E Ratio Explained: What Every Investor Should Know",
    date: "April 15, 2026",
    readTime: "5 min read",
    category: "Education",
    categoryColor: "var(--yellow)",
    content: `
The price-to-earnings (P/E) ratio is the most widely used stock valuation metric in the world. But despite its popularity, most investors don't fully understand what it tells them — or more importantly, what it doesn't.

## What Is the P/E Ratio?

The P/E ratio measures how much investors are willing to pay for each dollar of a company's earnings:

**P/E = Stock Price ÷ Earnings Per Share (EPS)**

For example, if a stock trades at $100 and earns $5 per share, its P/E is 20. This means investors are paying $20 for every $1 of current earnings.

## Trailing vs. Forward P/E

- **Trailing P/E:** Uses the past 12 months of actual earnings. This is backward-looking but based on real numbers.
- **Forward P/E:** Uses analysts' estimates for the next 12 months. This is forward-looking but based on projections that may be wrong.

As a general rule, use **forward P/E** when the company's earnings are expected to change significantly, and **trailing P/E** when earnings are stable.

## What's a "Good" P/E?

There's no universal answer, but here are some benchmarks:

| P/E Range | Typical Interpretation |
|-----------|----------------------|
| Under 10 | Potentially undervalued or in trouble |
| 10-15 | Value territory |
| 15-25 | Fair value for quality companies |
| 25-40 | Growth premium |
| 40+ | High expectations priced in |

**Critical caveat:** P/E must always be compared within context:
- Compare to the **industry average** (tech companies naturally trade higher than utilities)
- Compare to the **company's own history** (is it expensive vs. its 5-year average?)
- Compare to the **market average** (S&P 500 historically trades at ~16-18x)

## When P/E Misleads You

### 1. Negative Earnings
Companies with losses have no meaningful P/E. A negative P/E is useless. Use price-to-sales (P/S) or price-to-book (P/B) instead.

### 2. Cyclical Companies
Cyclical businesses (energy, mining, auto) have artificially low P/Es at the top of the cycle (high earnings) and high P/Es at the bottom (low earnings). This is the "P/E trap" — a low P/E on a cyclical stock might actually signal you're buying at the peak.

### 3. One-Time Items
Huge one-time gains or losses can distort EPS. Always check if earnings are "clean" or affected by unusual items (asset sales, restructuring charges, tax windfalls).

### 4. Growth Rate Ignored
A P/E of 30 on a company growing earnings at 40% annually is actually cheaper than a P/E of 15 on a company with flat earnings. This is why the **PEG ratio** (P/E ÷ growth rate) exists. A PEG under 1.0 generally indicates value relative to growth.

## The PEG Ratio: P/E's Smarter Cousin

**PEG = P/E ÷ Expected Annual EPS Growth Rate**

| PEG | Interpretation |
|-----|---------------|
| Under 1.0 | Potentially undervalued for its growth |
| 1.0-2.0 | Fairly valued |
| Over 2.0 | Potentially overvalued |

Example: NVIDIA at 35x P/E with 30% earnings growth = PEG of 1.17 (reasonable). A utility at 18x P/E with 3% growth = PEG of 6.0 (expensive for growth).

## Putting It All Together

The P/E ratio is a starting point, not a conclusion. Always use it alongside:
- **Free cash flow yield** (FCF/market cap)
- **Revenue growth trends**
- **Return on equity (ROE)**
- **Debt levels**
- **Industry comparisons**

## Let AI Do the Math

YieldWise AI's **Stock Screener** lets you filter thousands of stocks by P/E, PEG, dividend yield, market cap, and dozens of other metrics. Our AI then scores each stock and explains why it might be undervalued or overvalued — in plain English.

---

*This article is for educational purposes only and does not constitute financial advice.*
    `,
  },
};

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = require("react").use(params);
  const post = POSTS[slug];

  if (!post) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 16 }}>404</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Post not found</p>
          <Link href="/blog" className="btn btn-primary">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  // Convert markdown-ish content to HTML
  const formatContent = (text: string) => {
    return text
      .split("\n")
      .map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <br key={i} />;
        if (trimmed.startsWith("### "))
          return <h3 key={i} style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>{trimmed.slice(4)}</h3>;
        if (trimmed.startsWith("## "))
          return <h2 key={i} style={{ fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 16, color: "var(--accent)" }}>{trimmed.slice(3)}</h2>;
        if (trimmed.startsWith("| ")) {
          // Simple table rendering
          const cells = trimmed.split("|").filter(c => c.trim()).map(c => c.trim());
          if (trimmed.includes("---")) return null;
          const isHeader = i > 0;
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: `1fr 2fr`, gap: 1,
              fontSize: 14, borderBottom: "1px solid var(--border)",
            }}>
              {cells.map((cell, ci) => (
                <div key={ci} style={{
                  padding: "10px 12px",
                  background: "var(--bg-secondary)",
                  fontWeight: ci === 0 ? 600 : 400,
                  color: ci === 0 ? "var(--text-primary)" : "var(--text-secondary)",
                }}>
                  {cell}
                </div>
              ))}
            </div>
          );
        }
        if (trimmed.startsWith("- **"))
          return (
            <div key={i} style={{ paddingLeft: 20, marginBottom: 8, fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>
              • {trimmed.slice(2).split("**").map((part, pi) =>
                pi % 2 === 1 ? <strong key={pi} style={{ color: "var(--text-primary)" }}>{part}</strong> : part
              )}
            </div>
          );
        if (trimmed.startsWith("1. ") || trimmed.startsWith("2. ") || trimmed.startsWith("3. ") || trimmed.startsWith("4. ") || trimmed.startsWith("5. "))
          return (
            <div key={i} style={{ paddingLeft: 20, marginBottom: 8, fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {trimmed.split("**").map((part, pi) =>
                pi % 2 === 1 ? <strong key={pi} style={{ color: "var(--text-primary)" }}>{part}</strong> : part
              )}
            </div>
          );
        if (trimmed.startsWith("**") && trimmed.endsWith("**"))
          return <p key={i} style={{ fontSize: 15, fontWeight: 600, marginTop: 16, marginBottom: 8 }}>{trimmed.slice(2, -2)}</p>;
        if (trimmed.startsWith("*") && trimmed.endsWith("*"))
          return <p key={i} style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic", marginTop: 24 }}>{trimmed.slice(1, -1)}</p>;
        if (trimmed === "---")
          return <hr key={i} style={{ border: "none", borderTop: "1px solid var(--border)", margin: "32px 0" }} />;

        // Regular paragraph with bold support
        return (
          <p key={i} style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 8 }}>
            {trimmed.split("**").map((part, pi) =>
              pi % 2 === 1 ? <strong key={pi} style={{ color: "var(--text-primary)" }}>{part}</strong> : part
            )}
          </p>
        );
      })
      .filter(Boolean);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{
        padding: "16px 0", borderBottom: "1px solid var(--border)",
        background: "rgba(10,14,23,0.95)", backdropFilter: "blur(20px)",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--gradient-green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={16} color="white" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800 }}>Yield<span style={{ color: "var(--accent)" }}>Wise</span></span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Link href="/blog" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 600 }}>Blog</Link>
            <Link href="/signup" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article style={{ padding: "60px 0 100px" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <Link href="/blog" style={{ fontSize: 14, color: "var(--accent)", display: "flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
            <ArrowLeft size={14} /> Back to Blog
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6,
              background: `${post.categoryColor}15`, color: post.categoryColor,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <Tag size={10} /> {post.category}
            </span>
            <span style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
              <Calendar size={12} /> {post.date}
            </span>
            <span style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={12} /> {post.readTime}
            </span>
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.2, letterSpacing: -1.5, marginBottom: 40 }}>
            {post.title}
          </h1>

          <div>{formatContent(post.content)}</div>

          {/* CTA */}
          <div className="card" style={{
            marginTop: 48, padding: 32, textAlign: "center",
            border: "2px solid var(--accent)",
            background: "rgba(16,185,129,0.05)",
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              Try YieldWise AI — Free
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
              AI portfolio analysis, dividend tracking, and market signals. No credit card required.
            </p>
            <Link href="/signup" className="btn btn-primary">Get Started Free →</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
