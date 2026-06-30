const TOKEN = process.env["TELEGRAM_BOT_TOKEN"] ?? "";
const BASE = `https://api.telegram.org/bot${TOKEN}`;

async function call(method: string, body: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(`${BASE}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export interface InlineKeyboard {
  inline_keyboard: { text: string; callback_data: string }[][];
}

export async function sendMessage(
  chatId: number | string,
  text: string,
  opts: { parse_mode?: string; reply_markup?: InlineKeyboard | { remove_keyboard?: boolean } } = {}
): Promise<{ message_id: number }> {
  const result = await call("sendMessage", { chat_id: chatId, text, ...opts });
  return (result as { result: { message_id: number } }).result;
}

export async function pinMessage(chatId: number | string, messageId: number): Promise<void> {
  await call("pinChatMessage", { chat_id: chatId, message_id: messageId }).catch(() => null);
}

export async function answerCallback(id: string, text?: string): Promise<void> {
  await call("answerCallbackQuery", { callback_query_id: id, text: text ?? "" });
}

export async function editReplyMarkup(
  chatId: number | string,
  messageId: number,
  markup: InlineKeyboard
): Promise<void> {
  await call("editMessageReplyMarkup", { chat_id: chatId, message_id: messageId, reply_markup: markup });
}
