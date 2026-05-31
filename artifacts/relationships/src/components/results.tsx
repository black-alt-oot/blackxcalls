import { useState } from "react";

type TradeResult = {
  pair: string;
  type: "LONG" | "SHORT";
  entry: string;
  tp1: string;
  tp2: string;
  sl: string;
  outcome: "HIT TP2" | "HIT TP1" | "STOPPED";
  pnl: string;
  date: string;
  leverage: string;
};

const trades: TradeResult[] = [
  { pair: "BTC/USDT",  type: "LONG",  entry: "61,200", tp1: "64,500", tp2: "68,800", sl: "59,800", outcome: "HIT TP2", pnl: "+12.4%", date: "May 28, 2026", leverage: "5x" },
  { pair: "SOL/USDT",  type: "LONG",  entry: "168.0",  tp1: "182.0",  tp2: "210.0",  sl: "158.0",  outcome: "HIT TP2", pnl: "+25.0%", date: "May 26, 2026", leverage: "3x" },
  { pair: "ETH/USDT",  type: "LONG",  entry: "3,210",  tp1: "3,480",  tp2: "3,820",  sl: "3,080",  outcome: "HIT TP1", pnl: "+8.4%",  date: "May 24, 2026", leverage: "3x" },
  { pair: "AVAX/USDT", type: "SHORT", entry: "42.5",   tp1: "38.0",   tp2: "33.5",   sl: "44.8",   outcome: "HIT TP2", pnl: "+21.2%", date: "May 23, 2026", leverage: "4x" },
  { pair: "BNB/USDT",  type: "LONG",  entry: "572.0",  tp1: "610.0",  tp2: "655.0",  sl: "548.0",  outcome: "HIT TP2", pnl: "+14.5%", date: "May 22, 2026", leverage: "3x" },
  { pair: "LINK/USDT", type: "LONG",  entry: "14.8",   tp1: "17.2",   tp2: "20.5",   sl: "13.6",   outcome: "HIT TP2", pnl: "+38.5%", date: "May 21, 2026", leverage: "5x" },
  { pair: "XRP/USDT",  type: "LONG",  entry: "0.595",  tp1: "0.640",  tp2: "0.710",  sl: "0.565",  outcome: "STOPPED", pnl: "-5.0%",  date: "May 20, 2026", leverage: "3x" },
  { pair: "DOT/USDT",  type: "SHORT", entry: "9.80",   tp1: "8.60",   tp2: "7.90",   sl: "10.40",  outcome: "HIT TP1", pnl: "+12.2%", date: "May 19, 2026", leverage: "4x" },
  { pair: "ARB/USDT",  type: "LONG",  entry: "1.12",   tp1: "1.28",   tp2: "1.50",   sl: "1.02",   outcome: "HIT TP2", pnl: "+33.9%", date: "May 17, 2026", leverage: "5x" },
  { pair: "BTC/USDT",  type: "SHORT", entry: "68,400", tp1: "64,800", tp2: "61,200", sl: "70,500", outcome: "HIT TP2", pnl: "+10.5%", date: "May 15, 2026", leverage: "5x" },
  { pair: "NEAR/USDT", type: "LONG",  entry: "6.40",   tp1: "7.20",   tp2: "8.60",   sl: "5.90",   outcome: "HIT TP2", pnl: "+34.4%", date: "May 14, 2026", leverage: "4x" },
  { pair: "OP/USDT",   type: "LONG",  entry: "2.85",   tp1: "3.20",   tp2: "3.70",   sl: "2.60",   outcome: "HIT TP1", pnl: "+12.3%", date: "May 13, 2026", leverage: "3x" },
  { pair: "ETH/USDT",  type: "SHORT", entry: "3,650",  tp1: "3,400",  tp2: "3,100",  sl: "3,820",  outcome: "HIT TP2", pnl: "+15.1%", date: "May 11, 2026", leverage: "3x" },
  { pair: "DOGE/USDT", type: "LONG",  entry: "0.148",  tp1: "0.172",  tp2: "0.205",  sl: "0.135",  outcome: "HIT TP2", pnl: "+38.5%", date: "May 9, 2026",  leverage: "5x" },
  { pair: "SOL/USDT",  type: "SHORT", entry: "192.0",  tp1: "178.0",  tp2: "162.0",  sl: "202.0",  outcome: "STOPPED", pnl: "-5.2%",  date: "May 8, 2026",  leverage: "3x" },
  { pair: "ATOM/USDT", type: "LONG",  entry: "9.20",   tp1: "10.50",  tp2: "12.20",  sl: "8.40",   outcome: "HIT TP2", pnl: "+32.6%", date: "May 7, 2026",  leverage: "4x" },
  { pair: "BNB/USDT",  type: "SHORT", entry: "618.0",  tp1: "580.0",  tp2: "545.0",  sl: "642.0",  outcome: "HIT TP1", pnl: "+6.1%",  date: "May 6, 2026",  leverage: "3x" },
  { pair: "UNI/USDT",  type: "LONG",  entry: "10.40",  tp1: "12.00",  tp2: "14.50",  sl: "9.50",   outcome: "HIT TP2", pnl: "+39.4%", date: "May 5, 2026",  leverage: "5x" },
  { pair: "LINK/USDT", type: "SHORT", entry: "19.8",   tp1: "17.5",   tp2: "15.2",   sl: "21.2",   outcome: "HIT TP2", pnl: "+23.2%", date: "May 3, 2026",  leverage: "4x" },
  { pair: "BTC/USDT",  type: "LONG",  entry: "58,800", tp1: "62,400", tp2: "66,500", sl: "56,500", outcome: "HIT TP2", pnl: "+13.1%", date: "May 1, 2026",  leverage: "5x" },
  { pair: "MATIC/USDT",type: "LONG",  entry: "0.88",   tp1: "1.02",   tp2: "1.22",   sl: "0.79",   outcome: "HIT TP1", pnl: "+15.9%", date: "Apr 29, 2026", leverage: "4x" },
  { pair: "ETH/USDT",  type: "LONG",  entry: "3,050",  tp1: "3,280",  tp2: "3,550",  sl: "2,910",  outcome: "HIT TP2", pnl: "+16.4%", date: "Apr 27, 2026", leverage: "3x" },
  { pair: "XRP/USDT",  type: "SHORT", entry: "0.642",  tp1: "0.590",  tp2: "0.540",  sl: "0.675",  outcome: "HIT TP2", pnl: "+15.9%", date: "Apr 25, 2026", leverage: "3x" },
  { pair: "ARB/USDT",  type: "SHORT", entry: "1.38",   tp1: "1.18",   tp2: "1.02",   sl: "1.52",   outcome: "STOPPED", pnl: "-10.1%", date: "Apr 23, 2026", leverage: "5x" },
  { pair: "SOL/USDT",  type: "LONG",  entry: "148.0",  tp1: "165.0",  tp2: "188.0",  sl: "138.0",  outcome: "HIT TP2", pnl: "+27.0%", date: "Apr 21, 2026", leverage: "3x" },
];

const outcomeStyle: Record<string, { color: string; bg: string; label: string }> = {
  "HIT TP2": { color: "#22c55e", bg: "rgba(34,197,94,0.1)",   label: "HIT TP2" },
  "HIT TP1": { color: "#eab308", bg: "rgba(234,179,8,0.1)",   label: "HIT TP1" },
  "STOPPED": { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   label: "STOPPED" },
};

const FILTERS = ["ALL", "HIT TP2", "HIT TP1", "STOPPED"] as const;

export default function Results() {
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filtered = trades.filter((t) => {
    const matchesFilter = filter === "ALL" || t.outcome === filter;
    const matchesSearch = t.pair.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const wins = trades.filter(t => t.outcome !== "STOPPED").length;
  const winRate = ((wins / trades.length) * 100).toFixed(1);

  return (
    <section id="results" className="py-24 px-4 sm:px-6" style={{ background: "#080808" }}>
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)", color: "#dc2626" }}>
            TRACK RECORD
          </div>
          <h2 className="font-black text-4xl sm:text-5xl text-white mb-4">
            Every <span style={{ color: "#dc2626" }}>Call. Every Result.</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Full transparency — every signal logged with its exact outcome. Nothing hidden, nothing deleted.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg mx-auto">
          {[
            { label: "Total Calls", val: `${trades.length}` },
            { label: "Win Rate",    val: `${winRate}%` },
            { label: "Losses",      val: `${trades.length - wins}` },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4 text-center border" style={{ background: "#111111", borderColor: "rgba(220,38,38,0.1)" }}>
              <div className="font-black text-2xl text-white mb-0.5">{s.val}</div>
              <div className="text-gray-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search pair…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none"
              style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(220,38,38,0.4)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: filter === f ? "#dc2626" : "#111111",
                  color: filter === f ? "#fff" : "#6b7280",
                  border: `1px solid ${filter === f ? "#dc2626" : "rgba(255,255,255,0.07)"}`,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#111111", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Pair", "Type", "Entry", "TP1", "TP2", "SL", "Leverage", "Outcome", "PnL", "Date"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-bold text-gray-500 text-xs tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center text-gray-600">No results found</td>
                  </tr>
                ) : filtered.map((t, i) => {
                  const o = outcomeStyle[t.outcome];
                  const isWin = t.outcome !== "STOPPED";
                  return (
                    <tr
                      key={i}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "#0d0d0d" : "#0a0a0a" }}
                    >
                      <td className="px-4 py-3 font-bold text-white whitespace-nowrap">{t.pair}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: t.type === "LONG" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: t.type === "LONG" ? "#22c55e" : "#ef4444" }}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{t.entry}</td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{t.tp1}</td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{t.tp2}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{t.sl}</td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{t.leverage}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: o.bg, color: o.color }}>
                          {o.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-black whitespace-nowrap" style={{ color: isWin ? "#22c55e" : "#ef4444" }}>
                        {t.pnl}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{t.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-gray-700 text-xs mt-6">
          Showing {filtered.length} of {trades.length} trades · Updated daily
        </p>
      </div>
    </section>
  );
}
