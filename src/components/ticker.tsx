const tickers = [
  { coin: "BTC/USDT", price: "$67,432", change: "+4.2%", up: true },
  { coin: "ETH/USDT", price: "$3,821", change: "+2.8%", up: true },
  { coin: "SOL/USDT", price: "$182.4", change: "+6.1%", up: true },
  { coin: "BNB/USDT", price: "$589", change: "-1.2%", up: false },
  { coin: "XRP/USDT", price: "$0.624", change: "+3.5%", up: true },
  { coin: "AVAX/USDT", price: "$41.8", change: "+5.7%", up: true },
  { coin: "MATIC/USDT", price: "$1.12", change: "-0.8%", up: false },
  { coin: "LINK/USDT", price: "$18.3", change: "+7.2%", up: true },
  { coin: "DOT/USDT", price: "$9.45", change: "+1.9%", up: true },
  { coin: "ADA/USDT", price: "$0.551", change: "-2.1%", up: false },
];

const doubled = [...tickers, ...tickers];

export default function Ticker() {
  return (
    <div className="overflow-hidden py-2.5" style={{ background: "#0f0f0f", borderTop: "1px solid rgba(220,38,38,0.2)", borderBottom: "1px solid rgba(220,38,38,0.2)" }}>
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <div key={i} className="flex items-center gap-2 px-6 whitespace-nowrap">
            <span className="text-gray-300 text-xs font-semibold">{t.coin}</span>
            <span className="text-white text-xs font-bold">{t.price}</span>
            <span className="text-xs font-bold" style={{ color: t.up ? "#22c55e" : "#ef4444" }}>{t.change}</span>
            <span className="text-gray-700 mx-2">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
