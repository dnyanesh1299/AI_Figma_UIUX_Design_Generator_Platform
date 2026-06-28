/**
 * export.routes.js
 *
 * Routes for the Export & Code Generation API.
 * Mounted at: /api/export
 */

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  exportJsonController,
  exportHtmlController,
  logExportController,
  getExportHistoryController,
} from '../controllers/export.controller.js';

const router = Router();

/**
 * POST /api/export/json
 * Returns the design schema as a downloadable JSON file.
 * Public (no auth required — schema is provided in body).
 */
router.post('/json', exportJsonController);

/**
 * POST /api/export/html
 * Returns metadata about the HTML/CSS export that will be generated.
 * Public.
 */
router.post('/html', exportHtmlController);

/**
 * POST /api/export/log
 * Logs an export event to the database.
 * Requires authentication.
 */
router.post('/log', requireAuth, logExportController);

/**
 * GET /api/export/history
 * Returns the authenticated user's export history.
 * Requires authentication.
 */
router.get('/history', requireAuth, getExportHistoryController);

export default router;
