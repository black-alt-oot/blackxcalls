import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendMessage, pinMessage, answerCallback, editReplyMarkup } from "../_lib/tg.js";
import { readState, writeState, addSignalToGitHub, clearSignalsOnGitHub } from "../_lib/gh.js";
import { fetchAllPairs } from "../_lib/prices.js";
import { calculateRSI, calculateEMA } from "../_lib/calc.js";
import { formatPrice, buildChannelMessage, buildLeaderboardMessage } from "../_lib/fmt.js";
import type { Signal, ActiveSignal } from "../_lib/types.js";

const ADMIN_ID = Number(process.env["TELEGRAM_ADMIN_ID"] ?? "0");
const CHANNEL_ID = process.env["TELEGRAM_CHANNEL_ID"] ?? "";
const PAIR_COOLDOWN_MS = 4 * 60 * 60 * 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const update = req.body as TelegramUpdate;
  res.status(200).json({ ok: true });

  try {
    if (update.callback_query) {
      await handleCallback(update.callback_query);
    } else if (update.message) {
      await handleMessage(update.message);
    }
  } catch (err) {
    console.error("Webhook error:", err);
  }
}

interface TelegramUpdate {
  callback_query?: CallbackQuery;
  message?: Message;
}
interface CallbackQuery {
  id: string;
  from: { id: number };
  message?: { message_id: number; chat: { id: number } };
  data?: string;
}
interface Message {
  message_id: number;
  chat: { id: number };
  from?: { id: number };
  text?: string;
}

async function handleMessage(msg: Message) {
  if (msg.chat.id !== ADMIN_ID) return;
  const text = msg.text ?? "";

  if (text.startsWith("/start") || text.startsWith("/help")) return handleHelp();
  if (text.startsWith("/status"))      return handleStatus();
  if (text.startsWith("/scan"))        return handleScan();
  if (text.startsWith("/summary"))     return handleSummary();
  if (text.startsWith("/leaderboard")) return handleLeaderboard();
  if (text.startsWith("/results"))     return handleResults();
  if (text.startsWith("/post"))        return handlePostStart();
  if (text.startsWith("/clear"))       return handleClear();

  if (!text.startsWith("/")) await handleWizardStep(text);
}

async function handleHelp() {
  await sendMessage(ADMIN_ID,
    `👋 *BlackXCallzBot is active!*\n\n` +
    `Auto-scans 8 pairs every 5 min. Signals are *auto-posted & pinned* to the channel.\n\n` +
    `Commands:\n` +
    `/scan — Trigger a scan right now\n` +
    `/status — Live RSI + trend for all pairs\n` +
    `/results — Mark a signal TP1/TP2/SL hit\n` +
    `/leaderboard — Weekly win-rate summary\n` +
    `/summary — Post daily briefing now\n` +
    `/post — Manually create & post a signal\n` +
    `/clear — Remove all signals from the site\n` +
    `/help — Show this menu`,
    { parse_mode: "Markdown" }
  );
}

async function handleStatus() {
  await sendMessage(ADMIN_ID, "⏳ Fetching live data for all pairs...");
  const results = await fetchAllPairs();
  const lines: string[] = ["📊 *MARKET STATUS*\n"];
  for (const { pair: p, closes, error } of results) {
    if (error || closes.length === 0) {
      lines.push(`*${p.pair}* — ⚠️ Data unavailable\n`);
      continue;
    }
    const rsi = calculateRSI(closes);
    const ema20 = calculateEMA(closes, 20);
    const ema50 = calculateEMA(closes, 50);
    const price = closes[closes.length - 1]!;
    const rsiEmoji = rsi < 35 ? "🟢" : rsi > 65 ? "🔴" : "🟡";
    const trend = ema20[ema20.length - 1]! > ema50[ema50.length - 1]! ? "⬆️ Bullish" : "⬇️ Bearish";
    lines.push(`*${p.pair}* — ${formatPrice(price)}\nRSI: ${rsi.toFixed(1)} ${rsiEmoji} | Trend: ${trend}\n`);
  }
  lines.push(`_Updated: ${new Date().toUTCString()}_`);
  await sendMessage(ADMIN_ID, lines.join("\n"), { parse_mode: "Markdown" });
}

async function handleScan() {
  await sendMessage(ADMIN_ID, "🔍 Running manual scan across all pairs...");
  const { state, sha } = await readState();
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
      } catch (err) {
        console.error("Failed to post to channel:", err);
      }
    }

    try {
      await addSignalToGitHub(signal);
    } catch (err) {
      console.error("Failed to push to GitHub:", err);
    }
  }

  await writeState(state, sha);
  await sendMessage(ADMIN_ID, found > 0
    ? `✅ Scan complete — ${found} signal(s) auto-posted to channel & site.`
    : `⏳ Scan complete — no signals right now. RSI thresholds not met.`
  );
}

async function handleSummary() {
  await sendMessage(ADMIN_ID, "📊 Generating daily market summary...");
  const results = await fetchAllPairs();
  const lines: string[] = [`🌅 *DAILY MARKET BRIEFING*\n_${new Date().toUTCString().slice(0, 16)}_\n`];
  for (const { pair: p, closes, error } of results) {
    if (error || closes.length === 0) {
      lines.push(`*${p.pair}*  ⚠️ Unavailable\n`);
      continue;
    }
    const rsi = calculateRSI(closes);
    const ema20 = calculateEMA(closes, 20);
    const ema50 = calculateEMA(closes, 50);
    const price = closes[closes.length - 1]!;
    const trend = ema20[ema20.length - 1]! > ema50[ema50.length - 1]! ? "📈 Bullish" : "📉 Bearish";
    const rsiLabel = rsi < 40 ? "🟢 Oversold" : rsi > 60 ? "🔴 Overbought" : "🟡 Neutral";
    lines.push(`*${p.pair}*  ${formatPrice(price)}\nRSI ${rsi.toFixed(1)} ${rsiLabel} · ${trend}\n`);
  }
  lines.push(`\n📊 _Full signals at blackxcalls.vercel.app_\n🔔 _Stay sharp — @blackxcallz_`);
  const text = lines.join("\n");
  if (CHANNEL_ID) {
    try {
      const sent = await sendMessage(CHANNEL_ID, text, { parse_mode: "Markdown" });
      await pinMessage(CHANNEL_ID, sent.message_id);
    } catch (err) {
      console.error("Failed to post summary:", err);
    }
  }
  await sendMessage(ADMIN_ID, "✅ Daily summary posted to channel.");
}

async function handleLeaderboard() {
  const { state } = await readState();
  const text = buildLeaderboardMessage(state.weekResults);
  await sendMessage(ADMIN_ID, text + `\n\n_Post this to channel?_`, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "📣 Post to Channel", callback_data: "post_leaderboard" },
        { text: "Cancel", callback_data: "cancel_leaderboard" },
      ]],
    },
  });
}

async function handleResults() {
  const { state } = await readState();
  const signals = state.activeSignals;
  if (signals.length === 0) {
    await sendMessage(ADMIN_ID, "⚠️ No active signals tracked right now.\n\n_Use /scan to generate a new signal._", { parse_mode: "Markdown" });
    return;
  }
  for (const sig of signals.slice(0, 5)) {
    const dir = sig.type === "LONG" ? "🟢 LONG" : "🔴 SHORT";
    await sendMessage(ADMIN_ID,
      `📊 *${sig.pair}* — ${dir}\nEntry: \`${sig.entry}\` | TP1: \`${sig.target1}\` | TP2: \`${sig.target2}\` | SL: \`${sig.sl}\`\n\nWhat was the result?`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[
            { text: "🎯 TP1", callback_data: `result_tp1_${sig.id}` },
            { text: "🎯🎯 TP2", callback_data: `result_tp2_${sig.id}` },
            { text: "🛑 SL",   callback_data: `result_sl_${sig.id}` },
          ]],
        },
      }
    );
  }
}

async function handlePostStart() {
  const { state, sha } = await readState();
  state.manualState[String(ADMIN_ID)] = { step: "pair", data: {} };
  await writeState(state, sha);
  await sendMessage(ADMIN_ID,
    `📝 *Manual Signal Creator*\n\nStep 1/4 — Which pair?\n\nReply with e.g. *BTC/USDT*`,
    { parse_mode: "Markdown" }
  );
}

async function handleClear() {
  await sendMessage(ADMIN_ID,
    `⚠️ *Clear all signals from the site?*\n\nThis removes all active signal cards immediately.`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[
          { text: "🗑 Yes, clear all", callback_data: "confirm_clear" },
          { text: "Cancel", callback_data: "cancel_clear" },
        ]],
      },
    }
  );
}

async function handleWizardStep(text: string) {
  const { state, sha } = await readState();
  const wizard = state.manualState[String(ADMIN_ID)];
  if (!wizard) return;

  if (wizard.step === "pair") {
    wizard.data.pair = text.toUpperCase();
    wizard.data.coin = text.toUpperCase().split("/")[0] ?? text;
    wizard.data.tvSymbol = `BINANCE:${wizard.data.coin}USDT`;
    wizard.step = "type";
    await writeState(state, sha);
    await sendMessage(ADMIN_ID, `Step 2/4 — LONG or SHORT?`, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[
          { text: "🟢 LONG", callback_data: "manual_LONG" },
          { text: "🔴 SHORT", callback_data: "manual_SHORT" },
        ]],
      },
    });
  } else if (wizard.step === "entry") {
    wizard.data.entry = `$${text.replace(/[$,]/g, "")}`;
    wizard.data.entryNum = parseFloat(text.replace(/[$,]/g, ""));
    wizard.step = "targets";
    await writeState(state, sha);
    await sendMessage(ADMIN_ID, `Step 3/4 — Targets & SL\n\nReply: *TP1 TP2 SL* (space-separated)\nExample: \`68500 72000 61000\``, { parse_mode: "Markdown" });
  } else if (wizard.step === "targets") {
    const parts = text.split(/\s+/);
    if (parts.length < 3) { await sendMessage(ADMIN_ID, "⚠️ Need 3 values: TP1 TP2 SL. Try again."); return; }
    wizard.data.tp1Num = parseFloat(parts[0]!);
    wizard.data.tp2Num = parseFloat(parts[1]!);
    wizard.data.slNum  = parseFloat(parts[2]!);
    wizard.data.target1 = formatPrice(wizard.data.tp1Num);
    wizard.data.target2 = formatPrice(wizard.data.tp2Num);
    wizard.data.sl = formatPrice(wizard.data.slNum);
    wizard.step = "leverage";
    await writeState(state, sha);
    await sendMessage(ADMIN_ID, `Step 4/4 — Leverage e.g. *3x* or *5x*`, { parse_mode: "Markdown" });
  } else if (wizard.step === "leverage") {
    wizard.data.leverage = text.toLowerCase().includes("x") ? text : `${text}x`;
    wizard.data.status = "ACTIVE";
    wizard.data.time = "Just now";
    wizard.data.pnl = "+?%";

    const signal = wizard.data as Signal;
    const id = `manual_${wizard.data.coin}_${Date.now()}`;
    const active: ActiveSignal = { ...signal, id };
    state.activeSignals = [active, ...state.activeSignals].slice(0, 20);
    delete state.manualState[String(ADMIN_ID)];
    await writeState(state, sha);

    const dir = signal.type === "LONG" ? "🟢 LONG" : "🔴 SHORT";
    await sendMessage(ADMIN_ID,
      `📋 *MANUAL SIGNAL PREVIEW*\n\n*${signal.pair}* — ${dir}\n\nEntry: \`${signal.entry}\`\nTP1: \`${signal.target1}\`\nTP2: \`${signal.target2}\`\nSL: \`${signal.sl}\`\nLeverage: ${signal.leverage}\n\nPost this to the site?`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[
            { text: "✅ POST TO SITE", callback_data: `post_${id}` },
            { text: "❌ CANCEL", callback_data: `skip_${id}` },
          ]],
        },
      }
    );
  }
}

async function handleCallback(query: CallbackQuery) {
  const data = query.data ?? "";
  const msgId = query.message?.message_id;
  const chatId = query.message?.chat.id ?? ADMIN_ID;

  if (data === "manual_LONG" || data === "manual_SHORT") {
    const { state, sha } = await readState();
    const wizard = state.manualState[String(ADMIN_ID)];
    if (!wizard || wizard.step !== "type") { await answerCallback(query.id, "⚠️ Wizard expired. Use /post to start again."); return; }
    wizard.data.type = data === "manual_LONG" ? "LONG" : "SHORT";
    wizard.step = "entry";
    await writeState(state, sha);
    await answerCallback(query.id, `${wizard.data.type} selected`);
    await sendMessage(ADMIN_ID, `Step 3/4 — Entry price?\n\nReply with the entry price e.g. \`64200\``, { parse_mode: "Markdown" });

  } else if (data.startsWith("post_") && !data.startsWith("post_leaderboard")) {
    const id = data.slice(5);
    const { state, sha } = await readState();
    const signal = state.activeSignals.find((s) => s.id === id);
    if (!signal) { await answerCallback(query.id, "⚠️ Signal not found — rescan to get fresh ones."); return; }
    await answerCallback(query.id, "✅ Posting to site...");
    if (msgId) await editReplyMarkup(chatId, msgId, { inline_keyboard: [] });
    try {
      await addSignalToGitHub(signal);
      await sendMessage(ADMIN_ID, `✅ *${signal.pair} ${signal.type}* posted! Site updates in ~1 min.`, { parse_mode: "Markdown" });
      if (CHANNEL_ID) {
        const sent = await sendMessage(CHANNEL_ID, buildChannelMessage(signal, 50), { parse_mode: "Markdown" });
        await pinMessage(CHANNEL_ID, sent.message_id);
        signal.channelMsgId = sent.message_id;
        await writeState(state, sha);
      }
    } catch (err) {
      await sendMessage(ADMIN_ID, `❌ Failed to post. Error: ${String(err)}`);
    }

  } else if (data.startsWith("skip_")) {
    await answerCallback(query.id, "❌ Skipped.");
    if (msgId) await editReplyMarkup(chatId, msgId, { inline_keyboard: [] });

  } else if (data.startsWith("result_")) {
    const parts = data.split("_");
    const outcome = parts[1]! as "tp1" | "tp2" | "sl";
    const id = parts.slice(2).join("_");
    const { state, sha } = await readState();
    const sigIdx = state.activeSignals.findIndex((s) => s.id === id);
    if (sigIdx === -1) { await answerCallback(query.id, "⚠️ Signal not found."); return; }
    const sig = state.activeSignals[sigIdx]!;
    state.activeSignals.splice(sigIdx, 1);
    if (msgId) await editReplyMarkup(chatId, msgId, { inline_keyboard: [] });
    await answerCallback(query.id, "Posting result...");

    const dir = sig.type === "LONG" ? "🟢 LONG" : "🔴 SHORT";
    let resultLine = "", pnlLabel = "";
    if (outcome === "tp1") { resultLine = `🎯 *TP1 HIT!* \`${sig.target1}\``; pnlLabel = "+4%"; }
    else if (outcome === "tp2") { resultLine = `🎯🎯 *TP2 HIT!* \`${sig.target2}\``; pnlLabel = "+8%"; }
    else { resultLine = `🛑 *SL HIT* \`${sig.sl}\``; pnlLabel = "-3%"; }

    const resultMsg =
      `📣 *BLACK X CALLS — RESULT UPDATE*\n\n` +
      `📊 *${sig.pair}* — ${dir}\n\n` +
      `Entry: \`${sig.entry}\`\n${resultLine}\n\n` +
      `💰 PnL: *${pnlLabel}* ${outcome === "sl" ? "🔴" : "🟢"}\n\n` +
      `🔔 _Follow for more: t.me/blackxcallz_`;

    state.weekResults.push({ pair: sig.pair, type: sig.type, outcome, pnl: pnlLabel, ts: Date.now() });
    await writeState(state, sha);

    if (CHANNEL_ID) {
      try {
        const sent = await sendMessage(CHANNEL_ID, resultMsg, { parse_mode: "Markdown" });
        await pinMessage(CHANNEL_ID, sent.message_id);
      } catch (err) { console.error("Failed to post result:", err); }
    }
    await sendMessage(ADMIN_ID, "✅ Result posted to channel.");

  } else if (data === "confirm_clear") {
    await answerCallback(query.id, "Clearing...");
    if (msgId) await editReplyMarkup(chatId, msgId, { inline_keyboard: [] });
    try {
      await clearSignalsOnGitHub();
      await sendMessage(ADMIN_ID, "🗑 *All signals cleared.* Site will update in ~1 min.", { parse_mode: "Markdown" });
    } catch (err) {
      await sendMessage(ADMIN_ID, `❌ Failed to clear. Error: ${String(err)}`);
    }

  } else if (data === "cancel_clear") {
    await answerCallback(query.id, "Cancelled.");
    if (msgId) await editReplyMarkup(chatId, msgId, { inline_keyboard: [] });

  } else if (data === "post_leaderboard") {
    await answerCallback(query.id, "Posting leaderboard...");
    if (msgId) await editReplyMarkup(chatId, msgId, { inline_keyboard: [] });
    const { state, sha } = await readState();
    if (CHANNEL_ID) {
      try {
        const sent = await sendMessage(CHANNEL_ID, buildLeaderboardMessage(state.weekResults), { parse_mode: "Markdown" });
        await pinMessage(CHANNEL_ID, sent.message_id);
        state.weekResults = [];
        await writeState(state, sha);
        await sendMessage(ADMIN_ID, "✅ Leaderboard posted & pinned. Weekly stats reset.");
      } catch (err) {
        await sendMessage(ADMIN_ID, `❌ Failed to post. Error: ${String(err)}`);
      }
    }

  } else if (data === "cancel_leaderboard") {
    await answerCallback(query.id, "Cancelled.");
    if (msgId) await editReplyMarkup(chatId, msgId, { inline_keyboard: [] });
  }
}
