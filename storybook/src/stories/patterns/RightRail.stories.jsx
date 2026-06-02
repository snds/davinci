import React from 'react';
import { Panel } from '@davinci/ui/components/davinci/panel';
import { Avatar } from '@davinci/ui/components/davinci/avatar';
import { Button } from '@davinci/ui/components/davinci/button';

/* Example usage — the right rail: a "people you may know" suggestion list,
   assembled from @davinci/ui + tokens. Not a system component. */
export default {
  title: 'Patterns/RightRail',
  parameters: { layout: 'centered' },
};

const people = [
  { name: 'Priya Ravi', role: 'Design Engineer · Atlas', variant: 'g5' },
  { name: 'Miriam Chen', role: 'VP Design · Helix', variant: 'g4' },
  { name: 'Solomon Reyes', role: 'Design Engineer · Vector', variant: 'g6' },
];

export const Default = {
  render: () => (
    <Panel title="Add to your feed" style={{ width: 320, maxWidth: '100%' }} bodyStyle={{ padding: 0 }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {people.map((p) => (
          <li key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
            <Avatar initials={p.name.split(' ').map((w) => w[0]).join('')} size={44} variant={p.variant} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.role}</div>
            </div>
            <Button variant="outline" size="sm" pill icon="add">Follow</Button>
          </li>
        ))}
      </ul>
    </Panel>
  ),
};
