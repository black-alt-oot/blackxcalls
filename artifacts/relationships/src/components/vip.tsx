const plans = [
  {
    name: "FREE",
    price: "$0",
    period: "forever",
    color: "#6b7280",
    features: [
      "3–5 signals per week",
      "Delayed entry alerts",
      "Public Telegram access",
      "Basic market updates",
      "Community chat access",
    ],
    locked: [
      "Early entry alerts",
      "1-on-1 mentorship",
      "VIP-only signals",
      "Portfolio review",
    ],
    cta: "Join Free",
    ctaLink: "https://t.me/Blackxcalls",
    popular: false,
  },
  {
    name: "VIP",
    price: "$79",
    period: "/ month",
    color: "#dc2626",
    features: [
      "10–15 premium signals/week",
      "Early entry alerts (up to 2h ahead)",
      "Stop loss & take profit alerts",
      "Private VIP Telegram group",
      "Altcoin & gem calls",
      "Weekly market analysis",
      "24/7 support",
      "Trade journal & tracker",
    ],
    locked: [],
    cta: "Get VIP Access",
    ctaLink: "https://t.me/aje_4",
    popular: true,
  },
  {
    name: "ELITE",
    price: "$199",
    period: "/ month",
    color: "#f59e0b",
    features: [
      "Everything in VIP",
      "1-on-1 monthly mentorship call",
      "Personal portfolio review",
      "Exclusive DeFi & NFT calls",
      "Priority signal delivery",
      "Custom alert configurations",
      "Early access to new features",
      "Lifetime price lock",
    ],
    locked: [],
    cta: "Join Elite",
    ctaLink: "https://t.me/aje_4",
    popular: false,
  },
];

export default function VIP() {
  return (
    <section id="vip" className="py-24 px-4 sm:px-6 relative overflow-hidden" style={{ background: "#080808" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(220,38,38,0.08) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)", color: "#dc2626" }}>
            MEMBERSHIP PLANS
          </div>
          <h2 className="font-black text-4xl sm:text-5xl text-white mb-4">
            Choose Your <span style={{ color: "#dc2626" }}>Level</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            From free signals to elite mentorship — find the plan that matches your ambition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-2xl p-6 border transition-all duration-300"
              style={{
                background: plan.popular ? "linear-gradient(135deg, #1a0000 0%, #250808 100%)" : "#111111",
                borderColor: plan.popular ? "#dc2626" : "rgba(255,255,255,0.06)",
                boxShadow: plan.popular ? "0 0 40px rgba(220,38,38,0.15)" : "none",
              }}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full text-xs font-black text-white" style={{ background: "#dc2626" }}>
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="font-black text-sm tracking-widest mb-3" style={{ color: plan.color }}>{plan.name}</div>
                <div className="flex items-baseline gap-1">
                  <span className="font-black text-4xl text-white">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill={plan.color}>
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
                {plan.locked.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="#374151">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl font-bold text-center text-sm transition-all"
                style={{
                  background: plan.popular ? "#dc2626" : "transparent",
                  color: plan.popular ? "#fff" : plan.color,
                  border: plan.popular ? "none" : `2px solid ${plan.color}40`,
                }}
                onMouseEnter={e => {
                  if (plan.popular) (e.currentTarget as HTMLAnchorElement).style.background = "#b91c1c";
                  else (e.currentTarget as HTMLAnchorElement).style.borderColor = plan.color;
                }}
                onMouseLeave={e => {
                  if (plan.popular) (e.currentTarget as HTMLAnchorElement).style.background = "#dc2626";
                  else (e.currentTarget as HTMLAnchorElement).style.borderColor = `${plan.color}40`;
                }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          All VIP plans come with a 7-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
