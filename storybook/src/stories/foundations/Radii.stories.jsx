import React from 'react';

export default {
  title: 'Foundations/Radii',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

const radiiTokens = [
  { name: '--radius-xs',   value: '2px',    label: 'xs' },
  { name: '--radius-sm',   value: '4px',    label: 'sm' },
  { name: '--radius-md',   value: '6px',    label: 'md' },
  { name: '--radius-lg',   value: '8px',    label: 'lg' },
  { name: '--radius-xl',   value: '12px',   label: 'xl' },
  { name: '--radius-2xl',  value: '16px',   label: '2xl' },
  { name: '--radius-full', value: '9999px', label: 'full' },
];

export const AllRadii = {
  name: 'Radii Tokens',
  render: () => (
    <div style={{ padding: 48 }}>
      <h2 style={{ marginBottom: 40 }}>Border Radius Tokens</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-end' }}>
        {radiiTokens.map(({ name, value, label }) => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <div
              style={{
                width: 96,
                height: 96,
                background: 'var(--accent-subtle)',
                border: '2px solid var(--accent-border)',
                borderRadius: `var(${name})`,
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg)', fontFamily: 'var(--font-mono)' }}>{name}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
