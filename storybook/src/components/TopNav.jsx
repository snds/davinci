import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import Icon from './Icon';
import Avatar from './Avatar';
import { seededPhoto } from './Avatar';

function TopNav({ active = 'home', onNavigate, searchValue = '', onSearchChange, onSearchSubmit, alertCount = 0, alertsOpen = false, onToggleAlerts }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'network', label: 'Network', icon: 'group' },
    { id: 'jobs', label: 'Jobs', icon: 'work' },
    { id: 'messaging', label: 'Messages', icon: 'chat_bubble' },
    { id: 'notifications', label: 'Alerts', icon: 'notifications' },
  ];
  const bellRef = useRef(null);

  useEffect(() => {
    if (!alertsOpen) return;
    const onDoc = (e) => { if (!bellRef.current?.contains(e.target)) onToggleAlerts?.(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [alertsOpen, onToggleAlerts]);

  return (
    <header className="topnav">
      <Logo />
      <div className="topnav__search">
        <Icon name="search" style={{ fontSize: 16 }} />
        <input
          placeholder="Search people, companies, posts"
          value={searchValue}
          onChange={onSearchChange ? (e) => onSearchChange(e.target.value) : undefined}
        />
      </div>
      <nav className="topnav__tabs">
        {tabs.map(t => {
          const isAlerts = t.id === 'notifications';
          return (
            <div
              key={t.id}
              className="topnav__tab-wrap"
              ref={isAlerts ? bellRef : null}
            >
              <div
                className={`topnav__tab ${active === t.id ? 'active' : ''}`}
                onClick={() => {
                  if (isAlerts && onToggleAlerts) {
                    onToggleAlerts(!alertsOpen);
                  } else {
                    onNavigate?.(t.id);
                  }
                }}
                style={isAlerts ? { position: 'relative' } : null}
              >
                <span style={{ position: 'relative', display: 'inline-flex' }}>
                  <Icon name={t.icon} filled={active === t.id} />
                  {isAlerts && alertCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: -5, right: -7,
                      width: 16, height: 16,
                      borderRadius: '50%',
                      background: 'var(--danger)',
                      color: '#fff',
                      fontSize: 10, fontWeight: 700,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid var(--bg-surface)',
                      boxSizing: 'content-box',
                      lineHeight: 1,
                    }}>{alertCount}</span>
                  )}
                </span>
                <span>{t.label}</span>
              </div>
            </div>
          );
        })}
        <div className="topnav__tab" style={{ paddingLeft: 14, borderLeft: '1px solid var(--border-subtle)' }}>
          <Avatar initials="YO" size={32} photo={seededPhoto('yara-okonkwo', 64, 64, 'face')} />
          <span>You</span>
        </div>
      </nav>
    </header>
  );
}

export default TopNav;
