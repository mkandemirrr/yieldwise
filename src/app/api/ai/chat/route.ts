import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ response: generateFallback(message) });
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: `You are YieldWise AI, an expert financial assistant. You help users with:
- Stock analysis and valuation
- Portfolio optimization and risk assessment
- Dividend investing strategies
- Market trends and signals
- Financial planning advice

Rules:
- Be concise but thorough
- Use bullet points and structure
- Include relevant numbers and metrics when possible
- Always add a disclaimer that this is not financial advice
- Use emojis sparingly for readability
- If asked about a specific stock, include price, P/E, yield, and your assessment`,
        messages: [
          ...(history || []).map((m: any) => ({ role: m.role, content: m.content })),
          { role: "user", content: message },
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
