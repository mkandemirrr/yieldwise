import { NextResponse } from "next/server";

const FMP_KEY = process.env.FMP_API_KEY;
const BASE = "https://financialmodelingprep.com/stable";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");
  const symbol = searchParams.get("symbol") || "";
  const symbols = searchParams.get("symbols") || "";

  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
  }

  const validEndpoints: Record<string, string> = {
    // Single stock
    quote: `${BASE}/quote?symbol=${symbol}&apikey=${FMP_KEY}`,
    profile: `${BASE}/profile?symbol=${symbol}&apikey=${FMP_KEY}`,
    dividends: `${BASE}/dividends?symbol=${symbol}&apikey=${FMP_KEY}`,
    
    // Batch
    "batch-quote": `${BASE}/batch-quote?symbols=${symbols}&apikey=${FMP_KEY}`,
    
    // Market
    "market-indexes": `${BASE}/batch-quote?symbols=SPY,QQQ,DIA,IWM,BTC-USD&apikey=${FMP_KEY}`,
    gainers: `${BASE}/gainers?apikey=${FMP_KEY}`,
    losers: `${BASE}/losers?apikey=${FMP_KEY}`,
    actives: `${BASE}/actives?apikey=${FMP_KEY}`,
  };

  const url = validEndpoints[endpoint];
  if (!url) {
    return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
  }

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();

    // Handle FMP error messages
    if (data?.["Error Message"]) {
      return NextResponse.json({ error: data["Error Message"] }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
