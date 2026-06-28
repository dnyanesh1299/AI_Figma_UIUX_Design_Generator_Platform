/**
 * jsonExporter.js
 * Generates a downloadable JSON blob from the design schema.
 */

/**
 * @param {object} schema    - The full design schema
 * @param {object} options   - { projectName }
 * @returns {Promise<{ type: 'download', blob: Blob, filename: string }>}
 */
export async function generateJsonExport(schema, options = {}) {
  const projectName =
    options.projectName ||
    schema?.meta?.projectName ||
    'design-schema';

  const sanitizedName = projectName
    .replace(/[^a-z0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
    .toLowerCase();

  const json = JSON.stringify(schema, null, 2);
  const blob = new Blob([json], { type: 'application/json' });

  return {
    type: 'download',
    blob,
    filename: `${sanitizedName}.json`,
  };
}
