import React from 'react';
import Logo from '../../components/Logo';

export default {
  title: 'Primitives/Logo',
  component: Logo,
  argTypes: {
    size: {
      control: { type: 'range', min: 16, max: 80, step: 4 },
      description: 'Logo height in px',
    },
  },
};

export const Default = {
  args: {
    size: 32,
  },
};

export const Large = {
  args: {
    size: 56,
  },
};

export const Sizes = {
  name: 'Size Comparison',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {[20, 28, 32, 40, 56].map(size => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Logo size={size} />
          <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>size={size}</span>
        </div>
      ))}
    </div>
  ),
};
