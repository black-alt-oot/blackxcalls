const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const winRates = [91.2, 88.5, 93.1, 95.4, 89.7, 92.3, 94.8, 96.1, 91.5, 93.7, 94.7, 92.0];

const highlights = [
  { label: "Total Signals", val: "1,240+", icon: "📡" },
  { label: "Win Rate", val: "94.7%", icon: "🎯" },
  { label: "Avg Monthly ROI", val: "+38%", icon: "📈" },
  { label: "Active Members", val: "12,400+", icon: "👥" },
  { label: "Biggest Win", val: "+847%", icon: "🚀" },
  { label: "Streak Record", val: "31 Wins", icon: "🔥" },
];

const recentTrades = [
  { pair: "BTC/USDT", result: "+24.3%", type: "LONG", date: "Apr 28" },
  { pair: "SOL/USDT", result: "+41.7%", type: "LONG", date: "Apr 27" },
  { pair: "ETH/USDT", result: "+18.9%", type: "LONG", date: "Apr 26" },
  { pair: "AVAX/USDT", result: "+33.2%", type: "SHORT", date: "Apr 25" },
  { pair: "BNB/USDT", result: "+29.6%", type: "LONG", date: "Apr 24" },
  { pair: "LINK/USDT", result: "+52.1%", type: "LONG", date: "Apr 23" },
  { pair: "XRP/USDT", result: "-4.2%", type: "LONG", date: "Apr 22" },
  { pair: "DOT/USDT", result: "+16.8%", type: "SHORT", date: "Apr 21" },
];

export default function Stats() {
  const maxWR = Math.max(...winRates);

  return (
    <section id="performance" className="py-24 px-4 sm:px-6" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)", color: "#dc2626" }}>
            VERIFIED PERFORMANCE
          </div>
          <h2 className="font-black text-4xl sm:text-5xl text-white mb-4">
            Numbers Don't <span style={{ color: "#dc2626" }}>Lie</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Every trade is logged. Every result is public. Transparency is our foundation.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {highlights.map((h) => (
            <div
              key={h.label}
              className="rounded-2xl p-5 sm:p-6 text-center border"
              style={{ background: "#111111", borderColor: "rgba(220,38,38,0.1)" }}
            >
              <div className="text-3xl mb-2">{h.icon}</div>
              <div className="font-black text-2xl sm:text-3xl stat-number mb-1">{h.val}</div>
              <div className="text-gray-500 text-sm">{h.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 border" style={{ background: "#111111", borderColor: "rgba(255,255,255,0.06)" }}>
            <h3 className="font-bold text-white text-lg mb-6">Monthly Win Rate</h3>
            <div className="flex items-end gap-2 h-40">
              {months.map((m, i) => {
                const height = (winRates[i] / maxWR) * 100;
                const isCurrent = i === months.length - 2;
                return (
                  <div key={m} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm transition-all"
                      style={{
                        height: `${height}%`,
                        background: isCurrent ? "#dc2626" : "rgba(220,38,38,0.35)",
                        minHeight: "4px",
                      }}
                    />
                    <span className="text-gray-600 text-xs hidden sm:block">{m.slice(0, 1)}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-gray-600 text-xs">Jan 2025</span>
              <span className="text-gray-600 text-xs">Dec 2025</span>
            </div>
          </div>

          <div className="rounded-2xl p-6 border" style={{ background: "#111111", borderColor: "rgba(255,255,255,0.06)" }}>
            <h3 className="font-bold text-white text-lg mb-5">Recent Trades</h3>
            <div className="space-y-3">
              {recentTrades.map((t, i) => {
                const isWin = !t.result.startsWith("-");
                return (
                  <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl" style={{ background: "#191919" }}>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: t.type === "LONG" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", color: t.type === "LONG" ? "#22c55e" : "#ef4444" }}>
                        {t.type}
                      </span>
                      <span className="text-white text-sm font-semibold">{t.pair}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-xs">{t.date}</span>
                      <span className="font-black text-sm" style={{ color: isWin ? "#22c55e" : "#ef4444", minWidth: "60px", textAlign: "right" }}>
                        {t.result}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
