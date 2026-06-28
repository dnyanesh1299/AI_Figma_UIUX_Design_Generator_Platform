/**
 * export.service.js
 *
 * Server-side export orchestration.
 * Handles generating export file content from a design schema
 * and logging export events.
 */

import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors.js';

const prisma = new PrismaClient();

/**
 * Generate a JSON export payload.
 * @param {object} schema - The design schema
 * @param {string} projectName - Override project name
 * @returns {{ filename: string, content: string, contentType: string }}
 */
export function generateJsonExportService(schema, projectName) {
  if (!schema || typeof schema !== 'object') {
    throw new AppError(400, 'Invalid schema provided');
  }

  const name = (projectName || schema?.meta?.projectName || 'design-schema')
    .replace(/[^a-z0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
    .toLowerCase();

  return {
    filename: `${name}.json`,
    content: JSON.stringify(schema, null, 2),
    contentType: 'application/json',
  };
}

/**
 * Generate an HTML summary export (returns file list as JSON).
 * Full HTML generation happens on the frontend via htmlCssExporter.js.
 * This endpoint returns metadata about what will be generated.
 *
 * @param {object} schema
 * @returns {{ pages: number, components: number, files: string[] }}
 */
export function generateHtmlMetadataService(schema) {
  if (!schema || typeof schema !== 'object') {
    throw new AppError(400, 'Invalid schema provided');
  }

  const pages = schema?.pages || [];
  const totalComponents = pages.reduce((s, p) => s + (p.components?.length || 0), 0);

  const files = [
    'styles.css',
    'index.html',
    ...pages.slice(1).map((p, i) => `${(p.id || `page-${i + 1}`).replace(/\s+/g, '-').toLowerCase()}.html`),
    'README.md',
  ];

  return {
    projectName: schema?.meta?.projectName || 'design-export',
    pages: pages.length,
    components: totalComponents,
    theme: schema?.meta?.theme || 'dark',
    files,
    estimatedSize: `~${Math.max(10, Math.round(files.length * 8))}KB`,
  };
}

/**
 * Log an export event for a user.
 * @param {string} userId
 * @param {{ projectName: string, format: string, schemaHash?: string }} data
 */
export async function logExportService(userId, data) {
  if (!userId) throw new AppError(401, 'User ID is required');
  if (!data.format) throw new AppError(400, 'Export format is required');

  try {
    // Check if Export model exists in schema before inserting
    const record = await prisma.export.create({
      data: {
        userId,
        projectName: data.projectName || 'Untitled',
        format: data.format,
        schemaHash: data.schemaHash || null,
      },
    });
    return record;
  } catch (err) {
    // If table doesn't exist yet (migration not run), just return null gracefully
    if (err.code === 'P2021' || err.message?.includes('does not exist')) {
      console.warn('[ExportService] Export table not found — run prisma migrate to enable logging.');
      return null;
    }
    throw err;
  }
}

/**
 * Get export history for a user.
 * @param {string} userId
 * @param {number} limit
 */
export async function getExportHistoryService(userId, limit = 20) {
  if (!userId) throw new AppError(401, 'User ID is required');
  try {
    return await prisma.export.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { id: true, projectName: true, format: true, createdAt: true },
    });
  } catch (err) {
    if (err.code === 'P2021' || err.message?.includes('does not exist')) {
      return [];
    }
    throw err;
  }
}
