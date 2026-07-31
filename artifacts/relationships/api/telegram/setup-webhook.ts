import type { VercelRequest, VercelResponse } from "@vercel/node";

const TOKEN = process.env["TELEGRAM_BOT_TOKEN"] ?? "";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!TOKEN) return res.status(500).json({ error: "TELEGRAM_BOT_TOKEN not set" });

  const webhookUrl = `https://blackxcalls.vercel.app/api/telegram/webhook`;

  const result = await fetch(`https://api.telegram.org/bot${TOKEN}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ["message", "callback_query", "channel_post"],
    }),
  }).then((r) => r.json());

  // Also fetch current webhook info for confirmation
  const info = await fetch(`https://api.telegram.org/bot${TOKEN}/getWebhookInfo`).then((r) => r.json());

  return res.status(200).json({ set: result, info });
}
