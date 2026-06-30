import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendMessage, pinMessage } from "../_lib/tg.js";
import { readState, writeState, addSignalToGitHub } from "../_lib/gh.js";
import { fetchAllPairs } from "../_lib/prices.js";
import { calculateRSI, calculateEMA } from "../_lib/calc.js";
import { formatPrice, buildChannelMessage, buildLeaderboardMessage, getTodayKey, getWeekKey } from "../_lib/fmt.js";
import type { Signal, ActiveSignal } from "../_lib/types.js";

const ADMIN_ID = Number(process.env["TELEGRAM_ADMIN_ID"] ?? "0");
const CHANNEL_ID = process.env["TELEGRAM_CHANNEL_ID"] ?? "";
const CRON_SECRET = process.env["CRON_SECRET"] ?? "";
const PAIR_COOLDOWN_MS = 4 * 60 * 60 * 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify secret to prevent unauthorized calls
  const secret = (req.query["secret"] as string) ?? req.headers["x-cron-secret"] ?? "";
  if (CRON_SECRET && secret !== CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.status(200).json({ ok: true, ts: new Date().toISOString() });

  try {
    await runCron();
  } catch (err) {
    console.error("Cron error:", err);
  }
}

async function runCron() {
  const { state, sha } = await readState();
  const now = new Date();
  const utcHour = now.getUTCHours();
  const utcDay = now.getUTCDay(); // 0 = Sunday
  const todayKey = getTodayKey();
  const weekKey = getWeekKey();

  // ── Auto-scan all pairs ─────────────────────────────────────────────────
  const results = await fetchAllPairs();
  let found = 0;

  for (const { pair: p, closes, error } of results) {
    if (error || closes.length === 0) continue;
    const rsi = calculateRSI(closes);
    const ema20 = calculateEMA(closes, 20);
    const ema50 = calculateEMA(closes, 50);
    const price = closes[closes.length - 1]!;

    let signalType: "LONG" | "SHORT" | null = null;
    if (rsi < 40 && ema20[ema20.length - 1]! > ema50[ema50.length - 1]!) signalType = "LONG";
    else if (rsi > 60 && ema20[ema20.length - 1]! < ema50[ema50.length - 1]!) signalType = "SHORT";
    if (!signalType) continue;

    const lastTime = state.lastSignalTime[p.coin] ?? 0;
    if (Date.now() - lastTime < PAIR_COOLDOWN_MS) continue;

    state.lastSignalTime[p.coin] = Date.now();
    found++;

    const tp1 = signalType === "LONG" ? price * 1.04 : price * 0.96;
    const tp2 = signalType === "LONG" ? price * 1.08 : price * 0.92;
    const sl  = signalType === "LONG" ? price * 0.97 : price * 1.03;

    const signal: Signal = {
      coin: p.coin, pair: p.pair, tvSymbol: p.tvSymbol, type: signalType,
      entryNum: price, tp1Num: tp1, tp2Num: tp2, slNum: sl,
      entry: formatPrice(price), target1: formatPrice(tp1), target2: formatPrice(tp2),
      sl: formatPrice(sl), pnl: "+8%", status: "ACTIVE", time: "Just now", leverage: p.leverage,
    };

    const signalId = `${p.coin}_${Date.now()}`;

    if (CHANNEL_ID) {
      try {
        const sent = await sendMessage(CHANNEL_ID, buildChannelMessage(signal, rsi), { parse_mode: "Markdown" });
        await pinMessage(CHANNEL_ID, sent.message_id);
        const active: ActiveSignal = { ...signal, id: signalId, channelMsgId: sent.message_id };
        state.activeSignals = [active, ...state.activeSignals].slice(0, 20);
        console.log(`Signal posted & pinned: ${p.pair} ${signalType}`);
      } catch (err) {
        console.error(`Failed to post ${p.pair} to channel:`, err);
      }
    }

    try {
      await addSignalToGitHub(signal);
    } catch (err) {
      console.error(`Failed to push ${p.pair} to GitHub:`, err);
    }

    if (ADMIN_ID) {
      await sendMessage(ADMIN_ID,
        `✅ *AUTO-POSTED: ${p.pair} ${signalType}*\n\nEntry: \`${formatPrice(price)}\` | RSI: ${rsi.toFixed(1)}\nTP1: \`${formatPrice(tp1)}\` | TP2: \`${formatPrice(tp2)}\`\nSL: \`${formatPrice(sl)}\`\n\n_Posted to channel & site automatically._`,
        { parse_mode: "Markdown" }
      );
    }
  }

  // ── Daily briefing at 8am UTC ───────────────────────────────────────────
  if (utcHour === 8 && state.lastDailyBriefingDay !== todayKey) {
    state.lastDailyBriefingDay = todayKey;
    const lines: string[] = [`🌅 *DAILY MARKET BRIEFING*\n_${now.toUTCString().slice(0, 16)}_\n`];
    for (const { pair: p, closes, error } of results) {
      if (error || closes.length === 0) { lines.push(`*${p.pair}*  ⚠️ Unavailable\n`); continue; }
      const rsi = calculateRSI(closes);
      const ema20 = calculateEMA(closes, 20);
      const ema50 = calculateEMA(closes, 50);
      const price = closes[closes.length - 1]!;
      const trend = ema20[ema20.length - 1]! > ema50[ema50.length - 1]! ? "📈 Bullish" : "📉 Bearish";
      const rsiLabel = rsi < 40 ? "🟢 Oversold" : rsi > 60 ? "🔴 Overbought" : "🟡 Neutral";
      lines.push(`*${p.pair}*  ${formatPrice(price)}\nRSI ${rsi.toFixed(1)} ${rsiLabel} · ${trend}\n`);
    }
    lines.push(`\n📊 _Full signals at blackxcalls.vercel.app_\n🔔 _Stay sharp — @blackxcallz_`);
    if (CHANNEL_ID) {
      try {
        const sent = await sendMessage(CHANNEL_ID, lines.join("\n"), { parse_mode: "Markdown" });
        await pinMessage(CHANNEL_ID, sent.message_id);
        console.log("Daily briefing posted ✅");
      } catch (err) { console.error("Failed to post daily briefing:", err); }
    }
  }

  // ── Weekly leaderboard Sunday 9am UTC ──────────────────────────────────
  if (utcDay === 0 && utcHour === 9 && state.lastWeeklyLeaderboardWeek !== weekKey) {
    state.lastWeeklyLeaderboardWeek = weekKey;
    if (CHANNEL_ID) {
      try {
        const sent = await sendMessage(CHANNEL_ID, buildLeaderboardMessage(state.weekResults), { parse_mode: "Markdown" });
        await pinMessage(CHANNEL_ID, sent.message_id);
        state.weekResults = [];
        console.log("Weekly leaderboard posted ✅");
      } catch (err) { console.error("Failed to post leaderboard:", err); }
    }
  }

  await writeState(state, sha);
  console.log(`Cron done — signals found: ${found}`);
}
