// Network and Jobs pages.

// ---------------- Network ----------------

function NetworkPage() {
  const [tab, setTab] = useState('grow'); // grow | catchup | invites

  const invites = [
    { name: 'Kai Thornton', role: 'Design Engineer · Vector Project OS', mutual: 12, avatar: 'KT', variant: 'g5' },
    { name: 'Noor Farsi', role: 'Principal PM · Atlas Docs', mutual: 8, avatar: 'NF', variant: 'g2' },
    { name: 'Lena Brandt', role: 'Brand Director · Helix', mutual: 31, avatar: 'LB', variant: 'g4' },
  ];
  const suggested = [
    { name: 'Ore Adebayo', role: 'Head of Design · Pulse', mutual: 18, avatar: 'OA', variant: 'g6' },
    { name: 'Tara Weiss', role: 'Staff Researcher · Helix', mutual: 6, avatar: 'TW', variant: 'g1' },
    { name: 'Marcus Lind', role: 'Design Director · Vector', mutual: 4, avatar: 'ML', variant: 'g5' },
    { name: 'Ines Caballero', role: 'Founder · Unwritten', mutual: 22, avatar: 'IC', variant: 'g2' },
    { name: 'Jude Abara', role: 'Principal Engineer · Atlas', mutual: 3, avatar: 'JA', variant: 'g4' },
    { name: 'Emeline Roux', role: 'Creative Director · Frame', mutual: 15, avatar: 'ER', variant: 'g6' },
  ];
  const catchUp = [
    { name: 'Sofia Antonova', note: 'Started a new role · Staff Designer, Helix', avatar: 'SA', variant: 'g4', time: '2d' },
    { name: 'Daniel Amrani', note: '5 year work anniversary at Pylon', avatar: 'DA', variant: 'g2', time: '4d' },
    { name: 'Priya Ravi', note: 'Shared a post · Design Engineer playbook', avatar: 'PR', variant: 'g5', time: '1w' },
  ];

  return (
    <main className="stack" style={{ minWidth: 0 }}>
      <section className="panel">
        <div className="panel__header">
          <span>Manage your network</span>
        </div>
        <div className="network-sub-nav">
          <NetworkNavItem icon="group" label="Connections" count="842" />
          <NetworkNavItem icon="person" label="Following & followers" count="2.1k" />
          <NetworkNavItem icon="groups" label="Groups" count="12" />
          <NetworkNavItem icon="event" label="Events" count="3" />
          <NetworkNavItem icon="newspaper" label="Newsletters" count="7" />
          <NetworkNavItem icon="history" label="Hashtags" count="24" />
        </div>
      </section>

      <div className="results-tabs" style={{ padding: '0 4px', borderBottom: '1px solid var(--border-subtle)' }}>
        <button className={`results-tab ${tab === 'grow' ? 'active' : ''}`} onClick={() => setTab('grow')}>Grow</button>
        <button className={`results-tab ${tab === 'catchup' ? 'active' : ''}`} onClick={() => setTab('catchup')}>Catch up</button>
        <button className={`results-tab ${tab === 'invites' ? 'active' : ''}`} onClick={() => setTab('invites')}>
          Invitations <span className="results-tab__count">{invites.length}</span>
        </button>
      </div>

      {tab === 'invites' && (
        <section className="panel">
          <div className="panel__header"><span>Pending invitations</span><span className="meta">{invites.length} waiting</span></div>
          <div style={{ padding: 0 }}>
            {invites.map((inv, i) => (
              <div key={i} className="invite-row">
                <Avatar initials={inv.avatar} size={56} variant={inv.variant} photoSeed={inv.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>{inv.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{inv.role}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="group" style={{ fontSize: 12 }} /> {inv.mutual} mutual connections
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="ghost" size="sm" pill>Ignore</Button>
                  <Button variant="primary" size="sm" pill>Accept</Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'catchup' && (
        <section className="panel">
          <div className="panel__header"><span>Catch up with your network</span></div>
          <div style={{ padding: 0 }}>
            {catchUp.map((c, i) => (
              <div key={i} className="rail-item" style={{ padding: '14px 16px' }}>
                <Avatar initials={c.avatar} size={48} variant={c.variant} photoSeed={c.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)' }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{c.note}</div>
                  <div className="meta" style={{ marginTop: 2 }}>{c.time} ago</div>
                </div>
                <Button variant="outline" size="sm" pill>Say congrats</Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'grow' && (
        <>
          <InlineAd ad={AD_LIBRARY.recruit} />
          <section className="panel">
            <div className="panel__header">
              <span>People you may know from Helix Systems</span>
              <button className="btn btn--ghost btn--sm">See all</button>
            </div>
            <div className="network-grid">
              {suggested.map((p, i) => (
                <SuggestionCard key={i} person={p} />
              ))}
            </div>
          </section>
          <section className="panel">
            <div className="panel__header">
              <span>Based on your profile</span>
              <button className="btn btn--ghost btn--sm">See all</button>
            </div>
            <div className="network-grid">
              {[...suggested].reverse().map((p, i) => (
                <SuggestionCard key={i} person={p} />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function NetworkNavItem({ icon, label, count }) {
  return (
    <div className="network-nav-item">
      <Icon name={icon} style={{ fontSize: 18, color: 'var(--fg-muted)' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
      </div>
      <span className="meta" style={{ fontWeight: 600, color: 'var(--fg)' }}>{count}</span>
    </div>
  );
}

function SuggestionCard({ person }) {
  const [following, setFollowing] = useState(false);
  return (
    <div className="suggestion-card">
      <div
        className="suggestion-card__cover"
        style={{
          backgroundImage: `url(${seededPhoto(person.name + '-banner', 240, 56, 'banner')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Avatar initials={person.avatar} size={64} variant={person.variant} photoSeed={person.name} style={{ border: '3px solid var(--bg-surface)', marginTop: -32, position: 'relative' }} />
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, marginTop: 8, textAlign: 'center' }}>{person.name}</div>
      <div style={{ fontSize: 12, color: 'var(--fg-muted)', textAlign: 'center', marginTop: 2, minHeight: 32, lineHeight: 1.35, padding: '0 8px' }}>{person.role}</div>
      <div className="meta" style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
        <Icon name="group" style={{ fontSize: 12 }} /> {person.mutual} mutual
      </div>
      <div style={{ padding: '10px 12px 14px', width: '100%', boxSizing: 'border-box' }}>
        <Button
          variant={following ? 'secondary' : 'outline'}
          size="sm"
          pill
          icon={following ? 'check' : 'add'}
          style={{ width: '100%' }}
          onClick={() => setFollowing(f => !f)}
        >
          {following ? 'Pending' : 'Connect'}
        </Button>
      </div>
    </div>
  );
}

// ---------------- Jobs ----------------

function JobsPage() {
  const [selected, setSelected] = useState(0);
  const [savedIds, setSavedIds] = useState(new Set([1]));

  const jobs = [
    { id: 0, title: 'Staff Product Designer', company: 'Helix Systems', logo: 'HX', variant: 'g2',
      location: 'Lisbon or Remote · EU timezones', salary: '€110k – €140k · Equity',
      posted: '5 days ago', applicants: '48 applicants', remote: true, easyApply: true,
      verified: true,
      about: 'We\'re looking for a staff-level designer to lead our design platform — the tokens, components, and docs that power every product surface at Helix.',
      fits: ['Your skills match 8 of 10 requirements', 'Your connections can refer you', '3 people from your network work here'],
    },
    { id: 1, title: 'Senior Design Engineer', company: 'Atlas Docs', logo: 'AT', variant: 'g5',
      location: 'Remote · Americas', salary: '$170k – $210k',
      posted: '2 days ago', applicants: '124 applicants', remote: true, easyApply: true,
      about: 'Build the interactive canvas at the heart of Atlas. You\'ll work across React, typography, and performance.',
      fits: ['Your skills match 9 of 10 requirements'] },
    { id: 2, title: 'Design Systems Lead', company: 'Vector Project OS', logo: 'VE', variant: 'g6',
      location: 'Amsterdam, NL (hybrid)', salary: '€95k – €125k',
      posted: '1 week ago', applicants: '63 applicants', easyApply: false,
      about: 'Own Vector\'s design system end to end. Partner with product leads to scale our visual language.',
      fits: [] },
    { id: 3, title: 'Staff Brand Designer', company: 'Pulse Meetings', logo: 'PU', variant: 'g1',
      location: 'New York, NY · Hybrid', salary: '$165k – $195k',
      posted: '3 days ago', applicants: '87 applicants', easyApply: true,
      about: 'Define the visual identity of Pulse\'s next chapter. Brand system, marketing, motion, and in-product expression.',
      fits: ['Your skills match 7 of 10 requirements'] },
    { id: 4, title: 'Principal Product Designer', company: 'Frame Design Tools', logo: 'FR', variant: 'g4',
      location: 'San Francisco, CA (onsite)', salary: '$210k – $265k',
      posted: '4 days ago', applicants: '212 applicants', easyApply: false,
      about: 'Lead design for the Frame canvas — the tool used by millions of designers to think, prototype, and build.',
      fits: ['Your connections can refer you'] },
    { id: 5, title: 'Design Manager, Growth', company: 'Skyline Cloud', logo: 'SK', variant: 'g5',
      location: 'Remote · EMEA', salary: '€135k – €165k',
      posted: '6 days ago', applicants: '41 applicants', easyApply: true,
      about: 'Manage a team of 4 designers across self-serve signup, activation, and expansion surfaces.',
      fits: [] },
  ];
  const current = jobs[selected];
  const toggleSave = (id) => setSavedIds(s => {
    const next = new Set(s);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return (
    <div className="jobs-page" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 16, alignItems: 'start' }}>
      <section className="panel">
        <div className="panel__header">
          <span>Top picks for you</span>
          <span className="meta">{jobs.length}</span>
        </div>
        <div className="jobs-list">
          {jobs.map((j, i) => (
            <React.Fragment key={j.id}>
              <button
                type="button"
                className={`job-row ${selected === j.id ? 'active' : ''}`}
                onClick={() => setSelected(j.id)}
              >
                <Avatar initials={j.logo} size={48} variant={j.variant} style={{ borderRadius: 8 }} />
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.company}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {j.location}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    {j.easyApply && <Pill variant="accent">Easy Apply</Pill>}
                    {j.remote && <Pill>Remote</Pill>}
                  </div>
                </div>
                <button
                  type="button"
                  className={`job-save ${savedIds.has(j.id) ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleSave(j.id); }}
                  aria-label={savedIds.has(j.id) ? 'Unsave' : 'Save'}
                >
                  <Icon name="bookmark" filled={savedIds.has(j.id)} style={{ fontSize: 18 }} />
                </button>
              </button>
              {i === 2 && <InlineAd ad={AD_LIBRARY.course} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel__header">
          <span>Job details</span>
          <span className="meta">{current.posted}</span>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <Avatar initials={current.logo} size={64} variant={current.variant} style={{ borderRadius: 10 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>{current.title}</div>
              <div style={{ fontSize: 14, color: 'var(--fg)', marginTop: 2 }}>
                {current.company}
                {current.verified && <Icon name="check" style={{ fontSize: 14, color: 'var(--accent-fg)', marginLeft: 4, verticalAlign: 'middle' }} />}
              </div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>{current.location}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: 6, display: 'flex', gap: 10 }}>
                <span>{current.posted}</span>
                <span>·</span>
                <span>{current.applicants}</span>
                <span>·</span>
                <span>{current.salary}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <Button variant="primary" pill iconRight="arrow_forward">{current.easyApply ? 'Easy Apply' : 'Apply'}</Button>
            <Button
              variant={savedIds.has(current.id) ? 'secondary' : 'outline'}
              pill
              icon={savedIds.has(current.id) ? 'check' : 'bookmark'}
              onClick={() => toggleSave(current.id)}
            >
              {savedIds.has(current.id) ? 'Saved' : 'Save'}
            </Button>
            <Button variant="ghost" pill icon="send">Share</Button>
          </div>

          {current.fits.length > 0 && (
            <div className="job-fit" style={{ marginTop: 20 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="check" style={{ fontSize: 14, color: 'var(--success-fg)' }} />
                How you fit
              </div>
              {current.fits.map((f, i) => (
                <div key={i} style={{ fontSize: 13, color: 'var(--fg-muted)', padding: '4px 0', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-fg)', marginTop: 8, flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>
          )}

          <hr className="hr-soft" style={{ margin: '20px 0' }} />

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginTop: 0, marginBottom: 10 }}>About the role</h3>
          <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.55, margin: 0 }}>{current.about}</p>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { NetworkPage, JobsPage });
