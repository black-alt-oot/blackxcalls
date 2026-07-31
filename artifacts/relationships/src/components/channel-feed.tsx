import { useState, useEffect } from "react";

type AnnouncementPost = {
  id: string; type: "announcement";
  text: string; time: string; ts: number;
};
type SignalPost = {
  id: string; type: "signal";
  pair: string; direction: "LONG" | "SHORT";
  entry: string; tp1: string; tp2: string; sl: string;
  leverage: string; rsi: string; time: string; ts: number;
};
type ResultPost = {
  id: string; type: "result";
  pair: string; direction: "LONG" | "SHORT";
  outcome: "tp1" | "tp2" | "sl";
  entry: string; tp1?: string; tp2?: string; pnl: string;
  time: string; ts: number;
};
type BriefingPost = {
  id: string; type: "briefing";
  time: string; ts: number;
  markets: { pair: string; rsi: string; trend: string }[];
};
type ChannelPost = SignalPost | ResultPost | BriefingPost | AnnouncementPost;

const CHANNEL_URL = "https://t.me/blackxcallz";
const RAW_URL = "https://raw.githubusercontent.com/black-alt-oot/blackxcalls/main/artifacts/relationships/src/data/channel-posts.json";

// Ticker hook — increments every 60s so timeAgo labels re-render automatically
function useTick(intervalMs = 60_000) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return tick;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function AnnouncementCard({ post, tick }: { post: AnnouncementPost; tick: number }) {
  void tick; // consumed only to trigger re-render for timeAgo
  const lines = post.text.split("\n").filter(Boolean);
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span
          className="text-xs font-black px-2.5 py-1 rounded-lg"
          style={{ background: "rgba(220,38,38,0.1)", color: "#dc2626", border: "1px solid rgba(220,38,38,0.25)" }}
        >
          📢 ANNOUNCEMENT
        </span>
        <span className="text-gray-600 text-xs">{timeAgo(post.ts)}</span>
      </div>

      <div className="px-4 py-4 flex-1">
        <div className="space-y-1">
          {lines.map((line, i) => (
            <p key={i} className="text-gray-300 text-sm leading-relaxed" style={{ whiteSpace: "pre-wrap" }}>
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm transition-all"
          style={{
            background: "rgba(220,38,38,0.1)",
            color: "#dc2626",
            border: "1px solid rgba(220,38,38,0.25)",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 7.5l-1.67 7.86c-.12.55-.45.68-.91.42l-2.52-1.85-1.21 1.17c-.13.13-.25.25-.52.25l.19-2.67 4.87-4.4c.21-.19-.05-.29-.33-.1L7.72 14.7l-2.47-.77c-.54-.17-.55-.54.11-.8l9.65-3.72c.45-.17.84.11.69.79z"/>
          </svg>
          View in Channel
        </a>
      </div>
    </div>
  );
}

function SignalCard({ post, tick }: { post: SignalPost; tick: number }) {
  void tick;
  const isLong = post.direction === "LONG";
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-black px-2.5 py-1 rounded-lg"
            style={{ background: "rgba(220,38,38,0.15)", color: "#dc2626", border: "1px solid rgba(220,38,38,0.3)" }}
          >
            ⚡ SIGNAL ALERT
          </span>
        </div>
        <span className="text-gray-600 text-xs">{timeAgo(post.ts)}</span>
      </div>

      <div className="px-4 py-4 flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white font-black text-xl">{post.pair}</span>
          <span
            className="text-sm font-black px-3 py-1 rounded-xl"
            style={{
              background: isLong ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
              color: isLong ? "#22c55e" : "#ef4444",
              border: `1px solid ${isLong ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
            }}
          >
            {isLong ? "🟢 LONG" : "🔴 SHORT"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "Entry", value: post.entry, highlight: true },
            { label: "Leverage", value: post.leverage, highlight: false },
            { label: "TP1", value: post.tp1, highlight: false },
            { label: "TP2", value: post.tp2, highlight: false },
            { label: "SL", value: post.sl, highlight: false },
            { label: "RSI", value: post.rsi, highlight: false },
          ].map(({ label, value, highlight }) => (
            <div
              key={label}
              className="flex items-center justify-between px-3 py-2 rounded-xl"
              style={{ background: highlight ? "rgba(220,38,38,0.1)" : "rgba(255,255,255,0.03)" }}
            >
              <span className="text-gray-500 text-xs font-medium">{label}</span>
              <span
                className="text-xs font-black font-mono"
                style={{ color: highlight ? "#dc2626" : "#ffffff" }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 mb-1">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
          <span className="text-gray-600 text-xs">EMA trend confirmed · Posted to @blackxcallz</span>
        </div>
      </div>

      <div className="px-4 pb-4">
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm transition-all"
          style={{
            background: "linear-gradient(135deg, #dc2626, #b91c1c)",
            color: "#ffffff",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 7.5l-1.67 7.86c-.12.55-.45.68-.91.42l-2.52-1.85-1.21 1.17c-.13.13-.25.25-.52.25l.19-2.67 4.87-4.4c.21-.19-.05-.29-.33-.1L7.72 14.7l-2.47-.77c-.54-.17-.55-.54.11-.8l9.65-3.72c.45-.17.84.11.69.79z"/>
          </svg>
          View Call in Channel
        </a>
      </div>
    </div>
  );
}

function ResultCard({ post, tick }: { post: ResultPost; tick: number }) {
  void tick;
  const isWin = post.outcome !== "sl";
  const isLong = post.direction === "LONG";
  const outcomeLabel = post.outcome === "tp1" ? "🎯 TP1 HIT!" : post.outcome === "tp2" ? "🎯🎯 TP2 HIT!" : "🛑 SL HIT";

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "#111111", border: `1px solid ${isWin ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}` }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span
          className="text-xs font-black px-2.5 py-1 rounded-lg"
          style={{
            background: isWin ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            color: isWin ? "#22c55e" : "#ef4444",
            border: `1px solid ${isWin ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
          }}
        >
          📣 RESULT UPDATE
        </span>
        <span className="text-gray-600 text-xs">{timeAgo(post.ts)}</span>
      </div>

      <div className="px-4 py-4 flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-black text-xl">{post.pair}</span>
          <span
            className="text-sm font-black px-3 py-1 rounded-xl"
            style={{
              background: isLong ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
              color: isLong ? "#22c55e" : "#ef4444",
              border: `1px solid ${isLong ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
            }}
          >
            {isLong ? "🟢 LONG" : "🔴 SHORT"}
          </span>
        </div>

        <div
          className="flex items-center justify-between px-4 py-3 rounded-xl mb-3"
          style={{ background: isWin ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)" }}
        >
          <span className="text-white font-bold text-sm">{outcomeLabel}</span>
          <span
            className="font-black text-lg"
            style={{ color: isWin ? "#22c55e" : "#ef4444" }}
          >
            {post.pnl}
          </span>
        </div>

        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
          <span className="text-gray-500 text-xs">Entry</span>
          <span className="text-white text-xs font-mono font-bold">{post.entry}</span>
        </div>
      </div>

      <div className="px-4 pb-4">
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm transition-all"
          style={{
            background: isWin ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
            color: isWin ? "#22c55e" : "#ef4444",
            border: `1px solid ${isWin ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 7.5l-1.67 7.86c-.12.55-.45.68-.91.42l-2.52-1.85-1.21 1.17c-.13.13-.25.25-.52.25l.19-2.67 4.87-4.4c.21-.19-.05-.29-.33-.1L7.72 14.7l-2.47-.77c-.54-.17-.55-.54.11-.8l9.65-3.72c.45-.17.84.11.69.79z"/>
          </svg>
          View in Channel
        </a>
      </div>
    </div>
  );
}

function BriefingCard({ post, tick }: { post: BriefingPost; tick: number }) {
  void tick;
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span
          className="text-xs font-black px-2.5 py-1 rounded-lg"
          style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)" }}
        >
          🌅 DAILY BRIEFING
        </span>
        <span className="text-gray-600 text-xs">{timeAgo(post.ts)}</span>
      </div>

      <div className="px-4 py-4 flex-1">
        <p className="text-gray-400 text-sm mb-3 font-medium">Market overview for {post.markets.length} pairs</p>
        <div className="space-y-2">
          {post.markets.map((m) => {
            const rsi = parseFloat(m.rsi);
            const isBull = m.trend === "Bullish";
            const rsiColor = rsi < 40 ? "#22c55e" : rsi > 60 ? "#ef4444" : "#fbbf24";
            return (
              <div
                key={m.pair}
                className="flex items-center justify-between px-3 py-2 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <span className="text-white text-xs font-bold">{m.pair}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono" style={{ color: rsiColor }}>RSI {m.rsi}</span>
                  <span className="text-xs" style={{ color: isBull ? "#22c55e" : "#ef4444" }}>
                    {isBull ? "📈" : "📉"} {m.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 pb-4">
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm"
          style={{
            background: "rgba(251,191,36,0.1)",
            color: "#fbbf24",
            border: "1px solid rgba(251,191,36,0.25)",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 7.5l-1.67 7.86c-.12.55-.45.68-.91.42l-2.52-1.85-1.21 1.17c-.13.13-.25.25-.52.25l.19-2.67 4.87-4.4c.21-.19-.05-.29-.33-.1L7.72 14.7l-2.47-.77c-.54-.17-.55-.54.11-.8l9.65-3.72c.45-.17.84.11.69.79z"/>
          </svg>
          View Full Briefing
        </a>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="h-5 w-32 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.07)" }} />
      </div>
      <div className="px-4 py-4 space-y-3">
        <div className="h-4 w-3/4 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="h-4 w-1/2 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="h-4 w-2/3 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
      </div>
      <div className="px-4 pb-4">
        <div className="h-10 w-full rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
      </div>
    </div>
  );
}

export default function ChannelFeed() {
  const [posts, setPosts] = useState<ChannelPost[]>([]);
  const [loading, setLoading] = useState(true);
  const tick = useTick(60_000); // re-render every minute so timeAgo updates

  // Fetch live from GitHub — cache-busted every 5 min so new posts appear without a Vercel redeploy
  function loadPosts() {
    const bust = Math.floor(Date.now() / 300_000); // changes every 5 min
    fetch(`${RAW_URL}?t=${bust}`)
      .then((r) => r.json())
      .then((data: ChannelPost[]) => {
        setPosts([...data].sort((a, b) => b.ts - a.ts));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    loadPosts();
    // Refetch every 5 minutes while page is open
    const id = setInterval(loadPosts, 300_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="channel" className="py-24 px-4 sm:px-6" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)", color: "#dc2626" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#dc2626" }} />
            LIVE CHANNEL FEED
          </div>
          <h2 className="font-black text-4xl sm:text-5xl text-white mb-4">
            Latest <span style={{ color: "#dc2626" }}>Calls</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Every signal, result, and briefing posted to our channel — updated automatically.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
          ) : posts.length === 0 ? (
            <div className="col-span-3 text-center text-gray-600 py-16">No posts yet.</div>
          ) : (
            posts.map((post) => (
              <div key={post.id}>
                {post.type === "signal"       && <SignalCard       post={post as SignalPost}       tick={tick} />}
                {post.type === "result"       && <ResultCard       post={post as ResultPost}       tick={tick} />}
                {post.type === "briefing"     && <BriefingCard     post={post as BriefingPost}     tick={tick} />}
                {post.type === "announcement" && <AnnouncementCard post={post as AnnouncementPost} tick={tick} />}
              </div>
            ))
          )}
        </div>

        {/* Follow CTA */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "#111111", border: "1px solid rgba(220,38,38,0.2)" }}
        >
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#dc2626">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 7.5l-1.67 7.86c-.12.55-.45.68-.91.42l-2.52-1.85-1.21 1.17c-.13.13-.25.25-.52.25l.19-2.67 4.87-4.4c.21-.19-.05-.29-.33-.1L7.72 14.7l-2.47-.77c-.54-.17-.55-.54.11-.8l9.65-3.72c.45-.17.84.11.69.79z"/>
            </svg>
          </div>
          <h3 className="text-white font-black text-2xl mb-2">Never Miss a Signal</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Join 12,000+ traders getting real-time alerts the moment we post a call.
          </p>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm transition-all"
            style={{
              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              color: "#ffffff",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 7.5l-1.67 7.86c-.12.55-.45.68-.91.42l-2.52-1.85-1.21 1.17c-.13.13-.25.25-.52.25l.19-2.67 4.87-4.4c.21-.19-.05-.29-.33-.1L7.72 14.7l-2.47-.77c-.54-.17-.55-.54.11-.8l9.65-3.72c.45-.17.84.11.69.79z"/>
            </svg>
            Join @blackxcallz Free
          </a>
        </div>

      </div>
    </section>
  );
}
