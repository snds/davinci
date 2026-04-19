import React from 'react';
import Avatar from './Avatar';
import Icon from './Icon';
import { seededPhoto } from './Avatar';

function Composer({ onStartPost }) {
  const actions = [
    { icon: 'image', label: 'Photo', color: 'var(--accent-fg)' },
    { icon: 'play_circle', label: 'Video', color: 'var(--success-fg)' },
    { icon: 'event', label: 'Event', color: 'var(--warning-fg)' },
    { icon: 'article', label: 'Article', color: 'var(--danger-fg)' },
  ];

  return (
    <section className="panel">
      <div className="composer">
        <Avatar initials="YO" size={48} variant="g1" photo={seededPhoto('yara-okonkwo', 96, 96, 'face')} />
        <div className="composer__input" onClick={onStartPost}>Share an update, Yara…</div>
      </div>
      <div className="composer__actions">
        {actions.map((a, i) => (
          <div key={i} className="composer__action">
            <Icon name={a.icon} style={{ color: a.color }} />
            <span>{a.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Composer;
