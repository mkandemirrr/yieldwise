"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, TrendingUp, BarChart3, DollarSign, Shield, RotateCcw } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  { text: "Analyze Apple stock", icon: <TrendingUp size={14} /> },
  { text: "Best dividend stocks to buy", icon: <DollarSign size={14} /> },
  { text: "Is my portfolio too risky?", icon: <Shield size={14} /> },
  { text: "Compare NVDA vs AMD", icon: <BarChart3 size={14} /> },
  { text: "What ETFs should I invest in?", icon: <TrendingUp size={14} /> },
  { text: "Tech sector outlook 2026", icon: <BarChart3 size={14} /> },
];

// Simple markdown-like rendering
function renderContent(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    // Bold
    let rendered = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Bullet points
    if (rendered.startsWith("- ") || rendered.startsWith("• ")) {
      rendered = `<span style="color:var(--accent);margin-right:6px">•</span>${rendered.slice(2)}`;
      return <div key={i} style={{ paddingLeft: 8, marginBottom: 2 }} dangerouslySetInnerHTML={{ __html: rendered }} />;
    }
    // Headers
    if (rendered.startsWith("## ")) {
      return <div key={i} style={{ fontWeight: 700, fontSize: 15, marginTop: 12, marginBottom: 4, color: "var(--text-primary)" }} dangerouslySetInnerHTML={{ __html: rendered.slice(3) }} />;
    }
    if (rendered.startsWith("# ")) {
      return <div key={i} style={{ fontWeight: 800, fontSize: 16, marginTop: 12, marginBottom: 6, color: "var(--text-primary)" }} dangerouslySetInnerHTML={{ __html: rendered.slice(2) }} />;
    }
    // Empty line
    if (rendered.trim() === "") return <div key={i} style={{ height: 8 }} />;
    // Regular line
    return <div key={i} dangerouslySetInnerHTML={{ __html: rendered }} />;
  });
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 **Welcome to YieldWise AI!**\n\nI'm your personal financial assistant powered by real-time market data + AI.\n\n**What I can do:**\n- 📈 Analyze any stock with live prices\n- 💰 Find the best dividend opportunities\n- 🎯 Evaluate your portfolio risk\n- 📊 Compare stocks side-by-side\n- 🌎 Provide market outlook and trends\n\nTry one of the suggestions below or ask me anything!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;

    const userMsg: Message = { role: "user", content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: messages.slice(-8) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response || "I couldn't process that. Please try again.",
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ Connection error. Please check your internet and try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <div style={{
        padding: "16px 32px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "var(--gradient-green)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              AI Financial Chat
              <span className="badge badge-green" style={{ fontSize: 10 }}>LIVE DATA</span>
            </h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Powered by Claude AI + Real-Time Market Data</p>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setMessages([messages[0]])} title="New Chat">
          <RotateCcw size={16} /> New Chat
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px 32px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex", gap: 12, marginBottom: 20,
            flexDirection: m.role === "user" ? "row-reverse" : "row",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: m.role === "user" ? "var(--blue-light)" : "var(--accent-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: m.role === "user" ? "var(--blue)" : "var(--accent)",
            }}>
              {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div style={{
              maxWidth: "75%", padding: "14px 18px", borderRadius: 14,
              background: m.role === "user" ? "var(--blue-light)" : "var(--bg-card)",
              border: `1px solid ${m.role === "user" ? "rgba(59,130,246,0.2)" : "var(--border)"}`,
              fontSize: 14, lineHeight: 1.7, color: "var(--text-secondary)",
            }}>
              {m.role === "assistant" ? renderContent(m.content) : m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "var(--accent-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--accent)",
            }}>
              <Bot size={16} />
            </div>
            <div style={{
              padding: "14px 18px", borderRadius: 14,
              background: "var(--bg-card)", border: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: "var(--accent)",
                      animation: `pulse-green 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
                Analyzing with real-time data...
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding: "0 32px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SUGGESTIONS.map(s => (
            <button key={s.text} onClick={() => sendMessage(s.text)}
              className="btn btn-secondary btn-sm" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
              {s.icon} {s.text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "16px 32px", borderTop: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
        <form onSubmit={e => { e.preventDefault(); sendMessage(); }}
          style={{ display: "flex", gap: 12 }}>
          <input className="input" placeholder="Ask about any stock, portfolio strategy, dividends..."
            value={input} onChange={e => setInput(e.target.value)} disabled={loading}
            style={{ flex: 1, fontSize: 14 }} />
          <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
            <Send size={16} />
          </button>
        </form>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8, textAlign: "center" }}>
          YieldWise AI can make mistakes. Not financial advice. Always do your own research.
        </p>
      </div>
    </div>
  );
}
