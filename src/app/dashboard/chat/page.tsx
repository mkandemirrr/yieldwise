"use client";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Zap, User, Bot, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "Is my portfolio too risky?",
  "Which stocks pay the best dividends?",
  "Should I buy NVDA at this price?",
  "Analyze Apple's latest earnings",
  "How can I diversify my portfolio?",
  "What's the outlook for tech stocks?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your AI financial assistant. I can help you analyze stocks, evaluate your portfolio, track dividends, and understand market trends.\n\nTry asking me something like:\n• \"Is Apple a good buy right now?\"\n• \"How diversified is my portfolio?\"\n• \"What are the best dividend stocks?\"\n\nHow can I help you today?", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    
    const userMsg: Message = { role: "user", content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: messages.slice(-6) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response || "I can provide detailed analysis with a Pro subscription. For now, here are some general insights based on your question.", timestamp: new Date() }]);
    } catch {
      // Fallback response when API is not configured
      const fallback = generateFallbackResponse(msg);
      setMessages(prev => [...prev, { role: "assistant", content: fallback, timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackResponse = (question: string): string => {
    const q = question.toLowerCase();
    if (q.includes("risk") || q.includes("risky")) {
      return "📊 **Portfolio Risk Assessment**\n\nBased on typical portfolio analysis:\n• **Beta**: A diversified portfolio should target a beta around 1.0\n• **Sector Concentration**: Aim for no single sector above 30%\n• **Individual Stock**: No single stock should exceed 10-15% of your portfolio\n\nConnect your portfolio for a personalized AI risk analysis!";
    }
    if (q.includes("dividend")) {
      return "💰 **Top Dividend Insights**\n\nHigh-quality dividend stocks to consider:\n• **JNJ** — 3.12% yield, 62 years of increases\n• **KO** — 2.88% yield, Dividend King\n• **PG** — 2.38% yield, 68 years of increases\n• **XOM** — 3.25% yield, strong cash flow\n\nLook for companies with:\n✅ Payout ratio under 60%\n✅ 10+ years of dividend growth\n✅ Strong free cash flow";
    }
    if (q.includes("apple") || q.includes("aapl")) {
      return "🍎 **Apple (AAPL) Analysis**\n\n• **Price**: $218.45 (+0.93%)\n• **P/E Ratio**: 28.5x (slightly above sector avg)\n• **Market Cap**: $3.35T\n• **Dividend Yield**: 0.46%\n\n**AI Assessment**: Strong fundamentals with growing services revenue. iPhone 16 cycle performing well. AI integration (Apple Intelligence) is a growth catalyst.\n\n**AI Score: 82/100** — Hold/Accumulate";
    }
    return "🤖 **AI Analysis**\n\nGreat question! To provide the most accurate analysis, I use real-time market data and advanced AI models.\n\n**Key principles for smart investing:**\n1. Diversify across sectors and geographies\n2. Focus on quality companies with strong fundamentals\n3. Keep a long-term perspective\n4. Reinvest dividends for compound growth\n5. Regularly rebalance your portfolio\n\nAsk me about specific stocks, sectors, or strategies!";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <div style={{
        padding: "20px 32px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: "var(--gradient-green)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Sparkles size={20} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>AI Financial Chat</h1>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Powered by Claude AI • Ask anything about investing</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px 32px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex", gap: 12, marginBottom: 24,
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
              whiteSpace: "pre-wrap",
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
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
              display: "flex", gap: 6,
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "var(--text-muted)",
                  animation: `pulse-green 1.4s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding: "0 32px 16px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => sendMessage(s)}
              className="btn btn-secondary btn-sm" style={{ fontSize: 12 }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "16px 32px", borderTop: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
        <form onSubmit={e => { e.preventDefault(); sendMessage(); }}
          style={{ display: "flex", gap: 12 }}>
          <input className="input" placeholder="Ask about stocks, dividends, portfolio strategy..."
            value={input} onChange={e => setInput(e.target.value)} disabled={loading}
            style={{ flex: 1, fontSize: 14 }} />
          <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
