// Company page

function CompanyPage({ onBack }) {
  const [tab, setTab] = useState('home');
  return (
    <main className="stack">
      <section className="panel" style={{ overflow: 'hidden' }}>
        <div
          className="profile-cover"
          style={{
            backgroundImage: `url(${seededPhoto('davinci-systems-banner', 1200, 300, 'office')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: 140,
          }}
        ></div>
        <div style={{ padding: '0 24px 16px', marginTop: -40, position: 'relative' }}>
          <div style={{
            width: 96, height: 96, borderRadius: 14, background: 'var(--bg-surface)',
            border: '4px solid var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-md)', marginBottom: 14,
          }}>
            <img src="../../assets/logo-mark.svg" style={{ width: 64, height: 64 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <div className="profile-header__name">Davinci Systems</div>
              <div style={{ fontSize: 14, color: 'var(--fg)', marginTop: 4 }}>Design infrastructure for product teams.</div>
              <div className="profile-header__meta">
                <span>Software Development</span>
                <span>Lisbon, Portugal</span>
                <span style={{ color: 'var(--accent-fg)', fontWeight: 600 }}>24,802 followers</span>
                <span>201–500 employees</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="primary" icon="add">Follow</Button>
              <Button variant="outline" icon="chat_bubble">Message</Button>
              <Button variant="secondary">More</Button>
            </div>
          </div>
        </div>
        <div className="company-tabs">
          {['home','about','posts','jobs','people','products'].map(t => (
            <div key={t} className={`company-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </div>
          ))}
        </div>
      </section>

      <Panel title="Overview">
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--fg-muted)', margin: 0 }}>
          Davinci Systems builds the design infrastructure behind some of the largest product organizations in Europe.
          Our token pipeline, component library, and governance tooling power teams shipping to millions of users daily.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 20 }}>
          <div className="stat"><div className="stat__value">342</div><div className="stat__label">employees</div></div>
          <div className="stat"><div className="stat__value">2018</div><div className="stat__label">founded</div></div>
          <div className="stat"><div className="stat__value">18</div><div className="stat__label">open roles</div></div>
          <div className="stat"><div className="stat__value">€42M</div><div className="stat__label">series B</div></div>
        </div>
      </Panel>

      <Panel title="Recent posts" action={<Button variant="ghost" size="sm" iconRight="arrow_forward">See all</Button>}>
        <div className="post" style={{ padding: 0 }}>
          <div className="post__header">
            <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="../../assets/logo-mark.svg" style={{ width: 32, height: 32 }} />
            </div>
            <div className="post__who">
              <div className="post__name">Davinci Systems</div>
              <div className="post__role">24,802 followers</div>
              <div className="post__time">2d · <Icon name="public" style={{ fontSize: 12 }} /></div>
            </div>
          </div>
          <div className="post__body">
            Announcing Davinci 3.0 — a full rewrite of our token pipeline with native Radix Colors support,
            zero-config theming, and a 10× faster Figma sync. Read the launch post →
          </div>
          <div className="post__reactions">
            <span>❤ 👍 💡 &nbsp;&nbsp;1,204 reactions</span>
            <span>96 comments</span>
          </div>
        </div>
      </Panel>

      <Panel title="Jobs" action={<Button variant="ghost" size="sm" iconRight="arrow_forward">See all 18</Button>}>
        {[
          { title: 'Senior Design Engineer', loc: 'Remote · EU', team: 'Platform', new: true },
          { title: 'Brand Designer', loc: 'Lisbon · Hybrid', team: 'Brand Studio', new: true },
          { title: 'Engineering Manager, Tokens', loc: 'Remote · EU', team: 'Platform' },
        ].map((j, i) => (
          <div key={i} className="entry" style={{ alignItems: 'center' }}>
            <div className="entry__logo">
              <img src="../../assets/logo-mark.svg" style={{ width: 32, height: 32 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="entry__title">{j.title} {j.new && <Pill variant="alt" style={{ marginLeft: 6 }}>New</Pill>}</div>
              <div className="entry__sub">{j.team}</div>
              <div className="entry__time">{j.loc}</div>
            </div>
            <Button variant="outline" size="sm" pill>Easy apply</Button>
          </div>
        ))}
      </Panel>
    </main>
  );
}

Object.assign(window, { CompanyPage });
