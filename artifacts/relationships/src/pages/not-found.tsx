import { useLocation } from "wouter";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div style={{ background: "#080808", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="text-center px-4">
        <div className="font-black text-9xl mb-4" style={{ color: "#dc2626" }}>404</div>
        <h1 className="font-black text-3xl text-white mb-3">Page Not Found</h1>
        <p className="text-gray-500 text-lg mb-8">This signal doesn't exist.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-xl font-bold text-white transition-all"
          style={{ background: "#dc2626" }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#b91c1c"}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#dc2626"}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
