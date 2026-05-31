import { useState } from "react";

const pairs = [
  { coin: "BTC", label: "Bitcoin",  symbol: "BINANCE:BTCUSDT", color: "#f7931a" },
  { coin: "ETH", label: "Ethereum", symbol: "BINANCE:ETHUSDT",  color: "#627eea" },
  { coin: "SOL", label: "Solana",   symbol: "BINANCE:SOLUSDT",  color: "#9945ff" },
  { coin: "AVAX", label: "Avalanche", symbol: "BINANCE:AVAXUSDT", color: "#e84142" },
  { coin: "LINK", label: "Chainlink", symbol: "BINANCE:LINKUSDT", color: "#2a5ada" },
  { coin: "BNB",  label: "BNB",     symbol: "BINANCE:BNBUSDT",  color: "#f3ba2f" },
];

const intervals = [
  { label: "15m", value: "15" },
  { label: "1H",  value: "60" },
  { label: "4H",  value: "240" },
  { label: "1D",  value: "D" },
  { label: "1W",  value: "W" },
];

export default function Charts() {
  const [activePair, setActivePair] = useState(pairs[0]!);
  const [activeInterval, setActiveInterval] = useState(intervals[1]!);

  const chartUrl =
    `https://www.tradingview.com/widgetembed/` +
    `?symbol=${encodeURIComponent(activePair.symbol)}` +
    `&interval=${activeInterval.value}` +
    `&theme=dark` +
    `&style=1` +
    `&locale=en` +
    `&toolbar_bg=%23111111` +
    `&enable_publishing=false` +
    `&hide_top_toolbar=0` +
    `&hide_legend=0` +
    `&save_image=false` +
    `&calendar=false` +
    `&hide_volume=false` +
    `&studies=[]`;

  return (
    <section id="charts" className="py-24 px-4 sm:px-6" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)", color: "#dc2626" }}>
            LIVE CHARTS
          </div>
          <h2 className="font-black text-4xl sm:text-5xl text-white mb-4">
            Market <span style={{ color: "#dc2626" }}>Charts</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Real-time price action on every pair we trade. Powered by TradingView.
          </p>
        </div>

        {/* Pair Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {pairs.map((p) => {
            const isActive = activePair.coin === p.coin;
            return (
              <button
                key={p.coin}
                onClick={() => setActivePair(p)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                style={{
                  background: isActive ? `${p.color}20` : "#111111",
                  border: `1px solid ${isActive ? p.color : "rgba(255,255,255,0.07)"}`,
                  color: isActive ? p.color : "#6b7280",
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: isActive ? p.color : "#374151" }} />
                {p.coin}
                <span className="text-xs font-normal opacity-70">{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interval Selector */}
        <div className="flex justify-center gap-2 mb-6">
          {intervals.map((iv) => {
            const isActive = activeInterval.value === iv.value;
            return (
              <button
                key={iv.value}
                onClick={() => setActiveInterval(iv)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
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

        {/* Chart Container */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.07)", boxShadow: `0 0 60px ${activePair.color}18` }}
        >
          {/* Chart Header Bar */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ background: "#111111", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs"
                style={{ background: `${activePair.color}20`, color: activePair.color }}
              >
                {activePair.coin}
              </div>
              <div>
                <span className="text-white font-bold text-sm">{activePair.coin}/USDT</span>
                <span className="text-gray-500 text-xs ml-2">{activeInterval.label} Chart</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
              <span className="text-gray-500 text-xs">Live</span>
            </div>
          </div>

          {/* TradingView Chart */}
          <div style={{ height: 600, background: "#0f0f0f" }}>
            <iframe
              key={`${activePair.coin}-${activeInterval.value}`}
              src={chartUrl}
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              title={`${activePair.coin}/USDT ${activeInterval.label} Chart`}
              allow="fullscreen"
            />
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-gray-700 text-xs mt-4">
          Charts provided by <span style={{ color: "#dc2626" }}>TradingView</span> — real-time data, no delay.
        </p>

      </div>
    </section>
  );
}
