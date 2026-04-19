import React from 'react';
import Avatar from './Avatar';
import { seededPhoto } from './Avatar';
import Icon from './Icon';
import Panel from './Panel';

function LeftRail({ onViewProfile }) {
  return (
    <aside>
      <div className="profile-card" onClick={onViewProfile} style={{ cursor: 'pointer' }}>
        <div
          className="profile-card__cover"
          style={{
            backgroundImage: `url(${seededPhoto('yara-okonkwo-banner', 600, 180, 'banner')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="profile-card__body">
          <Avatar
            initials="YO"
            size={64}
            variant="g1"
            photo={seededPhoto('yara-okonkwo', 128, 128, 'face')}
            style={{ border: '3px solid var(--bg-surface)' }}
          />
          <div className="profile-card__name">Yara Okonkwo</div>
          <div className="profile-card__role">Principal Designer · Davinci Systems</div>
          <hr className="hr-soft" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span className="meta">Profile views</span>
            <span style={{ color: 'var(--accent-fg)', fontWeight: 600 }}>248</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 6 }}>
            <span className="meta">Post impressions</span>
            <span style={{ color: 'var(--accent-fg)', fontWeight: 600 }}>3,402</span>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <ul className="nav-list">
          <li><Icon name="bookmark" /> Saved items</li>
          <li><Icon name="groups" /> Groups <span className="count">12</span></li>
          <li><Icon name="event" /> Events</li>
          <li><Icon name="newspaper" /> Newsletters</li>
          <li><Icon name="history" /> Recent</li>
        </ul>
      </div>
    </aside>
  );
}

export default LeftRail;
