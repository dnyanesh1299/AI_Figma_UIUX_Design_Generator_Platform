import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImageCollection, selectBestImage } from "../lib/imageAssets";

const CATEGORIES = ["All", "Dashboard", "Landing Page", "Mobile App", "SaaS", "E-commerce", "Portfolio"];

const TEMPLATES = [
  { id: "1", name: "Fintech Pro Dashboard", category: "Dashboard", author: "AI Studio", tags: ["dark", "finance", "metrics"], views: 2841, colors: { primary: "#1D4ED8", accent: "#10B981", bg: "#0F172A" } },
  { id: "2", name: "SaaS Glassmorphism Landing", category: "Landing Page", author: "AI Studio", tags: ["glass", "saas", "landing"], views: 1920, colors: { primary: "#4F46E5", accent: "#06B6D4", bg: "#1e1b4b" } },
  { id: "3", name: "E-Commerce Mobile UI", category: "Mobile App", author: "AI Studio", tags: ["mobile", "shop", "modern"], views: 3412, colors: { primary: "#7C3AED", accent: "#F59E0B", bg: "#FAFAFA" } },
  { id: "4", name: "Crypto Analytics App", category: "Dashboard", author: "AI Studio", tags: ["crypto", "dark", "neon"], views: 2150, colors: { primary: "#F59E0B", accent: "#8B5CF6", bg: "#0D0D0D" } },
  { id: "5", name: "Healthcare Patient Portal", category: "SaaS", author: "AI Studio", tags: ["health", "clean", "light"], views: 987, colors: { primary: "#0EA5E9", accent: "#6EE7B7", bg: "#F0FDF4" } },
  { id: "6", name: "Gaming Platform Hub", category: "Landing Page", author: "AI Studio", tags: ["gaming", "neon", "dark"], views: 4201, colors: { primary: "#7C3AED", accent: "#EC4899", bg: "#09090B" } },
  { id: "7", name: "Developer Portfolio", category: "Portfolio", author: "AI Studio", tags: ["portfolio", "minimal", "dark"], views: 1543, colors: { primary: "#1E293B", accent: "#F43F5E", bg: "#F9FAFB" } },
  { id: "8", name: "Real Estate Listings", category: "E-commerce", author: "AI Studio", tags: ["real-estate", "clean", "earthy"], views: 876, colors: { primary: "#065F46", accent: "#D97706", bg: "#FFFBEB" } },
  { id: "9", name: "Education LMS Dashboard", category: "Dashboard", author: "AI Studio", tags: ["education", "blue", "dashboard"], views: 1298, colors: { primary: "#2563EB", accent: "#F97316", bg: "#EFF6FF" } }
];

function MiniCanvasPreview({ colors }) {
  return (
    <div style={{ width: "100%", height: "160px", background: colors.bg, borderRadius: "8px", padding: "10px", display: "flex", flexDirection: "column", gap: "6px", overflow: "hidden" }}>
      <div style={{ height: "14px", background: `${colors.primary}25`, borderRadius: "4px" }} />
      <div style={{ display: "flex", gap: "5px", flex: 1 }}>
        <div style={{ width: "36px", background: `${colors.primary}15`, borderRadius: "4px", display: "flex", flexDirection: "column", gap: "3px", padding: "4px" }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ height: "4px", background: i === 0 ? colors.primary : `${colors.primary}20`, borderRadius: "2px" }} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "5px" }}>
          <div style={{ display: "flex", gap: "4px" }}>
            {[colors.primary, colors.accent].map((c, i) => (
              <div key={i} style={{ flex: 1, height: "24px", background: c, borderRadius: "4px", opacity: 0.7 }} />
            ))}
            <div style={{ flex: 1, height: "24px", background: `${colors.primary}20`, borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 1, background: `${colors.accent}15`, borderRadius: "4px", border: `1px solid ${colors.accent}20` }} />
          <div style={{ height: "10px", background: `${colors.primary}10`, borderRadius: "3px" }} />
        </div>
      </div>
    </div>
  );
}

const featuredImages = getImageCollection("luxury jewelry necklaces earrings bracelet");

export default function ExplorePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = TEMPLATES.filter((t) => {
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featured = TEMPLATES[5]; // Gaming Platform as featured
  const featuredAsset = featuredImages.hero;
  const templateAssets = TEMPLATES.map((template) => ({
    ...template,
    image: selectBestImage(`${template.name} ${template.category} ${template.tags.join(" ")}`)
  }));

  return (
    <div style={{ padding: "32px", maxWidth: "1280px" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--secondary)", background: "var(--primary-muted)", border: "1px solid var(--border-glow)", padding: "3px 10px", borderRadius: "999px", display: "inline-block", marginBottom: "10px" }}>
          Explore Templates
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.02em", marginBottom: "8px" }}>
          Browse AI-Generated Designs
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: "480px" }}>
          Discover community-crafted templates and use them as a starting point for your own AI-generated UI.
        </p>
      </div>

      {/* Featured banner */}
      <div style={{
        background: `linear-gradient(135deg, ${featured.colors.bg}, #1e1b4b)`,
        border: "1px solid rgba(124,58,237,0.3)",
        borderRadius: "20px",
        padding: "28px 32px",
        marginBottom: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        flexWrap: "wrap",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "-30%", right: "10%", width: "300px", height: "300px", borderRadius: "50%", background: `radial-gradient(circle, ${featured.colors.accent}30, transparent 70%)` }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "560px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: featured.colors.accent, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <i className="fa-solid fa-fire" /> Featured Template
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "8px" }}>{featured.name}</h2>
          <p style={{ fontSize: "13px", color: "rgba(248,250,252,0.7)", marginBottom: "16px" }}>
            A stunning neon-lit gaming portal with live leaderboards, animated hero section, and real-time player stats.
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn-primary" onClick={() => navigate("/")} style={{ fontSize: "13px", padding: "8px 18px" }}>
              <i className="fa-solid fa-wand-magic-sparkles" /> Use Template
            </button>
            <button className="btn-secondary" style={{ fontSize: "13px", padding: "8px 14px" }}>
              <i className="fa-solid fa-eye" /> Preview
            </button>
          </div>
        </div>
        <div style={{ width: "240px", flexShrink: 0, position: "relative", zIndex: 1 }}>
          <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 18px 50px rgba(0,0,0,0.25)" }}>
            <img src={featuredAsset.src} alt="Featured jewelry asset" style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "14px", flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontSize: "18px", marginBottom: "4px" }}>Local asset matches</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "13px" }}>Images are ranked by keyword similarity to each template.</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
          {templateAssets.slice(0, 6).map((template) => (
            <article key={template.id} style={{ background: "rgba(30,41,59,0.45)", border: "1px solid var(--border)", borderRadius: "18px", overflow: "hidden" }}>
              <img src={template.image.src} alt={template.name} style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }} />
              <div style={{ padding: "14px" }}>
                <h4 style={{ margin: "0 0 4px", fontSize: "14px" }}>{template.name}</h4>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>{template.image.file}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" }}>
        <div className="search-wrap" style={{ flex: "1", minWidth: "200px", maxWidth: "320px" }}>
          <i className="fa-solid fa-magnifying-glass search-icon" />
          <input type="text" className="search-input" placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ margin: 0 }} />
        </div>
        <div className="explore-filter-bar">
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`filter-chip ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><i className="fa-solid fa-compass" /></div>
          <h4>No templates found</h4>
          <p>Try a different category or search term.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {filtered.map((t) => {
            const matchedImage = selectBestImage(`${t.name} ${t.category} ${t.tags.join(" ")}`);
            return (
            <div
              key={t.id}
              className="explore-card"
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3), 0 0 24px rgba(124,58,237,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="explore-card-preview" style={{ position: "relative", overflow: "hidden" }}>
                <img src={matchedImage.src} alt={t.name} style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.48))" }} />
              </div>

              <div className="explore-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "700" }}>{t.name}</h3>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", flexShrink: 0 }}>
                    <i className="fa-regular fa-eye" style={{ marginRight: "3px" }} />{t.views.toLocaleString()}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "12px" }}>
                  {t.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "999px", background: "var(--primary-muted)", border: "1px solid var(--border-glow)", color: "var(--secondary)" }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: "center", fontSize: "12px", padding: "7px 12px" }}
                    onClick={() => navigate("/")}
                  >
                    <i className="fa-solid fa-wand-magic-sparkles" />
                    Use Template
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: "12px", padding: "7px 12px" }}
                    onClick={() => navigate("/preview")}
                  >
                    <i className="fa-solid fa-expand" />
                  </button>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      )}
    </div>
  );
}
