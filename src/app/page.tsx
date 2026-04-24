"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, BarChart3, PieChart, MessageSquare, Bell, Search, Shield, Zap, Globe, DollarSign, ArrowRight, ChevronRight, Star, Users, Award, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "/blog" },
];

const TICKER_DATA = [
  { symbol: "S&P 500", price: "5,892.34", change: "+1.24%", up: true },
  { symbol: "NASDAQ", price: "19,234.67", change: "+1.87%", up: true },
  { symbol: "AAPL", price: "218.45", change: "+0.92%", up: true },
  { symbol: "MSFT", price: "452.30", change: "-0.34%", up: false },
  { symbol: "GOOGL", price: "178.90", change: "+2.15%", up: true },
  { symbol: "AMZN", price: "198.75", change: "+1.45%", up: true },
  { symbol: "TSLA", price: "245.60", change: "-1.23%", up: false },
  { symbol: "NVDA", price: "892.40", change: "+3.21%", up: true },
  { symbol: "BTC", price: "94,250", change: "+2.8%", up: true },
  { symbol: "EUR/USD", price: "1.1385", change: "-0.12%", up: false },
];

const FEATURES = [
  {
    icon: <PieChart size={28} />,
    title: "AI Portfolio Analyzer",
    desc: "Get instant AI-powered analysis of your portfolio. Sector allocation, risk scoring, diversification insights, and educational breakdowns.",
    color: "var(--accent)",
    bg: "var(--accent-light)",
  },
  {
    icon: <DollarSign size={28} />,
    title: "Dividend Tracker",
    desc: "Track your dividend income across all holdings. Monthly/yearly projections, ex-dividend dates, yield analysis, and payout history.",
    color: "var(--blue)",
    bg: "var(--blue-light)",
  },
  {
    icon: <Search size={28} />,
    title: "Smart Stock Screener",
    desc: "Filter stocks by P/E, Market Cap, Dividend Yield, Beta, and more. AI-powered scoring helps you find hidden gems.",
    color: "var(--purple)",
    bg: "var(--purple-light)",
  },
  {
    icon: <MessageSquare size={28} />,
    title: "AI Financial Chat",
    desc: "Ask anything about your investments in plain English. \"Is my portfolio too risky?\" \"Which stocks pay the best dividends?\"",
    color: "var(--yellow)",
    bg: "var(--yellow-light)",
  },
  {
    icon: <TrendingUp size={28} />,
    title: "Market Signals",
    desc: "Real-time market news with AI sentiment analysis. Know when to buy, hold, or sell with confidence.",
    color: "var(--accent)",
    bg: "var(--accent-light)",
  },
  {
    icon: <Bell size={28} />,
    title: "Price Alerts",
    desc: "Set custom price targets and get notified instantly. Never miss a buying opportunity or a sell signal again.",
    color: "var(--red)",
    bg: "var(--red-light)",
  },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect to get started",
    features: ["3 stocks in portfolio", "Basic stock screener", "3 AI chats per day", "Market overview"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    desc: "For active investors",
    features: ["Unlimited portfolio stocks", "Dividend tracker", "50 AI chats per day", "Full stock screener", "Market signals", "Email alerts"],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Premium",
    price: "$29.99",
    period: "/month",
    desc: "For serious traders",
    features: ["Everything in Pro", "Unlimited AI chats", "Real-time price alerts", "Priority AI responses", "API access", "Portfolio reports (PDF)"],
    cta: "Go Premium",
    popular: false,
  },
];

const STATS = [
  { value: "50K+", label: "Stocks Tracked" },
  { value: "35+", label: "Markets Covered" },
  { value: "99.9%", label: "Uptime" },
  { value: "<1s", label: "AI Response" },
];

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Ticker Bar */}
      <div style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        overflow: "hidden",
        height: 36,
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{
          display: "flex",
          gap: 40,
          animation: "ticker 30s linear infinite",
          whiteSpace: "nowrap",
        }}>
          {[...TICKER_DATA, ...TICKER_DATA].map((t, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500 }}>
              <span style={{ color: "var(--text-muted)" }}>{t.symbol}</span>
              <span style={{ color: "var(--text-primary)" }}>${t.price}</span>
              <span style={{ color: t.up ? "var(--accent)" : "var(--red)", fontSize: 12 }}>{t.change}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "14px 0",
        background: scrolled ? "rgba(10, 14, 23, 0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "var(--gradient-green)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <TrendingUp size={20} color="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>
              Yield<span style={{ color: "var(--accent)" }}>Wise</span>
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} style={{ color: "var(--text-secondary)", fontSize: 14, fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
              >{l.label}</a>
            ))}
            <Link href="/login" className="btn btn-ghost btn-sm">Log In</Link>
            <Link href="/signup" className="btn btn-primary btn-sm">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: "100px 0 80px",
        background: "var(--gradient-hero)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow effects */}
        <div style={{
          position: "absolute", top: "10%", left: "10%", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
          borderRadius: "50%", filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "10%", width: 400, height: 400,
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
          borderRadius: "50%", filter: "blur(60px)",
        }} />

        <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="badge badge-green" style={{ marginBottom: 24 }}>
            <Zap size={14} /> AI-Powered Financial Intelligence
          </div>

          <h1 style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: -2,
            marginBottom: 24,
            maxWidth: 800,
            margin: "0 auto 24px",
          }}>
            Your AI Financial
            <br />
            <span style={{
              background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Assistant
            </span>
          </h1>

          <p style={{
            fontSize: 20, color: "var(--text-secondary)",
            maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.7,
          }}>
            Portfolio analysis, dividend tracking, stock screening, and market signals — all powered by AI. Make smarter investment decisions.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup" className="btn btn-primary btn-lg" id="hero-cta">
              Start Free <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg">
              See Features
            </a>
          </div>

          {/* Stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32,
            maxWidth: 700, margin: "80px auto 0",
          }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 32, fontWeight: 800, color: "var(--accent)" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Dashboard Preview */}
          <div style={{
            marginTop: 80, borderRadius: 16, overflow: "hidden",
            border: "1px solid var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            background: "var(--bg-card)", padding: 20,
            maxWidth: 900, margin: "80px auto 0",
          }}>
            <div style={{
              background: "var(--bg-secondary)", borderRadius: 12, padding: 32,
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
            }}>
              {[
                { label: "Portfolio Value", value: "$127,450.30", change: "+2.4%", up: true },
                { label: "Daily P&L", value: "+$3,012.50", change: "+2.4%", up: true },
                { label: "Dividend Income", value: "$4,820/yr", change: "+12%", up: true },
                { label: "AI Score", value: "87/100", change: "Strong", up: true },
              ].map(m => (
                <div key={m.label} style={{
                  background: "var(--bg-card)", borderRadius: 10, padding: 16,
                  border: "1px solid var(--border)",
                }}>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{m.value}</div>
                  <div style={{ fontSize: 12, color: m.up ? "var(--accent)" : "var(--red)", marginTop: 4 }}>
                    {m.up ? "▲" : "▼"} {m.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "100px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="badge badge-blue" style={{ marginBottom: 16 }}>
              <BarChart3 size={14} /> Powerful Features
            </div>
            <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1.5, marginBottom: 16 }}>
              Everything You Need to Invest
              <span style={{ color: "var(--accent)" }}> Smarter</span>
            </h2>
            <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto" }}>
              Six powerful AI-driven tools that give you an unfair advantage in the market.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="card card-glow" style={{ padding: 32 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: f.bg, display: "flex", alignItems: "center", justifyContent: "center",
                  color: f.color, marginBottom: 20,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        padding: "100px 0",
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1.5, marginBottom: 16 }}>
              Start in <span style={{ color: "var(--accent)" }}>30 Seconds</span>
            </h2>
            <p style={{ fontSize: 18, color: "var(--text-secondary)" }}>
              No credit card required. No complicated setup.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48, maxWidth: 900, margin: "0 auto" }}>
            {[
              { step: "01", title: "Create Your Account", desc: "Sign up for free in seconds. No credit card needed." },
              { step: "02", title: "Add Your Stocks", desc: "Add your holdings or let AI analyze any stock instantly." },
              { step: "03", title: "Get AI Insights", desc: "Explore data-driven analysis, market signals, and educational insights." },
            ].map(s => (
              <div key={s.step} style={{ textAlign: "center" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "var(--gradient-green)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, fontWeight: 800, color: "white",
                  margin: "0 auto 20px", boxShadow: "var(--shadow-glow)",
                }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "100px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="badge badge-green" style={{ marginBottom: 16 }}>
              <DollarSign size={14} /> Simple Pricing
            </div>
            <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1.5, marginBottom: 16 }}>
              Invest in Your <span style={{ color: "var(--accent)" }}>Future</span>
            </h2>
            <p style={{ fontSize: 18, color: "var(--text-secondary)" }}>
              Start free. Upgrade when you are ready.
            </p>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24,
            maxWidth: 1000, margin: "0 auto",
          }}>
            {PRICING.map((p, i) => (
              <div key={i} className="card" style={{
                padding: 32, textAlign: "center", position: "relative",
                border: p.popular ? "2px solid var(--accent)" : "1px solid var(--border)",
                boxShadow: p.popular ? "var(--shadow-glow)" : "none",
              }}>
                {p.popular && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    background: "var(--gradient-green)", padding: "6px 20px",
                    borderRadius: 100, fontSize: 12, fontWeight: 700, color: "white",
                  }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{p.name}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>{p.desc}</p>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 48, fontWeight: 900 }}>{p.price}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: 14 }}>{p.period}</span>
                </div>
                <Link href="/signup" className={`btn ${p.popular ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: "100%", marginBottom: 24 }}>
                  {p.cta} <ChevronRight size={16} />
                </Link>
                <ul style={{ textAlign: "left", listStyle: "none" }}>
                  {p.features.map(f => (
                    <li key={f} style={{
                      padding: "8px 0", fontSize: 14, color: "var(--text-secondary)",
                      display: "flex", alignItems: "center", gap: 10,
                      borderBottom: "1px solid var(--border)",
                    }}>
                      <span style={{ color: "var(--accent)" }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "100px 0",
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <div className="container">
          <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1.5, marginBottom: 16 }}>
            Ready to Invest <span style={{ color: "var(--accent)" }}>Smarter?</span>
          </h2>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
            Join thousands of investors using AI to make better financial decisions.
          </p>
          <Link href="/signup" className="btn btn-primary btn-lg">
            Start Free Today <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "60px 0 30px",
        borderTop: "1px solid var(--border)",
      }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "var(--gradient-green)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <TrendingUp size={16} color="white" />
                </div>
                <span style={{ fontSize: 18, fontWeight: 800 }}>
                  Yield<span style={{ color: "var(--accent)" }}>Wise</span>
                </span>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-muted)", maxWidth: 280, lineHeight: 1.7 }}>
                AI-powered research and education platform helping investors explore markets with real-time data and intelligent analysis.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Product</h4>
              {["Portfolio Analyzer", "Dividend Tracker", "Stock Screener", "AI Chat", "Pricing"].map(l => (
                <a key={l} href="#" style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>{l}</a>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Resources</h4>
              {["Blog", "API Docs", "Help Center", "Changelog"].map(l => (
                <a key={l} href="#" style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>{l}</a>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Legal</h4>
              {["Privacy Policy", "Terms of Service", "Disclaimer"].map(l => (
                <a key={l} href="#" style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>{l}</a>
              ))}
            </div>
          </div>
          <div style={{
            borderTop: "1px solid var(--border)", paddingTop: 24,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              © 2026 YieldWise AI. All rights reserved.
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Not financial advice. AI analysis is for informational purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
