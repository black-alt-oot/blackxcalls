export const PAIRS = [
  { coin: "BTC",  pair: "BTC/USDT",  fsym: "BTC",  tvSymbol: "BINANCE:BTCUSDT",  leverage: "5x",  source: "crypto" as const },
  { coin: "ETH",  pair: "ETH/USDT",  fsym: "ETH",  tvSymbol: "BINANCE:ETHUSDT",  leverage: "3x",  source: "crypto" as const },
  { coin: "SOL",  pair: "SOL/USDT",  fsym: "SOL",  tvSymbol: "BINANCE:SOLUSDT",  leverage: "4x",  source: "crypto" as const },
  { coin: "AVAX", pair: "AVAX/USDT", fsym: "AVAX", tvSymbol: "BINANCE:AVAXUSDT", leverage: "5x",  source: "crypto" as const },
  { coin: "LINK", pair: "LINK/USDT", fsym: "LINK", tvSymbol: "BINANCE:LINKUSDT", leverage: "3x",  source: "crypto" as const },
  { coin: "BNB",  pair: "BNB/USDT",  fsym: "BNB",  tvSymbol: "BINANCE:BNBUSDT",  leverage: "6x",  source: "crypto" as const },
  { coin: "GOLD", pair: "XAU/USD",   fsym: "GC=F", tvSymbol: "TVC:GOLD",         leverage: "10x", source: "yahoo"  as const },
  { coin: "OIL",  pair: "WTI/USD",   fsym: "CL=F", tvSymbol: "TVC:USOIL",        leverage: "10x", source: "yahoo"  as const },
];

export async function fetchCandles(fsym: string): Promise<number[]> {
  const symbol = `${fsym}USDT`;
  try {
    const res = await fetch(
      `https://api.binance.us/api/v3/klines?symbol=${symbol}&interval=1h&limit=100`,
      { headers: { "User-Agent": "BlackXCallzBot/1.0" }, signal: AbortSignal.timeout(8000) }
    );
    const klines = (await res.json()) as string[][];
    return klines.map((k) => parseFloat(k[4]!));
  } catch {
    const instId = `${fsym}-USDT`;
    const res = await fetch(
      `https://www.okx.com/api/v5/market/candles?instId=${instId}&bar=1H&limit=100`,
      { headers: { "User-Agent": "BlackXCallzBot/1.0" }, signal: AbortSignal.timeout(8000) }
    );
    const data = (await res.json()) as { data: string[][] };
    return data.data.reverse().map((k) => parseFloat(k[4]!));
  }
}

export async function fetchYahooCandles(ticker: string): Promise<number[]> {
  const res = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1h&range=7d`,
    { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" }, signal: AbortSignal.timeout(8000) }
  );
  const body = (await res.json()) as {
    chart: { result: { indicators: { quote: { close: number[] }[] } }[] };
  };
  const closes = body.chart.result[0]?.indicators.quote[0]?.close ?? [];
  return closes.filter((c): c is number => c != null);
}

export async function fetchAllPairs(): Promise<
  { pair: (typeof PAIRS)[number]; closes: number[]; error?: boolean }[]
> {
  return Promise.all(
    PAIRS.map(async (p) => {
      try {
        const closes = p.source === "yahoo"
          ? await fetchYahooCandles(p.fsym)
          : await fetchCandles(p.fsym);
        return { pair: p, closes };
      } catch {
        return { pair: p, closes: [], error: true };
      }
    })
  );
}
