export interface Signal {
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
}

export interface ActiveSignal extends Signal {
  id: string;
  channelMsgId?: number;
}

export interface TradeResult {
  pair: string;
  type: "LONG" | "SHORT";
  outcome: "tp1" | "tp2" | "sl";
  pnl: string;
  ts: number;
}

export interface ManualStep {
  step: string;
  data: Partial<Signal>;
}

export interface BotState {
  lastSignalTime: Record<string, number>;
  activeSignals: ActiveSignal[];
  weekResults: TradeResult[];
  manualState: Record<string, ManualStep>;
  lastDailyBriefingDay: string;
  lastWeeklyLeaderboardWeek: string;
}

export const DEFAULT_STATE: BotState = {
  lastSignalTime: {},
  activeSignals: [],
  weekResults: [],
  manualState: {},
  lastDailyBriefingDay: "",
  lastWeeklyLeaderboardWeek: "",
};
