/**
 * FigmaExportModal.jsx
 * Simplified export modal focusing exclusively on Instant Copy-Paste import to Figma.
 * Removes Cloud Sync API configurations.
 */

import { useState, useCallback, useEffect } from "react";
import { generateSVGForPage, copySvgToClipboard } from "../lib/svgExport";
import { downloadFigmaJson, buildFigmaDocument, exportToFigmaAPI, loadFigmaToken, saveFigmaToken } from "../lib/figmaExport";

export default function FigmaExportModal({ schema, onClose }) {
  const [selectedPageIdx, setSelectedPageIdx] = useState(0);
  const [copySuccess, setCopySuccess] = useState(""); // "" | "desktop" | "tablet" | "mobile"
  const [downloading, setDownloading] = useState(false);
  const [figmaToken, setFigmaToken] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [exportSuccess, setExportSuccess] = useState("");

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    const savedToken = loadFigmaToken();
    if (savedToken) {
      setFigmaToken(savedToken);
    }
  }, []);

  const handleCopyPageSvg = useCallback(async (deviceMode) => {
    try {
      const page = schema.pages[selectedPageIdx] || schema.pages[0];
      const svg = generateSVGForPage(page, schema, deviceMode);
      const ok = await copySvgToClipboard(svg);
      if (ok) {
        setCopySuccess(deviceMode);
        setTimeout(() => setCopySuccess(""), 3000);
      } else {
        alert("Clipboard copy failed. Please try downloading the JSON backup.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to copy design: " + err.message);
    }
  }, [schema, selectedPageIdx]);

  const handleDownloadBackup = useCallback(async () => {
    setDownloading(true);
    try {
      const res = await buildFigmaDocument(schema);
      downloadFigmaJson(res.document, schema);
    } catch (err) {
      console.error("Backup download failed:", err);
      alert("Failed to build Figma document backup.");
    } finally {
      setDownloading(false);
    }
  }, [schema]);

  const handleExportToFigma = useCallback(async () => {
    const token = figmaToken.trim();
    if (!token) {
      setExportError("Add a Figma Personal Access Token first, or use Download JSON as a backup.");
      return;
    }

    setExporting(true);
    setExportError("");
    setExportSuccess("");

    try {
      saveFigmaToken(token);
      const page = schema.pages[selectedPageIdx] || schema.pages[0];
      const fileName = `${schema?.meta?.projectName || "AI Design Project"} - ${page?.name || "Page"}`;

      const result = await exportToFigmaAPI(token, schema, {
        fileName,
        forceRedo: true
      });

      const fileUrl = result?.export?.fileUrl;
      if (fileUrl) {
        window.open(fileUrl, "_blank", "noopener,noreferrer");
      }

      setExportSuccess(result?.message || "Export completed successfully. Opened the Figma file in a new tab.");
    } catch (err) {
      setExportError(err?.message || "Figma export failed.");
    } finally {
      setExporting(false);
    }
  }, [figmaToken, schema, selectedPageIdx]);

  const totalPages = schema?.pages?.length || 0;
  const projectName = schema?.meta?.projectName || "AI Design Project";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          animation: "fadeIn 0.2s ease"
        }}
      />

      {/* Modal Container */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          width: "min(460px, 90vw)", // Reduced width to prevent horizontal stretching
          background: "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(20,30,48,0.98))",
          border: "1px solid rgba(124,58,237,0.25)",
          borderRadius: "20px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          boxSizing: "border-box"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #7C3AED, #A855F7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(124,58,237,0.3)"
              }}
            >
              <i className="fa-brands fa-figma" style={{ fontSize: "16px", color: "white" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: "800", margin: 0, color: "#F8FAFC" }}>
                Copy to Figma
              </h2>
              <p style={{ fontSize: "11px", color: "#64748B", margin: 0, marginTop: "1px" }}>
                {projectName} · {totalPages} pages
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              border: "1px solid #1E293B",
              background: "rgba(30,41,59,0.5)",
              color: "#64748B",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              transition: "all 0.15s"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#334155";
              e.currentTarget.style.color = "#94A3B8";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#1E293B";
              e.currentTarget.style.color = "#64748B";
            }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Notice Info Box */}
        <div
          style={{
            background: "rgba(124,58,237,0.08)",
            border: "1px solid rgba(124,58,237,0.18)",
            borderRadius: "10px",
            padding: "10px 14px",
            boxSizing: "border-box"
          }}
        >
          <p style={{ fontSize: "12px", fontWeight: "700", color: "#A78BFA", margin: 0 }}>
            ⚡ Instant Clipboard Copy
          </p>
          <p style={{ fontSize: "11px", color: "#94A3B8", margin: "2px 0 0", lineHeight: "1.4" }}>
            Copies vectors directly to your clipboard. Paste into Figma with Ctrl+V (Cmd+V).
          </p>
        </div>

        {/* Token + Export */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "10px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Figma Personal Access Token
          </label>
          <input
            type="password"
            value={figmaToken}
            onChange={(e) => setFigmaToken(e.target.value)}
            placeholder="Paste your token here"
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "rgba(8,13,24,0.8)",
              border: "1px solid #1E293B",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#F8FAFC",
              boxSizing: "border-box",
              outline: "none"
            }}
          />
          <button
            onClick={handleExportToFigma}
            disabled={exporting}
            style={{
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: "700",
              border: "none",
              borderRadius: "10px",
              cursor: exporting ? "progress" : "pointer",
              background: exporting ? "rgba(124,58,237,0.55)" : "linear-gradient(135deg, #7C3AED, #A855F7)",
              color: "white",
              transition: "all 0.2s",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            <i className={exporting ? "fa-solid fa-spinner fa-spin" : "fa-brands fa-figma"} />
            {exporting ? "Exporting to Figma..." : "Export to Figma"}
          </button>
          {exportSuccess && (
            <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "10px", padding: "10px 12px", color: "#34d399", fontSize: "12px", lineHeight: "1.45" }}>
              {exportSuccess}
            </div>
          )}
          {exportError && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "10px", padding: "10px 12px", color: "#fca5a5", fontSize: "12px", lineHeight: "1.45" }}>
              {exportError}
            </div>
          )}
        </div>

        {/* Page Selector (Vertical Layout) */}
        {totalPages > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "10px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Select Design Page
            </label>
            <select
              value={selectedPageIdx}
              onChange={(e) => setSelectedPageIdx(Number(e.target.value))}
              style={{
                padding: "10px 12px",
                background: "rgba(8,13,24,0.8)",
                border: "1px solid #1E293B",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#F8FAFC",
                fontFamily: "inherit",
                cursor: "pointer",
                width: "100%",
                outline: "none",
                boxSizing: "border-box"
              }}
              onFocus={(e) => (e.target.style.borderColor = "#7C3AED")}
              onBlur={(e) => (e.target.style.borderColor = "#1E293B")}
            >
              {schema.pages.map((p, idx) => (
                <option key={idx} value={idx}>
                  {p.name} ({p.components?.length || 0} items)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Copy Buttons Stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "2px" }}>
          <button
            onClick={() => handleCopyPageSvg("desktop")}
            style={{
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: "700",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              background: copySuccess === "desktop" ? "#10B981" : "linear-gradient(135deg, #7C3AED, #A855F7)",
              color: "white",
              transition: "all 0.2s",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            <i className={copySuccess === "desktop" ? "fa-solid fa-check" : "fa-solid fa-desktop"} />
            {copySuccess === "desktop" ? "Copied! Paste (Ctrl+V) in Figma" : "Copy Desktop Design (1440px)"}
          </button>

          <button
            onClick={() => handleCopyPageSvg("tablet")}
            style={{
              padding: "11px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "12px",
              fontWeight: "700",
              border: "1px solid #1E293B",
              borderRadius: "10px",
              cursor: "pointer",
              background: copySuccess === "tablet" ? "#10B981" : "rgba(30,41,59,0.5)",
              color: copySuccess === "tablet" ? "white" : "#CBD5E1",
              transition: "all 0.2s",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            <i className={copySuccess === "tablet" ? "fa-solid fa-check" : "fa-solid fa-tablet-screen-button"} />
            {copySuccess === "tablet" ? "Copied! Paste (Ctrl+V) in Figma" : "Copy Tablet Design (768px)"}
          </button>

          <button
            onClick={() => handleCopyPageSvg("mobile")}
            style={{
              padding: "11px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "12px",
              fontWeight: "700",
              border: "1px solid #1E293B",
              borderRadius: "10px",
              cursor: "pointer",
              background: copySuccess === "mobile" ? "#10B981" : "rgba(30,41,59,0.5)",
              color: copySuccess === "mobile" ? "white" : "#CBD5E1",
              transition: "all 0.2s",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            <i className={copySuccess === "mobile" ? "fa-solid fa-check" : "fa-solid fa-mobile-screen-button"} />
            {copySuccess === "mobile" ? "Copied! Paste (Ctrl+V) in Figma" : "Copy Mobile Design (375px)"}
          </button>
        </div>

        {/* Step Instructions list */}
        <div
          style={{
            background: "rgba(15,23,42,0.6)",
            border: "1px solid #1E293B",
            borderRadius: "12px",
            padding: "12px 14px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <p style={{ fontSize: "10px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
            How to use:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11px", color: "#94A3B8", lineHeight: "1.4" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <span style={{ color: "#A78BFA", fontWeight: "700" }}>1.</span>
              <span>Click a copy button above.</span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <span style={{ color: "#A78BFA", fontWeight: "700" }}>2.</span>
              <span>Open any Figma file (App or Web).</span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <span style={{ color: "#A78BFA", fontWeight: "700" }}>3.</span>
              <span>Press <kbd style={{ background: "#1D2433", border: "1px solid #334155", padding: "1px 4px", borderRadius: "3px", color: "#FFF", fontSize: "10px" }}>Ctrl + V</kbd> to paste.</span>
            </div>
          </div>
        </div>

        {/* Footer Backup download */}
        <div style={{ display: "flex", gap: "8px", width: "100%" }}>
          <button
            onClick={handleDownloadBackup}
            disabled={downloading}
            style={{
              padding: "9px 12px",
              fontSize: "11px",
              fontWeight: "600",
              border: "1px solid #1E293B",
              borderRadius: "8px",
              background: "rgba(30,41,59,0.3)",
              color: "#94A3B8",
              cursor: "pointer",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxSizing: "border-box"
            }}
          >
            <i className="fa-solid fa-download" />
            {downloading ? "Building..." : "Download JSON"}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "9px 12px",
              fontSize: "11px",
              fontWeight: "600",
              border: "none",
              borderRadius: "8px",
              background: "transparent",
              color: "#64748B",
              cursor: "pointer",
              transition: "color 0.15s",
              boxSizing: "border-box"
            }}
            onMouseOver={(e) => (e.target.style.color = "#94A3B8")}
            onMouseOut={(e) => (e.target.style.color = "#64748B")}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
