import React, { useState } from 'react';

/**
 * LiveDemo
 * Renders actual Davinci HTML+CSS directly on the doc page (no iframe).
 * Since custom.css already imports davinci.css, all .btn, .panel, .pill, etc. classes
 * work natively inside the preview container.
 *
 * Props:
 *   html    — string  Raw HTML snippet using Davinci classes
 *   title   — string  Label shown in the preview header bar
 *   height  — number  Minimum height in px for the preview area
 *   pad     — string  CSS padding for the preview area (default '24px')
 *   center  — bool    Center preview content (default false)
 */
export default function LiveDemo({ html, title, height, pad = '24px', center = false }) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div
      style={{
        marginBottom: '24px',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px 6px 14px',
          background: 'var(--bg-subtle)',
          borderBottom: '1px solid var(--border)',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--success)',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              color: 'var(--fg-subtle)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {title || 'Preview'}
          </span>
        </div>
        <button
          onClick={() => setShowCode((v) => !v)}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '2px 9px',
            fontSize: '11px',
            color: 'var(--fg-muted)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            lineHeight: '1.6',
            transition: 'background 120ms, color 120ms',
          }}
        >
          {showCode ? 'Hide code' : 'View code'}
        </button>
      </div>

      {/* Live preview */}
      <div
        className="live-demo-preview"
        style={{
          padding: pad,
          background: 'var(--bg)',
          minHeight: height ? `${height}px` : undefined,
          display: center ? 'flex' : undefined,
          alignItems: center ? 'center' : undefined,
          justifyContent: center ? 'center' : undefined,
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Code block */}
      {showCode && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <pre
            style={{
              margin: 0,
              padding: '16px 20px',
              background: 'var(--bg-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--fg-muted)',
              overflowX: 'auto',
              lineHeight: '1.7',
              whiteSpace: 'pre',
            }}
          >
            <code>{html.replace(/^\n/, '').replace(/\n$/, '')}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
