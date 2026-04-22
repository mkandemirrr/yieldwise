"use client";
import Link from "next/link";
import { TrendingUp, Calendar, Clock, ArrowRight, Tag } from "lucide-react";

const POSTS = [
  {
    slug: "best-dividend-stocks-2026",
    title: "7 Best Dividend Stocks to Buy in 2026",
    excerpt: "Looking for reliable passive income? We analyzed hundreds of dividend-paying stocks to find the top picks that combine strong yields with growth potential.",
    date: "April 22, 2026",
    readTime: "6 min read",
    category: "Dividends",
    categoryColor: "var(--accent)",
  },
  {
    slug: "ai-stock-analysis-guide",
    title: "How AI Is Changing Stock Analysis Forever",
    excerpt: "From sentiment analysis to pattern recognition, artificial intelligence is giving retail investors tools that were once reserved for hedge funds. Here's how to use them.",
    date: "April 20, 2026",
    readTime: "8 min read",
    category: "AI & Tech",
    categoryColor: "var(--blue)",
  },
  {
    slug: "portfolio-diversification-strategy",
    title: "The Complete Guide to Portfolio Diversification",
    excerpt: "Don't put all your eggs in one basket — but how many baskets do you actually need? A data-driven approach to building a resilient portfolio.",
    date: "April 18, 2026",
    readTime: "7 min read",
    category: "Strategy",
    categoryColor: "var(--purple)",
  },
  {
    slug: "pe-ratio-explained",
    title: "P/E Ratio Explained: What Every Investor Should Know",
    excerpt: "The price-to-earnings ratio is the most commonly cited valuation metric — but most investors use it wrong. Learn how to interpret P/E like a pro.",
    date: "April 15, 2026",
    readTime: "5 min read",
    category: "Education",
    categoryColor: "var(--yellow)",
  },
];

export default function BlogPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Navbar */}
      <nav style={{
        padding: "16px 0",
        borderBottom: "1px solid var(--border)",
        background: "rgba(10, 14, 23, 0.95)",
        backdropFilter: "blur(20px)",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Link href="/#features" style={{ color: "var(--text-secondary)", fontSize: 14 }}>Features</Link>
            <Link href="/#pricing" style={{ color: "var(--text-secondary)", fontSize: 14 }}>Pricing</Link>
            <Link href="/blog" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 600 }}>Blog</Link>
            <Link href="/signup" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "80px 0 60px", textAlign: "center" }}>
        <div className="container">
          <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, marginBottom: 16 }}>
            YieldWise <span style={{ color: "var(--accent)" }}>Blog</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
            Market insights, investing strategies, and AI-powered analysis — written for modern investors.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section style={{ padding: "0 0 100px" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                <article className="card card-glow" style={{
                  padding: 32, cursor: "pointer",
                  transition: "transform 0.2s, border-color 0.2s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "4px 10px",
                      borderRadius: 6, background: `${post.categoryColor}15`,
                      color: post.categoryColor, display: "flex", alignItems: "center", gap: 4,
                    }}>
                      <Tag size={10} /> {post.category}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Calendar size={12} /> {post.date}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>
                    {post.title}
                  </h2>
                  <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>
                    {post.excerpt}
                  </p>
                  <span style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    Read more <ArrowRight size={14} />
                  </span>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "80px 0",
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <div className="container">
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
            Ready to invest <span style={{ color: "var(--accent)" }}>smarter?</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Try YieldWise AI free — no credit card required.</p>
          <Link href="/signup" className="btn btn-primary btn-lg">
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "24px 0", borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          © 2026 YieldWise AI. Not financial advice.
        </p>
      </footer>
    </div>
  );
}
