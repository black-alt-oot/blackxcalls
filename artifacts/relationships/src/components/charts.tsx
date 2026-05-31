import { useState } from "react";

const pairs = [
  { coin: "BTC",  label: "Bitcoin",    symbol: "BINANCE:BTCUSDT",  color: "#f7931a" },
  { coin: "ETH",  label: "Ethereum",   symbol: "BINANCE:ETHUSDT",  color: "#627eea" },
  { coin: "SOL",  label: "Solana",     symbol: "BINANCE:SOLUSDT",  color: "#9945ff" },
  { coin: "AVAX", label: "Avalanche",  symbol: "BINANCE:AVAXUSDT", color: "#e84142" },
  { coin: "LINK", label: "Chainlink",  symbol: "BINANCE:LINKUSDT", color: "#2a5ada" },
  { coin: "BNB",  label: "BNB",        symbol: "BINANCE:BNBUSDT",  color: "#f3ba2f" },
  { coin: "XRP",  label: "XRP",        symbol: "BINANCE:XRPUSDT",  color: "#00aae4" },
  { coin: "ADA",  label: "Cardano",    symbol: "BINANCE:ADAUSDT",  color: "#0033ad" },
  { coin: "DOT",  label: "Polkadot",   symbol: "BINANCE:DOTUSDT",  color: "#e6007a" },
  { coin: "DOGE", label: "Dogecoin",   symbol: "BINANCE:DOGEUSDT", color: "#c2a633" },
  { coin: "MATIC", label: "Polygon",   symbol: "BINANCE:MATICUSDT", color: "#8247e5" },
  { coin: "LTC",  label: "Litecoin",   symbol: "BINANCE:LTCUSDT",  color: "#bfbbbb" },
  { coin: "UNI",  label: "Uniswap",    symbol: "BINANCE:UNIUSDT",  color: "#ff007a" },
  { coin: "ATOM", label: "Cosmos",     symbol: "BINANCE:ATOMUSDT", color: "#6f7390" },
  { coin: "FTM",  label: "Fantom",     symbol: "BINANCE:FTMUSDT",  color: "#1969ff" },
  { coin: "NEAR", label: "NEAR",       symbol: "BINANCE:NEARUSDT", color: "#00c08b" },
  { coin: "ARB",  label: "Arbitrum",   symbol: "BINANCE:ARBUSDT",  color: "#28a0f0" },
  { coin: "OP",   label: "Optimism",   symbol: "BINANCE:OPUSDT",   color: "#ff0420" },
];

const intervals = [
  { label: "15m", value: "15" },
  { label: "1H",  value: "60" },
  { label: "4H",  value: "240" },
  { label: "1D",  value: "D" },
  { label: "1W",  value: "W" },
];

function ChartCard({ pair, interval, expanded, onExpand }: {
  pair: typeof pairs[0];
  interval: string;
  expanded: boolean;
  onExpand: () => void;
}) {
  const chartUrl =
    `https://www.tradingview.com/widgetembed/` +
    `?symbol=${encodeURIComponent(pair.symbol)}` +
    `&interval=${interval}` +
    `&theme=dark&style=1&locale=en` +
    `&toolbar_bg=%23111111` +
    `&enable_publishing=false` +
    `&hide_top_toolbar=0` +
    `&hide_legend=0` +
    `&save_image=false` +
    `&calendar=false` +
    `&hide_volume=false`;

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        border: `1px solid ${expanded ? pair.color : "rgba(255,255,255,0.07)"}`,
        background: "#111111",
        boxShadow: expanded ? `0 0 40px ${pair.color}22` : "none",
        transition: "all 0.2s ease",
      }}
    >
      {/* Card Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 cursor-pointer"
        style={{ background: "#111111", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        onClick={onExpand}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs"
            style={{ background: `${pair.color}20`, color: pair.color }}
          >
            {pair.coin}
          </div>
          <div>
            <span className="text-white font-bold text-sm">{pair.coin}/USDT</span>
            <span className="text-gray-600 text-xs ml-2">{pair.label}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
            <span className="text-gray-600 text-xs">Live</span>
          </span>
          <span
            className="text-gray-500 text-xs px-2 py-0.5 rounded"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            {expanded ? "⊠" : "⊞"}
          </span>
        </div>
      </div>

      {/* TradingView Chart */}
      <div style={{ height: expanded ? 520 : 280, background: "#0f0f0f" }}>
        <iframe
          key={`${pair.coin}-${interval}-${expanded}`}
          src={chartUrl}
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          title={`${pair.coin}/USDT Chart`}
          loading="lazy"
          allow="fullscreen"
        />
      </div>
    </div>
  );
}

export default function Charts() {
  const [activeInterval, setActiveInterval] = useState(intervals[1]!);
  const [expandedCoin, setExpandedCoin] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const handleExpand = (coin: string) => {
    setExpandedCoin(expandedCoin === coin ? null : coin);
  };

  const visiblePairs = pairs.slice(0, visibleCount);

  return (
    <section id="charts" className="py-24 px-4 sm:px-6" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)", color: "#dc2626" }}
          >
            LIVE CHARTS
          </div>
          <h2 className="font-black text-4xl sm:text-5xl text-white mb-4">
            All <span style={{ color: "#dc2626" }}>Markets</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Full live charts for every pair we trade. Click any chart to expand it.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex justify-center gap-2 mb-8">
          {intervals.map((iv) => {
            const isActive = activeInterval.value === iv.value;
            return (
              <button
                key={iv.value}
                onClick={() => setActiveInterval(iv)}
                className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: isActive ? "#dc2626" : "#111111",
                  color: isActive ? "#ffffff" : "#6b7280",
                  border: `1px solid ${isActive ? "#dc2626" : "rgba(255,255,255,0.07)"}`,
                }}
              >
                {iv.label}
              </button>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visiblePairs.map((p) => (
            <div
              key={p.coin}
              className={expandedCoin === p.coin ? "md:col-span-2 lg:col-span-3" : ""}
            >
              <ChartCard
                pair={p}
                interval={activeInterval.value}
                expanded={expandedCoin === p.coin}
                onExpand={() => handleExpand(p.coin)}
              />
            </div>
          ))}
        </div>

        {/* Load More */}
        {visibleCount < pairs.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount(pairs.length)}
              className="px-8 py-3 rounded-xl font-bold text-sm transition-all"
              style={{
                background: "transparent",
                border: "1px solid rgba(220,38,38,0.4)",
                color: "#dc2626",
              }}
            >
              Load {pairs.length - visibleCount} More Charts ↓
            </button>
          </div>
        )}

        <p className="text-center text-gray-700 text-xs mt-8">
          Charts powered by <span style={{ color: "#dc2626" }}>TradingView</span> — real-time data, no delay.
        </p>

      </div>
    </section>
  );
}
