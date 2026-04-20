import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { portfolio } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ analysis: generateBasicAnalysis(portfolio) });
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
        max_tokens: 1500,
        system: "You are a professional portfolio analyst. Analyze the given portfolio and provide: 1) Overall health score (0-100), 2) Sector diversification analysis, 3) Risk assessment, 4) Top 3 recommendations for improvement. Be concise and use bullet points. Add disclaimer about not being financial advice.",
        messages: [{ role: "user", content: `Analyze this portfolio:\n${JSON.stringify(portfolio, null, 2)}` }],
      }),
    });

    const data = await res.json();
    return NextResponse.json({ analysis: data.content?.[0]?.text || "Analysis complete." });
  } catch {
    return NextResponse.json({ analysis: "Analysis temporarily unavailable." }, { status: 500 });
  }
}

function generateBasicAnalysis(portfolio: any[]): string {
  const sectors = portfolio.reduce((acc: any, s: any) => { acc[s.sector] = (acc[s.sector] || 0) + 1; return acc; }, {});
  const totalValue = portfolio.reduce((s: number, p: any) => s + p.current * p.shares, 0);
  const totalCost = portfolio.reduce((s: number, p: any) => s + p.avgCost * p.shares, 0);
  const pl = ((totalValue - totalCost) / totalCost * 100).toFixed(2);

  return `📊 Portfolio Analysis Summary\n\n` +
    `🏷️ Holdings: ${portfolio.length} stocks\n` +
    `💰 Total Value: $${totalValue.toLocaleString()}\n` +
    `📈 Total Return: ${Number(pl) >= 0 ? "+" : ""}${pl}%\n\n` +
    `📌 Sector Breakdown:\n${Object.entries(sectors).map(([k, v]) => `  • ${k}: ${v} stocks`).join("\n")}\n\n` +
    `⚠️ Recommendations:\n` +
    `  1. ${Object.keys(sectors).length < 4 ? "Consider adding more sectors for diversification" : "Good sector diversification"}\n` +
    `  2. ${portfolio.length < 10 ? "Consider adding more holdings (target 10-15)" : "Good number of holdings"}\n` +
    `  3. Review positions with >15% of total portfolio value\n\n` +
    `⚖️ This is not financial advice. Always do your own research.`;
}
