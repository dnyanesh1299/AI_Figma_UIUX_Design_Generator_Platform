/**
 * ExportCenterPage.jsx
 *
 * Full-featured Export Dashboard for the AI UI/UX Design Platform.
 * Reads the design schema from localStorage (key: "export_schema")
 * and provides a premium UI to export in multiple formats.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PreviewRenderer from '../components/PreviewRenderer';
import ExportFormatCard from '../components/ExportFormatCard';
import ExportProgressModal from '../components/ExportProgressModal';
import { EXPORT_FORMATS, runExport, triggerDownload } from '../lib/exporters/index';

// ─── Helpers ────────────────────────────────────────────────────────────────

const HISTORY_KEY = 'export_history';
const SCHEMA_KEY  = 'export_schema';

function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}

function saveHistory(entry) {
  const history = [entry, ...getHistory()].slice(0, 10);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch {}
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatIcon(formatId) {
  const map = { json: 'fa-code', 'html-css': 'fa-file-code', zip: 'fa-file-zipper', 'svg-figma': 'fa-figma', 'copy-json': 'fa-copy' };
  return map[formatId] || 'fa-arrow-up-from-bracket';
}

function SchemaStat({ label, value, icon, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '4px',
      padding: '14px 16px',
      background: 'rgba(8,13,24,0.5)',
      borderRadius: '12px',
      border: '1px solid rgba(51,65,85,0.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <i className={`fa-solid ${icon}`} style={{ color, fontSize: '11px' }} />
        <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b' }}>{label}</span>
      </div>
      <span style={{ fontSize: '18px', fontWeight: '800', color: '#f1f5f9', fontFamily: 'Outfit, sans-serif' }}>{value}</span>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ExportCenterPage() {
  const navigate = useNavigate();

  const [schema, setSchema] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [devicePreview, setDevicePreview] = useState('desktop');
  const [activePage, setActivePage] = useState(0);
  const [history, setHistory] = useState([]);

  // Modal state
  const [modal, setModal] = useState({
    open: false,
    status: 'running', // 'running' | 'success' | 'error'
    formatLabel: '',
    formatId: '',
    filename: null,
    error: null,
    exportResult: null,
  });

  // Load schema from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SCHEMA_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSchema(parsed);
        setProjectName(parsed?.meta?.projectName || 'Untitled Design');
      }
    } catch (e) {
      console.error('Failed to load export schema:', e);
    }
    setHistory(getHistory());
  }, []);

  const pages = schema?.pages || [];
  const colors = schema?.tokens?.colors || {};
  const totalComponents = pages.reduce((s, p) => s + (p.components?.length || 0), 0);

  // ─── Export Handler ─────────────────────────────────────────────────────

  const handleExport = useCallback(async (formatId) => {
    if (!schema) return;

    const fmt = EXPORT_FORMATS.find(f => f.id === formatId);
    if (!fmt) return;

    // Open modal in running state
    setModal({
      open: true,
      status: 'running',
      formatLabel: fmt.label,
      formatId,
      filename: null,
      error: null,
      exportResult: null,
    });

    try {
      const result = await runExport(formatId, schema, {
        projectName,
        deviceMode: devicePreview,
        pageIndex: activePage,
      });

      if (result.type === 'clipboard') {
        // Clipboard copy success
        setModal(m => ({
          ...m,
          status: 'success',
          filename: null,
          exportResult: result,
        }));
        saveHistory({
          id: Date.now(),
          format: fmt.label,
          formatId,
          project: projectName,
          timestamp: new Date().toISOString(),
        });
        setHistory(getHistory());
        // Auto close after 2s for clipboard
        setTimeout(() => setModal(m => ({ ...m, open: false })), 2000);
      } else if (result.type === 'files') {
        // Files result (HTML+CSS) — trigger individual downloads
        const primaryFile = result.files[0];
        setModal(m => ({
          ...m,
          status: 'success',
          filename: `${result.files.length} files (${result.files.map(f => f.filename).join(', ')})`,
          exportResult: result,
        }));
        saveHistory({
          id: Date.now(),
          format: fmt.label,
          formatId,
          project: projectName,
          timestamp: new Date().toISOString(),
        });
        setHistory(getHistory());
      } else if (result.type === 'download') {
        setModal(m => ({
          ...m,
          status: 'success',
          filename: result.filename,
          exportResult: result,
        }));
        saveHistory({
          id: Date.now(),
          format: fmt.label,
          formatId,
          project: projectName,
          timestamp: new Date().toISOString(),
        });
        setHistory(getHistory());
      }
    } catch (err) {
      console.error('Export failed:', err);
      setModal(m => ({
        ...m,
        status: 'error',
        error: err.message || 'Export failed. Please try again.',
      }));
    }
  }, [schema, projectName, devicePreview, activePage]);

  // ─── Modal: trigger download ────────────────────────────────────────────

  const handleModalDownload = useCallback(() => {
    const result = modal.exportResult;
    if (!result) return;

    if (result.type === 'download') {
      triggerDownload(result.blob, result.filename);
    } else if (result.type === 'files') {
      // Download each file individually
      result.files.forEach((file, i) => {
        setTimeout(() => {
          const blob = new Blob([file.content], { type: file.mimeType || 'text/plain' });
          triggerDownload(blob, file.filename);
        }, i * 200);
      });
    }
    setModal(m => ({ ...m, open: false }));
  }, [modal.exportResult]);

  const handleModalRetry = useCallback(() => {
    const { formatId } = modal;
    setModal(m => ({ ...m, open: false }));
    setTimeout(() => handleExport(formatId), 100);
  }, [modal, handleExport]);

  // ─── Export All (ZIP) ───────────────────────────────────────────────────

  const handleExportAll = useCallback(() => handleExport('zip'), [handleExport]);

  // ─── Empty state ────────────────────────────────────────────────────────

  if (!schema) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 68px)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '24px',
        padding: '40px 24px', textAlign: 'center',
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '20px',
          background: 'rgba(124,58,237,0.12)',
          border: '1px solid rgba(124,58,237,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', color: '#a855f7',
        }}>
          <i className="fa-solid fa-box-archive" />
        </div>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>
            No Design to Export
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '360px', lineHeight: '1.6' }}>
            Generate a design in the Prompt Studio first, then use the Export button to open this center.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: 'white', fontSize: '14px', fontWeight: '700',
              fontFamily: 'inherit', cursor: 'pointer',
            }}
          >
            <i className="fa-solid fa-wand-magic-sparkles" />
            Go to Prompt Studio
          </button>
          <button
            onClick={() => navigate('/projects')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px',
              border: '1px solid rgba(51,65,85,0.6)',
              background: 'none', color: '#94a3b8',
              fontSize: '14px', fontWeight: '600',
              fontFamily: 'inherit', cursor: 'pointer',
            }}
          >
            <i className="fa-solid fa-folder-open" />
            My Projects
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Dashboard ─────────────────────────────────────────────────────

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '32px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      minHeight: 'calc(100vh - 68px)',
    }}>

      {/* ── Header ── */}
      <header style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '10px',
              border: '1px solid rgba(51,65,85,0.5)',
              background: 'none', color: '#64748b',
              fontSize: '12px', fontWeight: '600', fontFamily: 'inherit', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.6)'; e.currentTarget.style.color = '#f8fafc'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#64748b'; }}
          >
            <i className="fa-solid fa-arrow-left" />
            Back
          </button>

          <span style={{
            fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em',
            color: '#a855f7', background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.25)', padding: '4px 12px', borderRadius: '999px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <i className="fa-solid fa-arrow-up-from-bracket" style={{ fontSize: '10px' }} />
            Export Center
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            {/* Editable project name */}
            {editingName ? (
              <input
                autoFocus
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={e => { if (e.key === 'Enter') setEditingName(false); }}
                style={{
                  fontSize: 'clamp(22px,4vw,36px)', fontWeight: '900',
                  fontFamily: 'Outfit, sans-serif', color: '#f8fafc',
                  background: 'rgba(30,41,59,0.5)',
                  border: '2px solid rgba(124,58,237,0.5)',
                  borderRadius: '10px', padding: '4px 12px',
                  outline: 'none',
                  lineHeight: '1.2',
                  letterSpacing: '-0.02em',
                }}
              />
            ) : (
              <h1
                onClick={() => setEditingName(true)}
                title="Click to rename"
                style={{
                  fontSize: 'clamp(22px,4vw,36px)', fontWeight: '900',
                  fontFamily: 'Outfit, sans-serif', color: '#f8fafc',
                  letterSpacing: '-0.02em', lineHeight: '1.2',
                  cursor: 'text', display: 'flex', alignItems: 'center', gap: '10px',
                  margin: 0,
                }}
              >
                {projectName}
                <i className="fa-solid fa-pen" style={{ fontSize: '16px', color: '#475569', transition: 'color 0.2s' }}
                   onMouseOver={e => e.currentTarget.style.color = '#a855f7'}
                   onMouseOut={e => e.currentTarget.style.color = '#475569'} />
              </h1>
            )}
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-tag" style={{ fontSize: '11px' }} />
              {schema?.meta?.projectType || 'Web Design'}
              <span style={{ color: '#334155' }}>·</span>
              <i className="fa-solid fa-palette" style={{ fontSize: '11px' }} />
              {schema?.meta?.theme || 'dark'} theme
            </p>
          </div>

          {/* Export All button */}
          <button
            onClick={handleExportAll}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', borderRadius: '14px', border: 'none',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: 'white', fontSize: '15px', fontWeight: '800',
              fontFamily: 'Outfit, sans-serif', cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(124,58,237,0.4)',
              transition: 'all 0.2s',
              letterSpacing: '-0.01em',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(124,58,237,0.5)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.4)'; }}
          >
            <i className="fa-solid fa-file-zipper" />
            Export All as ZIP
          </button>
        </div>
      </header>

      {/* ── Main 3-column layout ── */}
      <div className="export-center-grid" style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr 300px',
        gap: '24px',
        alignItems: 'start',
      }}>

        {/* ── Left: Project Info ── */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Schema Stats */}
          <div style={{
            background: 'rgba(22,33,50,0.8)',
            border: '1px solid rgba(51,65,85,0.5)',
            borderRadius: '18px',
            padding: '20px',
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            <h3 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-chart-bar" style={{ color: '#a855f7' }} />
              Schema Summary
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <SchemaStat label="Pages" value={pages.length} icon="fa-file" color="#7c3aed" />
              <SchemaStat label="Components" value={totalComponents} icon="fa-cubes" color="#06b6d4" />
            </div>
            <SchemaStat label="Design Theme" value={schema?.meta?.theme || 'dark'} icon="fa-moon" color="#f59e0b" />
          </div>

          {/* Design Tokens */}
          <div style={{
            background: 'rgba(22,33,50,0.8)',
            border: '1px solid rgba(51,65,85,0.5)',
            borderRadius: '18px',
            padding: '20px',
          }}>
            <h3 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-palette" style={{ color: '#a855f7' }} />
              Design Tokens
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              {Object.entries(colors).slice(0, 8).map(([name, val]) => (
                <div
                  key={name}
                  title={`${name}: ${val}`}
                  onClick={() => navigator.clipboard.writeText(val)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: val, border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'transform 0.15s',
                  }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <span style={{ fontSize: '9px', color: '#64748b', textTransform: 'capitalize', textAlign: 'center' }}>
                    {name.replace(/([A-Z])/g, ' $1').trim().split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { label: 'Heading', value: schema?.tokens?.typography?.headingFont || 'Outfit' },
                { label: 'Body', value: schema?.tokens?.typography?.bodyFont || 'Inter' },
              ].map(t => (
                <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#64748b' }}>{t.label} Font</span>
                  <span style={{ color: '#f1f5f9', fontWeight: '600' }}>{t.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Export History */}
          {history.length > 0 && (
            <div style={{
              background: 'rgba(22,33,50,0.8)',
              border: '1px solid rgba(51,65,85,0.5)',
              borderRadius: '18px',
              padding: '20px',
            }}>
              <h3 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-clock-rotate-left" style={{ color: '#a855f7' }} />
                Recent Exports
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {history.slice(0, 5).map(item => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 10px', borderRadius: '10px',
                    background: 'rgba(8,13,24,0.4)',
                    border: '1px solid rgba(51,65,85,0.3)',
                  }}>
                    <i className={`fa-solid ${formatIcon(item.formatId)}`}
                       style={{ fontSize: '12px', color: '#7c3aed', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '11px', fontWeight: '600', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{item.format}</p>
                      <p style={{ fontSize: '10px', color: '#475569', margin: 0 }}>{formatDate(item.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* ── Center: Export Format Cards ── */}
        <main>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 4px', fontFamily: 'Outfit, sans-serif' }}>
              Choose Export Format
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Select a format below or export everything as a ZIP package.
            </p>
          </div>

          <div className="export-format-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}>
            {EXPORT_FORMATS.map(format => (
              <ExportFormatCard
                key={format.id}
                format={format}
                onExport={() => handleExport(format.id)}
                disabled={false}
              />
            ))}
          </div>

          {/* Coming Soon section */}
          <div style={{ marginTop: '24px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#475569', marginBottom: '12px' }}>
              Coming Soon
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { icon: 'fa-react', label: 'React + JSX', color: '#61dafb' },
                { icon: 'fa-wind', label: 'Tailwind CSS', color: '#06b6d4' },
                { icon: 'fa-mobile-screen', label: 'Flutter', color: '#54c5f8' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 14px',
                  background: 'rgba(15,22,36,0.5)',
                  border: '1px dashed rgba(51,65,85,0.5)',
                  borderRadius: '12px',
                  opacity: 0.6,
                }}>
                  <i className={`fa-brands ${item.icon}`} style={{ color: item.color, fontSize: '14px' }} />
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>{item.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '9px', color: '#334155', fontWeight: '700', textTransform: 'uppercase' }}>Soon</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* ── Right: Preview ── */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'rgba(22,33,50,0.8)',
            border: '1px solid rgba(51,65,85,0.5)',
            borderRadius: '18px',
            overflow: 'hidden',
          }}>
            {/* Preview toolbar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid rgba(51,65,85,0.4)',
              background: 'rgba(8,13,24,0.4)',
            }}>
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-eye" style={{ color: '#a855f7' }} />
                Preview
              </span>
              {/* Device toggle */}
              <div style={{ display: 'flex', gap: '3px', background: 'rgba(15,22,36,0.6)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(51,65,85,0.3)' }}>
                {[
                  { mode: 'desktop', icon: 'fa-desktop' },
                  { mode: 'tablet', icon: 'fa-tablet-screen-button' },
                  { mode: 'mobile', icon: 'fa-mobile-screen-button' },
                ].map(({ mode, icon }) => (
                  <button key={mode} onClick={() => setDevicePreview(mode)}
                    style={{
                      width: '26px', height: '26px', border: 'none', cursor: 'pointer',
                      borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontFamily: 'inherit', transition: 'all 0.15s',
                      background: devicePreview === mode ? 'rgba(124,58,237,0.35)' : 'transparent',
                      color: devicePreview === mode ? '#a855f7' : '#475569',
                    }}
                  >
                    <i className={`fa-solid ${icon}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Page tabs */}
            {pages.length > 1 && (
              <div style={{
                display: 'flex', gap: '2px', padding: '8px 12px',
                borderBottom: '1px solid rgba(51,65,85,0.3)',
                overflowX: 'auto',
              }}>
                {pages.map((p, i) => (
                  <button key={p.id} onClick={() => setActivePage(i)} style={{
                    padding: '4px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                    fontSize: '11px', fontWeight: '600', fontFamily: 'inherit', whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                    background: activePage === i ? 'rgba(124,58,237,0.35)' : 'transparent',
                    color: activePage === i ? '#a855f7' : '#64748b',
                  }}>
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            {/* Preview canvas */}
            <div style={{
              padding: '12px',
              maxHeight: '420px',
              overflowY: 'auto',
              overflowX: 'hidden',
              background: colors.background || '#0f172a',
            }}>
              <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', pointerEvents: 'none' }}>
                <PreviewRenderer
                  schema={pages.length > 0
                    ? { ...schema, pages: [pages[activePage] || pages[0]] }
                    : schema}
                  deviceMode={devicePreview}
                />
              </div>
            </div>
          </div>

          {/* Quick action chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 16px', borderRadius: '12px',
                border: '1px solid rgba(51,65,85,0.5)',
                background: 'none', color: '#94a3b8',
                fontSize: '13px', fontWeight: '600', fontFamily: 'inherit', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.6)'; e.currentTarget.style.color = '#f8fafc'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#a855f7' }} />
              Regenerate in Studio
            </button>
            <button
              onClick={() => navigate('/preview')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 16px', borderRadius: '12px',
                border: '1px solid rgba(51,65,85,0.5)',
                background: 'none', color: '#94a3b8',
                fontSize: '13px', fontWeight: '600', fontFamily: 'inherit', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.6)'; e.currentTarget.style.color = '#f8fafc'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              <i className="fa-solid fa-expand" style={{ color: '#06b6d4' }} />
              Open Full Preview
            </button>
          </div>
        </aside>
      </div>

      {/* ── Responsive overrides ── */}
      <style>{`
        @media (max-width: 1100px) {
          .export-center-grid { grid-template-columns: 240px 1fr !important; }
          .export-center-grid > aside:last-child { display: none; }
        }
        @media (max-width: 780px) {
          .export-center-grid { grid-template-columns: 1fr !important; }
          .export-center-grid > aside:first-child { order: 2; }
          .export-format-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .export-format-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Progress Modal ── */}
      <ExportProgressModal
        isOpen={modal.open}
        status={modal.status}
        formatLabel={modal.formatLabel}
        filename={modal.filename}
        error={modal.error}
        onClose={() => setModal(m => ({ ...m, open: false }))}
        onDownload={handleModalDownload}
        onRetry={handleModalRetry}
      />
    </div>
  );
}
