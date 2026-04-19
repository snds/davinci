import React from 'react';

export default {
  title: 'Foundations/Typography',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

const typeScale = [
  { name: '--text-2xs', size: '11px' },
  { name: '--text-xs',  size: '12px' },
  { name: '--text-sm',  size: '13px' },
  { name: '--text-md',  size: '14px' },
  { name: '--text-base',size: '15px' },
  { name: '--text-lg',  size: '17px' },
  { name: '--text-xl',  size: '20px' },
  { name: '--text-2xl', size: '24px' },
  { name: '--text-3xl', size: '30px' },
  { name: '--text-4xl', size: '38px' },
  { name: '--text-5xl', size: '48px' },
  { name: '--text-6xl', size: '60px' },
  { name: '--text-7xl', size: '76px' },
];

export const TypeSpecimens = {
  name: 'Type Specimens',
  render: () => (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ marginBottom: 32 }}>Typography</h2>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 24 }}>Headings</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--fg-subtle)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>h1 / .h1 — 48px heavy</div>
            <h1>The quick brown fox</h1>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--fg-subtle)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>h2 / .h2 — 30px bold</div>
            <h2>The quick brown fox jumps</h2>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--fg-subtle)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>h3 / .h3 — 20px semibold</div>
            <h3>The quick brown fox jumps over the lazy dog</h3>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--fg-subtle)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>h4 / .h4 — 17px semibold</div>
            <h4>The quick brown fox jumps over the lazy dog</h4>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 24 }}>Body & Utility</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--fg-subtle)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>.eyebrow</div>
            <span className="eyebrow">Eyebrow label text</span>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--fg-subtle)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>.body-lg — 17px</div>
            <p className="body-lg">The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.</p>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--fg-subtle)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>.body / p — 15px</div>
            <p className="body">The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!</p>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--fg-subtle)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>.body-sm — 13px muted</div>
            <p className="body-sm">The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.</p>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--fg-subtle)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>.caption — 12px muted</div>
            <span className="caption">Caption text for secondary information</span>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--fg-subtle)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>code</div>
            <code>const tokens = getDesignTokens();</code>
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 16 }}>Type Scale</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {typeScale.map(({ name, size }) => (
            <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <div style={{ width: 120, fontSize: 10, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{name}</div>
              <div style={{ width: 48, fontSize: 10, color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{size}</div>
              <div style={{ fontSize: `var(${name})`, lineHeight: 1.2, color: 'var(--fg)' }}>Davinci</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
