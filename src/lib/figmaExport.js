/**
 * figmaExport.js
 * Client-side Figma export orchestration.
 * Handles token management, duplicate detection, and server communication.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
const STORAGE_KEY_TOKEN = "figma_pat";
const STORAGE_KEY_EXPORTS = "figma_exports";

// ─── Token storage ─────────────────────────────────────────────────────────────

export function saveFigmaToken(token) {
  try {
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
  } catch {}
}

export function loadFigmaToken() {
  try {
    return localStorage.getItem(STORAGE_KEY_TOKEN) || "";
  } catch {
    return "";
  }
}

export function clearFigmaToken() {
  try {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  } catch {}
}

// ─── Schema hashing (duplicate detection) ──────────────────────────────────────

export function hashSchema(schema) {
  try {
    const str = JSON.stringify({
      meta: schema?.meta,
      pages: (schema?.pages || []).map(p => ({
        id: p.id,
        name: p.name,
        compCount: (p.components || []).length
      })),
      tokenKeys: Object.keys(schema?.tokens?.colors || {}).sort()
    });
    // Simple djb2 hash
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
      hash = hash >>> 0; // unsigned 32-bit
    }
    return hash.toString(16);
  } catch {
    return Date.now().toString(16);
  }
}

export function checkDuplicateExport(schema) {
  try {
    const hash = hashSchema(schema);
    const exports = JSON.parse(localStorage.getItem(STORAGE_KEY_EXPORTS) || "[]");
    return exports.find(e => e.hash === hash) || null;
  } catch {
    return null;
  }
}

export function recordExport(schema, result) {
  try {
    const hash = hashSchema(schema);
    const exports = JSON.parse(localStorage.getItem(STORAGE_KEY_EXPORTS) || "[]");
    const record = {
      hash,
      ts: Date.now(),
      projectName: schema?.meta?.projectName || "Untitled",
      fileKey: result?.fileKey,
      fileUrl: result?.fileUrl,
      name: result?.name
    };
    // Keep last 20 exports
    const updated = [record, ...exports.filter(e => e.hash !== hash)].slice(0, 20);
    localStorage.setItem(STORAGE_KEY_EXPORTS, JSON.stringify(updated));
  } catch {}
}

// ─── API calls ─────────────────────────────────────────────────────────────────

/**
 * Validate Figma token via server proxy
 */
export async function validateFigmaToken(token) {
  const res = await fetch(`${API_BASE_URL}/figma/validate-token`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Token validation failed");
  return data;
}

/**
 * Build Figma document from schema (server-side, no Figma API needed)
 */
export async function buildFigmaDocument(schema) {
  const res = await fetch(`${API_BASE_URL}/figma/build-document`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ schema })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Document build failed");
  return data;
}

/**
 * Export full design to Figma via server
 */
export async function exportToFigmaAPI(token, schema, options = {}) {
  const res = await fetch(`${API_BASE_URL}/figma/export`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, schema, options })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Export failed");
  return data;
}

// ─── Download helpers ──────────────────────────────────────────────────────────

/**
 * Download the Figma document JSON as a .fig.json file
 * Users can import this via Figma's "Import" feature or Figma plugins
 */
export function downloadFigmaJson(document, schema) {
  const name = schema?.meta?.projectName?.replace(/\s+/g, "-").toLowerCase() || "design";
  const payload = {
    _exportedBy: "AI Figma UI/UX Design Platform",
    _exportedAt: new Date().toISOString(),
    _version: "1.0.0",
    _schema: {
      projectName: schema?.meta?.projectName,
      projectType: schema?.meta?.projectType,
      pages: (schema?.pages || []).map(p => p.name),
      componentCount: (schema?.pages || []).reduce((s, p) => s + (p.components || []).length, 0)
    },
    figmaDocument: document
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement ? document.createElement("a") : { href: url, download: "" };
  // Use window.document to avoid collision
  const link = window.document.createElement("a");
  link.href = url;
  link.download = `${name}-figma-export.json`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Main export orchestrator ──────────────────────────────────────────────────

/**
 * Full export pipeline with progress callbacks.
 *
 * @param {object} schema - AI-generated design schema
 * @param {object} options - Export options
 * @param {string} options.token - Figma PAT
 * @param {string} options.mode - "new" | "existing"
 * @param {string} options.targetFileKey - Existing file key (if mode=existing)
 * @param {string} options.fileName - Custom file name
 * @param {boolean} options.forceRedo - Skip duplicate check
 * @param {function} onProgress - Progress callback: ({phase, percent, detail}) => void
 */
export async function runFigmaExport(schema, options, onProgress) {
  const { token, mode = "new", targetFileKey, fileName, forceRedo = false } = options;

  // 1. Duplicate check
  onProgress?.({ phase: "Checking for existing exports", percent: 3 });
  if (!forceRedo) {
    const existing = checkDuplicateExport(schema);
    if (existing) {
      return {
        isDuplicate: true,
        existing,
        message: `This design was already exported on ${new Date(existing.ts).toLocaleDateString()}.`
      };
    }
  }

  // 2. Validate token
  onProgress?.({ phase: "Validating Figma token", percent: 8 });
  await validateFigmaToken(token);

  // 3. Build document locally first (fast, for progress feedback)
  onProgress?.({ phase: "Building design system nodes", percent: 20 });

  // 4. Export via server
  onProgress?.({ phase: "Creating Figma file structure", percent: 35 });
  const exportResult = await exportToFigmaAPI(token, schema, {
    fileName: fileName || `${schema?.meta?.projectName || "Design"} — AI Export`,
    targetFileKey: mode === "existing" ? targetFileKey : undefined
  });

  onProgress?.({ phase: "Exporting Desktop screens", percent: 55 });
  await delay(300); // Visual progress breathing room

  onProgress?.({ phase: "Exporting Tablet & Mobile screens", percent: 70 });
  await delay(300);

  onProgress?.({ phase: "Exporting Component library", percent: 82 });
  await delay(200);

  onProgress?.({ phase: "Exporting Design System", percent: 90 });
  await delay(200);

  onProgress?.({ phase: "Finalizing export", percent: 97 });
  await delay(300);

  // 5. Record the export for deduplication
  recordExport(schema, exportResult?.export);

  onProgress?.({ phase: "Complete", percent: 100 });

  return {
    isDuplicate: false,
    result: exportResult?.export,
    figmaUser: exportResult?.figmaUser
  };
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Export summary stats ──────────────────────────────────────────────────────

export function getExportStats(schema) {
  const pages = schema?.pages || [];
  const allComps = pages.flatMap(p => p.components || []);
  const compTypes = [...new Set(allComps.map(c => c.type))];
  const colorCount = Object.keys(schema?.tokens?.colors || {}).length;
  const breakpoints = ["desktop", "tablet", "mobile"];

  return {
    totalPages: pages.length,
    totalComponents: allComps.length,
    uniqueComponentTypes: compTypes.length,
    colorTokens: colorCount,
    figmaPages: 7, // Cover, Design System, Components, Desktop, Tablet, Mobile, Prototypes
    totalScreens: pages.length * breakpoints.length,
    estimatedNodes: allComps.length * 8 + colorCount * 3 + pages.length * 5
  };
}

export function getRecentExports() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_EXPORTS) || "[]");
  } catch {
    return [];
  }
}
