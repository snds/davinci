import React from 'react';
import { Panel } from '@davinci/ui/components/davinci/panel';
import { Avatar } from '@davinci/ui/components/davinci/avatar';
import { Button } from '@davinci/ui/components/davinci/button';

/* Example usage — the main feed: a composer above a column of posts, all
   assembled from @davinci/ui + tokens. Not a system component. */
export default {
  title: 'Patterns/Feed',
  parameters: { layout: 'centered' },
};

function Composer() {
  return (
    <Panel bare>
      <div style={{ display: 'flex', gap: 10, padding: 14, alignItems: 'center' }}>
        <Avatar initials="YO" size={44} variant="g1" />
        <button type="button" style={{ flex: 1, textAlign: 'left', padding: '10px 16px', borderRadius: 9999, border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--fg-muted)', fontSize: 14, cursor: 'pointer' }}>
          Start a post…
        </button>
      </div>
    </Panel>
  );
}

function Post({ author, role, variant, body }) {
  return (
    <Panel bare>
      <div style={{ display: 'flex', gap: 10, padding: 14 }}>
        <Avatar initials={author.split(' ').map((w) => w[0]).join('').slice(0, 2)} size={48} variant={variant} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 14 }}>{author}</div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{role}</div>
        </div>
      </div>
      <div style={{ padding: '0 16px 12px', fontSize: 14, lineHeight: 1.55 }}>{body}</div>
      <div style={{ display: 'flex', gap: 4, padding: 8, borderTop: '1px solid var(--border-subtle)' }}>
        <Button variant="ghost" size="sm" icon="thumb_up">Like</Button>
        <Button variant="ghost" size="sm" icon="chat_bubble">Comment</Button>
        <Button variant="ghost" size="sm" icon="repeat">Repost</Button>
        <Button variant="ghost" size="sm" icon="send">Send</Button>
      </div>
    </Panel>
  );
}

export const Default = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 540, maxWidth: '100%' }}>
      <Composer />
      <Post author="Sofia Antonova" role="Staff Designer · Helix" variant="g4" body="Most design systems are asset libraries with a sitemap. The ones that last are contracts." />
      <Post author="Daniel Amrani" role="Head of Brand · Pylon" variant="g2" body="Shipping a refresh of our component library today — tokens all the way down." />
    </div>
  ),
};
