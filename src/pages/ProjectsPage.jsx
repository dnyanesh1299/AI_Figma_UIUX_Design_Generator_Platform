import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_PROJECTS = [
  {
    id: "1",
    name: "Fintech Dashboard",
    status: "Completed",
    prompt: "Dark mode fintech dashboard with revenue metrics and transaction table",
    industry: "finance",
    pages: 3,
    updatedAt: "2 hours ago",
    style: "dark",
    colors: { primary: "#1D4ED8", accent: "#10B981", bg: "#0F172A" }
  },
  {
    id: "2",
    name: "SaaS Onboarding Flow",
    status: "In Progress",
    prompt: "Glassmorphism SaaS landing with feature comparison and pricing table",
    industry: "saas",
    pages: 5,
    updatedAt: "Yesterday",
    style: "glassmorphism",
    colors: { primary: "#4F46E5", accent: "#06B6D4", bg: "#F8FAFC" }
  },
  {
    id: "3",
    name: "E-Commerce Mobile UI",
    status: "Completed",
    prompt: "Modern mobile e-commerce app with product grid, cart, and checkout",
    industry: "ecommerce",
    pages: 8,
    updatedAt: "3 days ago",
    style: "modern",
    colors: { primary: "#7C3AED", accent: "#F59E0B", bg: "#FAFAFA" }
  },
  {
    id: "4",
    name: "Gaming Platform Dashboard",
    status: "Archived",
    prompt: "Neon cyberpunk gaming portal with leaderboard and live stats",
    industry: "gaming",
    pages: 4,
    updatedAt: "1 week ago",
    style: "dark",
    colors: { primary: "#7C3AED", accent: "#EC4899", bg: "#09090B" }
  },
  {
    id: "5",
    name: "Healthcare Patient Portal",
    status: "Completed",
    prompt: "Clean healthcare portal with appointment scheduler and health metrics",
    industry: "healthcare",
    pages: 6,
    updatedAt: "2 weeks ago",
    style: "minimal",
    colors: { primary: "#0EA5E9", accent: "#6EE7B7", bg: "#F0FDF4" }
  },
  {
    id: "6",
    name: "Crypto Analytics App",
    status: "In Progress",
    prompt: "Crypto portfolio tracker with live price charts and trade history",
    industry: "crypto",
    pages: 4,
    updatedAt: "3 days ago",
    style: "dark",
    colors: { primary: "#F59E0B", accent: "#8B5CF6", bg: "#0D0D0D" }
  }
];

const STATUS_FILTERS = ["All", "Completed", "In Progress", "Archived"];

const statusPillClass = {
  "Completed": "pill success",
  "In Progress": "pill warning",
  "Archived": "pill"
};

function MiniPreview({ colors }) {
  return (
    <div style={{
      width: "100%",
      height: "140px",
      background: colors.bg,
      borderRadius: "10px",
      padding: "10px",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      overflow: "hidden",
      position: "relative"
    }}>
      {/* Navbar bar */}
      <div style={{ height: "14px", background: `${colors.primary}30`, borderRadius: "4px", width: "100%" }} />
      {/* Content */}
      <div style={{ display: "flex", gap: "6px", flex: 1 }}>
        {/* Sidebar */}
        <div style={{ width: "28px", background: `${colors.primary}15`, borderRadius: "4px", display: "flex", flexDirection: "column", gap: "3px", padding: "4px" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: "4px", background: i === 0 ? colors.primary : `${colors.primary}30`, borderRadius: "2px", opacity: 0.8 }} />
          ))}
        </div>
        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", gap: "4px" }}>
            {[colors.primary, colors.accent, `${colors.primary}60`].map((c, i) => (
              <div key={i} style={{ flex: 1, height: "22px", background: c, borderRadius: "4px", opacity: 0.7 }} />
            ))}
          </div>
          <div style={{ flex: 1, background: `${colors.primary}10`, borderRadius: "4px", border: `1px solid ${colors.primary}20` }} />
          <div style={{ height: "12px", background: `${colors.accent}15`, borderRadius: "3px" }} />
        </div>
      </div>
      {/* Shimmer overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)",
        borderRadius: "10px"
      }} />
    </div>
  );
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [actionMenu, setActionMenu] = useState(null);

  const filtered = MOCK_PROJECTS.filter((p) => {
    const matchesFilter = activeFilter === "All" || p.status === activeFilter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.prompt.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ padding: "32px", maxWidth: "1280px" }}>
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{
              fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase",
              color: "var(--secondary)", background: "var(--primary-muted)", border: "1px solid var(--border-glow)",
              padding: "3px 10px", borderRadius: "999px"
            }}>
              Projects
            </span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.02em", marginBottom: "6px" }}>
            My Design Projects
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            {MOCK_PROJECTS.length} generated layouts · {MOCK_PROJECTS.filter(p => p.status === "Completed").length} completed
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => navigate("/")}
          style={{ flexShrink: 0 }}
        >
          <i className="fa-solid fa-plus" />
          New Design
        </button>
      </div>

      {/* Search + Filter bar */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" }}>
        <div className="search-wrap" style={{ flex: "1", minWidth: "200px", maxWidth: "340px" }}>
          <i className="fa-solid fa-magnifying-glass search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ margin: 0 }}
          />
        </div>

        <div className="explore-filter-bar">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-chip ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Project grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fa-regular fa-folder-open" />
          </div>
          <h4>No projects found</h4>
          <p>Try adjusting your search or filter, or create a new design to get started.</p>
          <button className="btn-primary" onClick={() => navigate("/")}>
            <i className="fa-solid fa-wand-magic-sparkles" />
            Create First Design
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {filtered.map((project) => (
            <div
              key={project.id}
              style={{
                background: "rgba(30,41,59,0.6)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                overflow: "hidden",
                transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
                cursor: "pointer",
                position: "relative"
              }}
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
              onClick={() => navigate("/preview")}
            >
              {/* Preview */}
              <div style={{ padding: "12px 12px 0" }}>
                <MiniPreview colors={project.colors} />
              </div>

              {/* Card body */}
              <div style={{ padding: "14px 16px 16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", margin: 0 }}>
                    {project.name}
                  </h3>
                  <div style={{ position: "relative" }}>
                    <button
                      style={{
                        background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer",
                        padding: "4px 6px", borderRadius: "6px", fontSize: "13px",
                        transition: "background 0.15s, color 0.15s"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActionMenu(actionMenu === project.id ? null : project.id);
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = "var(--primary-muted)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-muted)"; }}
                    >
                      <i className="fa-solid fa-ellipsis" />
                    </button>

                    {actionMenu === project.id && (
                      <div
                        style={{
                          position: "absolute", right: 0, top: "28px", zIndex: 10, minWidth: "160px",
                          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px",
                          padding: "6px", boxShadow: "var(--shadow-xl)", animation: "scaleIn 0.15s ease"
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {[
                          { icon: "fa-eye", label: "Open Preview", action: () => navigate("/preview") },
                          { icon: "fa-copy", label: "Duplicate" },
                          { icon: "fa-download", label: "Export JSON" },
                          { icon: "fa-trash", label: "Delete", danger: true }
                        ].map((item) => (
                          <button
                            key={item.label}
                            style={{
                              display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px",
                              borderRadius: "8px", border: "none", background: "none", width: "100%",
                              textAlign: "left", fontSize: "13px", cursor: "pointer",
                              color: item.danger ? "var(--danger)" : "var(--text-secondary)",
                              transition: "background 0.15s, color 0.15s"
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = item.danger ? "var(--danger-muted)" : "var(--primary-muted)";
                              e.currentTarget.style.color = item.danger ? "var(--danger)" : "var(--text-primary)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = "none";
                              e.currentTarget.style.color = item.danger ? "var(--danger)" : "var(--text-secondary)";
                            }}
                            onClick={() => { if (item.action) item.action(); setActionMenu(null); }}
                          >
                            <i className={`fa-solid ${item.icon}`} style={{ width: "14px" }} />
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {project.prompt}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className={statusPillClass[project.status] || "pill"} style={{ fontSize: "11px", padding: "3px 10px" }}>
                      {project.status}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <i className="fa-regular fa-file" style={{ fontSize: "10px" }} />
                      {project.pages} pages
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    <i className="fa-regular fa-clock" style={{ marginRight: "4px" }} />
                    {project.updatedAt}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
