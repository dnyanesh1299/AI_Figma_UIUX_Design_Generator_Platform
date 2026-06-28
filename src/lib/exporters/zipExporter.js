/**
 * zipExporter.js
 * Bundles all export files (HTML, CSS, README) into a ZIP using JSZip.
 *
 * Folder structure:
 *   {project-name}/
 *     index.html
 *     styles.css
 *     README.md
 *     pages/
 *       analytics.html
 *       transactions.html
 *       ...
 *     assets/
 *       .gitkeep
 */

import JSZip from 'jszip';
import { generateHtmlCssExport } from './htmlCssExporter.js';
import { generateJsonExport } from './jsonExporter.js';

/**
 * @param {object} schema
 * @param {object} options - { projectName }
 * @returns {Promise<{ type: 'download', blob: Blob, filename: string }>}
 */
export async function generateZipExport(schema, options = {}) {
  const projectName =
    options.projectName ||
    schema?.meta?.projectName ||
    'design-export';

  const sanitizedName = projectName
    .replace(/[^a-z0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
    .toLowerCase();

  // Generate all HTML/CSS files
  const htmlResult = await generateHtmlCssExport(schema, { projectName });
  const files = htmlResult.files;

  // Generate JSON schema file
  const jsonResult = await generateJsonExport(schema, { projectName });

  // Build ZIP structure
  const zip = new JSZip();
  const rootFolder = zip.folder(sanitizedName);

  // assets/ folder
  rootFolder.folder('assets').file('.gitkeep', '');

  // Separate index.html, extra pages, and other files
  const indexFile = files.find(f => f.filename === 'index.html');
  const cssFile = files.find(f => f.filename === 'styles.css');
  const readmeFile = files.find(f => f.filename === 'README.md');
  const pageFiles = files.filter(
    f => f.filename !== 'index.html' &&
         f.filename !== 'styles.css' &&
         f.filename !== 'README.md' &&
         f.filename.endsWith('.html')
  );

  // Place root-level files
  if (indexFile) rootFolder.file('index.html', indexFile.content);
  if (cssFile)   rootFolder.file('styles.css', cssFile.content);
  if (readmeFile) rootFolder.file('README.md', readmeFile.content);

  // JSON schema in root
  rootFolder.file(`${sanitizedName}.json`, JSON.stringify(schema, null, 2));

  // Additional pages → pages/ subfolder
  if (pageFiles.length > 0) {
    const pagesFolder = rootFolder.folder('pages');
    pageFiles.forEach(f => pagesFolder.file(f.filename, f.content));
  }

  // Generate the ZIP blob
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return {
    type: 'download',
    blob,
    filename: `${sanitizedName}.zip`,
  };
}
