import { Link } from "react-router-dom";

const RELEASES = [
  {
    version: "v1.3.0",
    date: "June 18, 2026",
    title: "True Multi-Page Flow Previews & Enhanced Figma Auto-Layout",
    badge: "Major",
    accent: "#7c3aed",
    changes: [
      {
        type: "added",
        title: "Flow View in Prompt Studio",
        desc: "You can now preview all generated pages stacked vertically in the Prompt Studio canvas. No more clicking tabs to check page cohesion; scroll to inspect the whole project flow at once."
      },
      {
        type: "improved",
        title: "Figma Auto-Layout Mapping",
        desc: "Exported elements now translate perfectly to Figma's modern auto-layout system. Lists, tables, and buttons adapt responsiveness inside Figma directly."
      },
      {
        type: "fixed",
        title: "Routing Navigation in Previews",
        desc: "Fixed a bug where clicking a navigation link inside the Preview canvas sometimes triggered page redirects inside the parent platform instead of transitioning inside the preview box."
      }
    ]
  },
  {
    version: "v1.2.0",
    date: "May 25, 2026",
    title: "Token Inspector & Accent Palette Customizer",
    badge: "Minor",
    accent: "#06b6d4",
    changes: [
      {
        type: "added",
        title: "Global Token Inspector Drawer",
        desc: "Inspect, copy, and modify color and typography design tokens directly from a new panel inside the editor canvas. Swapping a primary token updates all page elements immediately."
      },
      {
        type: "improved",
        title: "Font Selection Scale",
        desc: "Added support for 15+ premium Google Fonts directly into the generation pipeline, enabling cleaner typographic pairings for tech and landing page designs."
      },
      {
        type: "fixed",
        title: "Chart Component Borders",
        desc: "Corrected styling parameters that caused double borders to render on metrics and line chart containers under dark mode styles."
      }
    ]
  },
  {
    version: "v1.1.0",
    date: "April 12, 2026",
    title: "Projects Dashboard & Team Templates Explore",
    badge: "Minor",
    accent: "#ec4899",
    changes: [
      {
        type: "added",
        title: "Personal Dashboard & Folder Storage",
        desc: "A fully revamped Projects Library page that lets you categorize generated mockups, search prompt history, and clone layouts into new workspace sheets."
      },
      {
        type: "improved",
        title: "Explore Gallery Filters",
        desc: "Added industry, category, and style filter tags to the Explore community templates gallery, allowing fast template browsing."
      }
    ]
  },
  {
    version: "v1.0.0",
    date: "March 1, 2026",
    title: "Official Launch: AI-Powered Figma UI/UX Generator",
    badge: "Initial Release",
    accent: "#10b981",
    changes: [
      {
        type: "added",
        title: "AI Design Classifier & Generator",
        desc: "Generate complete interactive layouts from single text prompts using our two-stage classification and generation pipeline."
      },
      {
        type: "added",
        title: "Figma API Integration",
        desc: "Save your Figma Personal Access Token in Settings and push vector-perfect representations directly to Figma files with one click."
      },
      {
        type: "added",
        title: "Interactive Canvas & Code Panel",
        desc: "Preview responsive breakdowns (Desktop/Tablet/Mobile), view generated raw layout JSON schemas, and test click flows instantly."
      }
    ]
  }
];

export default function ChangelogPage() {
  return (
    <div style={{ color: "var(--text-primary)" }}>
      {/* Hero */}
      <section style={{
        padding: "72px 40px 56px",
        background: "radial-gradient(ellipse 80% 60% at 50% -5%, rgba(168,85,247,0.12) 0%, transparent 70%)"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <span style={{
            fontSize: "11px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase",
            color: "var(--secondary)", background: "var(--primary-muted)", border: "1px solid var(--border-glow)",
            padding: "4px 14px", borderRadius: "999px", display: "inline-block", marginBottom: "16px"
          }}>
            <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: "6px" }} /> Changelog
          </span>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: "950", letterSpacing: "-0.03em", lineHeight: "1.05", marginBottom: "12px" }}>
            What's <span style={{ background: "var(--gradient-btn)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>New</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px", maxWidth: "480px", margin: "0 auto" }}>
            New features, fixes, and improvements to the AI Figma UI/UX Design Generator platform.
          </p>
        </div>
      </section>

      {/* Timeline entries */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "0 40px 80px", position: "relative" }}>
        
        {/* Central timeline line */}
        <div style={{
          position: "absolute", left: "54px", top: "0", bottom: "80px", width: "2px",
          background: "linear-gradient(180deg, var(--secondary) 0%, var(--border-light) 100%)",
          zIndex: 0
        }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "48px", position: "relative", zIndex: 1 }}>
          {RELEASES.map((rel, index) => (
            <div key={rel.version} style={{ display: "grid", gridTemplateColumns: "30px 1fr", gap: "24px", alignItems: "start" }}>
              
              {/* Timeline marker */}
              <div style={{
                width: "30px", height: "30px", borderRadius: "50%",
                background: "var(--bg-deep)", border: `3px solid ${rel.accent}`,
                boxShadow: `0 0 12px ${rel.accent}44`, display: "grid", placeItems: "center",
                marginTop: "4px"
              }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: rel.accent }} />
              </div>

              {/* Log details */}
              <div style={{
                background: "rgba(30,41,59,0.55)", border: "1px solid var(--border)",
                borderRadius: "20px", padding: "28px", backdropFilter: "blur(20px)",
                transition: "border-color 0.25s, box-shadow 0.25s"
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "var(--border-glow)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(124,58,237,0.1)"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = ""; }}
              >
                
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
                  <div>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>{rel.date}</span>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", marginTop: "2px", letterSpacing: "-0.01em" }}>
                      {rel.title}
                    </h2>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{
                      fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em",
                      color: rel.accent, background: `${rel.accent}15`, border: `1px solid ${rel.accent}30`,
                      padding: "3px 10px", borderRadius: "999px"
                    }}>{rel.version}</span>
                    <span style={{
                      fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em",
                      color: "var(--text-muted)", background: "var(--primary-muted)", border: "1px solid var(--border-light)",
                      padding: "3px 10px", borderRadius: "999px"
                    }}>{rel.badge}</span>
                  </div>
                </div>

                {/* Changes lists */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {rel.changes.map((change, ci) => (
                    <div key={ci} style={{ display: "flex", gap: "12px", alignItems: "start" }}>
                      
                      {/* Change Tag */}
                      <span style={{
                        fontSize: "9px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em",
                        padding: "2px 8px", borderRadius: "4px", width: "76px", textAlign: "center", flexShrink: 0,
                        marginTop: "3px",
                        color: change.type === "added" ? "var(--success)" : change.type === "improved" ? "var(--info)" : "var(--danger)",
                        background: change.type === "added" ? "var(--success-muted)" : change.type === "improved" ? "rgba(6,182,212,0.12)" : "var(--danger-muted)",
                        border: `1px solid ${change.type === "added" ? "rgba(34,197,94,0.3)" : change.type === "improved" ? "rgba(6,182,212,0.3)" : "rgba(239,68,68,0.3)"}`
                      }}>
                        {change.type}
                      </span>

                      {/* Change Info */}
                      <div>
                        <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px", color: "var(--text-primary)" }}>
                          {change.title}
                        </h4>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5", margin: 0 }}>
                          {change.desc}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: "60px",
          background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))",
          border: "1px solid var(--border-glow)",
          borderRadius: "24px",
          padding: "40px",
          textAlign: "center"
        }}>
          <h3 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "8px" }}>Have a feature request?</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
            We build what our community asks for. Submit your ideas on our public feature board.
          </p>
          <Link to="/help"><button className="btn-primary">Visit Help & Request board</button></Link>
        </div>

      </section>
    </div>
  );
}
