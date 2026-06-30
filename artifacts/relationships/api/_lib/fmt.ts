import type { Signal, TradeResult } from "./types.js";

export function formatPrice(price: number): string {
  if (price >= 10000) return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (price >= 1000) return `$${price.toLocaleString("en-US", { maximumFractionDigits: 1 })}`;
  if (price >= 10) return `$${price.toFixed(2)}`;
  return `$${price.toFixed(4)}`;
}

export function formatPips(val: number): string {
  if (val >= 100) return Math.round(val).toLocaleString();
  if (val >= 1) return val.toFixed(1);
  return val.toFixed(2);
}

export function buildChannelMessage(signal: Signal, rsi: number): string {
  const dir = signal.type === "LONG" ? "🟢 LONG" : "🔴 SHORT";
  const tp1Pips = formatPips(Math.abs(signal.tp1Num - signal.entryNum));
  const tp2Pips = formatPips(Math.abs(signal.tp2Num - signal.entryNum));
  const slPips = formatPips(Math.abs(signal.entryNum - signal.slNum));
  return (
    `⚡ *BLACK X CALLS — SIGNAL ALERT* ⚡\n\n` +
    `📊 *${signal.pair}* — ${dir}\n\n` +
    `💰 Entry:  \`${signal.entry}\`\n` +
    `🎯 TP1:    \`${signal.target1}\`  _(+${tp1Pips})_\n` +
    `🎯 TP2:    \`${signal.target2}\`  _(+${tp2Pips})_\n` +
    `🛡 SL:     \`${signal.sl}\`  _(-${slPips})_\n` +
    `⚡ Leverage: ${signal.leverage}\n\n` +
    `📈 RSI: ${rsi.toFixed(1)} | EMA trend confirmed ✅\n\n` +
    `🔔 *Follow for more:* t.me/blackxcallz`
  );
}

export function buildLeaderboardMessage(weekResults: TradeResult[]): string {
  const tp1s = weekResults.filter((r) => r.outcome === "tp1").length;
  const tp2s = weekResults.filter((r) => r.outcome === "tp2").length;
  const sls = weekResults.filter((r) => r.outcome === "sl").length;
  const total = tp1s + tp2s + sls;
  const wins = tp1s + tp2s;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : "—";
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setUTCDate(now.getUTCDate() - now.getUTCDay());

  const recentLines = weekResults
    .slice(-5)
    .reverse()
    .map((r) => {
      const icon = r.outcome === "tp1" ? "🎯" : r.outcome === "tp2" ? "🎯🎯" : "🛑";
      const dir = r.type === "LONG" ? "L" : "S";
      return `${icon} ${r.pair} ${dir} — *${r.pnl}*`;
    })
    .join("\n");

  return (
    `🏆 *BLACK X CALLS — WEEKLY LEADERBOARD*\n` +
    `_Week of ${weekStart.toUTCString().slice(0, 16)}_\n\n` +
    `📊 Signals Closed: *${total}*\n` +
    `✅ Wins:  *${wins}*  (TP1: ${tp1s} · TP2: ${tp2s})\n` +
    `❌ Losses: *${sls}*\n` +
    `📈 Win Rate: *${winRate}%*\n\n` +
    (recentLines ? `🕐 *Recent Results:*\n${recentLines}\n\n` : "") +
    `🔔 _Join us: t.me/blackxcallz_`
  );
}

export function getWeekKey(): string {
  const now = new Date();
  const startOfYear = new Date(now.getUTCFullYear(), 0, 1);
  const weekNum = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getUTCDay() + 1) / 7);
  return `${now.getUTCFullYear()}-W${weekNum}`;
}

export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
