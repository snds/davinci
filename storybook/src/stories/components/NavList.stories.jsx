import React from 'react';
import { Panel } from '@davinci/ui/components/davinci/panel';
import { Icon } from '@davinci/ui/components/davinci/icon';

/* Example usage — a navigation list assembled from @davinci/ui (Panel + Icon)
   plus tokens. Not a system component. */
export default {
  title: 'Components/NavList',
  parameters: { layout: 'centered' },
};

const items = [
  { icon: 'group', label: 'Connections', count: 482 },
  { icon: 'groups', label: 'Groups', count: 12 },
  { icon: 'event', label: 'Events', count: 3 },
  { icon: 'newspaper', label: 'Newsletters' },
];

function NavListExample({ activeIndex = -1 }) {
  return (
    <Panel title="Manage my network" style={{ width: 320, maxWidth: '100%' }} bodyStyle={{ padding: 6 }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((it, i) => (
          <li key={it.label}>
            <button
              type="button"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                textAlign: 'left', fontSize: 14, color: 'var(--fg)',
                background: i === activeIndex ? 'var(--bg-selected)' : 'transparent',
              }}
            >
              <Icon name={it.icon} />
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.count != null && <span style={{ color: 'var(--fg-muted)', fontSize: 13 }}>{it.count}</span>}
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export const Default = { render: () => <NavListExample /> };
export const WithActiveItem = { name: 'With active item', render: () => <NavListExample activeIndex={0} /> };
