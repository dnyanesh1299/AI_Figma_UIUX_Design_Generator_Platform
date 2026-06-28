import { Link } from "react-router-dom";
import { getImageCollection } from "../lib/imageAssets";

const imageSet = getImageCollection("jewelry luxury necklace bracelet earrings");

const features = [
  {
    icon: "fa-brain",
    title: "AI Classification Engine",
    desc: "Two-stage LLM pipeline classifies your prompt across 14 design dimensions — platform, industry, style, mood, and more."
  },
  {
    icon: "fa-layer-group",
    title: "Multi-Page Generation",
    desc: "Generate complete app flows with multiple interconnected pages — not just a single screen. Full navigation & route awareness."
  },
  {
    icon: "fa-mobile-screen",
    title: "Responsive by Default",
    desc: "Every design is produced with desktop, tablet, and mobile breakpoints on a 12-8-4 column grid system."
  },
  {
    icon: "fa-figma",
    title: "Figma Export Ready",
    desc: "One-click export to Figma via API, or download as a structured JSON schema for custom integrations."
  },
  {
    icon: "fa-palette",
    title: "Dynamic Design Tokens",
    desc: "Auto-generated color, typography, spacing, and shadow tokens that align perfectly with industry palettes."
  },
  {
    icon: "fa-bolt",
    title: "Instant Live Preview",
    desc: "See your generated UI rendered live in the browser across device modes — no download required."
  }
];

const steps = [
  { num: "01", title: "Describe Your Design", desc: "Type a natural language prompt describing your product — industry, style, and features. Be as specific or broad as you like." },
  { num: "02", title: "AI Generates Schema", desc: "Our LLM pipeline classifies your intent, selects design tokens, and generates a full multi-page layout schema in seconds." },
  { num: "03", title: "Preview & Export", desc: "Inspect your design live across device sizes, switch between pages, and export to Figma or JSON instantly." }
];

const testimonials = [
  { name: "Aria Chen", role: "Product Designer @ Stripe", text: "This cut my wireframing time from days to 20 minutes. The AI correctly inferred our brand style from the prompt alone.", avatar: "AC" },
  { name: "Marcus Webb", role: "CTO @ BuildFast", text: "We use it to rapidly prototype new product ideas before committing engineering resources. The Figma export is seamless.", avatar: "MW" },
  { name: "Priya Nair", role: "Founder @ LoomAI", text: "The multi-page generation is a game-changer. I got a complete SaaS dashboard flow — 8 screens — in under 2 minutes.", avatar: "PN" }
];

export default function LandingPage() {
  return (
    <div className="landing-page" style={{ color: "var(--text-primary)" }}>
      
      {/* ── Hero ── */}
      <section className="landing-hero">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="landing-section-label animate-fade-in" style={{ marginBottom: "20px" }}>
            <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: "6px" }} />
            AI-Powered UI/UX Generation Platform
          </div>

          <h1 className="landing-hero-title animate-fade-in-up">
            Design Stunning UIs<br />
            <span className="gradient-text">with a Single Prompt</span>
          </h1>

          <p className="landing-hero-subtitle animate-fade-in-up delay-200">
            Describe your product in natural language. Our AI classifies, designs, and generates
            production-ready multi-page UI schemas — exportable directly to Figma.
          </p>

          <div className="landing-hero-cta animate-fade-in-up delay-300">
            <Link to="/signup">
              <button
                className="btn-primary"
                style={{ padding: "14px 32px", fontSize: "15px", borderRadius: "14px" }}
              >
                <i className="fa-solid fa-rocket" />
                Start Generating Free
              </button>
            </Link>
            <Link to="/explore">
              <button
                className="btn-secondary"
                style={{ padding: "14px 28px", fontSize: "15px", borderRadius: "14px" }}
              >
                <i className="fa-solid fa-compass" />
                Browse Templates
              </button>
            </Link>
          </div>

          {/* Image showcase */}
          <div className="landing-image-showcase animate-fade-in-up delay-400">
            <div className="landing-image-hero-card">
              <img src={imageSet.hero.src} alt="Gold jewelry necklace display" className="landing-image-hero" />
              <div className="landing-image-hero-overlay">
                <div className="landing-section-label" style={{ marginBottom: "10px" }}>Asset-driven styling</div>
                <h3 style={{ fontSize: "26px", marginBottom: "10px" }}>Local jewelry assets selected by semantic relevance</h3>
                <p style={{ color: "rgba(248,250,252,0.82)", margin: 0, lineHeight: 1.6 }}>
                  The landing page now uses the best matching local image for the hero based on jewelry and luxury keywords.
                </p>
              </div>
            </div>
            <div className="landing-image-grid">
              {[
                { image: imageSet.secondary, title: "Diamond studs", caption: "Best for polished product cards" },
                { image: imageSet.tertiary, title: "Gold bracelet", caption: "Useful for feature banners" },
                { image: imageSet.grid[1], title: "Necklace display", caption: "Strong fit for editorial sections" },
                { image: imageSet.grid[2], title: "Bangles collection", caption: "Ideal for category tiles" }
              ].map((card) => (
                <article key={card.title} className="landing-image-card">
                  <img src={card.image.src} alt={card.title} className="landing-image-card-media" />
                  <div className="landing-image-card-body">
                    <h4>{card.title}</h4>
                    <p>{card.caption}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>
        <div className="landing-stats animate-fade-in-up">
          {[
            { value: "10K+", label: "Designs Generated" },
            { value: "3.2s", label: "Avg Generation Time" },
            { value: "18+", label: "Component Types" },
            { value: "99%", label: "Export Success Rate" }
          ].map((s, i) => (
            <div key={i} className="landing-stat">
              <div className="landing-stat-value">{s.value}</div>
              <div className="landing-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section className="landing-section">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div className="landing-section-label">Capabilities</div>
          <h2 className="landing-section-title">
            Everything You Need to <span className="gradient-text">Design Faster</span>
          </h2>
          <p className="landing-section-subtitle" style={{ margin: "0 auto" }}>
            A complete AI-powered design pipeline — from natural language prompt to pixel-perfect Figma-ready screens.
          </p>
        </div>

        <div className="grid-three" style={{ gap: "24px" }}>
          {features.map((f, i) => (
            <div key={i} className="landing-feature-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="landing-feature-icon">
                <i className={`fa-solid ${f.icon}`} />
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: "80px 40px", background: "rgba(30,41,59,0.2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div className="landing-section-label">Process</div>
            <h2 className="landing-section-title">
              From Prompt to Preview in <span className="gradient-text">3 Steps</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
            {steps.map((s, i) => (
              <div key={i} style={{ position: "relative" }}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div style={{
                    position: "absolute",
                    top: "20px",
                    right: "-20px",
                    width: "40px",
                    height: "2px",
                    background: "linear-gradient(90deg, var(--primary), transparent)",
                    zIndex: 0
                  }} />
                )}
                <div className="landing-step">
                  <div className="landing-step-number">{s.num}</div>
                  <div>
                    <h3 style={{ fontSize: "17px", marginBottom: "8px" }}>{s.title}</h3>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="landing-section">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div className="landing-section-label">Testimonials</div>
          <h2 className="landing-section-title">
            Loved by <span className="gradient-text">Designers & Founders</span>
          </h2>
        </div>

        <div className="grid-three" style={{ gap: "24px" }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                background: "rgba(30,41,59,0.5)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}
            >
              <div style={{ display: "flex", gap: "4px" }}>
                {[...Array(5)].map((_, j) => (
                  <i key={j} className="fa-solid fa-star" style={{ color: "#f59e0b", fontSize: "12px" }} />
                ))}
              </div>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.7", margin: 0, flex: 1 }}>
                "{t.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "var(--gradient-btn)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "14px",
                  flexShrink: 0
                }}>
                  {t.avatar}
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "600", margin: 0 }}>{t.name}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="landing-cta-section">
        <div className="landing-section-label" style={{ marginBottom: "16px" }}>
          Ready to Ship?
        </div>
        <h2
          className="landing-section-title"
          style={{ fontSize: "clamp(28px,4vw,48px)", marginBottom: "16px", margin: "0 auto 16px" }}
        >
          Start Designing with AI Today
        </h2>
        <p
          style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "480px", margin: "0 auto 36px", lineHeight: "1.6" }}
        >
          Join thousands of designers and builders using AI to accelerate their design workflow.
          No design skills required.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/signup">
            <button
              className="btn-primary"
              style={{ padding: "14px 36px", fontSize: "15px", borderRadius: "14px" }}
            >
              <i className="fa-solid fa-rocket" />
              Create Free Account
            </button>
          </Link>
          <Link to="/login">
            <button
              className="btn-secondary"
              style={{ padding: "14px 28px", fontSize: "15px", borderRadius: "14px" }}
            >
              Sign In
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            background: "var(--gradient-btn)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "12px",
            fontWeight: "800"
          }}>
            AI
          </span>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "15px" }}>
            Figma UI/UX Generator
          </span>
        </div>

        <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          &copy; {new Date().getFullYear()} AI Figma Generator. All rights reserved.
        </div>

        <nav className="landing-footer-links">
          {[
            { label: "Product", path: "/landing" },
            { label: "Explore", path: "/explore" },
            { label: "Pricing", path: "/pricing" },
            { label: "Blog", path: "/blog" },
            { label: "Changelog", path: "/changelog" },
            { label: "About", path: "/about" },
            { label: "Privacy", path: "/privacy" },
            { label: "Terms", path: "/terms" },
          ].map((item) => (
            <Link key={item.label} to={item.path} className="landing-footer-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          .grid-three { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .landing-section { padding: 48px 20px !important; }
          .landing-hero { padding: 60px 20px 48px !important; }
          div[style*="gridTemplateColumns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
