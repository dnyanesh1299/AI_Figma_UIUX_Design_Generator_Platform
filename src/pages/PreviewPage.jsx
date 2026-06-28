import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PreviewRenderer from "../components/PreviewRenderer";
import FigmaExportModal from "../components/FigmaExportModal";

const EXPORT_SCHEMA_KEY = "export_schema";

const normalizeSchema = (rawSchema) => {
  if (!rawSchema || typeof rawSchema !== "object" || Array.isArray(rawSchema)) {
    return DEMO_SCHEMA;
  }

  const pages = Array.isArray(rawSchema.pages)
    ? rawSchema.pages.map((page) => ({
      ...page,
      components: Array.isArray(page?.components) ? page.components : []
    }))
    : DEMO_SCHEMA.pages;

  return {
    ...rawSchema,
    pages
  };
};

// A rich demo schema for the preview page
const DEMO_SCHEMA = {
  meta: { projectName: "Fintech Pro Dashboard", projectType: "finance dashboard", theme: "dark" },
  tokens: {
    colors: {
      primary: "#1D4ED8",
      secondary: "#10B981",
      accent: "#06B6D4",
      background: "#0F172A",
      surface: "#1E293B",
      border: "#334155",
      text: "#F8FAFC",
      textMuted: "#94A3B8"
    },
    typography: { headingFont: "Outfit", bodyFont: "Inter" }
  },
  pages: [
    {
      id: "dashboard",
      name: "Dashboard",
      path: "/",
      layout: { type: "grid", columns: 12, gap: "24px", background: "#0F172A" },
      components: [
        {
          id: "nav-1", type: "navbar", label: "Top Navigation",
          position: { x: 0, y: 0, w: 12, h: 1 },
          styles: { background: "#1E293B", color: "#F8FAFC", padding: "16px 24px" },
          properties: { brand: "FinTech Pro", menuItems: ["Dashboard", "Analytics", "Transactions", "Accounts"] },
          responsive: {
            mobile: { position: { x: 0, y: 0, w: 4, h: 1 } },
            tablet: { position: { x: 0, y: 0, w: 8, h: 1 } },
            desktop: { position: { x: 0, y: 0, w: 12, h: 1 } }
          }
        },
        {
          id: "metric-1", type: "metric-card", label: "Total Revenue",
          position: { x: 0, y: 1, w: 3, h: 1 },
          styles: { background: "#1E293B", padding: "20px" },
          properties: { title: "Total Revenue", content: "$248,520", change: "+14.2%" },
          responsive: {
            mobile: { position: { x: 0, y: 1, w: 4, h: 1 } },
            tablet: { position: { x: 0, y: 1, w: 4, h: 1 } },
            desktop: { position: { x: 0, y: 1, w: 3, h: 1 } }
          }
        },
        {
          id: "metric-2", type: "metric-card", label: "Active Users",
          position: { x: 3, y: 1, w: 3, h: 1 },
          styles: { background: "#1E293B", padding: "20px" },
          properties: { title: "Active Users", content: "12,840", change: "+8.7%" },
          responsive: {
            mobile: { position: { x: 0, y: 2, w: 4, h: 1 } },
            tablet: { position: { x: 4, y: 1, w: 4, h: 1 } },
            desktop: { position: { x: 3, y: 1, w: 3, h: 1 } }
          }
        },
        {
          id: "metric-3", type: "metric-card", label: "Transactions",
          position: { x: 6, y: 1, w: 3, h: 1 },
          styles: { background: "#1E293B", padding: "20px" },
          properties: { title: "Transactions", content: "4,291", change: "+22.1%" },
          responsive: {
            mobile: { position: { x: 0, y: 3, w: 4, h: 1 } },
            tablet: { position: { x: 0, y: 2, w: 4, h: 1 } },
            desktop: { position: { x: 6, y: 1, w: 3, h: 1 } }
          }
        },
        {
          id: "metric-4", type: "metric-card", label: "Net Profit",
          position: { x: 9, y: 1, w: 3, h: 1 },
          styles: { background: "#1E293B", padding: "20px" },
          properties: { title: "Net Profit", content: "$61,200", change: "-3.4%" },
          responsive: {
            mobile: { position: { x: 0, y: 4, w: 4, h: 1 } },
            tablet: { position: { x: 4, y: 2, w: 4, h: 1 } },
            desktop: { position: { x: 9, y: 1, w: 3, h: 1 } }
          }
        },
        {
          id: "chart-1", type: "chart", label: "Revenue Chart",
          position: { x: 0, y: 2, w: 8, h: 2 },
          styles: { background: "#1E293B" },
          properties: { title: "Monthly Revenue Overview" },
          responsive: {
            mobile: { position: { x: 0, y: 5, w: 4, h: 2 } },
            tablet: { position: { x: 0, y: 3, w: 8, h: 2 } },
            desktop: { position: { x: 0, y: 2, w: 8, h: 2 } }
          }
        },
        {
          id: "data-table-1", type: "data-table", label: "Recent Transactions",
          position: { x: 0, y: 4, w: 12, h: 2 },
          styles: { background: "#1E293B" },
          properties: { title: "Recent Transactions" },
          responsive: {
            mobile: { position: { x: 0, y: 7, w: 4, h: 2 } },
            tablet: { position: { x: 0, y: 5, w: 8, h: 2 } },
            desktop: { position: { x: 0, y: 4, w: 12, h: 2 } }
          }
        }
      ]
    },
    {
      id: "analytics",
      name: "Analytics",
      path: "/analytics",
      layout: { type: "grid", columns: 12, gap: "24px", background: "#0F172A" },
      components: [
        {
          id: "nav-2", type: "navbar", label: "Top Navigation",
          position: { x: 0, y: 0, w: 12, h: 1 },
          styles: { background: "#1E293B", color: "#F8FAFC", padding: "16px 24px" },
          properties: { brand: "FinTech Pro", menuItems: ["Dashboard", "Analytics", "Transactions", "Accounts"] },
          responsive: {
            mobile: { position: { x: 0, y: 0, w: 4, h: 1 } },
            tablet: { position: { x: 0, y: 0, w: 8, h: 1 } },
            desktop: { position: { x: 0, y: 0, w: 12, h: 1 } }
          }
        },
        {
          id: "hero-2", type: "hero", label: "Analytics Hero",
          position: { x: 0, y: 1, w: 12, h: 1 },
          styles: { background: "linear-gradient(135deg, #1e1b4b, #0f172a)", padding: "40px 32px" },
          properties: { title: "Advanced Analytics & Insights", subtitle: "Deep dive into user behavior, revenue streams, and growth metrics.", ctaText: "Export Report" },
          responsive: {
            mobile: { position: { x: 0, y: 1, w: 4, h: 1 } },
            tablet: { position: { x: 0, y: 1, w: 8, h: 1 } },
            desktop: { position: { x: 0, y: 1, w: 12, h: 1 } }
          }
        },
        {
          id: "chart-2", type: "chart", label: "User Growth",
          position: { x: 0, y: 2, w: 6, h: 2 },
          styles: { background: "#1E293B" },
          properties: { title: "User Growth Trends" },
          responsive: {
            mobile: { position: { x: 0, y: 2, w: 4, h: 2 } },
            tablet: { position: { x: 0, y: 2, w: 8, h: 2 } },
            desktop: { position: { x: 0, y: 2, w: 6, h: 2 } }
          }
        },
        {
          id: "chart-3", type: "chart", label: "Conversion Funnel",
          position: { x: 6, y: 2, w: 6, h: 2 },
          styles: { background: "#1E293B" },
          properties: { title: "Conversion Funnel" },
          responsive: {
            mobile: { position: { x: 0, y: 4, w: 4, h: 2 } },
            tablet: { position: { x: 0, y: 4, w: 8, h: 2 } },
            desktop: { position: { x: 6, y: 2, w: 6, h: 2 } }
          }
        }
      ]
    },
    {
      id: "transactions",
      name: "Transactions",
      path: "/transactions",
      layout: { type: "grid", columns: 12, gap: "24px", background: "#0F172A" },
      components: [
        {
          id: "nav-3", type: "navbar", label: "Top Navigation",
          position: { x: 0, y: 0, w: 12, h: 1 },
          styles: { background: "#1E293B", color: "#F8FAFC", padding: "16px 24px" },
          properties: { brand: "FinTech Pro", menuItems: ["Dashboard", "Analytics", "Transactions", "Accounts"] },
          responsive: {
            mobile: { position: { x: 0, y: 0, w: 4, h: 1 } },
            tablet: { position: { x: 0, y: 0, w: 8, h: 1 } },
            desktop: { position: { x: 0, y: 0, w: 12, h: 1 } }
          }
        },
        {
          id: "table-3", type: "data-table", label: "All Transactions",
          position: { x: 0, y: 1, w: 12, h: 3 },
          styles: { background: "#1E293B" },
          properties: { title: "All Transactions — June 2026" },
          responsive: {
            mobile: { position: { x: 0, y: 1, w: 4, h: 3 } },
            tablet: { position: { x: 0, y: 1, w: 8, h: 3 } },
            desktop: { position: { x: 0, y: 1, w: 12, h: 3 } }
          }
        }
      ]
    }
  ]
};

export default function PreviewPage() {
  const navigate = useNavigate();
  const [schema] = useState(() => {
    try {
      const stored = localStorage.getItem("export_schema");
      return stored ? normalizeSchema(JSON.parse(stored)) : DEMO_SCHEMA;
    } catch {
      return DEMO_SCHEMA;
    }
  });
  const [deviceMode, setDeviceMode] = useState("desktop");
  const [activePage, setActivePage] = useState(0);
  const [viewMode, setViewMode] = useState("full");
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [fileName, setFileName] = useState(() => {
    const projName = schema?.meta?.projectName || "fintech-pro-dashboard";
    return `${projName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`;
  });
  const [copied, setCopied] = useState(false);
  const [showFigmaModal, setShowFigmaModal] = useState(false);

  const pages = schema?.pages || [];
  const currentPage = pages[activePage];

  const deviceWidths = { desktop: "100%", tablet: "768px", mobile: "375px" };

  const handlePageClick = (index) => {
    setActivePage(index);
    if (viewMode === "full") {
      const el = document.getElementById(`preview-page-frame-${index}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  };

  function handleCopyJson() {
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownloadJson() {
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleOpenExportCenter() {
    try { localStorage.setItem(EXPORT_SCHEMA_KEY, JSON.stringify(schema)); } catch {}
    navigate("/export");
  }

  return (
    <div className="preview-page-root" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 68px)", overflow: "hidden", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Top Toolbar */}
      <div className="preview-toolbar" style={{
        display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px",
        borderBottom: "1px solid var(--border)", background: "rgba(15,23,42,0.9)",
        backdropFilter: "blur(12px)", flexWrap: "wrap",
        minWidth: 0, overflowX: "hidden", boxSizing: "border-box"
      }}>
        {/* Project name */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "8px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "8px",
            background: "var(--gradient-btn)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "12px", color: "white", fontWeight: "700"
          }}>
            <i className="fa-solid fa-cube" />
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: "600", margin: 0 }}>{schema.meta?.projectName}</p>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{schema.meta?.projectType}</p>
          </div>
        </div>

        <div style={{ width: "1px", height: "28px", background: "var(--border)" }} />

        {/* Page tabs */}
        <div style={{ display: "flex", gap: "4px", background: "rgba(30,41,59,0.6)", padding: "4px", borderRadius: "10px", border: "1px solid var(--border)" }}>
          {pages.map((p, i) => (
            <button
              key={p.id}
              onClick={() => handlePageClick(i)}
              style={{
                padding: "5px 14px", borderRadius: "7px", border: "none", cursor: "pointer", fontSize: "12px",
                fontWeight: "600", fontFamily: "inherit", transition: "all 0.15s",
                background: activePage === i ? "var(--primary)" : "transparent",
                color: activePage === i ? "white" : "var(--text-muted)"
              }}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        {pages.length > 1 && (
          <div style={{ display: "flex", gap: "4px", background: "rgba(30,41,59,0.6)", padding: "4px", borderRadius: "10px", border: "1px solid var(--border)" }}>
            {[
              { mode: "single", label: "Single Page View", icon: "fa-file-lines" },
              { mode: "full", label: "Full Website View", icon: "fa-globe" }
            ].map(({ mode, label, icon }) => (
              <button
                key={mode}
                title={label}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: "5px 12px", borderRadius: "7px", border: "none", cursor: "pointer", fontSize: "12px",
                  fontWeight: "600", fontFamily: "inherit", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "6px",
                  background: viewMode === mode ? "rgba(124,58,237,0.3)" : "transparent",
                  color: viewMode === mode ? "var(--secondary)" : "var(--text-muted)"
                }}
              >
                <i className={`fa-solid ${icon}`} />
                <span>{mode === "single" ? "Single" : "Flow"}</span>
              </button>
            ))}
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Device toggles */}
        <div style={{ display: "flex", gap: "4px", background: "rgba(30,41,59,0.6)", padding: "4px", borderRadius: "10px", border: "1px solid var(--border)" }}>
          {[
            { mode: "desktop", icon: "fa-desktop" },
            { mode: "tablet", icon: "fa-tablet-screen-button" },
            { mode: "mobile", icon: "fa-mobile-screen-button" }
          ].map(({ mode, icon }) => (
            <button
              key={mode}
              onClick={() => setDeviceMode(mode)}
              style={{
                width: "30px", height: "30px", border: "none", cursor: "pointer", borderRadius: "7px",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px",
                transition: "all 0.15s", fontFamily: "inherit",
                background: deviceMode === mode ? "rgba(30,41,59,0.8)" : "transparent",
                color: deviceMode === mode ? "var(--secondary)" : "var(--text-muted)"
              }}
            >
              <i className={`fa-solid ${icon}`} />
            </button>
          ))}
        </div>

        {/* Figma export button */}
        <button
          onClick={() => setShowFigmaModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: "700",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontFamily: "inherit",
            background: "linear-gradient(135deg, #7C3AED, #A855F7)",
            color: "white",
            boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
            transition: "all 0.2s"
          }}
          onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,58,237,0.5)"; }}
          onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.4)"; }}
        >
          <i className="fa-brands fa-figma" />
          Export to Figma
        </button>

        {/* JSON Export panel toggle */}
        <button
          className="btn-secondary preview-export-btn"
          onClick={() => setShowExportPanel((p) => !p)}
          style={{ padding: "8px 16px", fontSize: "13px" }}
        >
          <i className="fa-solid fa-arrow-up-from-bracket" />
          Export
        </button>

        {/* Spacer to push export btn right on large screens */}
        <style>{`
          .preview-toolbar .spacer-flex { flex: 1; min-width: 0; }
          @media (max-width: 900px) {
            .preview-toolbar {
              padding: 8px 12px !important;
              gap: 6px !important;
            }
            .preview-toolbar .preview-export-btn span { display: none; }
          }
          @media (max-width: 600px) {
            .preview-toolbar {
              padding: 6px 10px !important;
            }
            .preview-page-root .preview-canvas-wrapper {
              padding: 12px 8px !important;
            }
          }
          /* Canvas stays contained */
          .preview-canvas-inner {
            max-width: 100% !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
        `}</style>
      </div>

      {/* Main area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Component Tree sidebar */}
        <div style={{
          width: "220px", flexShrink: 0, borderRight: "1px solid var(--border)",
          background: "rgba(15,23,42,0.7)", overflowY: "auto", padding: "16px 12px"
        }}>
          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "12px" }}>
            <i className="fa-solid fa-sitemap" style={{ marginRight: "6px" }} />
            Components
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {currentPage?.components?.map((comp, i) => (
              <div
                key={comp.id}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px",
                  borderRadius: "8px", fontSize: "12px", color: "var(--text-secondary)",
                  cursor: "pointer", transition: "background 0.15s, color 0.15s"
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = "var(--primary-muted)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                <i className={`fa-solid ${
                  comp.type === "navbar" ? "fa-grip-lines" :
                  comp.type === "hero" ? "fa-panorama" :
                  comp.type === "metric-card" ? "fa-chart-simple" :
                  comp.type === "chart" ? "fa-chart-bar" :
                  comp.type === "data-table" ? "fa-table" :
                  comp.type === "form" ? "fa-list-check" :
                  "fa-square"
                }`} style={{ width: "14px", color: "var(--secondary)", fontSize: "11px" }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {comp.label || comp.type}
                </span>
              </div>
            ))}
          </div>

          <div style={{ height: "1px", background: "var(--border)", margin: "16px 0" }} />

          {/* Token swatches */}
          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "10px" }}>
            <i className="fa-solid fa-palette" style={{ marginRight: "6px" }} />
            Design Tokens
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {Object.entries(schema.tokens?.colors || {}).slice(0, 6).map(([name, val]) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "18px", height: "18px", borderRadius: "4px",
                  background: val, border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0
                }} />
                <div style={{ overflow: "hidden" }}>
                  <p style={{ fontSize: "11px", fontWeight: "600", margin: 0, textTransform: "capitalize", color: "var(--text-secondary)" }}>{name}</p>
                  <p style={{ fontSize: "10px", color: "var(--text-muted)", margin: 0 }}>{val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="preview-canvas-wrapper" style={{ flex: 1, overflowY: "auto", overflowX: "hidden", background: "var(--bg-deep)", display: "flex", justifyContent: "center", padding: "24px", boxSizing: "border-box", minWidth: 0 }}>
          {viewMode === "full" && pages.length > 1 ? (
            <div
              id="preview-canvas-scroll-container"
              style={{
                width: "100%",
                maxWidth: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                overflowY: "auto",
                overflowX: "hidden",
                maxHeight: "100%",
                padding: "6px 4px",
                alignItems: "center",
                minWidth: 0,
                boxSizing: "border-box"
              }}
            >
              {pages.map((p, i) => (
                <div
                  key={p.id}
                  id={`preview-page-frame-${i}`}
                  style={{
                    width: deviceWidths[deviceMode],
                    maxWidth: "100%",
                    background: schema.tokens?.colors?.background || "#0F172A",
                    borderRadius: "16px",
                    border: "1px solid rgba(71,85,105,0.4)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                    overflow: "hidden",
                    transition: "width 0.35s ease",
                    minHeight: "520px",
                    boxSizing: "border-box"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid rgba(71,85,105,0.3)", background: "rgba(30,41,59,0.5)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "10px", background: "var(--secondary)", color: "white", padding: "2px 8px", borderRadius: "999px", fontWeight: "700" }}>
                        Page {i + 1}
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)" }}>{p.name}</span>
                    </div>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>{deviceMode} view</span>
                  </div>

                  <div style={{ padding: "16px" }}>
                    <PreviewRenderer
                      schema={{ ...schema, pages: [p] }}
                      deviceMode={deviceMode}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="preview-canvas-inner" style={{
              width: deviceWidths[deviceMode],
              maxWidth: "100%",
              background: schema.tokens?.colors?.background || "#0F172A",
              borderRadius: "16px",
              border: "1px solid rgba(71,85,105,0.4)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              overflow: "hidden",
              transition: "width 0.35s ease",
              minHeight: "600px",
              boxSizing: "border-box"
            }}>
              {/* Device chrome */}
              {deviceMode === "desktop" && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderBottom: "1px solid rgba(71,85,105,0.3)", background: "rgba(30,41,59,0.5)" }}>
                  {['#ef4444', '#f59e0b', '#22c55e'].map((c, i) => (
                    <span key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
                  ))}
                  <div style={{ flex: 1, marginLeft: "8px", background: "rgba(15,23,42,0.8)", borderRadius: "6px", padding: "3px 12px", fontSize: "11px", color: "var(--text-muted)" }}>
                    {schema.meta?.projectName}
                  </div>
                </div>
              )}
              {deviceMode === "mobile" && (
                <div style={{ display: "flex", justifyContent: "center", padding: "10px", background: "rgba(30,41,59,0.4)" }}>
                  <div style={{ width: "60px", height: "5px", borderRadius: "3px", background: "rgba(71,85,105,0.5)" }} />
                </div>
              )}

              <div style={{ padding: "16px" }}>
                <PreviewRenderer
                  schema={{ ...schema, pages: [currentPage] }}
                  deviceMode={deviceMode}
                />
              </div>
            </div>
          )}
        </div>

        {/* Export panel */}
        {showExportPanel && (
          <div style={{
            width: "280px", flexShrink: 0, borderLeft: "1px solid var(--border)",
            background: "rgba(15,23,42,0.8)", overflowY: "auto", padding: "20px 16px"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "700" }}>
                <i className="fa-solid fa-arrow-up-from-bracket" style={{ marginRight: "8px", color: "var(--secondary)" }} />
                Export Design
              </h4>
              <button
                onClick={() => setShowExportPanel(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "16px" }}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
                File Name
                <input
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  style={{ fontSize: "13px", padding: "8px 12px", margin: 0 }}
                />
              </label>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  onClick={handleOpenExportCenter}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    padding: "10px 16px", fontSize: "13px", fontWeight: "700",
                    border: "none", borderRadius: "10px", cursor: "pointer",
                    fontFamily: "inherit",
                    background: "linear-gradient(135deg, #059669, #10b981)",
                    color: "white",
                    boxShadow: "0 4px 16px rgba(16,185,129,0.35)"
                  }}
                >
                  <i className="fa-solid fa-arrow-up-from-bracket" />
                  Open Export Center
                </button>
                <button
                  onClick={() => setShowFigmaModal(true)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    padding: "10px 16px", fontSize: "13px", fontWeight: "700",
                    border: "none", borderRadius: "10px", cursor: "pointer",
                    fontFamily: "inherit",
                    background: "linear-gradient(135deg, #7C3AED, #A855F7)",
                    color: "white",
                    boxShadow: "0 4px 16px rgba(124,58,237,0.35)"
                  }}
                >
                  <i className="fa-brands fa-figma" />
                  Export to Figma
                </button>
                <button className="btn-primary" onClick={handleDownloadJson} style={{ justifyContent: "center", fontSize: "13px" }}>
                  <i className="fa-solid fa-download" />
                  Download JSON Schema
                </button>
                <button className="btn-secondary" onClick={handleCopyJson} style={{ justifyContent: "center", fontSize: "13px" }}>
                  <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`} />
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </button>
              </div>


              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "10px" }}>
                  Schema Summary
                </p>
                {[
                  { label: "Pages", value: pages.length },
                  { label: "Components", value: pages.reduce((s, p) => s + (Array.isArray(p.components) ? p.components.length : 0), 0) },
                  { label: "Theme", value: schema.meta?.theme || "dark" },
                  { label: "Platform", value: schema.meta?.projectType?.split(" ")[1] || "web" }
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "8px" }}>
                    <span style={{ color: "var(--text-muted)" }}>{item.label}</span>
                    <span style={{ fontWeight: "600", textTransform: "capitalize" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Figma Export Modal */}
      {showFigmaModal && (
        <FigmaExportModal
          schema={schema}
          onClose={() => setShowFigmaModal(false)}
        />
      )}
    </div>
  );
}
