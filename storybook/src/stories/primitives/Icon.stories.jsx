import React from 'react';
import Icon, { ICON_CODEPOINTS } from '../../components/Icon';

export default {
  title: 'Primitives/Icon',
  component: Icon,
  argTypes: {
    name: {
      control: 'select',
      options: Object.keys(ICON_CODEPOINTS),
      description: 'Icon name',
    },
    filled: {
      control: 'boolean',
      description: 'Filled variant',
    },
  },
};

export const Default = {
  args: {
    name: 'home',
    filled: false,
  },
};

export const Filled = {
  args: {
    name: 'home',
    filled: true,
  },
};

export const AllIcons = {
  name: 'All Icons',
  render: () => (
    <div>
      <h3 style={{ marginBottom: 24 }}>All Icons — Outlined & Filled</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
        {Object.keys(ICON_CODEPOINTS).map(name => (
          <div
            key={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '12px 8px',
              borderRadius: 8,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Icon name={name} />
              <Icon name={name} filled />
            </div>
            <span style={{ fontSize: 10, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', textAlign: 'center', wordBreak: 'break-all' }}>
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
