export default function TelegramFloat() {
  return (
    <a
      href="https://t.me/blackxcallz"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-sm text-white shadow-2xl group"
      style={{
        bottom: "24px",
        right: "24px",
        background: "#dc2626",
        boxShadow: "0 0 32px rgba(220,38,38,0.4)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.05)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 48px rgba(220,38,38,0.6)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 32px rgba(220,38,38,0.4)";
      }}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#fff" }} />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
      </span>
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
      </svg>
      <span>Join Free</span>
    </a>
  );
}
