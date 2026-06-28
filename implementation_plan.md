# Export & Code Generation System — Implementation Plan

## Background

The platform already has:
- **AI design generation** (`POST /api/generate-design`) → produces a structured JSON schema
- **SVG export** (`svgExport.js`) for Figma copy-paste
- **FigmaExportModal** component with SVG rendering
- **PreviewPage** with a basic JSON download + clipboard copy panel
- **PromptStudioPage** with a Save (JSON download) and Figma export button
- **PreviewRenderer** that renders the JSON schema as live CSS-grid UI

What's missing is a **complete Export Center**: HTML/CSS code generation, ZIP packaging, project naming, a dedicated Export Dashboard page, progress states, and the server-side export API.

---

## User Review Required

> [!IMPORTANT]
> **ZIP generation approach**: Since the server already uses Express (no file-system temp-file requirement), ZIP bundling will happen **entirely on the frontend** using `JSZip` (a pure-JS library installed via npm). No new server dependency is strictly required for export. The server will only be extended with new export endpoints if you want server-side ZIP generation (e.g., for large projects). The plan defaults to frontend-only for speed.

> [!IMPORTANT]
> **Database changes**: The plan adds an `Export` Prisma model to log export history per user. This requires a migration. If you want to skip DB changes for now, export history can be stored in localStorage only — please confirm preference.

> [!WARNING]
> **No React/Next.js/Flutter export yet**: The modular exporter architecture will make these easy to add later, but only HTML/CSS and JSON export are implemented in this plan. The export format registry is designed to be extended with one new file per format.

---

## Open Questions

> [!IMPORTANT]
> 1. **Export history persistence** — Store in DB (requires migration) or localStorage only?
> 2. **ZIP generation** — Frontend JSZip (zero server changes) or Express `archiver` package (server-side)?
> 3. **Export Center route** — Should `/export` be a protected route (auth required) or public?

---

## Architecture Overview

```
src/
  pages/
    ExportCenterPage.jsx        ← NEW: dedicated export dashboard
  components/
    ExportFormatCard.jsx        ← NEW: format selection card with icon/desc
    ExportProgressModal.jsx     ← NEW: progress + success/error states
  lib/
    exporters/
      index.js                  ← NEW: format registry + dispatcher
      jsonExporter.js           ← NEW: JSON file builder
      htmlCssExporter.js        ← NEW: HTML+CSS code generator (from schema)
      zipExporter.js            ← NEW: ZIP bundler using JSZip

server/src/
  controllers/
    export.controller.js        ← NEW: handles export API calls
  routes/
    export.routes.js            ← NEW: /api/export/* routes
  services/
    export.service.js           ← NEW: server-side export orchestration
  prisma/
    schema.prisma               ← MODIFY: add Export model
```

---

## Proposed Changes

### Frontend — Export Library

#### [NEW] `src/lib/exporters/index.js`
Central registry for all export formats. Each format is a named exporter object with `{ id, label, icon, description, generate(schema, options) }`. New formats (React, Tailwind, Flutter) are added here without touching any other file.

#### [NEW] `src/lib/exporters/jsonExporter.js`
Generates a clean, formatted JSON file blob from the design schema. Supports custom file naming.

#### [NEW] `src/lib/exporters/htmlCssExporter.js`
**Core feature.** Converts the design JSON schema into production-ready HTML + CSS:
- Generates `index.html` with semantic structure, Google Fonts imports, FontAwesome CDN
- Generates `styles.css` with CSS custom properties from design tokens, responsive grid layout, component styles
- Generates one `page-{name}.html` per page in the schema
- Uses the same layout algorithm as `svgExport.js` (12-col grid, responsive breakpoints)
- Outputs clean, human-readable, maintainable code with comments

#### [NEW] `src/lib/exporters/zipExporter.js`
Bundles all export files into a ZIP using `JSZip`. Creates the folder structure:
```
{project-name}/
  index.html
  styles.css
  assets/
    README.md
  pages/
    dashboard.html
    analytics.html
    ...
```

---

### Frontend — UI Components

#### [NEW] `src/components/ExportFormatCard.jsx`
A premium card component for each export format:
- Format icon (large, colorful)
- Format name and description
- File count / size estimate
- One-click "Export" button
- Hover animation and selection state

#### [NEW] `src/components/ExportProgressModal.jsx`
Full-screen modal overlay showing:
- Animated progress steps (Preparing → Generating → Packaging → Done)
- Success state with download button and confetti micro-animation
- Error state with retry button
- Project name input before export begins

---

### Frontend — Export Center Page

#### [NEW] `src/pages/ExportCenterPage.jsx`
A dedicated, full-featured Export Dashboard:

**Layout:**
- Left sidebar: project info card + schema summary stats
- Center: export format grid (4 cards per row on desktop)
- Right: project preview thumbnail (using `PreviewRenderer` in read-only mode)

**Export Format Cards:**
| Format | Icon | Description |
|--------|------|-------------|
| JSON Schema | `fa-code` | Raw design schema, re-importable |
| HTML + CSS | `fa-file-code` | Static website, production-ready |
| ZIP Package | `fa-file-zipper` | All files bundled for download |
| SVG (Figma) | `fa-figma` | Vector export for Figma paste |
| Copy JSON | `fa-copy` | One-click clipboard copy |

**UX Details:**
- Project name input at top (pre-filled from schema `meta.projectName`)
- "Export All" button generates ZIP with everything
- Per-format download buttons with individual progress indicators
- Export history log (last 5 exports, stored in localStorage)
- Dark/light mode support via existing CSS variables
- Fully mobile responsive

---

### Frontend — App Integration

#### [MODIFY] `src/App.jsx`
Add the new route:
```jsx
<Route path="export" element={<ProtectedRoute><ExportCenterPage /></ProtectedRoute>} />
```

#### [MODIFY] `src/pages/PromptStudioPage.jsx`
- Replace the existing "Save" button with an **"Export Center"** button that navigates to `/export` with the current schema passed via `localStorage` (key: `export_schema`)
- Keep the quick JSON copy/download as-is

#### [MODIFY] `src/pages/PreviewPage.jsx`
- Add an **"Open Export Center"** button in the export panel alongside existing download/copy buttons
- Pass current schema to localStorage before navigating

#### [MODIFY] `src/components/Navbar.jsx`
- Add "Export" nav item with `fa-arrow-up-from-bracket` icon (next to Projects)

---

### Backend — Export API

#### [NEW] `server/src/controllers/export.controller.js`
Three endpoints:
- `POST /api/export/json` — Returns the schema as a JSON attachment
- `POST /api/export/html` — Returns generated HTML/CSS as JSON payload (files array)
- `POST /api/export/log` — Logs an export event to DB (auth required)

#### [NEW] `server/src/routes/export.routes.js`
```js
router.post('/json', exportJsonController);
router.post('/html', exportHtmlController);
router.post('/log', requireAuth, logExportController);
```

#### [NEW] `server/src/services/export.service.js`
Server-side HTML/CSS generation (mirrors the frontend exporter, for API-based export). Also handles export log CRUD.

#### [MODIFY] `server/src/routes/index.js`
Register: `router.use('/export', exportRoutes);`

---

### Database

#### [MODIFY] `server/prisma/schema.prisma`
Add `Export` model:
```prisma
model Export {
  id          String   @id @default(uuid()) @db.Uuid
  userId      String   @map("user_id") @db.Uuid
  projectName String   @map("project_name")
  format      String   // "json" | "html" | "zip" | "svg"
  schemaHash  String?  @map("schema_hash")  // for dedup
  createdAt   DateTime @default(now()) @map("created_at")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([createdAt])
  @@map("exports")
}
```
Also add `exports Export[]` relation to `User` model.

---

## JSON Schema Design

The existing schema structure is well-designed. The HTML/CSS exporter will consume:
```json
{
  "meta": { "projectName", "projectType", "theme" },
  "tokens": {
    "colors": { "primary", "secondary", "accent", "background", "surface", "border", "text", "textMuted" },
    "typography": { "headingFont", "bodyFont" }
  },
  "pages": [
    {
      "id", "name", "path",
      "layout": { "type", "columns", "gap", "background" },
      "components": [
        { "id", "type", "label", "position": { "x", "y", "w", "h" }, "styles", "properties", "responsive" }
      ]
    }
  ]
}
```
No schema changes are needed — the exporter reads this as-is.

---

## Verification Plan

### Automated
- Manual end-to-end: generate design → open export center → download each format → verify files open correctly in browser

### Manual Verification
1. Generate a design in Prompt Studio → click Export Center → verify schema appears
2. Download JSON → open file, confirm valid JSON with correct schema structure
3. Export HTML+CSS → open `index.html` in browser, verify it renders with correct fonts/colors
4. Export ZIP → unzip, open folder, verify file structure matches spec
5. Test on mobile viewport (375px) — verify Export Center is fully responsive
6. Verify dark/light mode styling works via existing CSS variables

---

## Scalability — Future Export Formats

To add a new export format (e.g. React + Tailwind):
1. Create `src/lib/exporters/reactTailwindExporter.js` with a `generate(schema)` function
2. Register it in `src/lib/exporters/index.js` with `{ id: 'react-tailwind', label: 'React + Tailwind', ... }`
3. The ExportCenterPage and format cards automatically pick it up — no other changes needed

This modular registry pattern means the core export system never needs modification for new formats.

---

## Implementation Order

1. `JSZip` npm install (frontend)
2. `src/lib/exporters/` — all 4 exporter files
3. `src/components/ExportFormatCard.jsx`
4. `src/components/ExportProgressModal.jsx`
5. `src/pages/ExportCenterPage.jsx`
6. Update `App.jsx` routing
7. Integrate "Export Center" button in `PromptStudioPage` and `PreviewPage`
8. Update `Navbar.jsx`
9. Server: `export.controller.js` + `export.routes.js` + `export.service.js`
10. Prisma schema update + migration command
