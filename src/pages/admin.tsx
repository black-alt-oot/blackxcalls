import { useState } from "react";
import { useLocation } from "wouter";
import { useSignalAlerts } from "@/hooks/use-signal-alerts";

type Signal = {
  id: string;
  pair: string;
  type: "LONG" | "SHORT";
  entry: string;
  tp1: string;
  tp2: string;
  sl: string;
  leverage: string;
  status: "ACTIVE" | "HIT TP1" | "HIT TP2" | "STOPPED";
  note: string;
  timestamp: string;
};

const initialSignals: Signal[] = [
  { id: "1", pair: "BTC/USDT", type: "LONG", entry: "64200", tp1: "67500", tp2: "71000", sl: "62800", leverage: "5x", status: "ACTIVE", note: "Strong support at 64k", timestamp: "2025-04-30 10:22" },
  { id: "2", pair: "ETH/USDT", type: "LONG", entry: "3420", tp1: "3750", tp2: "4100", sl: "3280", leverage: "3x", status: "ACTIVE", note: "Breakout incoming", timestamp: "2025-04-30 08:15" },
];

export default function Admin() {
  const [, navigate] = useLocation();
  const [signals, setSignals] = useState<Signal[]>(initialSignals);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const { alerts, pushAlert, dismissAlert, clearAll } = useSignalAlerts();
  const [alertForm, setAlertForm] = useState({ pair: "", type: "LONG" as "LONG" | "SHORT", entry: "", message: "" });
  const [showAlertPanel, setShowAlertPanel] = useState(false);

  const defaultForm: Omit<Signal, "id" | "timestamp"> = {
    pair: "",
    type: "LONG",
    entry: "",
    tp1: "",
    tp2: "",
    sl: "",
    leverage: "3x",
    status: "ACTIVE",
    note: "",
  };

  const [form, setForm] = useState(defaultForm);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      setSignals(prev => prev.map(s => s.id === editId ? { ...s, ...form } : s));
      showToast("Signal updated successfully!");
      setEditId(null);
    } else {
      const newSignal: Signal = {
        ...form,
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
      };
      setSignals(prev => [newSignal, ...prev]);
      showToast("Signal published!");
    }
    setForm(defaultForm);
    setShowForm(false);
  };

  const handleEdit = (s: Signal) => {
    setForm({ pair: s.pair, type: s.type, entry: s.entry, tp1: s.tp1, tp2: s.tp2, sl: s.sl, leverage: s.leverage, status: s.status, note: s.note });
    setEditId(s.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setSignals(prev => prev.filter(s => s.id !== id));
    showToast("Signal deleted.");
  };

  const handleStatusChange = (id: string, status: Signal["status"]) => {
    setSignals(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    showToast("Status updated!");
  };

  const statusColors: Record<string, { color: string; bg: string }> = {
    ACTIVE: { color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
    "HIT TP1": { color: "#eab308", bg: "rgba(234,179,8,0.1)" },
    "HIT TP2": { color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
    STOPPED: { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  };

  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#fff" }}>
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl font-medium text-sm text-white" style={{ background: "#dc2626", boxShadow: "0 4px 20px rgba(220,38,38,0.4)" }}>
          {toast}
        </div>
      )}

      <div className="border-b" style={{ background: "rgba(8,8,8,0.95)", borderColor: "rgba(220,38,38,0.15)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-gray-500 hover:text-white transition-colors text-sm flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <span className="text-gray-700">|</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded flex items-center justify-center font-black text-xs text-white" style={{ background: "#dc2626" }}>BX</div>
              <span className="font-black text-white">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAlertPanel(!showAlertPanel)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={{ border: "1px solid rgba(220,38,38,0.4)", color: "#dc2626", background: "rgba(220,38,38,0.08)" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.15)"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.08)"}
            >
              <span className="w-2 h-2 rounded-full pulse-dot shrink-0" style={{ background: "#dc2626" }} />
              Push Alert
            </button>
            <button
              onClick={() => { setShowForm(!showForm); setEditId(null); setForm(defaultForm); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all"
              style={{ background: "#dc2626" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#b91c1c"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#dc2626"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Signal
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Signals", val: signals.length.toString() },
            { label: "Active", val: signals.filter(s => s.status === "ACTIVE").length.toString() },
            { label: "Hit TP", val: signals.filter(s => s.status === "HIT TP1" || s.status === "HIT TP2").length.toString() },
            { label: "Stopped", val: signals.filter(s => s.status === "STOPPED").length.toString() },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4 text-center border" style={{ background: "#111111", borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="font-black text-2xl stat-number">{s.val}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {showAlertPanel && (
          <div className="mb-8 rounded-2xl border overflow-hidden" style={{ background: "#111111", borderColor: "rgba(220,38,38,0.3)" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(220,38,38,0.15)", background: "rgba(220,38,38,0.05)" }}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full pulse-dot" style={{ background: "#dc2626" }} />
                <h2 className="font-bold text-white">Push Live Signal Alert</h2>
                <span className="text-gray-500 text-xs">— Broadcasts to all site visitors in real-time</span>
              </div>
              {alerts.length > 0 && (
                <button onClick={clearAll} className="text-gray-500 hover:text-red-400 text-xs transition-colors">Clear all alerts</button>
              )}
            </div>

            <div className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!alertForm.pair || !alertForm.entry) return;
                  pushAlert(alertForm);
                  setAlertForm({ pair: "", type: "LONG", entry: "", message: "" });
                  showToast("🔴 Live alert pushed to all visitors!");
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
              >
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1.5 tracking-wide">Trading Pair</label>
                  <input
                    type="text"
                    placeholder="e.g. BTC/USDT"
                    value={alertForm.pair}
                    onChange={e => setAlertForm(prev => ({ ...prev, pair: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", caretColor: "#dc2626" }}
                    onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(220,38,38,0.5)"}
                    onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1.5 tracking-wide">Entry Price</label>
                  <input
                    type="text"
                    placeholder="e.g. 64200"
                    value={alertForm.entry}
                    onChange={e => setAlertForm(prev => ({ ...prev, entry: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", caretColor: "#dc2626" }}
                    onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(220,38,38,0.5)"}
                    onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1.5 tracking-wide">Direction</label>
                  <select
                    value={alertForm.type}
                    onChange={e => setAlertForm(prev => ({ ...prev, type: e.target.value as "LONG" | "SHORT" }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <option value="LONG">LONG</option>
                    <option value="SHORT">SHORT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1.5 tracking-wide">Message (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Strong breakout!"
                    value={alertForm.message}
                    onChange={e => setAlertForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", caretColor: "#dc2626" }}
                    onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(220,38,38,0.5)"}
                    onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all glow-red"
                    style={{ background: "#dc2626" }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#b91c1c"}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#dc2626"}
                  >
                    <span className="w-2 h-2 rounded-full bg-white pulse-dot shrink-0" />
                    Broadcast Live Alert
                  </button>
                </div>
              </form>

              {alerts.length > 0 && (
                <div>
                  <div className="text-gray-500 text-xs font-semibold tracking-wide mb-3">RECENT ALERTS</div>
                  <div className="space-y-2">
                    {alerts.map((a) => {
                      const isLong = a.type === "LONG";
                      return (
                        <div key={a.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ background: "#191919" }}>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#dc2626" }} />
                          <span className="font-bold text-white text-sm">{a.pair}</span>
                          <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: isLong ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", color: isLong ? "#22c55e" : "#ef4444" }}>{a.type}</span>
                          <span className="text-gray-400 text-xs">@${a.entry}</span>
                          {a.message && <span className="text-gray-500 text-xs flex-1 truncate">— {a.message}</span>}
                          <span className="text-gray-600 text-xs ml-auto shrink-0">{new Date(a.timestamp).toLocaleTimeString()}</span>
                          <button onClick={() => dismissAlert(a.id)} className="text-gray-600 hover:text-red-400 transition-colors shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {showForm && (
          <div className="mb-8 rounded-2xl p-6 border" style={{ background: "#111111", borderColor: "rgba(220,38,38,0.25)" }}>
            <h2 className="font-bold text-white text-lg mb-5">{editId ? "Edit Signal" : "Upload New Signal"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Trading Pair", key: "pair", placeholder: "e.g. BTC/USDT" },
                { label: "Entry Price", key: "entry", placeholder: "e.g. 64200" },
                { label: "Take Profit 1", key: "tp1", placeholder: "e.g. 67500" },
                { label: "Take Profit 2", key: "tp2", placeholder: "e.g. 71000" },
                { label: "Stop Loss", key: "sl", placeholder: "e.g. 62800" },
                { label: "Note (optional)", key: "note", placeholder: "e.g. Strong breakout setup" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-gray-400 text-xs font-semibold mb-1.5 tracking-wide">{f.label}</label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={(form as Record<string, string>)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    required={f.key !== "note"}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none transition-all"
                    style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", caretColor: "#dc2626" }}
                    onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(220,38,38,0.5)"}
                    onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>
              ))}

              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1.5 tracking-wide">Direction</label>
                <select
                  value={form.type}
                  onChange={e => setForm(prev => ({ ...prev, type: e.target.value as "LONG" | "SHORT" }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                  style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <option value="LONG">LONG</option>
                  <option value="SHORT">SHORT</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1.5 tracking-wide">Leverage</label>
                <select
                  value={form.leverage}
                  onChange={e => setForm(prev => ({ ...prev, leverage: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                  style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {["2x", "3x", "4x", "5x", "6x", "8x", "10x"].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1.5 tracking-wide">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(prev => ({ ...prev, status: e.target.value as Signal["status"] }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                  style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="HIT TP1">HIT TP1</option>
                  <option value="HIT TP2">HIT TP2</option>
                  <option value="STOPPED">STOPPED</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all"
                  style={{ background: "#dc2626" }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#b91c1c"}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#dc2626"}
                >
                  {editId ? "Update Signal" : "Publish Signal"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditId(null); setForm(defaultForm); }}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-400 transition-colors hover:text-white"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-2xl border overflow-hidden" style={{ background: "#111111", borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-bold text-white">Signals ({signals.length})</h2>
          </div>

          {signals.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              <div className="text-4xl mb-3">📡</div>
              <div>No signals yet. Upload your first call!</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {["Pair", "Type", "Entry", "TP1", "TP2", "SL", "Leverage", "Status", "Note", "Time", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {signals.map((s) => {
                    const st = statusColors[s.status] || { color: "#9ca3af", bg: "rgba(156,163,175,0.1)" };
                    return (
                      <tr key={s.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td className="px-4 py-3 font-bold text-white text-sm whitespace-nowrap">{s.pair}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: s.type === "LONG" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", color: s.type === "LONG" ? "#22c55e" : "#ef4444" }}>
                            {s.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-sm">${s.entry}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: "#22c55e" }}>${s.tp1}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: "#22c55e" }}>${s.tp2}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: "#ef4444" }}>${s.sl}</td>
                        <td className="px-4 py-3 text-sm font-bold" style={{ color: "#dc2626" }}>{s.leverage}</td>
                        <td className="px-4 py-3">
                          <select
                            value={s.status}
                            onChange={e => handleStatusChange(s.id, e.target.value as Signal["status"])}
                            className="px-2 py-1 rounded-lg text-xs font-semibold outline-none cursor-pointer"
                            style={{ background: st.bg, color: st.color, border: "none" }}
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="HIT TP1">HIT TP1</option>
                            <option value="HIT TP2">HIT TP2</option>
                            <option value="STOPPED">STOPPED</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{s.note || "—"}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{s.timestamp}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(s)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
                              style={{ background: "rgba(255,255,255,0.05)" }}
                              title="Edit"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(s.id)}
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ background: "rgba(220,38,38,0.1)", color: "#dc2626" }}
                              title="Delete"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
