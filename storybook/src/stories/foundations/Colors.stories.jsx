import React, { useEffect, useState } from 'react';

export default {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

function ColorSwatch({ name }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    setValue(v);
  }, [name]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 120 }}>
      <div
        style={{
          width: '100%',
          height: 56,
          borderRadius: 8,
          background: `var(${name})`,
          border: '1px solid rgba(128,128,128,0.2)',
        }}
      />
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg)', fontFamily: 'var(--font-mono)' }}>{name}</div>
      <div style={{ fontSize: 10, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>{value}</div>
    </div>
  );
}

function SwatchGroup({ title, vars }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 16 }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
        {vars.map(v => <ColorSwatch key={v} name={v} />)}
      </div>
    </div>
  );
}

export const AllColors = {
  name: 'All Colors',
  render: () => (
    <div style={{ padding: 32 }}>
      <h2 style={{ marginBottom: 32 }}>Color Tokens</h2>

      <SwatchGroup title="Sand Scale" vars={[
        '--sand-1','--sand-2','--sand-3','--sand-4','--sand-5','--sand-6',
        '--sand-7','--sand-8','--sand-9','--sand-10','--sand-11','--sand-12',
      ]} />

      <SwatchGroup title="Blue Scale" vars={[
        '--blue-1','--blue-2','--blue-3','--blue-4','--blue-5','--blue-6',
        '--blue-7','--blue-8','--blue-9','--blue-10','--blue-11','--blue-12',
      ]} />

      <SwatchGroup title="Yellow Scale" vars={[
        '--yellow-1','--yellow-2','--yellow-3','--yellow-4','--yellow-5','--yellow-6',
        '--yellow-7','--yellow-8','--yellow-9','--yellow-10','--yellow-11','--yellow-12',
      ]} />

      <SwatchGroup title="Functional" vars={[
        '--green-9','--green-10','--green-11',
        '--red-9','--red-10','--red-11',
        '--amber-9','--amber-11',
      ]} />

      <SwatchGroup title="Semantic — Backgrounds" vars={[
        '--bg','--bg-subtle','--bg-surface','--bg-elevated','--bg-hover','--bg-active','--bg-selected',
      ]} />

      <SwatchGroup title="Semantic — Foregrounds" vars={[
        '--fg','--fg-muted','--fg-subtle','--fg-disabled','--fg-on-accent',
      ]} />

      <SwatchGroup title="Semantic — Borders" vars={[
        '--border','--border-subtle','--border-strong','--border-focus',
      ]} />

      <SwatchGroup title="Semantic — Accent" vars={[
        '--accent','--accent-hover','--accent-subtle','--accent-fg','--accent-border',
      ]} />

      <SwatchGroup title="Semantic — Alt" vars={[
        '--alt','--alt-hover','--alt-subtle','--alt-fg',
      ]} />

      <SwatchGroup title="Semantic — Status" vars={[
        '--success','--success-fg','--danger','--danger-fg','--warning','--warning-fg',
      ]} />
    </div>
  ),
};
