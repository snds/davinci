import React from 'react';
import { Panel } from '@davinci/ui/components/davinci/panel';
import { Avatar } from '@davinci/ui/components/davinci/avatar';
import { Button } from '@davinci/ui/components/davinci/button';
import { Pill } from '@davinci/ui/components/davinci/pill';

/* Example usage — a member profile page header + sections, assembled from
   @davinci/ui (Panel + Avatar + Button + Pill) plus tokens. Not a system
   component — the live app composes the full version. */
export default {
  title: 'Patterns/ProfilePage',
  parameters: { layout: 'fullscreen' },
};

export const Default = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 680, margin: '0 auto', padding: 24 }}>
      <Panel bare>
        <div style={{ height: 120, background: 'linear-gradient(135deg, var(--blue-8), var(--violet-9))' }} />
        <div style={{ padding: '0 24px 20px', marginTop: -44 }}>
          <Avatar initials="YO" size={104} variant="g1" />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 22 }}>Yara Okonkwo</h2>
                <Pill variant="accent">Open to work</Pill>
              </div>
              <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 4 }}>Design Engineer · Davinci Platform Team</div>
              <div style={{ fontSize: 13, color: 'var(--fg-subtle)', marginTop: 2 }}>Lisbon, Portugal · 482 connections</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="primary" size="sm" pill icon="add">Follow</Button>
              <Button variant="outline" size="sm" pill>Message</Button>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="About">
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--fg-muted)' }}>
          Design engineer focused on the layer between design and code — tokens, components, and the
          tooling that keeps them honest. Currently building the Davinci design system.
        </p>
      </Panel>

      <Panel title="Experience">
        {[
          { role: 'Design Engineer', org: 'Davinci · 2024 – Present', logo: 'DV', variant: 'g1' },
          { role: 'Product Designer', org: 'Helix Systems · 2021 – 2024', logo: 'HX', variant: 'g2' },
        ].map((e) => (
          <div key={e.org} style={{ display: 'flex', gap: 12, padding: '10px 0' }}>
            <Avatar initials={e.logo} size={44} variant={e.variant} shape="rounded" ring={false} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{e.role}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{e.org}</div>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  ),
};
