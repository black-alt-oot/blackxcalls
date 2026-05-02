const testimonials = [
  {
    name: "Marcus W.",
    handle: "@crypto_marcus",
    avatar: "MW",
    avatarColor: "#dc2626",
    text: "BLACK X CALLS changed everything for me. I turned $2,000 into $18,400 in 3 months following their signals. The entry precision is insane — they consistently get me in before the pump.",
    pnl: "+820%",
    timeframe: "3 months",
    verified: true,
  },
  {
    name: "Sophia K.",
    handle: "@sophiakrypto",
    avatar: "SK",
    avatarColor: "#9945ff",
    text: "I've tried 5 different signal groups before. None come close. The transparency here is real — they show losses too. Made +$14K in April alone just following the BTC and ETH calls.",
    pnl: "+$14K",
    timeframe: "April 2025",
    verified: true,
  },
  {
    name: "Daniel R.",
    handle: "@dan_tradez",
    avatar: "DR",
    avatarColor: "#f7931a",
    text: "Win rate is legit. I track every call in a spreadsheet and we're at 94% for this quarter. The early entry alerts are incredible — I'm often 8-12% ahead before other channels.",
    pnl: "94% WR",
    timeframe: "Q1 2025",
    verified: true,
  },
  {
    name: "Aisha M.",
    handle: "@aishacalls",
    avatar: "AM",
    avatarColor: "#22c55e",
    text: "As a beginner, the stop-loss guidance saved me so many times. The team explains the reasoning behind every call. Up 180% in 6 weeks and finally feel confident trading.",
    pnl: "+180%",
    timeframe: "6 weeks",
    verified: true,
  },
  {
    name: "Jake T.",
    handle: "@jakecrypt",
    avatar: "JT",
    avatarColor: "#627eea",
    text: "The SOL call last month was absolutely wild — entry at $168, hit TP2 at $210. That's +25% in 4 days. I've compounded my initial stack 6x since joining. No cap.",
    pnl: "+6x",
    timeframe: "2 months",
    verified: true,
  },
  {
    name: "Carlos B.",
    handle: "@carlosbtrader",
    avatar: "CB",
    avatarColor: "#eab308",
    text: "Been here since day 1. The signals and guidance here are a game changer. Learned more about risk management following these calls than I did in 2 years of solo trading.",
    pnl: "+$31K",
    timeframe: "5 months",
    verified: true,
  },
  {
    name: "Tunde A.",
    handle: "@tunde_trades",
    avatar: "TA",
    avatarColor: "#06b6d4",
    text: "I was skeptical at first but the results speak for themselves. Hit 3 TPs in one week on BTC, ETH and BNB calls. My portfolio is up 240% in 7 weeks. This channel is different.",
    pnl: "+240%",
    timeframe: "7 weeks",
    verified: true,
  },
  {
    name: "Priya S.",
    handle: "@priyatrader",
    avatar: "PS",
    avatarColor: "#ec4899",
    text: "As someone who works a full-time job, I don't have time to watch charts all day. BLACK X CALLS gives me clear entries and targets. I just set my orders and let it run. Up $9K this month.",
    pnl: "+$9K",
    timeframe: "1 month",
    verified: true,
  },
  {
    name: "Kwame O.",
    handle: "@kwame_crypto",
    avatar: "KO",
    avatarColor: "#10b981",
    text: "The XRP and LINK calls this quarter were fire. Every single one hit TP1 minimum. I went from $500 to $4,200 in 6 weeks. My friends keep asking how I'm doing it — I tell them to join.",
    pnl: "+740%",
    timeframe: "6 weeks",
    verified: true,
  },
  {
    name: "Lena V.",
    handle: "@lena_v_crypto",
    avatar: "LV",
    avatarColor: "#8b5cf6",
    text: "I've been trading for 4 years. Never seen accuracy like this. The AVAX short call alone made me $6,800 in 48 hours. The admin is always responsive and explains every trade.",
    pnl: "+$6.8K",
    timeframe: "48 hours",
    verified: true,
  },
  {
    name: "Emeka J.",
    handle: "@emeka_j",
    avatar: "EJ",
    avatarColor: "#f97316",
    text: "Joined with $1,000. Now sitting at $11,400 after 2 months. The calls are consistent, the stop losses are tight, and the team actually cares. Best decision I made in crypto.",
    pnl: "+1040%",
    timeframe: "2 months",
    verified: true,
  },
  {
    name: "Sarah L.",
    handle: "@sarah_l_fx",
    avatar: "SL",
    avatarColor: "#14b8a6",
    text: "Coming from forex trading, I was new to crypto signals. This channel made the transition so smooth. Clear setups, great R:R ratios, and consistent wins. Up $22K across 3 months.",
    pnl: "+$22K",
    timeframe: "3 months",
    verified: true,
  },
  {
    name: "Nnamdi C.",
    handle: "@nnamdi_calls",
    avatar: "NC",
    avatarColor: "#dc2626",
    text: "The DOT and MATIC calls last month were incredible. Hit both TPs with perfect timing. I've tried 8 signal groups — nothing comes close to the precision here. Genuinely life-changing.",
    pnl: "+$17K",
    timeframe: "30 days",
    verified: true,
  },
  {
    name: "David H.",
    handle: "@david_hodls",
    avatar: "DH",
    avatarColor: "#6366f1",
    text: "I started with $3K and was nervous about following signals. But the first 5 calls all hit. I'm now at $19K and fully trust the process. The win rate is real — I track every trade.",
    pnl: "+533%",
    timeframe: "10 weeks",
    verified: true,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)", color: "#dc2626" }}>
            MEMBER RESULTS
          </div>
          <h2 className="font-black text-4xl sm:text-5xl text-white mb-4">
            Real People. <span style={{ color: "#dc2626" }}>Real Profits.</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Join over 12,000 traders who are already winning with BLACK X CALLS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 border flex flex-col"
              style={{ background: "#111111", borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white"
                    style={{ background: t.avatarColor }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-1.5">
                      {t.name}
                      {t.verified && (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="#dc2626">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="text-gray-500 text-xs">{t.handle}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-sm" style={{ color: "#22c55e" }}>{t.pnl}</div>
                  <div className="text-gray-600 text-xs">{t.timeframe}</div>
                </div>
              </div>

              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, si) => (
                  <svg key={si} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="#eab308">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-400 text-sm leading-relaxed flex-1">"{t.text}"</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://t.me/blackxcallz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg text-white transition-all glow-red"
            style={{ background: "#dc2626" }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "#b91c1c"}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "#dc2626"}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
            </svg>
            Join 12,000+ Winners Today
          </a>
        </div>
      </div>
    </section>
  );
}
