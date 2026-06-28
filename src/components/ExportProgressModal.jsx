/**
 * ExportProgressModal.jsx
 * Full-screen progress modal shown during export operations.
 * Shows animated steps → success with download, or error with retry.
 */

import { useEffect, useState } from 'react';

const STEPS = [
  { label: 'Reading schema', icon: 'fa-brain', duration: 400 },
  { label: 'Generating files', icon: 'fa-file-code', duration: 600 },
  { label: 'Packaging output', icon: 'fa-box-archive', duration: 400 },
  { label: 'Finalizing', icon: 'fa-circle-check', duration: 300 },
];

export default function ExportProgressModal({
  isOpen,
  status,          // 'running' | 'success' | 'error'
  formatLabel,
  filename,
  error,
  onClose,
  onDownload,
  onRetry,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Animate steps while running
  useEffect(() => {
    if (!isOpen || status !== 'running') return;
    setCurrentStep(0);
    setProgress(0);

    let step = 0;
    let totalElapsed = 0;
    const totalDuration = STEPS.reduce((s, st) => s + st.duration, 0);

    const animate = () => {
      if (step >= STEPS.length) return;
      setTimeout(() => {
        step += 1;
        totalElapsed += STEPS[step - 1]?.duration || 0;
        setCurrentStep(step);
        setProgress(Math.round((totalElapsed / totalDuration) * 100));
        animate();
      }, STEPS[step]?.duration || 400);
    };

    animate();
  }, [isOpen, status]);

  // Full progress on success
  useEffect(() => {
    if (status === 'success') {
      setCurrentStep(STEPS.length);
      setProgress(100);
    }
  }, [status]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Export progress"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(8,13,24,0.85)',
        backdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget && status !== 'running') onClose(); }}
    >
      <div style={{
        background: 'rgba(22,33,50,0.98)',
        border: '1px solid rgba(51,65,85,0.7)',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        animation: 'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}>

        {/* Close button (only when not running) */}
        {status !== 'running' && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', fontSize: '20px',
              transition: 'color 0.15s',
            }}
            onMouseOver={e => e.currentTarget.style.color = '#f8fafc'}
            onMouseOut={e => e.currentTarget.style.color = '#64748b'}
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}

        {/* Status Icon */}
        <div style={{
          width: '72px', height: '72px',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px',
          background: status === 'success'
            ? 'rgba(16,185,129,0.15)'
            : status === 'error'
              ? 'rgba(239,68,68,0.15)'
              : 'rgba(124,58,237,0.15)',
          color: status === 'success'
            ? '#34d399'
            : status === 'error'
              ? '#f87171'
              : '#a855f7',
          border: `2px solid ${status === 'success'
            ? 'rgba(16,185,129,0.3)'
            : status === 'error'
              ? 'rgba(239,68,68,0.3)'
              : 'rgba(124,58,237,0.3)'}`,
          transition: 'all 0.3s ease',
          animation: status === 'running' ? 'pulse-glow 1.5s ease-in-out infinite' : 'none',
        }}>
          <i className={`fa-solid ${
            status === 'success' ? 'fa-circle-check'
            : status === 'error' ? 'fa-triangle-exclamation'
            : 'fa-box-archive fa-spin'
          }`} style={{ animationDuration: status === 'running' ? '1.5s' : '0s' }} />
        </div>

        {/* Title + subtitle */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{
            fontSize: '20px', fontWeight: '800',
            fontFamily: 'Outfit, sans-serif', color: '#f8fafc',
            marginBottom: '8px',
          }}>
            {status === 'success'
              ? 'Export Complete!'
              : status === 'error'
                ? 'Export Failed'
                : `Exporting ${formatLabel}…`}
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
            {status === 'success'
              ? `Your file ${filename ? `"${filename}"` : ''} is ready to download.`
              : status === 'error'
                ? (error || 'Something went wrong. Please try again.')
                : 'Please wait while we generate your export files.'}
          </p>
        </div>

        {/* Progress bar */}
        {status === 'running' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              width: '100%', height: '6px',
              background: 'rgba(51,65,85,0.6)',
              borderRadius: '999px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
                borderRadius: '999px',
                transition: 'width 0.4s ease',
                boxShadow: '0 0 10px rgba(124,58,237,0.5)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Step {Math.min(currentStep + 1, STEPS.length)} of {STEPS.length}
              </span>
              <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '700' }}>
                {progress}%
              </span>
            </div>
          </div>
        )}

        {/* Steps list */}
        {status === 'running' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {STEPS.map((step, i) => {
              const done = i < currentStep;
              const active = i === currentStep;
              return (
                <div
                  key={step.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    background: active
                      ? 'rgba(124,58,237,0.12)'
                      : done
                        ? 'rgba(16,185,129,0.06)'
                        : 'transparent',
                    border: `1px solid ${active
                      ? 'rgba(124,58,237,0.25)'
                      : done
                        ? 'rgba(16,185,129,0.15)'
                        : 'rgba(51,65,85,0.3)'}`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px',
                    background: done
                      ? 'rgba(16,185,129,0.2)'
                      : active
                        ? 'rgba(124,58,237,0.2)'
                        : 'rgba(30,41,59,0.6)',
                    color: done ? '#34d399' : active ? '#a855f7' : '#475569',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                  }}>
                    <i className={`fa-solid ${done ? 'fa-check' : active ? step.icon + ' fa-spin' : step.icon}`}
                       style={{ animationDuration: active ? '1.2s' : '0s' }} />
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: active ? '600' : '400',
                    color: done ? '#34d399' : active ? '#f1f5f9' : '#64748b',
                    transition: 'all 0.3s ease',
                  }}>
                    {step.label}
                  </span>
                  {done && (
                    <i className="fa-solid fa-check" style={{ marginLeft: 'auto', fontSize: '11px', color: '#34d399' }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Success actions */}
        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <button
              onClick={onDownload}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '14px 24px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: 'white', fontSize: '14px', fontWeight: '700',
                fontFamily: 'inherit', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(124,58,237,0.5)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.4)'; }}
            >
              <i className="fa-solid fa-arrow-down-to-bracket" />
              Download File
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '12px', borderRadius: '12px',
                border: '1px solid rgba(51,65,85,0.6)',
                background: 'none', color: '#94a3b8',
                fontSize: '13px', fontWeight: '600',
                fontFamily: 'inherit', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.6)'; e.currentTarget.style.color = '#f8fafc'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              Done
            </button>
          </div>
        )}

        {/* Error actions */}
        {status === 'error' && (
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button
              onClick={onRetry}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px', borderRadius: '12px', border: 'none',
                background: 'rgba(124,58,237,0.2)', color: '#a855f7',
                fontSize: '13px', fontWeight: '700',
                fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.3)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.2)'; }}
            >
              <i className="fa-solid fa-arrow-rotate-right" />
              Retry
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '12px', borderRadius: '12px',
                border: '1px solid rgba(51,65,85,0.6)',
                background: 'none', color: '#94a3b8',
                fontSize: '13px', fontWeight: '600',
                fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.6)'; e.currentTarget.style.color = '#f8fafc'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Clipboard success */}
        {status === 'success' && filename === null && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 20px', borderRadius: '12px',
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.2)',
          }}>
            <i className="fa-solid fa-clipboard-check" style={{ color: '#34d399' }} />
            <span style={{ fontSize: '13px', color: '#34d399', fontWeight: '600' }}>
              Copied to clipboard!
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(124,58,237,0); }
        }
      `}</style>
    </div>
  );
}
