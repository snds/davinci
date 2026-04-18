// Left-rail profile/nav card + right-rail widgets

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
          <Avatar initials="YO" size={64} variant="g1" photo={seededPhoto('yara-okonkwo', 128, 128, 'face')} style={{ border: '3px solid var(--bg-surface)' }} />
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

      <div style={{ marginTop: 16 }}>
        <RailAd ad={AD_LIBRARY.aws} />
      </div>
    </aside>
  );
}

function RightRail() {
  const news = [
    { t: 'AI tools reshape the design stack', sub: '4h ago · 8,204 readers' },
    { t: 'Typography on the web, revisited', sub: '6h ago · 3,102 readers' },
    { t: 'Remote-first companies hit new peak', sub: '12h ago · 12k readers' },
    { t: 'Product orgs lean into async rituals', sub: '1d ago · 5,608 readers' },
  ];
  return (
    <aside>
      <Panel title="Davinci News" action={<Icon name="info" style={{ color: 'var(--fg-subtle)', fontSize: 16 }} />} bodyStyle={{ padding: 0 }}>
        {news.map((n, i) => (
          <div key={i} className="rail-item" style={{ alignItems: 'flex-start' }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--fg-muted)', marginTop: 7 }} />
            <div className="rail-item__text">
              <div className="rail-item__title">{n.t}</div>
              <div className="rail-item__sub">{n.sub}</div>
            </div>
          </div>
        ))}
      </Panel>

      <Panel title="People to follow" bodyStyle={{ padding: 0 }}>
        {[
          { n: 'Miriam Chen', r: 'VP Design · Helix', i: 'MC', v: 'g4' },
          { n: 'Daniel Amrani', r: 'Head of Brand · Pylon', i: 'DA', v: 'g2' },
          { n: 'Priya Ravi', r: 'Design Engineer · Atlas', i: 'PR', v: 'g5' },
        ].map((p, i) => (
          <div key={i} className="rail-item">
            <Avatar initials={p.i} size={40} variant={p.v} photo={seededPhoto(p.n, 80, 80, 'face')} />
            <div className="rail-item__text">
              <div className="rail-item__title">{p.n}</div>
              <div className="rail-item__sub">{p.r}</div>
            </div>
            <Button variant="outline" size="sm" pill icon="add">Follow</Button>
          </div>
        ))}
      </Panel>

      <div style={{ marginTop: 16 }}>
        <RailAd ad={AD_LIBRARY.course} />
      </div>
    </aside>
  );
}

Object.assign(window, { LeftRail, RightRail });
