import { useLocation } from "wouter";

export default function Footer() {
  const [, navigate] = useLocation();

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer style={{ background: "#080808", borderTop: "1px solid rgba(220,38,38,0.15)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-white" style={{ background: "#dc2626" }}>
                BX
              </div>
              <span className="font-black text-xl text-white tracking-wide">BLACK<span style={{ color: "#dc2626" }}>X</span>CALLS</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
              Premium crypto trading signals with elite precision. Join thousands of traders banking consistent profits daily.
            </p>
            <a
              href="https://t.me/Blackxcalls"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: "#dc2626" }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "#b91c1c"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "#dc2626"}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
              </svg>
              Join Telegram
            </a>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-5 tracking-wider">NAVIGATE</h4>
            <ul className="space-y-3">
              {[
                { label: "Signals", id: "#signals" },
                { label: "Performance", id: "#performance" },
                { label: "VIP Plans", id: "#vip" },
                { label: "Testimonials", id: "#testimonials" },
              ].map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => scrollTo(l.id)}
                    className="text-gray-500 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-5 tracking-wider">COMMUNITY</h4>
            <ul className="space-y-3">
              {[
                { label: "Free Telegram", href: "https://t.me/Blackxcalls" },
                { label: "VIP Group", href: "https://t.me/aje_4" },
                { label: "Contact Admin", href: "https://t.me/aje_4" },
                { label: "Admin Panel", admin: true },
              ].map((l) => (
                <li key={l.label}>
                  {l.admin ? (
                    <button
                      onClick={() => navigate("/admin")}
                      className="text-gray-500 hover:text-white text-sm transition-colors"
                    >
                      {l.label}
                    </button>
                  ) : (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white text-sm transition-colors">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-gray-600 text-xs text-center sm:text-left">
            © 2026 BLACK X CALLS. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs text-center sm:text-right max-w-md">
            <span style={{ color: "#dc2626" }}>RISK DISCLAIMER:</span> Crypto trading involves significant risk. Past performance does not guarantee future results. Trade responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}
