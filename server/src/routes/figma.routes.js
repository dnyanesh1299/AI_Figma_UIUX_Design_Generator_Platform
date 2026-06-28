/**
 * figma.routes.js
 * Routes for Figma integration: token validation, file listing, and design export.
 */

import { Router } from "express";
import {
  validateTokenController,
  listFilesController,
  exportDesignController,
  buildDocumentController
} from "../controllers/figma.controller.js";

const router = Router();

/**
 * POST /api/figma/validate-token
 * Validates a Figma Personal Access Token
 */
router.post("/validate-token", validateTokenController);

/**
 * GET /api/figma/files
 * Lists the authenticated user's Figma files
 */
router.get("/files", listFilesController);

/**
 * POST /api/figma/export
 * Full export: converts schema to Figma file via REST API
 */
router.post("/export", exportDesignController);

/**
 * POST /api/figma/build-document
 * Build Figma document JSON without pushing to Figma
 * (useful for download/import workflow)
 */
router.post("/build-document", buildDocumentController);

export default router;
