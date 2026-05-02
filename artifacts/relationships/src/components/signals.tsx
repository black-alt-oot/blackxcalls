const signals = [
  {
    coin: "BTC",
    pair: "BTC/USDT",
    type: "LONG",
    entry: "$64,200",
    target1: "$67,500",
    target2: "$71,000",
    sl: "$62,800",
    pnl: "+18.4%",
    status: "ACTIVE",
    time: "2h ago",
    leverage: "5x",
  },
  {
    coin: "ETH",
    pair: "ETH/USDT",
    type: "LONG",
    entry: "$3,420",
    target1: "$3,750",
    target2: "$4,100",
    sl: "$3,280",
    pnl: "+11.7%",
    status: "ACTIVE",
    time: "4h ago",
    leverage: "3x",
  },
  {
    coin: "SOL",
    pair: "SOL/USDT",
    type: "LONG",
    entry: "$168",
    target1: "$185",
    target2: "$210",
    sl: "$161",
    pnl: "+24.6%",
    status: "HIT TP2",
    time: "1d ago",
    leverage: "4x",
  },
  {
    coin: "AVAX",
    pair: "AVAX/USDT",
    type: "SHORT",
    entry: "$44.2",
    target1: "$39.5",
    target2: "$35.0",
    sl: "$46.8",
    pnl: "+16.1%",
    status: "HIT TP1",
    time: "1d ago",
    leverage: "5x",
  },
  {
    coin: "LINK",
    pair: "LINK/USDT",
    type: "LONG",
    entry: "$16.8",
    target1: "$19.2",
    target2: "$22.5",
    sl: "$15.9",
    pnl: "+8.9%",
    status: "ACTIVE",
    time: "6h ago",
    leverage: "3x",
  },
  {
    coin: "BNB",
    pair: "BNB/USDT",
    type: "LONG",
    entry: "$558",
    target1: "$610",
    target2: "$670",
    sl: "$535",
    pnl: "+31.2%",
    status: "HIT TP2",
    time: "3d ago",
    leverage: "6x",
  },
];

const statusStyle: Record<string, { color: string; bg: string }> = {
  ACTIVE: { color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  "HIT TP1": { color: "#eab308", bg: "rgba(234,179,8,0.1)" },
  "HIT TP2": { color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
};

const coinColors: Record<string, string> = {
  BTC: "#f7931a",
  ETH: "#627eea",
  SOL: "#9945ff",
  AVAX: "#e84142",
  LINK: "#2a5ada",
  BNB: "#f3ba2f",
};

export default function Signals() {
  return (
    <section id="signals" className="py-24 px-4 sm:px-6" style={{ background: "#080808" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)", color: "#dc2626" }}>
            LIVE TRADING SIGNALS
          </div>
          <h2 className="font-black text-4xl sm:text-5xl text-white mb-4">
            Real-Time <span style={{ color: "#dc2626" }}>Calls</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Precision entries, calculated targets, and disciplined stop losses — every trade, every time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {signals.map((s, i) => {
            const coinColor = coinColors[s.coin] || "#dc2626";
            const st = statusStyle[s.status] || { color: "#9ca3af", bg: "rgba(156,163,175,0.1)" };
            return (
              <div
                key={i}
                className="signal-card rounded-2xl p-5 border"
                style={{ background: "#111111", borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: `${coinColor}20`, color: coinColor }}>
                      {s.coin}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{s.pair}</div>
                      <div className="text-gray-500 text-xs">{s.time}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: s.type === "LONG" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", color: s.type === "LONG" ? "#22c55e" : "#ef4444" }}>
                      {s.type}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: st.bg, color: st.color }}>
                      {s.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl p-3" style={{ background: "#191919" }}>
                    <div className="text-gray-500 text-xs mb-1">Entry</div>
                    <div className="text-white font-bold text-sm">{s.entry}</div>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: "#191919" }}>
                    <div className="text-gray-500 text-xs mb-1">Leverage</div>
                    <div className="font-bold text-sm" style={{ color: "#dc2626" }}>{s.leverage}</div>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: "#191919" }}>
                    <div className="text-gray-500 text-xs mb-1">TP1</div>
                    <div className="font-bold text-sm" style={{ color: "#22c55e" }}>{s.target1}</div>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: "#191919" }}>
                    <div className="text-gray-500 text-xs mb-1">TP2</div>
                    <div className="font-bold text-sm" style={{ color: "#22c55e" }}>{s.target2}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div>
                    <div className="text-gray-500 text-xs">Stop Loss</div>
                    <div className="font-semibold text-sm" style={{ color: "#ef4444" }}>{s.sl}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 text-xs">PnL</div>
                    <div className="font-black text-lg" style={{ color: "#22c55e" }}>{s.pnl}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
