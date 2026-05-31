import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import { logger } from "./lib/logger";

const BOT_TOKEN = process.env["TELEGRAM_BOT_TOKEN"] ?? "";
const ADMIN_ID = Number(process.env["TELEGRAM_ADMIN_ID"] ?? "0");
const GITHUB_TOKEN = process.env["GITHUB_TOKEN"] ?? "";
const GITHUB_OWNER = process.env["GITHUB_OWNER"] ?? "";
const GITHUB_REPO = process.env["GITHUB_REPO"] ?? "";
const SIGNALS_FILE = "artifacts/relationships/src/data/signals.json";
const SCAN_INTERVAL_MS = 15 * 60 * 1000;

const PAIRS = [
  { coin: "BTC",  pair: "BTC/USDT",  fsym: "BTC",  tvSymbol: "BINANCE:BTCUSDT",  leverage: "5x" },
  { coin: "ETH",  pair: "ETH/USDT",  fsym: "ETH",  tvSymbol: "BINANCE:ETHUSDT",  leverage: "3x" },
  { coin: "SOL",  pair: "SOL/USDT",  fsym: "SOL",  tvSymbol: "BINANCE:SOLUSDT",  leverage: "4x" },
  { coin: "AVAX", pair: "AVAX/USDT", fsym: "AVAX", tvSymbol: "BINANCE:AVAXUSDT", leverage: "5x" },
  { coin: "LINK", pair: "LINK/USDT", fsym: "LINK", tvSymbol: "BINANCE:LINKUSDT", leverage: "3x" },
  { coin: "BNB",  pair: "BNB/USDT",  fsym: "BNB",  tvSymbol: "BINANCE:BNBUSDT",  leverage: "6x" },
];

function calculateRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const change = closes[i]! - closes[i - 1]!;
    if (change > 0) gains += change;
    else losses -= change;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function calculateEMA(closes: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const emas: number[] = [closes[0]!];
  for (let i = 1; i < closes.length; i++) {
    emas.push(closes[i]! * k + emas[i - 1]! * (1 - k));
  }
  return emas;
}

async function fetchCandles(fsym: string): Promise<number[]> {
  // CryptoCompare — free, no geo-restrictions, 100k calls/month
  const res = await axios.get("https://min-api.cryptocompare.com/data/v2/histohour", {
    params: { fsym, tsym: "USD", limit: 100 },
    headers: { "User-Agent": "BlackXCallzBot/1.0" },
  });
  const candles = (res.data as { Data: { Data: { close: number }[] } }).Data.Data;
  return candles.map((c) => c.close);
}

function formatPrice(price: number): string {
  if (price >= 10000) return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (price >= 1000) return `$${price.toLocaleString("en-US", { maximumFractionDigits: 1 })}`;
  if (price >= 10) return `$${price.toFixed(2)}`;
  return `$${price.toFixed(4)}`;
}

function formatPips(val: number): string {
  if (val >= 100) return Math.round(val).toLocaleString();
  if (val >= 1) return val.toFixed(1);
  return val.toFixed(2);
}

type PendingSignal = {
  coin: string;
  pair: string;
  tvSymbol: string;
  type: "LONG" | "SHORT";
  entryNum: number;
  tp1Num: number;
  tp2Num: number;
  slNum: number;
  entry: string;
  target1: string;
  target2: string;
  sl: string;
  pnl: string;
  status: string;
  time: string;
  leverage: string;
};

const pendingSignals = new Map<string, PendingSignal>();

async function postSignalToGitHub(signal: PendingSignal): Promise<void> {
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${SIGNALS_FILE}`;
  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github.v3+json",
  };

  const res = await axios.get(apiUrl, { headers });
  const currentContent = Buffer.from(res.data.content as string, "base64").toString("utf-8");
  const currentSignals: PendingSignal[] = JSON.parse(currentContent) as PendingSignal[];
  const sha = res.data.sha as string;

  const updated = [signal, ...currentSignals].slice(0, 6);
  const newContent = Buffer.from(JSON.stringify(updated, null, 2)).toString("base64");

  await axios.put(
    apiUrl,
    { message: `signal: add ${signal.type} ${signal.pair}`, content: newContent, sha },
    { headers },
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scanSignals(bot: TelegramBot): Promise<void> {
  logger.info("Scanning pairs for signals...");
  for (const p of PAIRS) {
    try {
      await delay(2500); // Respect CoinGecko free tier rate limit (30 req/min)
      const closes = await fetchCandles(p.fsym);
      const rsi = calculateRSI(closes);
      const ema20 = calculateEMA(closes, 20);
      const ema50 = calculateEMA(closes, 50);

      const lastEma20 = ema20[ema20.length - 1]!;
      const lastEma50 = ema50[ema50.length - 1]!;
      const prevEma20 = ema20[ema20.length - 2]!;
      const prevEma50 = ema50[ema50.length - 2]!;
      const price = closes[closes.length - 1]!;

      let signalType: "LONG" | "SHORT" | null = null;
      if (rsi < 35 && lastEma20 > lastEma50 && prevEma20 <= prevEma50) signalType = "LONG";
      else if (rsi > 65 && lastEma20 < lastEma50 && prevEma20 >= prevEma50) signalType = "SHORT";

      if (!signalType) continue;

      const tp1 = signalType === "LONG" ? price * 1.04 : price * 0.96;
      const tp2 = signalType === "LONG" ? price * 1.08 : price * 0.92;
      const sl = signalType === "LONG" ? price * 0.98 : price * 1.02;

      const signal: PendingSignal = {
        coin: p.coin,
        pair: p.pair,
        tvSymbol: p.tvSymbol,
        type: signalType,
        entryNum: price,
        tp1Num: tp1,
        tp2Num: tp2,
        slNum: sl,
        entry: formatPrice(price),
        target1: formatPrice(tp1),
        target2: formatPrice(tp2),
        sl: formatPrice(sl),
        pnl: "+8%",
        status: "ACTIVE",
        time: "Just now",
        leverage: p.leverage,
      };

      const id = `${p.coin}_${Date.now()}`;
      pendingSignals.set(id, signal);

      const tp1Pips = formatPips(Math.abs(tp1 - price));
      const tp2Pips = formatPips(Math.abs(tp2 - price));
      const slPips = formatPips(Math.abs(price - sl));

      const msg =
        `🚨 *SIGNAL DETECTED*\n\n` +
        `*${p.pair}* — ${signalType === "LONG" ? "🟢 LONG" : "🔴 SHORT"}\n\n` +
        `Entry: ${formatPrice(price)}\n` +
        `TP1: ${formatPrice(tp1)} _(+${tp1Pips} pips)_\n` +
        `TP2: ${formatPrice(tp2)} _(+${tp2Pips} pips)_\n` +
        `SL: ${formatPrice(sl)} _(-${slPips} pips)_\n` +
        `Leverage: ${p.leverage}\n\n` +
        `RSI: ${rsi.toFixed(1)} | EMA Cross: ✅`;

      await bot.sendMessage(ADMIN_ID, msg, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ POST TO SITE", callback_data: `post_${id}` },
              { text: "❌ SKIP", callback_data: `skip_${id}` },
            ],
          ],
        },
      });

      logger.info({ pair: p.pair, type: signalType, rsi: rsi.toFixed(1) }, "Signal alert sent to admin");
    } catch (err) {
      logger.error({ err, pair: p.pair }, "Error scanning pair");
    }
  }
}

export function startBot(): void {
  if (!BOT_TOKEN || !ADMIN_ID) {
    logger.warn("TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_ID not set — bot disabled");
    return;
  }

  let bot: TelegramBot;
  try {
    bot = new TelegramBot(BOT_TOKEN, { polling: true });
  } catch (err) {
    logger.error({ err }, "Failed to start Telegram bot");
    return;
  }

  logger.info("BlackXCallzBot started ✅");

  bot.on("callback_query", async (query) => {
    const data = query.data ?? "";
    const msgId = query.message?.message_id;

    if (data.startsWith("post_")) {
      const id = data.slice(5);
      const signal = pendingSignals.get(id);
      if (!signal) {
        await bot.answerCallbackQuery(query.id, { text: "Signal expired." });
        return;
      }
      pendingSignals.delete(id);
      await bot.answerCallbackQuery(query.id, { text: "✅ Posting to site..." });
      if (msgId) {
        await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: ADMIN_ID, message_id: msgId });
      }
      try {
        await postSignalToGitHub(signal);
        await bot.sendMessage(ADMIN_ID, "✅ Signal posted! Site will update in ~1 min.");
      } catch (err) {
        logger.error({ err }, "Failed to post signal to GitHub");
        await bot.sendMessage(ADMIN_ID, `❌ Failed to post signal. Error: ${String(err)}`);
      }
    } else if (data.startsWith("skip_")) {
      const id = data.slice(5);
      pendingSignals.delete(id);
      await bot.answerCallbackQuery(query.id, { text: "❌ Skipped." });
      if (msgId) {
        await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: ADMIN_ID, message_id: msgId });
      }
    }
  });

  bot.on("polling_error", (err) => {
    logger.error({ err }, "Telegram polling error");
  });

  void scanSignals(bot);
  setInterval(() => void scanSignals(bot), SCAN_INTERVAL_MS);
}
