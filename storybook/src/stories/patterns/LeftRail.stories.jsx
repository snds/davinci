import React from 'react';
import { Panel } from '@davinci/ui/components/davinci/panel';
import { Avatar } from '@davinci/ui/components/davinci/avatar';
import { Icon } from '@davinci/ui/components/davinci/icon';

/* Example usage — the left rail: an identity card above a quick-nav list,
   assembled from @davinci/ui + tokens. Not a system component. */
export default {
  title: 'Patterns/LeftRail',
  parameters: { layout: 'centered' },
};

const links = [
  { icon: 'bookmark', label: 'Saved items' },
  { icon: 'group', label: 'Groups' },
  { icon: 'newspaper', label: 'Newsletters' },
  { icon: 'event', label: 'Events' },
];

export const Default = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 240 }}>
      <Panel bare>
        <div style={{ height: 56, background: 'var(--bg-subtle)' }} />
        <div style={{ padding: '0 16px 16px', marginTop: -28 }}>
          <Avatar initials="YO" size={64} variant="g1" />
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 16, marginTop: 8 }}>Yara Okonkwo</div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>Design Engineer · Davinci</div>
        </div>
      </Panel>
      <Panel bare bodyStyle={{ padding: 6 }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {links.map((l) => (
            <li key={l.label}>
              <button type="button" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--fg)', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}>
                <Icon name={l.icon} /> {l.label}
              </button>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  ),
};
