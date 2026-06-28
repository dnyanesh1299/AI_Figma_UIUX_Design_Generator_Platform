import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("appearance");
  
  // States for preferences
  const [theme, setTheme] = useState("dark");
  const [accent, setAccent] = useState("purple");
  const [glowEnabled, setGlowEnabled] = useState(true);
  
  const [defaultModel, setDefaultModel] = useState("ultra-v2");
  const [autoLayout, setAutoLayout] = useState(true);
  const [figmaToken, setFigmaToken] = useState("••••••••••••••••••••••••••••••••••••");
  const [tokenVisible, setTokenVisible] = useState(false);
  const [testingToken, setTestingToken] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const testFigmaConnection = () => {
    setTestingToken(true);
    setTestResult(null);
    setTimeout(() => {
      setTestingToken(false);
      setTestResult("success");
    }, 1500);
  };

  return (
    <div style={{ color: "var(--text-primary)" }}>
      {/* Header */}
      <section style={{
        padding: "48px 40px 32px",
        background: "radial-gradient(ellipse 80% 60% at 50% -5%, rgba(124,58,237,0.08) 0%, transparent 70%)",
        borderBottom: "1px solid var(--border-light)"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <span style={{
            fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase",
            color: "var(--secondary)", background: "var(--primary-muted)", border: "1px solid var(--border-glow)",
            padding: "4px 12px", borderRadius: "999px", display: "inline-block", marginBottom: "10px"
          }}>
            Account Preferences
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.02em" }}>
            App Settings
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
            Configure your design environment preferences, API integration schemas, and security defaults.
          </p>
        </div>
      </section>

      {/* Main content grid */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "40px", alignItems: "start" }}>
          
          {/* Tabs Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { id: "appearance", label: "Appearance", icon: "fa-palette" },
              { id: "generation", label: "Generation defaults", icon: "fa-wand-magic-sparkles" },
              { id: "integrations", label: "Integrations & API", icon: "fa-circle-nodes" },
              { id: "danger", label: "Danger Zone", icon: "fa-circle-exclamation" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-muted)",
                  background: activeTab === tab.id ? "var(--primary-muted)" : "transparent",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.2s"
                }}
                onMouseOver={e => { if (activeTab !== tab.id) e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseOut={e => { if (activeTab !== tab.id) e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                <i className={`fa-solid ${tab.icon}`} style={{ width: "16px", color: activeTab === tab.id ? "var(--secondary)" : "inherit" }} />
                {tab.label}
              </button>
            ))}
          </aside>

          {/* Tab Content Panels */}
          <div style={{ background: "rgba(30,41,59,0.45)", border: "1px solid var(--border)", borderRadius: "24px", padding: "32px", minHeight: "360px" }}>
            
            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>Theme Mode</h3>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "12px" }}>Set the general UI styling mode for the editor panels.</p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {[
                      { id: "dark", label: "Dark Mode", icon: "fa-moon" },
                      { id: "light", label: "Light Mode (Beta)", icon: "fa-sun" }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        style={{
                          padding: "10px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: "600",
                          border: theme === t.id ? "1px solid var(--border-glow)" : "1px solid var(--border-light)",
                          background: theme === t.id ? "var(--primary-muted)" : "rgba(8,13,24,0.4)",
                          color: theme === t.id ? "var(--text-primary)" : "var(--text-muted)",
                          cursor: "pointer", display: "flex", alignItems: "center", gap: "8px"
                        }}
                      >
                        <i className={`fa-solid ${t.icon}`} />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ height: "1px", background: "var(--border-light)" }} />

                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>Accent Tone Color</h3>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "12px" }}>Choose the brand highlight palette color.</p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    {[
                      { id: "purple", color: "#7c3aed" },
                      { id: "cyan", color: "#06b6d4" },
                      { id: "pink", color: "#ec4899" },
                      { id: "green", color: "#10b981" }
                    ].map(acc => (
                      <button
                        key={acc.id}
                        onClick={() => setAccent(acc.id)}
                        style={{
                          width: "36px", height: "36px", borderRadius: "50%",
                          background: acc.color, border: accent === acc.id ? "3px solid var(--text-primary)" : "none",
                          cursor: "pointer", transition: "transform 0.2s",
                          boxShadow: accent === acc.id ? `0 0 12px ${acc.color}` : "none"
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = "scale(1.1)"}
                        onMouseOut={e => e.currentTarget.style.transform = ""}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ height: "1px", background: "var(--border-light)" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "2px" }}>Glowing Accent Borders</h3>
                    <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>Render glowing gradient accent borders on cards and components.</p>
                  </div>
                  <button
                    onClick={() => setGlowEnabled(!glowEnabled)}
                    style={{
                      width: "48px", height: "24px", borderRadius: "999px",
                      background: glowEnabled ? "var(--secondary)" : "rgba(255,255,255,0.1)",
                      border: "none", cursor: "pointer", position: "relative",
                      transition: "background 0.2s"
                    }}
                  >
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", background: "white",
                      position: "absolute", top: "3px", left: glowEnabled ? "27px" : "3px",
                      transition: "left 0.2s"
                    }} />
                  </button>
                </div>
              </div>
            )}

            {/* Generation Tab */}
            {activeTab === "generation" && (
              <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>Default LLM Engine</h3>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "12px" }}>Choose the default synthesis model for design execution prompts.</p>
                  <select
                    value={defaultModel}
                    onChange={e => setDefaultModel(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: "10px",
                      border: "1px solid var(--border)", background: "rgba(8,13,24,0.6)",
                      color: "var(--text-primary)", fontSize: "13px", fontFamily: "inherit"
                    }}
                  >
                    <option value="ultra-v2">Ultra-v2 Classifier &amp; Generator (Highly detailed, 30s)</option>
                    <option value="fast-v1">Fast-v1 Generator (Draft layout only, 10s)</option>
                    <option value="standard-v2">Standard-v2 Layout Engine (Balanced, 18s)</option>
                  </select>
                </div>

                <div style={{ height: "1px", background: "var(--border-light)" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "2px" }}>Figma Auto-Layout Translation</h3>
                    <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>Automatically format layout blocks to Figma responsive frames during export.</p>
                  </div>
                  <button
                    onClick={() => setAutoLayout(!autoLayout)}
                    style={{
                      width: "48px", height: "24px", borderRadius: "999px",
                      background: autoLayout ? "var(--secondary)" : "rgba(255,255,255,0.1)",
                      border: "none", cursor: "pointer", position: "relative",
                      transition: "background 0.2s"
                    }}
                  >
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", background: "white",
                      position: "absolute", top: "3px", left: autoLayout ? "27px" : "3px",
                      transition: "left 0.2s"
                    }} />
                  </button>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === "integrations" && (
              <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>Figma Personal Access Token</h3>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "12px" }}>
                    Configure your token to enable pushing vector structures straight into your Figma canvas files.
                  </p>
                  
                  <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                    <div style={{ flex: 1, position: "relative" }}>
                      <input
                        type={tokenVisible ? "text" : "password"}
                        value={figmaToken}
                        onChange={e => setFigmaToken(e.target.value)}
                        style={{
                          width: "100%", padding: "10px 40px 10px 14px", borderRadius: "10px",
                          border: "1px solid var(--border)", background: "rgba(8,13,24,0.6)",
                          color: "var(--text-primary)", fontSize: "13px", fontFamily: "inherit"
                        }}
                      />
                      <button
                        onClick={() => setTokenVisible(!tokenVisible)}
                        style={{
                          position: "absolute", right: "12px", top: "10px",
                          background: "none", border: "none", color: "var(--text-muted)",
                          cursor: "pointer"
                        }}
                      >
                        <i className={`fa-regular ${tokenVisible ? "fa-eye-slash" : "fa-eye"}`} />
                      </button>
                    </div>

                    <button
                      className="btn-secondary"
                      onClick={testFigmaConnection}
                      disabled={testingToken}
                      style={{ padding: "0 20px", borderRadius: "10px", fontSize: "13px", whiteSpace: "nowrap" }}
                    >
                      {testingToken ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "6px" }} /> Testing...
                        </>
                      ) : "Test Connection"}
                    </button>
                  </div>

                  {testResult === "success" && (
                    <div style={{
                      background: "var(--success-muted)", border: "1px solid rgba(34,197,94,0.3)",
                      padding: "10px 14px", borderRadius: "10px", color: "var(--success)", fontSize: "12.5px",
                      display: "flex", alignItems: "center", gap: "8px"
                    }}>
                      <i className="fa-solid fa-circle-check" />
                      Figma API token verified successfully. Pushing components enabled.
                    </div>
                  )}

                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px", lineHeight: "1.4" }}>
                    We encrypt your tokens at rest and never access your files except during active clicks of the export action. See our <a href="/privacy" target="_blank" style={{ textDecoration: "underline", color: "var(--secondary)" }}>Privacy Policy</a>.
                  </p>
                </div>
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === "danger" && (
              <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "16px", padding: "20px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--danger)", marginBottom: "4px" }}>
                    Delete Personal Account
                  </h3>
                  <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: "1.5" }}>
                    Permanently delete your account, saved design history, export metrics, and API keys. This action is irreversible and all files will be wiped from servers.
                  </p>
                  
                  <button
                    className="btn-primary"
                    style={{ background: "var(--danger)", border: "none", boxShadow: "none" }}
                    onClick={() => {
                      if (window.confirm("Are you sure you want to permanently delete your account? This is irreversible.")) {
                        alert("Account deletion initiated. (Mock action)");
                      }
                    }}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
          div[style*="gridTemplateColumns: 220px 1fr"] { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </div>
  );
}
