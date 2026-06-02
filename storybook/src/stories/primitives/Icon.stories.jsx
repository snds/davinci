import React from 'react';
import { Icon } from '@davinci/ui/components/davinci/icon';

// A representative set of Material Symbols Rounded ligatures for the grid demo.
const ICON_NAMES = [
  'home', 'search', 'group', 'groups', 'work', 'chat_bubble', 'notifications',
  'person', 'settings', 'bookmark', 'favorite', 'event', 'newspaper', 'history',
  'info', 'add', 'edit', 'link', 'delete', 'more_horiz', 'more_vert', 'public',
  'thumb_up', 'repeat', 'send', 'mail', 'image', 'play_circle', 'article',
  'location_on', 'arrow_forward', 'dark_mode', 'light_mode', 'close', 'check',
  'visibility', 'lock',
];

export default {
  title: 'Primitives/Icon',
  component: Icon,
  argTypes: {
    name: {
      control: 'select',
      options: ICON_NAMES,
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
        {ICON_NAMES.map(name => (
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
