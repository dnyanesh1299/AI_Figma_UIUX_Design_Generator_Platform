/**
 * exporters/index.js
 *
 * Central registry for all export formats.
 * To add a new format: create an exporter file, import it here,
 * and push an entry into EXPORT_FORMATS. The ExportCenterPage
 * will automatically render it — no other changes needed.
 */

import { generateJsonExport } from './jsonExporter.js';
import { generateHtmlCssExport } from './htmlCssExporter.js';
import { generateZipExport } from './zipExporter.js';
import { generateSVGForPage, copySvgToClipboard } from '../svgExport.js';

/**
 * Export format registry.
 * Each entry defines the format shown in the Export Dashboard.
 */
export const EXPORT_FORMATS = [
  {
    id: 'json',
    label: 'JSON Schema',
    icon: 'fa-code',
    iconColor: '#34d399',
    iconBg: 'rgba(52,211,153,0.12)',
    description: 'Raw design schema in JSON format. Re-importable and version-controllable.',
    fileCount: '1 file',
    extension: '.json',
    badge: null,
    generate: generateJsonExport,
  },
  {
    id: 'html-css',
    label: 'HTML + CSS',
    icon: 'fa-file-code',
    iconColor: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.12)',
    description: 'Production-ready static website with semantic HTML5 and responsive CSS.',
    fileCount: 'Per page + stylesheet',
    extension: '.html / .css',
    badge: 'Recommended',
    generate: generateHtmlCssExport,
  },
  {
    id: 'zip',
    label: 'ZIP Package',
    icon: 'fa-file-zipper',
    iconColor: '#7c3aed',
    iconBg: 'rgba(124,58,237,0.12)',
    description: 'Complete project folder with all HTML, CSS, and assets bundled for download.',
    fileCount: 'Full folder',
    extension: '.zip',
    badge: 'Complete',
    generate: generateZipExport,
  },
  {
    id: 'svg-figma',
    label: 'SVG (Figma)',
    icon: 'fa-figma',
    iconColor: '#a855f7',
    iconBg: 'rgba(168,85,247,0.12)',
    description: 'Vector SVG for direct paste into Figma. Preserves layout and design tokens.',
    fileCount: 'Per page',
    extension: '.svg',
    badge: null,
    generate: async (schema, options) => {
      const pages = schema?.pages || [];
      const page = pages[options?.pageIndex ?? 0];
      if (!page) throw new Error('No page found in schema');
      const svgString = generateSVGForPage(page, schema, options?.deviceMode || 'desktop');
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      return {
        type: 'download',
        blob,
        filename: `${options?.projectName || 'design'}-${page.id || 'page'}.svg`,
      };
    },
  },
  {
    id: 'copy-json',
    label: 'Copy JSON',
    icon: 'fa-copy',
    iconColor: '#06b6d4',
    iconBg: 'rgba(6,182,212,0.12)',
    description: 'Copy the full design JSON to clipboard for sharing or importing elsewhere.',
    fileCount: 'Clipboard',
    extension: null,
    badge: null,
    generate: async (schema) => {
      const json = JSON.stringify(schema, null, 2);
      await navigator.clipboard.writeText(json);
      return { type: 'clipboard' };
    },
  },
];

/**
 * Get a registered exporter by its id.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getExporter(id) {
  return EXPORT_FORMATS.find((f) => f.id === id);
}

/**
 * Run an export by format id.
 * @param {string} formatId - One of the registered format ids
 * @param {object} schema   - The design schema object
 * @param {object} options  - { projectName, deviceMode, pageIndex }
 * @returns {Promise<{ type: 'download'|'clipboard', blob?: Blob, filename?: string }>}
 */
export async function runExport(formatId, schema, options = {}) {
  const exporter = getExporter(formatId);
  if (!exporter) throw new Error(`Unknown export format: ${formatId}`);
  return exporter.generate(schema, options);
}

/**
 * Trigger a browser file download from a Blob.
 * @param {Blob} blob
 * @param {string} filename
 */
export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
