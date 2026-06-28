/**
 * figma.controller.js
 * Express controllers for Figma integration endpoints.
 */

import {
  validateFigmaToken,
  listUserFigmaFiles,
  createAndPopulateFigmaFile,
  buildFigmaDocument,
  exportWithRetry
} from "../services/figmaExport.service.js";
import { AppError } from "../utils/errors.js";

/**
 * POST /api/figma/validate-token
 * Body: { token: string }
 * Validates a Figma Personal Access Token by calling /v1/me
 */
export async function validateTokenController(req, res, next) {
  try {
    const { token } = req.body;
    if (!token || typeof token !== "string" || token.trim().length === 0) {
      throw new AppError(400, "Figma Personal Access Token is required.");
    }

    const user = await validateFigmaToken(token.trim());

    return res.status(200).json({
      status: "success",
      user: {
        id: user.id,
        handle: user.handle,
        email: user.email,
        imgUrl: user.img_url
      }
    });
  } catch (err) {
    if (err.response?.status === 403 || err.response?.status === 401) {
      return next(new AppError(401, "Invalid Figma token. Please check your Personal Access Token and try again."));
    }
    return next(err instanceof AppError ? err : new AppError(500, `Token validation failed: ${err.message}`));
  }
}

/**
 * GET /api/figma/files
 * Query: { token: string }
 * Lists the user's recent Figma files (drafts)
 */
export async function listFilesController(req, res, next) {
  try {
    const token = req.headers["x-figma-token"] || req.query.token;
    if (!token) throw new AppError(400, "Figma token required in x-figma-token header or token query param.");

    const result = await listUserFigmaFiles(token.trim());

    return res.status(200).json({
      status: "success",
      user: result.user,
      files: result.files
    });
  } catch (err) {
    return next(err instanceof AppError ? err : new AppError(500, `Failed to fetch files: ${err.message}`));
  }
}

/**
 * POST /api/figma/export
 * Body: { token, schema, options: { fileName, targetFileKey } }
 * Exports the AI design schema to a Figma file
 */
export async function exportDesignController(req, res, next) {
  try {
    const { token, schema, options = {} } = req.body;

    if (!token || typeof token !== "string") {
      throw new AppError(400, "Figma Personal Access Token is required.");
    }
    if (!schema || typeof schema !== "object") {
      throw new AppError(400, "Design schema is required.");
    }
    if (!schema.pages || !Array.isArray(schema.pages) || schema.pages.length === 0) {
      throw new AppError(400, "Schema must contain at least one page.");
    }

    // Validate token before export
    let figmaUser;
    try {
      figmaUser = await validateFigmaToken(token.trim());
    } catch (tokenErr) {
      throw new AppError(401, "Invalid Figma token. Please verify your Personal Access Token.");
    }

    // Build progress tracking (server-sent events not used here — client polls or awaits)
    const progressLog = [];
    const onProgress = ({ phase, percent }) => {
      progressLog.push({ phase, percent, ts: Date.now() });
    };

    // Run export with retry
    const result = await exportWithRetry(
      () => createAndPopulateFigmaFile(token.trim(), schema, options, onProgress),
      3
    );

    return res.status(200).json({
      status: "success",
      figmaUser: {
        handle: figmaUser.handle,
        email: figmaUser.email
      },
      export: {
        fileKey: result.fileKey,
        fileUrl: result.fileUrl,
        name: result.name,
        mode: result.mode,
        message: result.message,
        pages: result.pages,
        document: result.document // Full Figma document JSON for client-side import
      },
      progress: progressLog
    });
  } catch (err) {
    return next(err instanceof AppError ? err : new AppError(500, `Export failed: ${err.message}`));
  }
}

/**
 * POST /api/figma/build-document
 * Body: { schema }
 * Builds and returns the full Figma document JSON (no Figma API call needed)
 * Useful for previewing the export structure or downloading as JSON for manual import
 */
export async function buildDocumentController(req, res, next) {
  try {
    const { schema } = req.body;

    if (!schema || typeof schema !== "object") {
      throw new AppError(400, "Design schema is required.");
    }

    const document = buildFigmaDocument(schema);

    const stats = {
      totalPages: document.pages.length,
      totalNodes: document.pages.reduce((sum, page) => sum + countNodes(page.children || []), 0),
      pages: document.pages.map(p => ({
        name: p.name,
        nodeCount: countNodes(p.children || [])
      }))
    };

    return res.status(200).json({
      status: "success",
      document,
      stats
    });
  } catch (err) {
    return next(err instanceof AppError ? err : new AppError(500, `Document build failed: ${err.message}`));
  }
}

function countNodes(nodes) {
  if (!nodes) return 0;
  return nodes.reduce((sum, node) => sum + 1 + countNodes(node.children || []), 0);
}
