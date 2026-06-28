/**
 * export.controller.js
 *
 * Handles export-related API routes:
 * - POST /api/export/json    → Returns JSON as file attachment
 * - POST /api/export/html    → Returns HTML export metadata
 * - POST /api/export/log     → Logs export event (auth required)
 * - GET  /api/export/history → Returns export history (auth required)
 */

import {
  generateJsonExportService,
  generateHtmlMetadataService,
  logExportService,
  getExportHistoryService,
} from '../services/export.service.js';
import { AppError } from '../utils/errors.js';

/**
 * POST /api/export/json
 * Returns the design schema as a JSON file attachment.
 * Body: { schema: object, projectName?: string }
 */
export async function exportJsonController(req, res, next) {
  try {
    const { schema, projectName } = req.body;
    if (!schema) throw new AppError(400, 'Schema is required');

    const result = generateJsonExportService(schema, projectName);

    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.setHeader('Cache-Control', 'no-cache');
    return res.send(result.content);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/export/html
 * Returns metadata about what will be generated for HTML export.
 * Body: { schema: object }
 */
export async function exportHtmlController(req, res, next) {
  try {
    const { schema } = req.body;
    if (!schema) throw new AppError(400, 'Schema is required');

    const metadata = generateHtmlMetadataService(schema);

    return res.status(200).json({
      status: 'success',
      data: metadata,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/export/log
 * Logs an export event to the database.
 * Body: { projectName: string, format: string, schemaHash?: string }
 * Auth: required
 */
export async function logExportController(req, res, next) {
  try {
    const userId = req.user?.id;
    const { projectName, format, schemaHash } = req.body;

    if (!format) throw new AppError(400, 'Export format is required');

    const record = await logExportService(userId, { projectName, format, schemaHash });

    return res.status(200).json({
      status: 'success',
      message: 'Export event logged',
      data: record,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/export/history
 * Returns the user's export history.
 * Auth: required
 */
export async function getExportHistoryController(req, res, next) {
  try {
    const userId = req.user?.id;
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);

    const history = await getExportHistoryService(userId, limit);

    return res.status(200).json({
      status: 'success',
      data: history,
    });
  } catch (err) {
    next(err);
  }
}
