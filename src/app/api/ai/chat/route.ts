import { NextResponse } from "next/server";

const FMP_KEY = process.env.FMP_API_KEY;
const FMP_BASE = "https://financialmodelingprep.com/stable";

// Fetch real stock data to enrich AI responses
async function getStockContext(message: string): Promise<string> {
  const symbols = extractSymbols(message);
  if (symbols.length === 0 || !FMP_KEY) return "";

  try {
    const quotes = await fetch(`${FMP_BASE}/batch-quote?symbols=${symbols.join(",")}&apikey=${FMP_KEY}`);
    const quoteData = await quotes.json();

    if (!Array.isArray(quoteData) || quoteData.length === 0) return "";

    let context = "\n\n[REAL-TIME MARKET DATA - Use this in your response]\n";
    for (const q of quoteData) {
      context += `\n${q.symbol} (${q.name}):
- Current Price: $${q.price}
- Change: ${q.change >= 0 ? "+" : ""}${q.change} (${q.changePercentage >= 0 ? "+" : ""}${q.changePercentage.toFixed(2)}%)
- Day Range: $${q.dayLow} - $${q.dayHigh}
- 52W Range: $${q.yearLow} - $${q.yearHigh}
- Market Cap: $${(q.marketCap / 1e9).toFixed(2)}B
- 50-Day Avg: $${q.priceAvg50}
- 200-Day Avg: $${q.priceAvg200}
- Volume: ${(q.volume / 1e6).toFixed(2)}M
`;
    }

    // Try to get profile data for more detail
    for (const sym of symbols.slice(0, 2)) {
      try {
        const profileRes = await fetch(`${FMP_BASE}/profile?symbol=${sym}&apikey=${FMP_KEY}`);
        const profileData = await profileRes.json();
        if (Array.isArray(profileData) && profileData[0]) {
          const p = profileData[0];
          context += `\n${sym} Profile:
- Sector: ${p.sector || "N/A"} | Industry: ${p.industry || "N/A"}
- Beta: ${p.beta || "N/A"}
- Last Dividend: $${p.lastDividend || 0}
- PE Ratio: ${p.pe || "N/A"}
- Description: ${(p.description || "").slice(0, 200)}...
`;
        }
      } catch { /* skip profile on error */ }
    }

    return context;
  } catch {
    return "";
  }
}

// Extract stock symbols from message
function extractSymbols(message: string): string[] {
  const knownSymbols = [
    "AAPL", "MSFT", "GOOGL", "GOOG", "AMZN", "NVDA", "META", "TSLA",
    "BRK.B", "JPM", "V", "JNJ", "UNH", "MA", "HD", "PG", "MRK",
    "ABBV", "CVX", "KO", "PEP", "LLY", "AVGO", "COST", "WMT",
    "MCD", "CSCO", "CRM", "TMO", "ACN", "ABT", "DHR", "NKE",
    "TXN", "PM", "UNP", "NEE", "RTX", "LOW", "HON", "INTC",
    "AMD", "QCOM", "SPGI", "GS", "AXP", "BA", "CAT", "DIS",
    "SPY", "QQQ", "DIA", "IWM", "VOO", "VTI",
  ];

  const upper = message.toUpperCase();
  const found: string[] = [];

  // Check for $ prefix (e.g., $AAPL)
  const dollarMatches = message.match(/\$([A-Z]{1,5})/g);
  if (dollarMatches) {
    for (const m of dollarMatches) found.push(m.replace("$", ""));
  }

  // Check for known symbols in text
  for (const sym of knownSymbols) {
    if (upper.includes(sym) && !found.includes(sym)) {
      found.push(sym);
    }
  }

  // Check common company names
  const nameMap: Record<string, string> = {
    "APPLE": "AAPL", "MICROSOFT": "MSFT", "GOOGLE": "GOOGL",
    "AMAZON": "AMZN", "NVIDIA": "NVDA", "TESLA": "TSLA",
    "META": "META", "FACEBOOK": "META", "NETFLIX": "NFLX",
    "DISNEY": "DIS", "BOEING": "BA", "INTEL": "INTC",
    "AMD": "AMD", "COCA-COLA": "KO", "PEPSI": "PEP",
  };

  for (const [name, sym] of Object.entries(nameMap)) {
    if (upper.includes(name) && !found.includes(sym)) {
      found.push(sym);
    }
  }

  return found.slice(0, 3); // Max 3 symbols
}

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ response: generateFallback(message) });
    }

    // Fetch real stock data if symbols are mentioned
    const stockContext = await getStockContext(message);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: `You are YieldWise AI, a premium financial assistant powered by real-time market data.

Your capabilities:
- Real-time stock analysis with live prices
- Portfolio optimization and risk assessment
- Dividend investing strategies and income calculations
- Market trends, technical indicators, and signals
- ETF comparisons and fund analysis
- Sector rotation and macro analysis

Response style:
- Be concise but insightful — aim for professional quality
- Use markdown formatting: **bold** for key metrics, bullet points for lists
- Include specific numbers from the real-time data provided
- Give actionable insights, not just data
- Calculate relevant metrics (upside/downside %, distance from 52W high/low)
- Rate stocks with an AI Score (0-100) when analyzing individual stocks
- End with a brief ⚠️ disclaimer that this is not financial advice
- Use 📈📉💰🎯 emojis strategically for readability

When stock data is provided in [REAL-TIME MARKET DATA], use those exact numbers in your response.`,
        messages: [
          ...(history || []).map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
          { role: "user", content: message + stockContext },
        ],
      }),
    });

    const data = await res.json();
    const response = data.content?.[0]?.text || "I couldn't process that request. Please try again.";
    
    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ response: "AI service temporarily unavailable. Please try again." }, { status: 500 });
  }
}

function generateFallback(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("risk")) return "📊 Portfolio Risk: Diversify across 5+ sectors. No single stock should exceed 15% of your total portfolio. Consider adding bonds or ETFs.";
  if (q.includes("dividend")) return "💰 Top Dividend Picks: JNJ (3.12%), KO (2.88%), PG (2.38%). Focus on Dividend Kings with 50+ years of consecutive increases.";
  if (q.includes("buy") || q.includes("sell")) return "📈 Before any trade, check: P/E ratio vs industry avg, revenue growth trend, free cash flow, and insider activity. Always have an exit strategy.";
  return "🤖 I'm your AI financial assistant. I can analyze stocks, optimize portfolios, and provide market insights. Connect your API key for full AI-powered analysis!";
}
