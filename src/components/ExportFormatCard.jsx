/**
 * ExportFormatCard.jsx
 * Premium card component for each export format in the Export Dashboard.
 */

import { useState } from 'react';

export default function ExportFormatCard({
  format,
  onExport,
  isExporting = false,
  disabled = false,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? 'rgba(30,41,59,0.95)'
          : 'rgba(22,33,50,0.8)',
        border: `1px solid ${hovered ? 'rgba(124,58,237,0.4)' : 'rgba(51,65,85,0.6)'}`,
        borderRadius: '18px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'all 0.25s ease',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered
          ? '0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.2)'
          : '0 4px 16px rgba(0,0,0,0.2)',
      }}
    >
      {/* Glow effect */}
      {hovered && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.6), rgba(168,85,247,0.6), transparent)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Badge */}
      {format.badge && (
        <span style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          fontSize: '10px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          padding: '3px 10px',
          borderRadius: '999px',
          background: format.badge === 'Recommended'
            ? 'rgba(16,185,129,0.2)'
            : 'rgba(124,58,237,0.2)',
          color: format.badge === 'Recommended' ? '#34d399' : '#a855f7',
          border: `1px solid ${format.badge === 'Recommended' ? 'rgba(16,185,129,0.3)' : 'rgba(124,58,237,0.3)'}`,
        }}>
          {format.badge}
        </span>
      )}

      {/* Icon */}
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '14px',
        background: format.iconBg,
        border: `1px solid ${format.iconColor}33`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        color: format.iconColor,
        transition: 'transform 0.2s',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
      }}>
        <i className={`fa-solid ${format.icon}`} />
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#f8fafc',
          marginBottom: '6px',
          fontFamily: 'Outfit, sans-serif',
        }}>
          {format.label}
        </h3>
        <p style={{
          fontSize: '13px',
          color: '#94a3b8',
          lineHeight: '1.6',
          margin: 0,
        }}>
          {format.description}
        </p>
      </div>

      {/* Meta info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '12px',
        borderTop: '1px solid rgba(51,65,85,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i className="fa-solid fa-file" style={{ fontSize: '11px', color: '#475569' }} />
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
            {format.fileCount}
          </span>
          {format.extension && (
            <>
              <span style={{ color: '#334155' }}>·</span>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                color: format.iconColor,
                fontFamily: 'monospace',
              }}>
                {format.extension}
              </span>
            </>
          )}
        </div>

        <button
          onClick={onExport}
          disabled={isExporting || disabled}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            cursor: isExporting || disabled ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontWeight: '700',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
            background: isExporting
              ? 'rgba(124,58,237,0.2)'
              : hovered
                ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                : 'rgba(124,58,237,0.15)',
            color: isExporting ? '#a855f7' : hovered ? 'white' : '#a855f7',
            opacity: disabled ? 0.5 : 1,
            boxShadow: hovered && !isExporting
              ? '0 4px 16px rgba(124,58,237,0.35)'
              : 'none',
          }}
        >
          {isExporting ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '11px' }} />
              Generating…
            </>
          ) : (
            <>
              <i className="fa-solid fa-arrow-down-to-bracket" style={{ fontSize: '11px' }} />
              Export
            </>
          )}
        </button>
      </div>
    </div>
  );
}
