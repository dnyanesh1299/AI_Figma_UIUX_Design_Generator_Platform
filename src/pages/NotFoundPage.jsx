import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      {/* Background orbs */}
      <div style={{
        position: "absolute", top: "10%", left: "15%", width: "400px", height: "400px",
        borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
        animation: "orb-drift 8s ease-in-out infinite", pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "15%", width: "300px", height: "300px",
        borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
        animation: "orb-drift 10s ease-in-out infinite reverse", pointerEvents: "none"
      }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Glitch 404 number */}
        <div style={{ position: "relative", marginBottom: "8px" }}>
          <div className="not-found-number">404</div>
          {/* Glitch layers */}
          <div
            className="not-found-number"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              color: "rgba(6,182,212,0.4)",
              background: "none",
              WebkitTextFillColor: "rgba(6,182,212,0.4)",
              animation: "glitch 2.5s steps(1) infinite",
              animationDelay: "0.1s",
              pointerEvents: "none"
            }}
          >
            404
          </div>
          <div
            className="not-found-number"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              color: "rgba(239,68,68,0.3)",
              background: "none",
              WebkitTextFillColor: "rgba(239,68,68,0.3)",
              animation: "glitch 2.5s steps(1) infinite",
              animationDelay: "0.25s",
              pointerEvents: "none"
            }}
          >
            404
          </div>
        </div>

        {/* Icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "18px",
            background: "var(--primary-muted)",
            border: "1px solid var(--border-glow)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            color: "var(--secondary)",
            marginBottom: "24px",
            animation: "pulse-glow 3s ease-in-out infinite"
          }}
        >
          <i className="fa-solid fa-triangle-exclamation" />
        </div>

        <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: "800", letterSpacing: "-0.02em", marginBottom: "12px" }}>
          Page not found
        </h2>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", maxWidth: "400px", lineHeight: "1.6", marginBottom: "32px" }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/">
            <button className="btn-primary" style={{ fontSize: "14px", padding: "11px 24px" }}>
              <i className="fa-solid fa-house" />
              Go to Studio
            </button>
          </Link>
          <Link to="/explore">
            <button className="btn-secondary" style={{ fontSize: "14px", padding: "11px 20px" }}>
              <i className="fa-solid fa-compass" />
              Explore Templates
            </button>
          </Link>
          <Link to="/help">
            <button className="btn-ghost" style={{ fontSize: "14px", padding: "11px 16px" }}>
              <i className="fa-regular fa-circle-question" />
              Help Center
            </button>
          </Link>
        </div>

        {/* Decorative grid */}
        <div
          style={{
            marginTop: "60px",
            opacity: 0.04,
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "8px",
            width: "min(700px, 90vw)",
            pointerEvents: "none"
          }}
        >
          {[...Array(48)].map((_, i) => (
            <div key={i} style={{ height: "8px", background: "white", borderRadius: "2px" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
