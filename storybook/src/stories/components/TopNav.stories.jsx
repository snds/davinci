import React from 'react';
import { Avatar } from '@davinci/ui/components/davinci/avatar';
import { Icon } from '@davinci/ui/components/davinci/icon';

/* Example usage — the global top navigation assembled from @davinci/ui
   (Avatar + Icon) plus tokens. Not a system component. */
export default {
  title: 'Components/TopNav',
  parameters: { layout: 'fullscreen' },
};

const tabs = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'network', icon: 'group', label: 'Network' },
  { id: 'jobs', icon: 'work', label: 'Jobs' },
  { id: 'messaging', icon: 'chat_bubble', label: 'Messages' },
  { id: 'alerts', icon: 'notifications', label: 'Alerts' },
];

function TopNavExample({ active = 'home', alerts = 0 }) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', height: 56, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--accent-fg)', letterSpacing: '-0.02em' }}>davinci</span>
      <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
        <Icon name="search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-subtle)' }} />
        <input
          placeholder="Search"
          style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--fg)', fontSize: 14 }}
        />
      </div>
      <nav style={{ display: 'flex', marginLeft: 'auto', alignItems: 'stretch' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              width: 64, height: 56, border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: 11, color: active === t.id ? 'var(--fg)' : 'var(--fg-muted)',
              boxShadow: active === t.id ? 'inset 0 -2px 0 var(--fg)' : 'none',
            }}
          >
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <Icon name={t.icon} filled={active === t.id} size="lg" />
              {t.id === 'alerts' && alerts > 0 && (
                <span style={{ position: 'absolute', top: -2, right: -6, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 9999, background: 'var(--danger)', color: 'white', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{alerts}</span>
              )}
            </span>
            {t.label}
          </button>
        ))}
      </nav>
      <Avatar initials="YO" size={28} variant="g1" />
    </header>
  );
}

export const Default = { render: () => <TopNavExample active="home" /> };
export const NetworkActive = { name: 'Network active', render: () => <TopNavExample active="network" /> };
export const WithAlerts = { name: 'With alerts', render: () => <TopNavExample active="home" alerts={3} /> };
export const MessagingActive = { name: 'Messaging active', render: () => <TopNavExample active="messaging" /> };
