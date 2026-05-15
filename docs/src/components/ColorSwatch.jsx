import React, { useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

function useVar(name) {
  const [value, setValue] = useState('');
  useEffect(() => {
    if (typeof document === 'undefined') return;
    setValue(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
  }, [name]);
  return value;
}

// ---------------------------------------------------------------------------
// ScaleRow — horizontal 12-step band for palette display
// ---------------------------------------------------------------------------

function ScaleStep({ scale, step }) {
  const varName = `--${scale}-${step}`;
  const value = useVar(varName);
  return (
    <div
      title={`${varName}\n${value}`}
      style={{
        flex: '1 1 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <div
        style={{
          width: '100%',
          height: 36,
          background: `var(${varName})`,
          borderRadius:
            step === 1 ? '5px 0 0 5px' : step === 12 ? '0 5px 5px 0' : 0,
        }}
      />
      <span
        style={{
          fontSize: 9,
          color: 'var(--fg-subtle, #999)',
          fontFamily: 'var(--font-mono, monospace)',
          lineHeight: 1,
        }}
      >
        {step}
      </span>
    </div>
  );
}

function ScaleRow({ scale, label }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 4,
      }}
    >
      <div
        style={{
          width: 72,
          flexShrink: 0,
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--fg-muted, #888)',
          fontFamily: 'var(--font-mono, monospace)',
          textAlign: 'right',
          lineHeight: 1.2,
        }}
      >
        {label || scale}
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          borderRadius: 6,
          overflow: 'hidden',
          border: '1px solid var(--border-subtle, rgba(128,128,128,0.15))',
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((step) => (
          <ScaleStep key={step} scale={scale} step={step} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single swatch — used in semantic / spot color display
// ---------------------------------------------------------------------------

function SingleSwatch({ varName, description }) {
  const value = useVar(varName);
  return (
    <div
      title={`${varName}: ${value}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        minWidth: 72,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          background: `var(${varName})`,
          border: '1px solid var(--border-subtle, rgba(128,128,128,0.2))',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          flexShrink: 0,
        }}
      />
      <div style={{ textAlign: 'center', lineHeight: 1.3 }}>
        <div
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 11,
            color: 'var(--fg-muted, #888)',
            wordBreak: 'break-all',
          }}
        >
          {varName}
        </div>
        {description && (
          <div style={{ fontSize: 10, color: 'var(--fg-subtle, #999)', marginTop: 2 }}>
            {description}
          </div>
        )}
        <div
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 10,
            color: 'var(--fg-subtle, #999)',
            marginTop: 1,
          }}
        >
          {value || '—'}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

/**
 * ColorSwatch — versatile color display component for Docusaurus MDX.
 *
 * Modes:
 *   1. Scale row (horizontal band):   <ColorSwatch scale="blue" />
 *   2. Multiple scale rows:           <ColorSwatch scales={[['blue','blue'],['sand','sand ↗']]} />
 *   3. Spot swatches (legacy/semantic): <ColorSwatch vars={['--accent','--accent-hover']} />
 *
 * Props:
 *   scale   string          — single Radix scale name (e.g. "blue")
 *   scales  [name, label][] — array of [scale, label] pairs
 *   vars    string[]        — array of CSS var names (spot swatch mode)
 *   title   string          — optional section heading
 */
export default function ColorSwatch({ scale, scales, vars, title }) {
  const containerStyle = {
    marginBottom: 32,
    padding: '20px 20px 16px',
    background: 'var(--bg-surface, #1c1c19)',
    borderRadius: 12,
    border: '1px solid var(--border, rgba(128,128,128,0.2))',
  };

  const eyebrowStyle = {
    marginBottom: 14,
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--fg-muted, #888)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  };

  // ── Mode 1: multiple scale rows ──────────────────────────────────────────
  if (scales) {
    return (
      <div style={containerStyle}>
        {title && <div style={eyebrowStyle}>{title}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {scales.map(([s, l]) => (
            <ScaleRow key={s} scale={s} label={l} />
          ))}
        </div>
      </div>
    );
  }

  // ── Mode 2: single scale row ─────────────────────────────────────────────
  if (scale) {
    return (
      <div style={containerStyle}>
        {title && <div style={eyebrowStyle}>{title}</div>}
        <ScaleRow scale={scale} label={scale} />
      </div>
    );
  }

  // ── Mode 3: spot swatches (original vars[] API) ──────────────────────────
  if (vars) {
    return (
      <div style={containerStyle}>
        {title && <div style={eyebrowStyle}>{title}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {vars.map((v) => (
            <SingleSwatch key={v} varName={v} />
          ))}
        </div>
      </div>
    );
  }

  return null;
}
