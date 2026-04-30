export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg" style={{ paddingTop: "64px" }}>
      <div className="hero-gradient absolute inset-0 pointer-events-none" />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)" }} />

      <div className="absolute top-20 right-10 w-2 h-2 rounded-full pulse-dot" style={{ background: "#dc2626" }} />
      <div className="absolute top-40 left-16 w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "#dc2626", animationDelay: "0.7s" }} />
      <div className="absolute bottom-32 right-24 w-2 h-2 rounded-full pulse-dot" style={{ background: "#dc2626", animationDelay: "1.4s" }} />
      <div className="absolute bottom-48 left-10 w-1 h-1 rounded-full pulse-dot" style={{ background: "#dc2626", animationDelay: "0.3s" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 fade-in-up" style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#dc2626" }}>
          <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: "#dc2626" }} />
          LIVE SIGNALS — 94.7% WIN RATE THIS MONTH
        </div>

        <h1 className="font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-none mb-6 fade-in-up" style={{ animationDelay: "0.1s" }}>
          <span className="text-white">BLACK</span>
          <span className="text-glow" style={{ color: "#dc2626" }}>X</span>
          <br />
          <span className="text-white">CALLS</span>
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed fade-in-up" style={{ animationDelay: "0.2s" }}>
          Premium crypto trading signals with{" "}
          <span style={{ color: "#dc2626" }} className="font-semibold">elite precision</span>.
          Join thousands of traders banking consistent profits daily.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up" style={{ animationDelay: "0.3s" }}>
          <a
            href="https://t.me/Blackxcalls"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg text-white transition-all glow-red"
            style={{ background: "#dc2626", minWidth: "220px", justifyContent: "center" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#b91c1c"; (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.02)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#dc2626"; (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
            </svg>
            Join FREE Channel
          </a>
          <button
            onClick={() => scrollTo("#vip")}
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all"
            style={{ border: "2px solid rgba(220,38,38,0.5)", color: "#dc2626", minWidth: "220px", justifyContent: "center", background: "transparent" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#dc2626"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.08)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(220,38,38,0.5)"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            ⚡ Get VIP Access
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 sm:gap-10 max-w-lg mx-auto mt-16 fade-in-up" style={{ animationDelay: "0.4s" }}>
          {[
            { val: "12K+", label: "Active Members" },
            { val: "94.7%", label: "Win Rate" },
            { val: "$4.2M", label: "Profits Generated" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-black text-2xl sm:text-3xl stat-number">{s.val}</div>
              <div className="text-gray-500 text-xs sm:text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <button onClick={() => scrollTo("#signals")} className="text-gray-600 hover:text-gray-400 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
