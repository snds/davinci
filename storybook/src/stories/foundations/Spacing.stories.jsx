import React from 'react';

export default {
  title: 'Foundations/Spacing',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

const spacingTokens = [
  { name: '--s-0',  value: '0px' },
  { name: '--s-1',  value: '2px' },
  { name: '--s-2',  value: '4px' },
  { name: '--s-3',  value: '8px' },
  { name: '--s-4',  value: '12px' },
  { name: '--s-5',  value: '16px' },
  { name: '--s-6',  value: '20px' },
  { name: '--s-7',  value: '24px' },
  { name: '--s-8',  value: '32px' },
  { name: '--s-9',  value: '40px' },
  { name: '--s-10', value: '48px' },
  { name: '--s-11', value: '64px' },
  { name: '--s-12', value: '80px' },
  { name: '--s-13', value: '96px' },
  { name: '--s-14', value: '128px' },
];

export const AllSpacing = {
  name: 'Spacing Scale',
  render: () => (
    <div style={{ padding: 32 }}>
      <h2 style={{ marginBottom: 32 }}>Spacing Tokens</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {spacingTokens.map(({ name, value }) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 80, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', flexShrink: 0 }}>{name}</div>
            <div style={{ width: 44, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)', flexShrink: 0 }}>{value}</div>
            <div
              style={{
                height: 20,
                width: `var(${name})`,
                minWidth: name === '--s-0' ? 2 : undefined,
                background: 'var(--accent)',
                borderRadius: 3,
                opacity: 0.8,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};
