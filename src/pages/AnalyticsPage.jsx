import { useState } from "react";
import { Link } from "react-router-dom";

// Mock usage data
const METRICS = [
  { label: "Total Generations", value: "142", change: "+24% this month", icon: "fa-wand-magic-sparkles", color: "var(--secondary)" },
  { label: "Figma Exports", value: "38", change: "+12% this month", icon: "fa-figma", color: "#06b6d4" },
  { label: "API Requests", value: "1,240", change: "+48% this month", icon: "fa-server", color: "#ec4899" },
  { label: "Token Usage", value: "64k", change: "Within plan limits", icon: "fa-microchip", color: "#10b981" }
];

const PRESETS = [
  { name: "Fintech Dark Dashboard", count: 48, percentage: 34, color: "#7c3aed" },
  { name: "Glassmorphism SaaS Landing", count: 32, percentage: 22, color: "#06b6d4" },
  { name: "Minimalist E-Commerce Flow", count: 24, percentage: 17, color: "#ec4899" },
  { name: "Mobile Social Feed", count: 20, percentage: 14, color: "#f59e0b" },
  { name: "Other Presets", count: 18, percentage: 13, color: "#94a3b8" }
];

const EXPORTS = [
  { project: "Fintech Dashboard Pro", date: "June 18, 2026", status: "Success", size: "3.2 MB" },
  { project: "SaaS Sales Landing v2", date: "June 15, 2026", status: "Success", size: "1.8 MB" },
  { project: "Crypto Portfolio Tracker", date: "June 10, 2026", status: "Success", size: "4.1 MB" },
  { project: "User Profile Mobile Screen", date: "June 05, 2026", status: "Success", size: "840 KB" },
  { project: "Help Center Docs Layout", date: "May 28, 2026", status: "Failed (Token Expired)", size: "—" }
];

// Daily generations counts for the last 7 days (represented visually in SVG)
const DAILY_STATS = [
  { day: "Mon", count: 8 },
  { day: "Tue", count: 12 },
  { day: "Wed", count: 18 },
  { day: "Thu", count: 14 },
  { day: "Fri", count: 22 },
  { day: "Sat", count: 10 },
  { day: "Sun", count: 15 }
];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("Last 7 Days");

  const maxCount = Math.max(...DAILY_STATS.map(d => d.count));

  return (
    <div style={{ color: "var(--text-primary)" }}>
      {/* Header */}
      <section style={{
        padding: "48px 40px 32px",
        background: "radial-gradient(ellipse 80% 60% at 50% -5%, rgba(6,182,212,0.08) 0%, transparent 70%)",
        borderBottom: "1px solid var(--border-light)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <div>
            <span style={{
              fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase",
              color: "var(--accent)", background: "var(--accent-muted)", border: "1px solid rgba(6,182,212,0.3)",
              padding: "4px 12px", borderRadius: "999px", display: "inline-block", marginBottom: "10px"
            }}>
              Usage Reports
            </span>
            <h1 style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.02em" }}>
              Analytics Dashboard
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
              Track your prompt counts, generation success rates, and active Figma export pipelines.
            </p>
          </div>

          {/* Timeframe Select */}
          <div style={{ display: "flex", gap: "6px", background: "rgba(30,41,59,0.6)", padding: "4px", borderRadius: "10px", border: "1px solid var(--border)" }}>
            {["Last 7 Days", "Last 30 Days", "All Time"].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  padding: "6px 14px", borderRadius: "8px", border: "none", fontSize: "12.5px", fontWeight: "600",
                  color: timeframe === tf ? "var(--text-primary)" : "var(--text-muted)",
                  background: timeframe === tf ? "var(--primary-muted)" : "transparent",
                  cursor: "pointer", transition: "all 0.2s"
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Cards */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "32px" }}>
          {METRICS.map((metric, i) => (
            <div
              key={i}
              className="card"
              style={{
                background: "rgba(30,41,59,0.5)",
                border: "1px solid var(--border-light)",
                borderRadius: "20px",
                padding: "24px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "600" }}>{metric.label}</span>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: `${metric.color}18`, border: `1px solid ${metric.color}33`,
                  display: "grid", placeItems: "center", color: metric.color, fontSize: "16px"
                }}>
                  <i className={`fa-solid ${metric.icon}`} />
                </div>
              </div>
              <h2 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "4px", letterSpacing: "-0.01em" }}>
                {metric.value}
              </h2>
              <span style={{
                fontSize: "11px", fontWeight: "600",
                color: metric.change.startsWith("+") ? "var(--success)" : "var(--text-muted)"
              }}>
                {metric.change}
              </span>
            </div>
          ))}
        </div>

        {/* Charts and Preset Lists */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px", marginBottom: "32px" }}>
          
          {/* Chart card */}
          <div style={{
            background: "rgba(30,41,59,0.45)", border: "1px solid var(--border)",
            borderRadius: "24px", padding: "28px"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
              Generations Per Day
            </h3>

            {/* Custom SVG Bar Chart */}
            <div style={{ height: "240px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--border-light)" }}>
              {DAILY_STATS.map((d, index) => {
                const pct = (d.count / maxCount) * 85; // cap height at 85%
                return (
                  <div key={index} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                    
                    {/* Tooltip hover */}
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--secondary)", marginBottom: "6px" }}>
                      {d.count}
                    </span>

                    {/* Bar */}
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "48px",
                        height: `${pct}%`,
                        background: "linear-gradient(180deg, var(--secondary), rgba(124,58,237,0.2))",
                        borderRadius: "8px 8px 0 0",
                        transition: "all 0.3s",
                        cursor: "pointer"
                      }}
                      onMouseOver={e => e.currentTarget.style.filter = "brightness(1.2)"}
                      onMouseOut={e => e.currentTarget.style.filter = ""}
                    />

                    {/* Day label */}
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
                      {d.day}
                    </span>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Preset Breakdowns list */}
          <div style={{
            background: "rgba(30,41,59,0.45)", border: "1px solid var(--border)",
            borderRadius: "24px", padding: "28px"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
              Top Style Presets
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {PRESETS.map((preset, index) => (
                <div key={index}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                    <span style={{ color: "var(--text-primary)" }}>{preset.name}</span>
                    <span style={{ color: "var(--text-muted)" }}>{preset.count} gen ({preset.percentage}%)</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{
                      width: `${preset.percentage}%`,
                      height: "100%",
                      background: preset.color,
                      borderRadius: "999px"
                    }} />
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Exports History Table */}
        <div style={{
          background: "rgba(30,41,59,0.45)", border: "1px solid var(--border)",
          borderRadius: "24px", padding: "28px", overflow: "hidden"
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
            Recent Figma Exports
          </h3>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)" }}>
                  <th style={{ padding: "12px 16px", fontWeight: "600" }}>Project Name</th>
                  <th style={{ padding: "12px 16px", fontWeight: "600" }}>Export Date</th>
                  <th style={{ padding: "12px 16px", fontWeight: "600" }}>Status</th>
                  <th style={{ padding: "12px 16px", fontWeight: "600" }}>File Size</th>
                </tr>
              </thead>
              <tbody>
                {EXPORTS.map((exp, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: index === EXPORTS.length - 1 ? "none" : "1px solid var(--border-light)",
                      transition: "background 0.2s"
                    }}
                    onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.01)"}
                    onMouseOut={e => e.currentTarget.style.background = ""}
                  >
                    <td style={{ padding: "14px 16px", fontWeight: "700" }}>{exp.project}</td>
                    <td style={{ padding: "14px 16px", color: "var(--text-secondary)" }}>{exp.date}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        fontSize: "10.5px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em",
                        padding: "3px 10px", borderRadius: "999px",
                        color: exp.status === "Success" ? "var(--success)" : "var(--danger)",
                        background: exp.status === "Success" ? "var(--success-muted)" : "var(--danger-muted)",
                        border: `1px solid ${exp.status === "Success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`
                      }}>
                        {exp.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--text-muted)" }}>{exp.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </section>

      <style>{`
        @media (max-width: 900px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
          div[style*="gridTemplateColumns: 1.5fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
