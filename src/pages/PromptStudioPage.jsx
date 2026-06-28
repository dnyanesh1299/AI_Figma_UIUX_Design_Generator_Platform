import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiRequest, API_BASE_URL } from "../lib/api";
import PreviewRenderer from "../components/PreviewRenderer";
import FigmaExportModal from "../components/FigmaExportModal";

const EXPORT_SCHEMA_KEY = "export_schema";

const STYLE_PRESETS = [
  { label: "Dark Finance", icon: "fa-chart-line", prompt: "Create a dark mode fintech dashboard with a sidebar, revenue metrics grid, transaction data table, and sparkline charts." },
  { label: "Glass SaaS", icon: "fa-cube", prompt: "Build a glassmorphism SaaS landing page with a gradient hero, feature cards, pricing table, and testimonial section." },
  { label: "Neon Gaming", icon: "fa-gamepad", prompt: "Design a neon cyberpunk gaming platform with dark background, leaderboard table, live player stats, and animated hero section." },
  { label: "Clean Healthcare", icon: "fa-heart-pulse", prompt: "Create a minimal healthcare patient portal with appointment scheduler, health metrics cards, and doctor directory." },
  { label: "Crypto Analytics", icon: "fa-bitcoin-sign", prompt: "Build a crypto portfolio dashboard with live price charts, portfolio performance cards, and recent trade history table." },
  { label: "E-commerce", icon: "fa-bag-shopping", prompt: "Design a modern e-commerce product listing page with filter sidebar, product card grid, and quick view functionality." }
];

const getFromLocalStorage = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const saveToLocalStorage = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

const normalizeGeneratedSchema = (rawSchema) => {
  if (!rawSchema || typeof rawSchema !== "object" || Array.isArray(rawSchema)) {
    return null;
  }

  const pages = Array.isArray(rawSchema.pages)
    ? rawSchema.pages.map((page) => ({
      ...page,
      components: Array.isArray(page?.components) ? page.components : []
    }))
    : [];

  if (pages.length === 0) {
    return null;
  }

  return {
    ...rawSchema,
    pages
  };
};

export default function PromptStudioPage() {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState(
    "Create a modern fintech dashboard with a dark theme, metrics grid, transaction table, and active card summary."
  );
  const [schema, setSchema] = useState(null);
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deviceMode, setDeviceMode] = useState("desktop");
  const [activeTab, setActiveTab] = useState("preview");
  const [activePage, setActivePage] = useState(0);
  const [viewMode, setViewMode] = useState("full");
  const [promptHistory, setPromptHistory] = useState(() => getFromLocalStorage("prompt_history", []));
  const [designHistory, setDesignHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await apiRequest("/history");
      if (res.status === "success" && Array.isArray(res.data)) {
        setDesignHistory(res.data);
        saveToLocalStorage("design_generation_history", res.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.warn("Failed to fetch history from server, falling back to local storage:", err.message);
      const localHist = getFromLocalStorage("design_generation_history", []);
      setDesignHistory(localHist);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDeleteHistory = async (e, id) => {
    e.stopPropagation();
    try {
      if (id && !String(id).startsWith("local-")) {
        await apiRequest(`/history/${id}`, { method: "DELETE" });
      }
    } catch (err) {
      console.warn("Failed to delete history item on server:", err.message);
    }
    const updatedHist = designHistory.filter(item => item.id !== id);
    setDesignHistory(updatedHist);
    saveToLocalStorage("design_generation_history", updatedHist);
  };

  const handleLoadHistoryItem = (item) => {
    if (!item || !item.schema) return;
    setPrompt(item.prompt);
    setClassification(item.classification);
    setSchema(item.schema);
    setActivePage(0);
    setError(null);
  };

  const handlePageClick = (index) => {
    setActivePage(index);
    if (viewMode === "full") {
      const el = document.getElementById(`page-frame-${index}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  };
  const [showHistory, setShowHistory] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFigmaModal, setShowFigmaModal] = useState(false);
  const textareaRef = useRef(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Prompt cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);
    setSchema(null);
    setClassification(null);
    setActivePage(0);

    // Save to history (old string list logic)
    const updated = [prompt, ...promptHistory.filter(p => p !== prompt)].slice(0, 8);
    setPromptHistory(updated);
    saveToLocalStorage("prompt_history", updated);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate-design`,
        { prompt },
        { withCredentials: true }
      );
      const responseData = response.data;
      if (responseData.status === "success" || responseData.status === "partial_success") {
        const normalizedSchema = normalizeGeneratedSchema(responseData.data);
        if (!normalizedSchema) {
          throw new Error("Generated schema is missing pages or components.");
        }
        setSchema(normalizedSchema);
        setClassification(responseData.classification);

        // Refresh design history
        loadHistory().catch(() => {
          const newHistoryItem = {
            id: responseData.id || `local-${Date.now()}`,
            prompt,
            classification: responseData.classification,
            schema: normalizedSchema,
            createdAt: new Date().toISOString()
          };
          const updatedHist = [newHistoryItem, ...designHistory].slice(0, 20);
          setDesignHistory(updatedHist);
          saveToLocalStorage("design_generation_history", updatedHist);
        });

        if (responseData.status === "partial_success") {
          setError(`Note: ${responseData.message} (${responseData.error})`);
        }
      } else {
        throw new Error(responseData.message || "Failed to generate design");
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message;
      setError(`Generation failed: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleModify = async () => {
    if (!prompt.trim()) {
      setError("Prompt cannot be empty");
      return;
    }
    if (!schema) {
      setError("No active layout to modify. Generate or load a design first.");
      return;
    }

    setLoading(true);
    setError(null);
    setActivePage(0);

    // Save prompt to simple history
    const updated = [prompt, ...promptHistory.filter(p => p !== prompt)].slice(0, 8);
    setPromptHistory(updated);
    saveToLocalStorage("prompt_history", updated);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/modify-design`,
        { prompt, schema, classification },
        { withCredentials: true }
      );
      const responseData = response.data;
      if (responseData.status === "success" || responseData.status === "partial_success") {
        const normalizedSchema = normalizeGeneratedSchema(responseData.data);
        if (!normalizedSchema) {
          throw new Error("Modified schema is missing pages or components.");
        }
        setSchema(normalizedSchema);
        setClassification(responseData.classification);

        // Refresh design history
        loadHistory().catch(() => {
          const newHistoryItem = {
            id: responseData.id || `local-${Date.now()}`,
            prompt,
            classification: responseData.classification,
            schema: normalizedSchema,
            createdAt: new Date().toISOString()
          };
          const updatedHist = [newHistoryItem, ...designHistory].slice(0, 20);
          setDesignHistory(updatedHist);
          saveToLocalStorage("design_generation_history", updatedHist);
        });

        if (responseData.status === "partial_success") {
          setError(`Note: ${responseData.message} (${responseData.error})`);
        }
      } else {
        throw new Error(responseData.message || "Failed to modify design");
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message;
      setError(`Modification failed: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!schema) return;
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProject = () => {
    if (!schema) return;
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${schema.meta?.projectName?.replace(/\s+/g, "-").toLowerCase() || "design"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenExportCenter = () => {
    if (!schema) return;
    try { localStorage.setItem(EXPORT_SCHEMA_KEY, JSON.stringify(schema)); } catch {}
    navigate("/export");
  };

  const pages = schema?.pages || [];
  const colors = schema?.colors || schema?.tokens?.colors || { primary: "#7c3aed", secondary: "#a855f7", background: "#0f172a" };
  const typography = schema?.typography || schema?.tokens?.typography || {};

  return (
    <div className="prompt-studio-root" style={{ maxWidth: "1400px", width: "100%", minWidth: 0, margin: "0 auto", padding: "28px 24px 28px", display: "flex", flexDirection: "column", gap: "24px", overflowX: "hidden", boxSizing: "border-box" }}>

      {/* Header Banner */}
      <section style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "760px" }}>
        <span style={{
          alignSelf: "flex-start", fontSize: "11px", fontWeight: "700", textTransform: "uppercase",
          letterSpacing: "0.07em", color: "var(--secondary)", background: "var(--primary-muted)",
          border: "1px solid var(--border-glow)", padding: "4px 12px", borderRadius: "999px",
          display: "flex", alignItems: "center", gap: "6px"
        }}>
          <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: "10px" }} />
          AI-Powered Layout Engine
        </span>
        <h1 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: "900", letterSpacing: "-0.03em", lineHeight: "1.05", color: "var(--text-primary)", margin: 0 }}>
          Generate{" "}
          <span style={{ background: "var(--gradient-btn)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Live UI Previews
          </span>{" "}
          in Seconds
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", maxWidth: "520px", margin: 0, lineHeight: "1.6" }}>
          Describe your dashboard or app, select a style preset, and instantly see interactive designs exportable to Figma.
        </p>
      </section>

      {/* Style Presets strip */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
          <i className="fa-solid fa-bolt" style={{ color: "var(--secondary)" }} />
          Quick Presets:
        </span>
        {STYLE_PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => setPrompt(preset.prompt)}
            style={{
              display: "flex", alignItems: "center", gap: "6px", padding: "5px 12px",
              borderRadius: "999px", border: "1px solid var(--border)", background: "transparent",
              color: "var(--text-secondary)", fontSize: "12px", cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "var(--primary-muted)";
              e.currentTarget.style.borderColor = "var(--border-glow)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <i className={`fa-solid ${preset.icon}`} style={{ fontSize: "11px" }} />
            {preset.label}
          </button>
        ))}
      </div>

      {/* Main Workspace */}
      <div className="studio-workspace" style={{ display: "grid", gridTemplateColumns: "minmax(280px, 340px) minmax(0, 1fr)", gap: "24px", alignItems: "start", width: "100%", minWidth: 0, overflowX: "hidden" }}>

        {/* ── Left Panel ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>

          {/* Prompt Input Card */}
          <div style={{
            background: "rgba(30,41,59,0.7)", border: "1px solid var(--border)", borderRadius: "18px",
            padding: "20px", backdropFilter: "blur(16px)", boxShadow: "var(--shadow-card)", display: "flex", flexDirection: "column", gap: "14px"
          }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
              <i className="fa-solid fa-wand-magic-sparkles" style={{ color: "var(--secondary)", fontSize: "13px" }} />
              Configure UI Generator
            </h3>

            {schema && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "rgba(124, 58, 237, 0.15)", border: "1px solid var(--border-glow)",
                padding: "8px 12px", borderRadius: "10px", fontSize: "12px", color: "var(--text-secondary)",
                animation: "fadeIn 0.2s ease"
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <i className="fa-solid fa-pen-to-square" style={{ color: "var(--secondary)" }} />
                  Editing: <strong>{schema.meta?.projectName || "Active Layout"}</strong>
                </span>
                <button
                  onClick={() => {
                    setSchema(null);
                    setClassification(null);
                    setPrompt("");
                    setError(null);
                  }}
                  style={{
                    background: "none", border: "none", color: "var(--text-muted)",
                    cursor: "pointer", fontSize: "12px", padding: "2px", display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                  title="Clear layout to start a brand new generation"
                  onMouseOver={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                  onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            )}

            {/* Prompt textarea with history toggle */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {schema ? "Refinement / Modification Prompt" : "Design Prompt"}
                </label>
                {promptHistory.length > 0 && (
                  <button
                    onClick={() => setShowHistory((p) => !p)}
                    style={{ fontSize: "11px", color: "var(--secondary)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <i className="fa-solid fa-clock-rotate-left" />
                    History
                  </button>
                )}
              </div>

              {/* History dropdown */}
              {showHistory && promptHistory.length > 0 && (
                <div style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px",
                  overflow: "hidden", animation: "scaleIn 0.15s ease"
                }}>
                  {promptHistory.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => { setPrompt(h); setShowHistory(false); }}
                      style={{
                        display: "block", width: "100%", textAlign: "left", padding: "8px 12px",
                        fontSize: "12px", color: "var(--text-secondary)", background: "none", border: "none",
                        cursor: "pointer", borderBottom: i < promptHistory.length - 1 ? "1px solid var(--border-light)" : "none",
                        transition: "background 0.15s", fontFamily: "inherit",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = "var(--primary-muted)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                    >
                      <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: "6px", fontSize: "10px" }} />
                      {h}
                    </button>
                  ))}
                </div>
              )}

              <textarea
                ref={textareaRef}
                rows={6}
                placeholder="e.g. Create a dark mode healthcare dashboard with quick stats, doctor list and scheduler card..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%", background: "rgba(8,13,24,0.8)", border: "1px solid var(--input-border)",
                  borderRadius: "12px", padding: "12px 14px", fontSize: "13px", color: "var(--text-primary)",
                  resize: "vertical", fontFamily: "inherit", lineHeight: "1.5", transition: "border-color 0.2s",
                  margin: 0, opacity: loading ? 0.6 : 1
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--cta)"; e.target.style.boxShadow = "0 0 0 3px var(--input-focus)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--input-border)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Character count */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{prompt.length} chars</span>
            </div>

            {/* Error notifications */}
            {error && (
              <div style={{
                padding: "10px 14px", borderRadius: "10px", border: "1px solid",
                fontSize: "12px", lineHeight: "1.5", display: "flex", gap: "8px",
                alignItems: "flex-start",
                background: error.includes("Note:") ? "var(--warning-muted)" : "var(--danger-muted)",
                borderColor: error.includes("Note:") ? "rgba(245,158,11,0.3)" : "rgba(239,68,68,0.3)",
                color: error.includes("Note:") ? "#fde68a" : "#fca5a5"
              }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ marginTop: "1px", flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{error}</span>
              </div>
            )}

            {schema ? (
              <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="btn-secondary"
                  style={{
                    flex: "0 0 80px", justifyContent: "center", padding: "12px", fontSize: "13px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text-secondary)"
                  }}
                  title="Start fresh with a brand new generation using this prompt"
                >
                  <i className="fa-solid fa-plus" /> New
                </button>
                <button
                  onClick={handleModify}
                  disabled={loading}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: "center", padding: "12px", fontSize: "13px" }}
                  title="Refine and modify the active layout using this prompt"
                >
                  {loading ? (
                    <><i className="fa-solid fa-spinner fa-spin" /> Refining...</>
                  ) : (
                    <><i className="fa-solid fa-pen-to-square" /> Refine Design</>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "14px" }}
              >
                {loading ? (
                  <><i className="fa-solid fa-spinner fa-spin" /> Synthesizing Design...</>
                ) : (
                  <><i className="fa-solid fa-cube" /> Generate UI Layout</>
                )}
              </button>
            )}
          </div>

          {/* ── Design History Card ── */}
          <div style={{
            background: "rgba(30,41,59,0.7)", border: "1px solid var(--border)", borderRadius: "18px",
            padding: "20px", backdropFilter: "blur(16px)", boxShadow: "var(--shadow-card)", display: "flex", flexDirection: "column", gap: "14px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                <i className="fa-solid fa-clock-rotate-left" style={{ color: "var(--secondary)", fontSize: "13px" }} />
                Generation History
              </h3>
              {designHistory.length > 0 && (
                <button
                  onClick={() => {
                    setDesignHistory([]);
                    saveToLocalStorage("design_generation_history", []);
                  }}
                  style={{ fontSize: "11px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <i className="fa-solid fa-trash-can" />
                  Clear Local
                </button>
              )}
            </div>

            {historyLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ color: "var(--text-muted)" }} />
              </div>
            ) : designHistory.length === 0 ? (
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, textAlign: "center", padding: "10px 0" }}>
                No generated layouts in history yet. Write a prompt above to generate your first design!
              </p>
            ) : (
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                maxHeight: "280px",
                overflowY: "auto",
                paddingRight: "4px"
              }}>
                {designHistory.map((item) => {
                  const isCurrent = schema && schema.meta?.projectName === item.schema?.meta?.projectName && prompt === item.prompt;
                  const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now";
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleLoadHistoryItem(item)}
                      style={{
                        padding: "10px 12px",
                        background: isCurrent ? "rgba(124,58,237,0.15)" : "rgba(8,13,24,0.4)",
                        border: isCurrent ? "1px solid var(--border-glow)" : "1px solid var(--border-light)",
                        borderRadius: "10px",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => {
                        if (!isCurrent) {
                          e.currentTarget.style.background = "var(--primary-muted)";
                          e.currentTarget.style.borderColor = "var(--border-glow)";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isCurrent) {
                          e.currentTarget.style.background = "rgba(8,13,24,0.4)";
                          e.currentTarget.style.borderColor = "var(--border-light)";
                        }
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                        <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "500" }}>
                          {dateStr}
                        </span>
                        <button
                          onClick={(e) => handleDeleteHistory(e, item.id)}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: "var(--text-muted)", fontSize: "11px", transition: "color 0.15s",
                            display: "flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.color = "var(--danger)"}
                          onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                        >
                          <i className="fa-solid fa-xmark" />
                        </button>
                      </div>
                      <p style={{
                        fontSize: "12px",
                        color: isCurrent ? "var(--text-primary)" : "var(--text-secondary)",
                        fontWeight: isCurrent ? "600" : "400",
                        margin: 0,
                        lineHeight: "1.4",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}>
                        {item.prompt}
                      </p>
                      {item.classification && (
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "2px" }}>
                          <span style={{
                            fontSize: "9px", background: "rgba(255,255,255,0.06)",
                            padding: "2px 6px", borderRadius: "4px", color: "var(--text-muted)",
                            textTransform: "capitalize"
                          }}>
                            {item.classification.platform || "web"}
                          </span>
                          <span style={{
                            fontSize: "9px", background: "rgba(255,255,255,0.06)",
                            padding: "2px 6px", borderRadius: "4px", color: "var(--text-muted)",
                            textTransform: "capitalize"
                          }}>
                            {item.classification.style || "modern"}
                          </span>
                          <span style={{
                            fontSize: "9px", background: "rgba(255,255,255,0.06)",
                            padding: "2px 6px", borderRadius: "4px", color: "var(--text-muted)",
                            textTransform: "capitalize"
                          }}>
                            {item.classification.industry || "generic"}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Classification Results */}
          {classification && (
            <div style={{
              background: "rgba(30,41,59,0.7)", border: "1px solid var(--border)", borderRadius: "18px",
              padding: "18px", backdropFilter: "blur(16px)", boxShadow: "var(--shadow-card)"
            }}>
              <h4 style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                <i className="fa-solid fa-microchip" style={{ color: "var(--secondary)" }} />
                AI Classification Results
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {[
                  { label: "Platform", value: classification.platform },
                  { label: "Industry", value: classification.industry },
                  { label: "Theme", value: classification.style },
                  { label: "Complexity", value: classification.complexity },
                  { label: "Color Mood", value: classification.colorMood },
                  { label: "Motion", value: classification.motionLevel }
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "rgba(8,13,24,0.6)", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border-light)" }}>
                    <p style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
                    <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", textTransform: "capitalize", margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Token Inspector */}
          {schema && (
            <div style={{
              background: "rgba(30,41,59,0.7)", border: "1px solid var(--border)", borderRadius: "18px",
              overflow: "hidden", backdropFilter: "blur(16px)", boxShadow: "var(--shadow-card)"
            }}>
              <button
                onClick={() => setShowTokens((p) => !p)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit"
                }}
              >
                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "6px" }}>
                  <i className="fa-solid fa-palette" style={{ color: "var(--secondary)" }} />
                  Token Inspector
                </span>
                <i className={`fa-solid ${showTokens ? "fa-chevron-up" : "fa-chevron-down"}`} style={{ color: "var(--text-muted)", fontSize: "11px" }} />
              </button>

              {showTokens && (
                <div style={{ padding: "0 18px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {/* Colors */}
                  <div>
                    <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Colors</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {Object.entries(colors).slice(0, 8).map(([name, val]) => (
                        <div key={name} title={`${name}: ${val}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                          <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: val, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}
                            onClick={() => navigator.clipboard.writeText(val)} />
                          <span style={{ fontSize: "9px", color: "var(--text-muted)", textTransform: "capitalize" }}>{name.replace(/([A-Z])/g, " $1").trim().split(" ")[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Typography */}
                  {typography.bodyFont && (
                    <div>
                      <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Typography</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {[{ label: "Display", font: typography.displayFont }, { label: "Heading", font: typography.headingFont }, { label: "Body", font: typography.bodyFont }].filter(t => t.font).map((t) => (
                          <div key={t.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                            <span style={{ color: "var(--text-muted)" }}>{t.label}</span>
                            <span style={{ color: "var(--text-primary)", fontWeight: "500" }}>{t.font}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right Panel ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{
            background: "rgba(30,41,59,0.7)", border: "1px solid var(--border)", borderRadius: "18px",
            padding: "20px", backdropFilter: "blur(16px)", boxShadow: "var(--shadow-card)",
            minHeight: "600px", display: "flex", flexDirection: "column", gap: "14px"
          }}>

            {/* Control Bar */}
            <div className="studio-control-bar" style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "14px", minWidth: 0 }}>
              {/* Tabs */}
              <div style={{ display: "flex", background: "rgba(8,13,24,0.8)", padding: "4px", borderRadius: "12px", gap: "4px", border: "1px solid var(--border-light)" }}>
                {[
                  { id: "preview", icon: "fa-laptop-code", label: "Live Preview" },
                  { id: "json", icon: "fa-code", label: "Raw JSON" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: "7px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "12px",
                      fontWeight: "600", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px",
                      transition: "all 0.15s",
                      background: activeTab === tab.id ? "var(--primary)" : "transparent",
                      color: activeTab === tab.id ? "white" : "var(--text-muted)"
                    }}
                  >
                    <i className={`fa-solid ${tab.icon}`} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Right controls */}
              <div className="studio-right-controls" style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", minWidth: 0 }}>
                {/* Page navigator — only if schema has multiple pages */}
                {schema && pages.length > 1 && activeTab === "preview" && (
                  <div style={{ display: "flex", background: "rgba(8,13,24,0.8)", padding: "4px", borderRadius: "10px", gap: "3px", border: "1px solid var(--border-light)" }}>
                    {pages.map((p, i) => (
                      <button
                        key={p.id}
                        onClick={() => handlePageClick(i)}
                        title={p.name}
                        style={{
                          padding: "4px 10px", borderRadius: "7px", border: "none", cursor: "pointer", fontSize: "11px",
                          fontWeight: "600", fontFamily: "inherit", transition: "all 0.15s",
                          background: activePage === i ? "rgba(124,58,237,0.4)" : "transparent",
                          color: activePage === i ? "var(--secondary)" : "var(--text-muted)"
                        }}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* View Mode Toggle (Single vs Flow) — preview only, if multiple pages exist */}
                {schema && pages.length > 1 && activeTab === "preview" && (
                  <div style={{ display: "flex", background: "rgba(8,13,24,0.8)", padding: "4px", borderRadius: "10px", gap: "3px", border: "1px solid var(--border-light)" }}>
                    {[
                      { mode: "single", label: "Single Page View", icon: "fa-file-lines" },
                      { mode: "full", label: "Full Website View", icon: "fa-globe" }
                    ].map(({ mode, label, icon }) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        title={label}
                        style={{
                          padding: "4px 10px", borderRadius: "7px", border: "none", cursor: "pointer", fontSize: "11px",
                          fontWeight: "600", fontFamily: "inherit", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "5px",
                          background: viewMode === mode ? "rgba(124,58,237,0.4)" : "transparent",
                          color: viewMode === mode ? "var(--secondary)" : "var(--text-muted)"
                        }}
                      >
                        <i className={`fa-solid ${icon}`} />
                        <span>{mode === "single" ? "Single" : "Flow"}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Device switcher — preview only */}
                {activeTab === "preview" && (
                  <div style={{ display: "flex", background: "rgba(8,13,24,0.8)", padding: "4px", borderRadius: "10px", gap: "3px", border: "1px solid var(--border-light)" }}>
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
                )}

                {/* Save/export actions — only when schema is ready */}
                {schema && (
                  <div className="studio-action-buttons" style={{ display: "flex", gap: "5px", flexWrap: "wrap", alignItems: "center" }}>
                    <button
                      onClick={handleCopyJson}
                      className="btn-ghost"
                      style={{ fontSize: "12px", padding: "6px 12px" }}
                    >
                      <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`} />
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={handleSaveProject}
                      className="btn-secondary"
                      style={{ fontSize: "12px", padding: "6px 12px" }}
                    >
                      <i className="fa-solid fa-download" />
                      Save JSON
                    </button>
                    <button
                      onClick={() => {
                        try { localStorage.setItem(EXPORT_SCHEMA_KEY, JSON.stringify(schema)); } catch {}
                        navigate("/preview");
                      }}
                      className="btn-secondary"
                      style={{ fontSize: "12px", padding: "6px 12px" }}
                    >
                      <i className="fa-solid fa-expand" />
                      Fullscreen
                    </button>
                    <button
                      onClick={handleOpenExportCenter}
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        padding: "6px 14px", fontSize: "12px", fontWeight: "700",
                        border: "none", borderRadius: "10px", cursor: "pointer",
                        fontFamily: "inherit",
                        background: "linear-gradient(135deg, #059669, #10b981)",
                        color: "white",
                        boxShadow: "0 4px 16px rgba(16,185,129,0.35)",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(16,185,129,0.5)"; }}
                      onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(16,185,129,0.35)"; }}
                    >
                      <i className="fa-solid fa-arrow-up-from-bracket" />
                      Export
                    </button>
                    <button
                      onClick={() => setShowFigmaModal(true)}
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        padding: "6px 14px", fontSize: "12px", fontWeight: "700",
                        border: "none", borderRadius: "10px", cursor: "pointer",
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
                      Figma
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Canvas Content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minWidth: 0 }}>
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px", padding: "60px 20px" }}>
                  <div style={{
                    width: "60px", height: "60px", borderRadius: "50%",
                    border: "4px solid rgba(124,58,237,0.15)",
                    borderTopColor: "var(--primary)",
                    animation: "spin-slow 0.8s linear infinite"
                  }} />
                  <div>
                    <h4 style={{ fontWeight: "700", fontSize: "16px", marginBottom: "6px" }}>Generating Design Schema</h4>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", maxWidth: "280px", lineHeight: "1.5", margin: 0 }}>
                      Our AI pipeline is classifying your prompt, generating design tokens, and building responsive component grids...
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    {["Classification", "Tokens", "Layout", "Components"].map((step, i) => (
                      <div key={step} style={{
                        padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "600",
                        background: "var(--primary-muted)", border: "1px solid var(--border-glow)",
                        color: "var(--secondary)", animation: `fadeIn 0.5s ease ${i * 0.3}s forwards`, opacity: 0
                      }}>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              ) : !schema ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "16px", padding: "60px 20px", maxWidth: "360px" }}>
                  <div style={{
                    width: "60px", height: "60px", borderRadius: "16px", background: "var(--primary-muted)",
                    border: "1px solid var(--border-glow)", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "26px", color: "var(--secondary)"
                  }}>
                    <i className="fa-solid fa-cubes-stacked" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "8px" }}>No Design Loaded Yet</h4>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
                      Choose a quick preset above or write your own design prompt in the panel on the left, then click Generate.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                    {STYLE_PRESETS.slice(0, 3).map((p) => (
                      <button
                        key={p.label}
                        onClick={() => { setPrompt(p.prompt); }}
                        style={{
                          display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px",
                          borderRadius: "999px", border: "1px solid var(--border)", background: "transparent",
                          color: "var(--text-muted)", fontSize: "12px", cursor: "pointer", fontFamily: "inherit",
                          transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = "var(--primary-muted)"; e.currentTarget.style.borderColor = "var(--border-glow)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                      >
                        <i className={`fa-solid ${p.icon}`} style={{ fontSize: "11px" }} />
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : activeTab === "json" ? (
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={handleCopyJson}
                      className="btn-secondary"
                      style={{ fontSize: "12px", padding: "6px 14px" }}
                    >
                      <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`} />
                      {copied ? "Copied!" : "Copy JSON"}
                    </button>
                  </div>
                  <div style={{ background: "rgba(8,13,24,0.9)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", overflowX: "auto", maxHeight: "520px", overflowY: "auto" }}>
                    <pre style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "#34d399", lineHeight: "1.6", margin: 0 }}>
                      {JSON.stringify(schema, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                /* Live Preview Canvas */
                <div className="studio-canvas-wrapper" style={{ width: "100%", display: "flex", justifyContent: "center", padding: "4px", minWidth: 0, overflowX: "hidden", overflowY: "hidden" }}>
                  {viewMode === "full" && pages.length > 1 ? (
                    <div
                      id="studio-canvas-scroll-container"
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "28px",
                        overflowY: "auto",
                        overflowX: "hidden",
                        maxHeight: "580px",
                        padding: "10px 4px",
                        alignItems: "center",
                        minWidth: 0,
                        boxSizing: "border-box"
                      }}
                    >
                      {pages.map((p, i) => (
                        <div
                          key={p.id}
                          id={`page-frame-${i}`}
                          style={{
                            width: deviceMode === "mobile" ? "min(375px, 100%)" : deviceMode === "tablet" ? "min(768px, 100%)" : "100%",
                            maxWidth: "100%",
                            background: colors?.background || "#0b0f19",
                            borderRadius: "16px",
                            border: "1px solid rgba(71,85,105,0.5)",
                            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                            padding: "16px",
                            transition: "width 0.3s ease",
                            position: "relative",
                            minWidth: 0,
                            overflow: "hidden",
                            boxSizing: "border-box"
                          }}
                        >
                          {/* Device chrome header with name */}
                          <div style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            borderBottom: "1px solid rgba(71,85,105,0.3)", paddingBottom: "10px", marginBottom: "14px"
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "10px", background: "var(--secondary)", color: "white", padding: "2px 8px", borderRadius: "999px", fontWeight: "700" }}>
                                Page {i + 1}
                              </span>
                              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)" }}>{p.name}</span>
                            </div>
                            <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>{deviceMode} view</span>
                          </div>

                          <PreviewRenderer
                            schema={{ ...schema, pages: [p] }}
                            deviceMode={deviceMode}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="studio-single-frame"
                      style={{
                        width: deviceMode === "mobile" ? "min(375px, 100%)" : deviceMode === "tablet" ? "min(768px, 100%)" : "100%",
                        maxWidth: "100%",
                        background: colors?.background || "#0b0f19",
                        borderRadius: "16px",
                        border: "1px solid rgba(71,85,105,0.5)",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                        padding: "12px",
                        overflowY: "auto",
                        overflowX: "hidden",
                        transition: "width 0.3s ease",
                        minHeight: "580px",
                        maxHeight: "580px",
                        position: "relative",
                        minWidth: 0,
                        boxSizing: "border-box"
                      }}
                    >
                      {/* Device chrome header */}
                      {deviceMode === "mobile" && (
                        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "10px" }}>
                          <div style={{ width: "60px", height: "4px", borderRadius: "2px", background: "rgba(71,85,105,0.5)" }} />
                        </div>
                      )}
                      {deviceMode === "desktop" && (
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", borderBottom: "1px solid rgba(71,85,105,0.3)", paddingBottom: "10px", marginBottom: "10px" }}>
                          {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
                            <span key={i} style={{ width: "9px", height: "9px", borderRadius: "50%", background: c }} />
                          ))}
                          <span style={{ marginLeft: "8px", background: "rgba(30,41,59,0.8)", borderRadius: "4px", padding: "2px 10px", fontSize: "9px", color: "var(--text-muted)" }}>
                            {schema?.meta?.projectName || "ai-wireframe"}
                          </span>
                        </div>
                      )}

                      <PreviewRenderer
                        schema={schema && pages.length > 0 ? { ...schema, pages: [pages[activePage] || pages[0]] } : schema}
                        deviceMode={deviceMode}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Studio workspace responsive grid */
        .studio-workspace {
          grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
        }

        /* Tablet: stack panels vertically */
        @media (max-width: 960px) {
          .studio-workspace {
            grid-template-columns: 1fr !important;
          }
          .studio-control-bar {
            flex-direction: column;
            align-items: flex-start !important;
          }
          .studio-right-controls {
            width: 100%;
            flex-wrap: wrap !important;
            gap: 6px !important;
          }
          .studio-action-buttons {
            flex-wrap: wrap !important;
          }
          .studio-canvas-wrapper {
            overflow-x: hidden !important;
          }
        }

        /* Mobile: collapse toolbar further */
        @media (max-width: 600px) {
          .prompt-studio-root {
            padding: 16px 12px !important;
          }
          .studio-right-controls {
            gap: 4px !important;
          }
          .studio-action-buttons button {
            padding: 5px 8px !important;
            font-size: 11px !important;
          }
          .studio-action-buttons button i + * {
            display: none;
          }
          .studio-canvas-wrapper {
            padding: 2px !important;
          }
        }

        /* Always prevent the canvas from expanding the page */
        .studio-canvas-wrapper,
        #studio-canvas-scroll-container,
        .studio-single-frame {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
      `}</style>

      {/* Figma Export Modal */}
      {showFigmaModal && schema && (
        <FigmaExportModal
          schema={schema}
          onClose={() => setShowFigmaModal(false)}
        />
      )}
    </div>
  );
}
