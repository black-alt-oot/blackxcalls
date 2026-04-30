import { useState, useEffect, useCallback } from "react";

export type SignalAlert = {
  id: string;
  pair: string;
  type: "LONG" | "SHORT";
  entry: string;
  message: string;
  timestamp: number;
};

const STORAGE_KEY = "bxcalls_alerts";
const CHANNEL_NAME = "bxcalls_notifications";

export function useSignalAlerts() {
  const [alerts, setAlerts] = useState<SignalAlert[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (e) => {
        if (e.data?.type === "NEW_ALERT") {
          setAlerts((prev) => {
            const updated = [e.data.alert, ...prev].slice(0, 10);
            return updated;
          });
        }
      };
    } catch {
    }
    return () => {
      channel?.close();
    };
  }, []);

  const pushAlert = useCallback((alert: Omit<SignalAlert, "id" | "timestamp">) => {
    const newAlert: SignalAlert = {
      ...alert,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setAlerts((prev) => {
      const updated = [newAlert, ...prev].slice(0, 10);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    try {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage({ type: "NEW_ALERT", alert: newAlert });
      setTimeout(() => channel.close(), 500);
    } catch {}
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setAlerts([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { alerts, pushAlert, dismissAlert, clearAll };
}
