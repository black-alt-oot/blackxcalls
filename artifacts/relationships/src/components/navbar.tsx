import { useState } from "react";
import { useLocation } from "wouter";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  const navLinks = [
    { label: "Signals", href: "#signals" },
    { label: "Performance", href: "#performance" },
    { label: "VIP", href: "#vip" },
    { label: "Testimonials", href: "#testimonials" },
  ];

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(8,8,8,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(220,38,38,0.15)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "#dc2626" }}>
              <span className="text-white font-black text-sm">BX</span>
            </div>
            <span className="font-black text-white text-lg tracking-wider">BLACK<span style={{ color: "#dc2626" }}>X</span>CALLS</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-wide"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://t.me/Blackxcalls"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all glow-red-sm"
              style={{ background: "#dc2626" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#b91c1c")}
              onMouseLeave={e => (e.currentTarget.style.background = "#dc2626")}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
              </svg>
              Join Telegram
            </a>
            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 border transition-colors"
              style={{ borderColor: "rgba(220,38,38,0.3)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#dc2626"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(220,38,38,0.3)"; (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af"; }}
            >
              Admin
            </button>
          </div>

          <button
            className="md:hidden p-2 text-gray-400"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-current transition-all" style={{ transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "" }} />
              <span className="block w-6 h-0.5 bg-current transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
              <span className="block w-6 h-0.5 bg-current transition-all" style={{ transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "" }} />
            </div>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: "rgba(220,38,38,0.15)" }}>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left px-2 py-3 text-gray-400 hover:text-white transition-colors text-sm"
              >
                {link.label}
              </button>
            ))}
            <div className="flex flex-col gap-2 mt-3 pt-3" style={{ borderTop: "1px solid rgba(220,38,38,0.15)" }}>
              <a
                href="https://t.me/Blackxcalls"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white"
                style={{ background: "#dc2626" }}
              >
                Join Telegram
              </a>
              <button
                onClick={() => navigate("/admin")}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 border"
                style={{ borderColor: "rgba(220,38,38,0.3)" }}
              >
                Admin Panel
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
