import { Link } from "react-router-dom";

function AppFooter() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      padding: "48px 40px 32px",
      background: "var(--bg-deep)",
      color: "var(--text-muted)",
      fontSize: "13px"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "40px",
        marginBottom: "40px"
      }}>
        {/* Brand info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: "var(--gradient-btn)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "10px",
                fontWeight: "800",
                flexShrink: 0
              }}
            >
              AI
            </span>
            <span style={{ color: "var(--text-primary)", fontWeight: "700", fontFamily: "'Outfit', sans-serif" }}>
              Figma UI Generator
            </span>
          </div>
          <p style={{ lineHeight: "1.5", fontSize: "12.5px" }}>
            Generate professional multi-page application schemas using generative models.
          </p>
          <div style={{ display: "flex", gap: "12px", fontSize: "15px" }}>
            <a href="#" style={{ color: "var(--text-muted)" }}><i className="fa-brands fa-twitter" /></a>
            <a href="#" style={{ color: "var(--text-muted)" }}><i className="fa-brands fa-figma" /></a>
            <a href="#" style={{ color: "var(--text-muted)" }}><i className="fa-brands fa-github" /></a>
          </div>
        </div>

        {/* Product links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4 style={{ color: "var(--text-primary)", fontWeight: "700", fontSize: "14px" }}>Product</h4>
          <Link to="/" style={{ color: "var(--text-muted)" }}>Prompt Studio</Link>
          <Link to="/projects" style={{ color: "var(--text-muted)" }}>My Projects</Link>
          <Link to="/explore" style={{ color: "var(--text-muted)" }}>Explore Templates</Link>
          <Link to="/preview" style={{ color: "var(--text-muted)" }}>Canvas Preview</Link>
        </div>

        {/* Resources links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4 style={{ color: "var(--text-primary)", fontWeight: "700", fontSize: "14px" }}>Resources</h4>
          <Link to="/pricing" style={{ color: "var(--text-muted)" }}>Pricing Plans</Link>
          <Link to="/blog" style={{ color: "var(--text-muted)" }}>Product Blog</Link>
          <Link to="/changelog" style={{ color: "var(--text-muted)" }}>Release Changelog</Link>
          <Link to="/help" style={{ color: "var(--text-muted)" }}>Help Center</Link>
        </div>

        {/* Company/Legal links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4 style={{ color: "var(--text-primary)", fontWeight: "700", fontSize: "14px" }}>Company &amp; Legal</h4>
          <Link to="/about" style={{ color: "var(--text-muted)" }}>About Team</Link>
          <Link to="/privacy" style={{ color: "var(--text-muted)" }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: "var(--text-muted)" }}>Terms of Service</Link>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--border-light)", margin: "32px 0 24px" }} />

      {/* Bottom info */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        fontSize: "12px",
        color: "var(--text-muted)"
      }}>
        <span>&copy; {new Date().getFullYear()} AI Figma Generator. All rights reserved.</span>
        <span>Made with <i className="fa-solid fa-heart" style={{ color: "var(--danger)", margin: "0 2px" }} /> for designers.</span>
      </div>
    </footer>
  );
}

export default AppFooter;
