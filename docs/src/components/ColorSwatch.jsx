import React, { useEffect, useState } from 'react';

/**
 * ColorSwatch
 * Renders a labeled grid of color swatches from an array of CSS variable names.
 *
 * Props:
 *   vars   — string[]  e.g. ['--sand-1', '--sand-2', ...]
 *   title  — string    optional section heading
 */
function SingleSwatch({ varName }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const computed = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    setValue(computed);
  }, [varName]);

  return (
    <div
      title={`${varName}: ${value}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        minWidth: '72px',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          background: `var(${varName})`,
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          flexShrink: 0,
        }}
      />
      <div
        style={{
          textAlign: 'center',
          lineHeight: '1.3',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--fg-muted)',
            wordBreak: 'break-all',
          }}
        >
          {varName}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--fg-subtle)',
            marginTop: '1px',
          }}
        >
          {value || '—'}
        </div>
      </div>
    </div>
  );
}

export default function ColorSwatch({ vars = [], title }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      {title && (
        <h4
          style={{
            marginBottom: '16px',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--fg-muted)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--ls-wider)',
          }}
        >
          {title}
        </h4>
      )}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '20px',
          background: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
        }}
      >
        {vars.map((v) => (
          <SingleSwatch key={v} varName={v} />
        ))}
      </div>
    </div>
  );
}
