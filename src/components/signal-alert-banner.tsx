import { useState, useEffect } from "react";
import { useSignalAlerts } from "@/hooks/use-signal-alerts";

export default function SignalAlertBanner() {
  const { alerts, dismissAlert } = useSignalAlerts();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<typeof alerts[0] | null>(null);

  useEffect(() => {
    if (alerts.length > 0) {
      const latest = alerts[0];
      if (!current || current.id !== latest.id) {
        setCurrent(latest);
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 12000);
        return () => clearTimeout(timer);
      }
    }
  }, [alerts]);

  const handleDismiss = () => {
    setVisible(false);
    if (current) dismissAlert(current.id);
  };

  if (!visible || !current) return null;

  const isLong = current.type === "LONG";

  return (
    <div
      className="fixed top-20 left-0 right-0 z-50 flex justify-center px-4"
      style={{ animation: "slideDown 0.4s ease forwards" }}
    >
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        className="flex items-center gap-4 px-5 py-3.5 rounded-2xl shadow-2xl max-w-2xl w-full"
        style={{
          background: "linear-gradient(135deg, #1a0000 0%, #1f0505 100%)",
          border: "1px solid rgba(220,38,38,0.5)",
          boxShadow: "0 0 30px rgba(220,38,38,0.25), 0 8px 32px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full pulse-dot" style={{ background: "#dc2626" }} />
          <span className="text-xs font-black tracking-widest" style={{ color: "#dc2626" }}>LIVE SIGNAL</span>
        </div>

        <div className="w-px h-6 shrink-0" style={{ background: "rgba(220,38,38,0.3)" }} />

        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <span className="font-black text-white text-sm">{current.pair}</span>
          <span
            className="px-2 py-0.5 rounded text-xs font-black"
            style={{
              background: isLong ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
              color: isLong ? "#22c55e" : "#ef4444",
            }}
          >
            {current.type}
          </span>
          <span className="text-gray-400 text-xs">
            Entry: <span className="text-white font-semibold">${current.entry}</span>
          </span>
          {current.message && (
            <span className="text-gray-400 text-xs hidden sm:inline">— {current.message}</span>
          )}
        </div>

        <a
          href="https://t.me/Blackxcalls"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
          style={{ background: "#dc2626" }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "#b91c1c"}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "#dc2626"}
        >
          View Call
        </a>

        <button
          onClick={handleDismiss}
          className="shrink-0 p-1 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
