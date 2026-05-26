import React from 'react';
import { Panel } from '@davinci/ui/components/davinci/panel';
import { Avatar } from '@davinci/ui/components/davinci/avatar';
import { Button } from '@davinci/ui/components/davinci/button';

/* Example usage — the post composer is an app composition assembled from
   @davinci/ui (Panel + Avatar + Button) plus tokens. Not a system component. */
export default {
  title: 'Components/Composer',
  parameters: { layout: 'centered' },
};

export const Default = {
  render: () => (
    <Panel bare style={{ width: 540, maxWidth: '100%' }}>
      <div style={{ display: 'flex', gap: 10, padding: 14, alignItems: 'center' }}>
        <Avatar initials="YO" size={44} variant="g1" />
        <button
          type="button"
          style={{
            flex: 1, textAlign: 'left', padding: '10px 16px', borderRadius: 9999,
            border: '1px solid var(--border)', background: 'var(--bg-subtle)',
            color: 'var(--fg-muted)', fontSize: 14, cursor: 'pointer',
          }}
        >
          Start a post…
        </button>
      </div>
      <div style={{ display: 'flex', gap: 4, padding: '6px 10px 10px', borderTop: '1px solid var(--border-subtle)' }}>
        <Button variant="ghost" size="sm" icon="image">Photo</Button>
        <Button variant="ghost" size="sm" icon="play_circle">Video</Button>
        <Button variant="ghost" size="sm" icon="event">Event</Button>
        <Button variant="ghost" size="sm" icon="article">Article</Button>
      </div>
    </Panel>
  ),
};
