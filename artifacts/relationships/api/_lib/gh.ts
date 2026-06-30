import type { BotState, Signal } from "./types.js";
import { DEFAULT_STATE } from "./types.js";

const TOKEN = process.env["GITHUB_TOKEN"] ?? "";
const OWNER = process.env["GITHUB_OWNER"] ?? "";
const REPO = process.env["GITHUB_REPO"] ?? "";
const SIGNALS_PATH = "artifacts/relationships/src/data/signals.json";
const STATE_PATH = "artifacts/relationships/src/data/bot-state.json";
const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;
const HEADERS = {
  Authorization: `token ${TOKEN}`,
  "Content-Type": "application/json",
  Accept: "application/vnd.github.v3+json",
};

async function readFile(path: string): Promise<{ content: unknown; sha: string }> {
  const res = await fetch(`${API}/${path}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`GitHub GET ${path} failed: ${res.status}`);
  const data = (await res.json()) as { content: string; sha: string };
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  return { content: JSON.parse(decoded), sha: data.sha };
}

async function writeFile(path: string, content: unknown, sha: string, message: string): Promise<void> {
  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");
  const res = await fetch(`${API}/${path}`, {
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify({ message, content: encoded, sha }),
  });
  if (!res.ok) throw new Error(`GitHub PUT ${path} failed: ${res.status}`);
}

export async function readState(): Promise<{ state: BotState; sha: string }> {
  try {
    const { content, sha } = await readFile(STATE_PATH);
    return { state: content as BotState, sha };
  } catch {
    return { state: { ...DEFAULT_STATE }, sha: "" };
  }
}

export async function writeState(state: BotState, sha: string): Promise<void> {
  if (!sha) {
    const encoded = Buffer.from(JSON.stringify(state, null, 2)).toString("base64");
    const res = await fetch(`${API}/${STATE_PATH}`, {
      method: "PUT",
      headers: HEADERS,
      body: JSON.stringify({ message: "bot: init state", content: encoded }),
    });
    if (!res.ok) throw new Error(`GitHub create state failed: ${res.status}`);
    return;
  }
  await writeFile(STATE_PATH, state, sha, "bot: update state");
}

export async function readSignals(): Promise<{ signals: Signal[]; sha: string }> {
  const { content, sha } = await readFile(SIGNALS_PATH);
  return { signals: content as Signal[], sha };
}

export async function writeSignals(signals: Signal[], sha: string): Promise<void> {
  await writeFile(SIGNALS_PATH, signals, sha, `signal: update signals`);
}

export async function addSignalToGitHub(signal: Signal): Promise<void> {
  const { signals, sha } = await readSignals();
  const updated = [signal, ...signals].slice(0, 6);
  await writeSignals(updated, sha);
}

export async function clearSignalsOnGitHub(): Promise<void> {
  const { sha } = await readSignals();
  await writeSignals([], sha);
}
