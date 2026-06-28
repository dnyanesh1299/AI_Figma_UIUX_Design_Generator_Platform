import { useState } from "react";

const FAQ_SECTIONS = [
  {
    title: "Getting Started",
    icon: "fa-rocket",
    items: [
      { q: "How does the AI design generator work?", a: "Our platform uses a two-stage LLM pipeline. First, it classifies your text prompt across 14 design dimensions (platform, industry, style, color mood, etc.). Then it generates a complete JSON design schema with layout grids, component definitions, and design tokens. This schema is rendered live in your browser." },
      { q: "What makes a good design prompt?", a: "Be specific about the industry, platform (web/mobile/dashboard), visual style (dark/glassmorphism/minimal), and key components you need (charts, tables, hero, forms). Example: 'Create a dark mode SaaS dashboard with glassmorphism cards, revenue metrics, user growth chart, and activity feed sidebar.'" },
      { q: "How many pages can be generated at once?", a: "For medium complexity prompts, the AI generates 2-3 interconnected pages. For advanced prompts, up to 5 pages with proper navigation routes. Use the page tabs in the preview canvas to switch between them." },
      { q: "Is there a free tier?", a: "Yes! Free accounts can generate up to 200 designs per month with JSON export. Pro accounts unlock Figma API export, unlimited history, and priority generation." }
    ]
  },
  {
    title: "Design Generation",
    icon: "fa-palette",
    items: [
      { q: "What component types are supported?", a: "Navbar, Sidebar, Hero, Card, Metric Card, Chart, Data Table, Form, Button, and Footer. The system automatically composes these into coherent layouts based on your prompt context." },
      { q: "Can I specify exact colors or fonts?", a: "Absolutely. Include hex codes, color names, or Google Font names in your prompt and they will be prioritized over the AI's industry palette defaults. Example: 'Use #FF6B35 as the primary color with Playfair Display headings.'" },
      { q: "How does responsive design work?", a: "Every component includes positions for three grid systems: desktop (12-col), tablet (8-col), and mobile (4-col). Use the device switcher buttons in the preview canvas to see each breakpoint." },
      { q: "What is the Token Inspector?", a: "The Token Inspector shows all design tokens (colors, fonts, spacing) extracted from the generated schema. You can click any color swatch to copy its hex value to clipboard." }
    ]
  },
  {
    title: "Exporting & Integration",
    icon: "fa-arrow-up-from-bracket",
    items: [
      { q: "How do I export to Figma?", a: "In the Preview page, open the Export panel and click 'Export to Figma'. You'll need to have your Figma Personal Access Token configured in your API Keys settings. The export maps each component to a Figma frame." },
      { q: "What is the JSON Schema format?", a: "The JSON schema includes meta (project info), tokens (colors, typography, spacing), pages (array of page objects with components), globalStyles, and navigation. It's designed to be human-readable and parseable by custom tools." },
      { q: "Can I use the API programmatically?", a: "Yes. Use your API key from Profile → API Keys. Send a POST request to /api/generate-design with your prompt in the request body. See the API Reference section below." }
    ]
  }
];

const TUTORIALS = [
  { icon: "fa-wand-magic-sparkles", title: "Your First Design", desc: "Generate a complete dashboard from a single sentence", mins: "3 min" },
  { icon: "fa-layer-group", title: "Multi-Page Flows", desc: "Create interconnected app pages with navigation", mins: "5 min" },
  { icon: "fa-palette", title: "Custom Design Tokens", desc: "Override colors, fonts, and spacing with your brand", mins: "4 min" },
  { icon: "fa-figma", title: "Exporting to Figma", desc: "Connect your API key and push designs directly", mins: "6 min" }
];

export default function HelpPage() {
  const [openItems, setOpenItems] = useState({});
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState(null);

  function toggleItem(key) {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const filteredSections = FAQ_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        !search ||
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter((s) => s.items.length > 0 || !search);

  return (
    <div style={{ padding: "32px", maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--secondary)", background: "var(--primary-muted)", border: "1px solid var(--border-glow)", padding: "3px 10px", borderRadius: "999px", display: "inline-block", marginBottom: "10px" }}>
          Help Center
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.02em", marginBottom: "8px" }}>
          How can we help?
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
          Find answers, guides, and documentation to get the most out of the AI Design Generator.
        </p>

        {/* Search */}
        <div className="search-wrap" style={{ maxWidth: "440px" }}>
          <i className="fa-solid fa-magnifying-glass search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search help articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ margin: 0 }}
          />
        </div>
      </div>

      {/* Quick start cards */}
      <div style={{ marginBottom: "36px" }}>
        <h2 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "14px" }}>
          <i className="fa-solid fa-film" style={{ color: "var(--secondary)", marginRight: "8px" }} />
          Video Tutorials
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
          {TUTORIALS.map((t, i) => (
            <div
              key={i}
              style={{
                background: "rgba(30,41,59,0.6)", border: "1px solid var(--border)", borderRadius: "14px",
                padding: "18px", cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--border-glow)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "var(--primary-muted)", border: "1px solid var(--border-glow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "var(--secondary)", marginBottom: "12px" }}>
                <i className={`fa-solid ${t.icon}`} />
              </div>
              <h4 style={{ fontSize: "13px", fontWeight: "700", marginBottom: "4px" }}>{t.title}</h4>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "10px", lineHeight: "1.4" }}>{t.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--secondary)" }}>
                <i className="fa-regular fa-clock" />
                {t.mins} read
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div style={{ marginBottom: "36px" }}>
        <h2 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "14px" }}>
          <i className="fa-regular fa-circle-question" style={{ color: "var(--secondary)", marginRight: "8px" }} />
          Frequently Asked Questions
        </h2>

        {filteredSections.map((section) => (
          <div key={section.title} style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <i className={`fa-solid ${section.icon}`} style={{ color: "var(--secondary)", fontSize: "14px" }} />
              <h3 style={{ fontSize: "15px", fontWeight: "700" }}>{section.title}</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {section.items.map((item, i) => {
                const key = `${section.title}-${i}`;
                const isOpen = openItems[key];
                return (
                  <div key={i} className="help-accordion">
                    <button className="help-accordion-header" onClick={() => toggleItem(key)}>
                      <span>{item.q}</span>
                      <i className={`fa-solid ${isOpen ? "fa-chevron-up" : "fa-chevron-down"}`} style={{ fontSize: "12px", color: "var(--text-muted)", flexShrink: 0 }} />
                    </button>
                    {isOpen && (
                      <div className="help-accordion-body animate-fade-in">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredSections.length === 0 && search && (
          <div className="empty-state">
            <div className="empty-icon"><i className="fa-regular fa-circle-question" /></div>
            <h4>No results for "{search}"</h4>
            <p>Try a different keyword or browse the categories above.</p>
          </div>
        )}
      </div>

      {/* API Reference */}
      <div style={{ marginBottom: "36px" }}>
        <h2 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "14px" }}>
          <i className="fa-solid fa-code" style={{ color: "var(--secondary)", marginRight: "8px" }} />
          API Reference
        </h2>
        <div className="card" style={{ padding: "20px" }}>
          <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>POST /api/generate-design</h4>
          <div style={{ background: "rgba(8,13,24,0.9)", borderRadius: "10px", padding: "14px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#34d399", lineHeight: "1.7", border: "1px solid var(--border)" }}>
            <pre style={{ margin: 0 }}>{`// Request
POST https://your-domain/api/generate-design
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "prompt": "Create a dark fintech dashboard..."
}

// Response
{
  "status": "success",
  "classification": { "platform": "dashboard", ... },
  "data": {
    "meta": { "projectName": "..." },
    "tokens": { "colors": {}, "typography": {} },
    "pages": [ { "id": "home", "components": [...] } ]
  }
}`}</pre>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="card" style={{ padding: "24px", background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05))", border: "1px solid var(--border-glow)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>
              <i className="fa-solid fa-headset" style={{ color: "var(--secondary)", marginRight: "8px" }} />
              Still need help?
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>
              Our team responds within 24 hours on business days.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ fontSize: "13px" }}>
              <i className="fa-regular fa-envelope" /> Email Support
            </button>
            <button className="btn-secondary" style={{ fontSize: "13px" }}>
              <i className="fa-brands fa-discord" /> Join Discord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
