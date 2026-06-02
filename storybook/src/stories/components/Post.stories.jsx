import React from 'react';
import { Panel } from '@davinci/ui/components/davinci/panel';
import { Avatar } from '@davinci/ui/components/davinci/avatar';
import { Button } from '@davinci/ui/components/davinci/button';

/* Example usage — a feed post assembled from @davinci/ui (Panel + Avatar +
   Button) plus tokens. Not a system component. */
export default {
  title: 'Components/Post',
  parameters: { layout: 'centered' },
};

function initials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function PostExample({
  author = 'Sofia Antonova',
  role = 'Staff Designer · Helix',
  body,
  company = false,
  liked = false,
  attachment,
}) {
  return (
    <Panel bare style={{ width: 540, maxWidth: '100%' }}>
      <div style={{ display: 'flex', gap: 10, padding: 14 }}>
        <Avatar initials={initials(author)} size={48} variant={company ? 'g2' : 'g4'} shape={company ? 'rounded' : 'circle'} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 14 }}>{author}</div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{role}</div>
        </div>
        <Button variant="ghost" size="icon-sm" icon="more_horiz" aria-label="Post options" />
      </div>
      <div style={{ padding: '0 16px 12px', fontSize: 14, lineHeight: 1.55 }}>{body}</div>
      {attachment && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: 14, background: 'var(--bg-subtle)' }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{attachment}</div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>radix-ui.com</div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 4, padding: 8, borderTop: '1px solid var(--border-subtle)' }}>
        <Button variant="ghost" size="sm" icon="thumb_up" style={liked ? { color: 'var(--accent-fg)' } : undefined}>Like</Button>
        <Button variant="ghost" size="sm" icon="chat_bubble">Comment</Button>
        <Button variant="ghost" size="sm" icon="repeat">Repost</Button>
        <Button variant="ghost" size="sm" icon="send">Send</Button>
      </div>
    </Panel>
  );
}

export const Default = {
  render: () => <PostExample body="Most design systems are asset libraries with a sitemap. The ones that last are contracts." />,
};
export const Liked = {
  render: () => <PostExample liked body="A design system is a contract, not a style guide." />,
};
export const WithAttachment = {
  name: 'With attachment',
  render: () => <PostExample body="Great read on building color systems that age well:" attachment="Radix Colors for design systems that age well" />,
};
export const CompanyPost = {
  name: 'Company post',
  render: () => <PostExample author="Helix Systems" role="Product & Design Platform" company body="We're hiring a Design Engineer for the Platform team — come build the system with us." />,
};
