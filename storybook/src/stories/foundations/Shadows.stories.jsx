import React from 'react';

export default {
  title: 'Foundations/Shadows',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

const shadowTokens = [
  { name: '--shadow-xs',    label: 'xs',    desc: 'Subtle lift' },
  { name: '--shadow-sm',    label: 'sm',    desc: 'Card default' },
  { name: '--shadow-md',    label: 'md',    desc: 'Dropdown' },
  { name: '--shadow-lg',    label: 'lg',    desc: 'Modal' },
  { name: '--shadow-xl',    label: 'xl',    desc: 'Overlay panel' },
  { name: '--shadow-focus', label: 'focus', desc: 'Focus ring' },
];

export const AllShadows = {
  name: 'Shadow Tokens',
  render: () => (
    <div style={{ padding: 48 }}>
      <h2 style={{ marginBottom: 40 }}>Shadow Tokens</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
        {shadowTokens.map(({ name, label, desc }) => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <div
              style={{
                width: 160,
                height: 100,
                borderRadius: 10,
                background: 'var(--bg-surface)',
                boxShadow: `var(${name})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-muted)' }}>{label}</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>{name}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
