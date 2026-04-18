// Messages, Alerts pages, and Alerts dropdown.

// ---------------- Messages ----------------

const CONVERSATIONS = [
  { id: 0, name: 'Sofia Antonova', role: 'Staff Designer · Helix', avatar: 'SA', variant: 'g4',
    time: '12:08 PM', preview: 'Sounds great — I\'ll send the Figma file over this afternoon.',
    unread: true, messages: [
      { from: 'them', text: 'Hey! Loved your talk at DBS last week. Quick Q about your token architecture — do you scope aliases per-product or share globally?', time: '11:52 AM' },
      { from: 'them', text: 'We\'re hitting issues where product teams want to fork tokens and it\'s starting to feel unsustainable.', time: '11:53 AM' },
      { from: 'me', text: 'Thank you! We tried both. Per-product aliases worked cleanly at first but divergence got ugly. Now we have one global scale and products can only override at the alias level with a lint.', time: '11:59 AM' },
      { from: 'me', text: 'Happy to walk you through our Figma structure if that\'d help?', time: '12:00 PM' },
      { from: 'them', text: 'That would be amazing. Could we do 30 min this week?', time: '12:05 PM' },
      { from: 'me', text: 'Yep — Thursday at 2pm your time?', time: '12:07 PM' },
      { from: 'them', text: 'Sounds great — I\'ll send the Figma file over this afternoon.', time: '12:08 PM' },
    ]},
  { id: 1, name: 'Daniel Amrani', role: 'Head of Brand · Pylon', avatar: 'DA', variant: 'g2',
    time: '10:42 AM', preview: 'Totally — let me know when the deck is ready and I\'ll review.',
    unread: true, messages: [
      { from: 'them', text: 'Totally — let me know when the deck is ready and I\'ll review.', time: '10:42 AM' },
    ]},
  { id: 2, name: 'Priya Ravi', role: 'Design Engineer · Atlas', avatar: 'PR', variant: 'g5',
    time: 'Yesterday', preview: 'You: Thanks! Congrats on the launch btw 🎉', unread: false, messages: [
      { from: 'me', text: 'Thanks! Congrats on the launch btw 🎉', time: 'Yesterday 4:12 PM' },
    ]},
  { id: 3, name: 'Helix Systems Recruiting', role: 'Company page', avatar: 'HX', variant: 'g2',
    time: 'Yesterday', preview: 'We just opened a Staff role on the platform team — interested?', unread: false, messages: [
      { from: 'them', text: 'We just opened a Staff role on the platform team — interested?', time: 'Yesterday 2:03 PM' },
    ]},
  { id: 4, name: 'Miriam Chen', role: 'VP Design · Helix', avatar: 'MC', variant: 'g4',
    time: '3 days ago', preview: 'Let\'s grab coffee next time you\'re in London!', unread: false, messages: [
      { from: 'them', text: 'Let\'s grab coffee next time you\'re in London!', time: '3 days ago' },
    ]},
  { id: 5, name: 'Ines Caballero', role: 'Founder · Unwritten', avatar: 'IC', variant: 'g2',
    time: 'Last week', preview: 'You: Forwarding your note to my cofounder — thanks for the intro.', unread: false, messages: [
      { from: 'me', text: 'Forwarding your note to my cofounder — thanks for the intro.', time: 'Last week' },
    ]},
];

function MessagesPage() {
  const [selectedId, setSelectedId] = useState(0);
  const [filter, setFilter] = useState('focused'); // focused | other
  const [draft, setDraft] = useState('');
  const conv = CONVERSATIONS.find(c => c.id === selectedId);

  return (
    <section className="panel" style={{ padding: 0, overflow: 'hidden', height: 'calc(100vh - 160px)', display: 'grid', gridTemplateColumns: '340px 1fr' }}>
      {/* Left: conversations */}
      <div style={{ borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, flex: 1 }}>Messaging</span>
          <button className="btn btn--ghost btn--sm" style={{ padding: 4 }}><Icon name="more_horiz" /></button>
          <button className="btn btn--ghost btn--sm" style={{ padding: 4 }}><Icon name="edit" /></button>
        </div>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="topnav__search" style={{ position: 'relative' }}>
            <Icon name="search" style={{ fontSize: 16 }} />
            <input placeholder="Search messages" />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <button className={`chip-tab ${filter === 'focused' ? 'active' : ''}`} onClick={() => setFilter('focused')}>Focused</button>
            <button className={`chip-tab ${filter === 'other' ? 'active' : ''}`} onClick={() => setFilter('other')}>Other</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {CONVERSATIONS.map(c => (
            <button
              key={c.id}
              type="button"
              className={`conv-row ${selectedId === c.id ? 'active' : ''}`}
              onClick={() => setSelectedId(c.id)}
            >
              <Avatar
                initials={c.avatar}
                size={48}
                variant={c.variant}
                photoSeed={c.role.includes('Company') ? null : c.name}
                style={c.role.includes('Company') ? { borderRadius: 8 } : null}
              />
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: c.unread ? 700 : 600, fontSize: 14, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: c.unread ? 'var(--accent-fg)' : 'var(--fg-subtle)', whiteSpace: 'nowrap' }}>{c.time}</span>
                </div>
                <div style={{ fontSize: 12, color: c.unread ? 'var(--fg)' : 'var(--fg-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: c.unread ? 500 : 400 }}>
                  {c.preview}
                </div>
              </div>
              {c.unread && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Right: thread */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {conv && (
          <>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar
                initials={conv.avatar}
                size={40}
                variant={conv.variant}
                photoSeed={conv.role.includes('Company') ? null : conv.name}
                style={conv.role.includes('Company') ? { borderRadius: 6 } : null}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{conv.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{conv.role}</div>
              </div>
              <button className="btn btn--ghost btn--sm" style={{ padding: 8 }} aria-label="Call"><Icon name="work" /></button>
              <button className="btn btn--ghost btn--sm" style={{ padding: 8 }} aria-label="More"><Icon name="more_horiz" /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
              <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--fg-subtle)', padding: '8px 0' }}>
                Today
              </div>
              {conv.messages.map((m, i) => (
                <div key={i} className={`msg msg--${m.from}`}>
                  <div className="msg__bubble">{m.text}</div>
                  <div className="msg__time">{m.time}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', padding: 12 }}>
              <div className="msg-composer">
                <textarea
                  placeholder={`Write a message to ${conv.name.split(' ')[0]}…`}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={2}
                />
                <div className="msg-composer__toolbar">
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn--ghost btn--sm" style={{ padding: 6 }}><Icon name="image" /></button>
                    <button className="btn btn--ghost btn--sm" style={{ padding: 6 }}><Icon name="event" /></button>
                    <button className="btn btn--ghost btn--sm" style={{ padding: 6 }}><Icon name="favorite" /></button>
                  </div>
                  <Button variant="primary" size="sm" pill iconRight="send" onClick={() => setDraft('')}>Send</Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ---------------- Alerts (Notifications) ----------------

const ALERTS = [
  { id: 0, type: 'mention', unread: true, time: '12m',
    avatar: 'SA', variant: 'g4', actor: 'Sofia Antonova',
    title: <><strong>Sofia Antonova</strong> mentioned you in a comment</>,
    body: '"…following Yara\'s approach on scoped aliases we\'ve cut our token sprawl in half."' },
  { id: 1, type: 'reaction', unread: true, time: '1h',
    avatar: 'DA', variant: 'g2', actor: 'Daniel Amrani',
    title: <><strong>Daniel Amrani</strong> and <strong>42 others</strong> reacted to your post</>,
    body: '"A design system is a contract, not a style guide."' },
  { id: 2, type: 'job', unread: true, time: '3h',
    avatar: 'HX', variant: 'g2', isCompany: true,
    title: <>A new job matches your preferences: <strong>Staff Product Designer</strong> at Helix Systems</>,
    body: 'Lisbon or Remote · €110k – €140k · Matches 8 of 10 skills' },
  { id: 3, type: 'connection', unread: false, time: '6h',
    avatar: 'PR', variant: 'g5', actor: 'Priya Ravi',
    title: <><strong>Priya Ravi</strong> accepted your connection request</>,
    body: 'You have 12 mutual connections, including Miriam Chen.' },
  { id: 4, type: 'post', unread: false, time: '1d',
    avatar: 'DS', variant: 'g4', isCompany: true,
    title: <><strong>Design Systems Guild</strong> posted for the first time in a while</>,
    body: 'Weekly digest: what\'s new in Radix, Tokens Studio, and Specify.' },
  { id: 5, type: 'anniversary', unread: false, time: '2d',
    avatar: 'MC', variant: 'g4', actor: 'Miriam Chen',
    title: <><strong>Miriam Chen</strong> is celebrating 5 years at Helix Systems</>,
    body: 'Say congrats to keep in touch.' },
  { id: 6, type: 'view', unread: false, time: '3d',
    avatar: 'YO', variant: 'g1', actor: 'Yara Okonkwo',
    title: <><strong>Your profile appeared in 14 searches</strong> this week</>,
    body: 'Searchers from Helix, Atlas, and Vector found you via "design systems".' },
  { id: 7, type: 'post', unread: false, time: '5d',
    avatar: 'VE', variant: 'g6', isCompany: true,
    title: <><strong>Vector Project OS</strong> shared a post you might like</>,
    body: 'How we wrote our design engineering rubric (public).' },
];

const ALERT_ICON_MAP = {
  mention: { icon: 'chat_bubble', color: 'var(--accent-fg)' },
  reaction: { icon: 'favorite', color: 'var(--danger-fg)' },
  job: { icon: 'work', color: 'var(--success-fg)' },
  connection: { icon: 'group', color: 'var(--accent-fg)' },
  post: { icon: 'article', color: 'var(--warning-fg)' },
  anniversary: { icon: 'favorite', color: 'var(--alt-fg)' },
  view: { icon: 'visibility', color: 'var(--fg-muted)' },
};

function AlertRow({ alert, compact }) {
  const ico = ALERT_ICON_MAP[alert.type] || { icon: 'notifications', color: 'var(--fg-muted)' };
  return (
    <div className={`alert-row ${alert.unread ? 'alert-row--unread' : ''} ${compact ? 'alert-row--compact' : ''}`}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Avatar
          initials={alert.avatar}
          size={compact ? 40 : 48}
          variant={alert.variant}
          photo={alert.actor === 'Yara Okonkwo' ? seededPhoto('yara-okonkwo', 96, 96, 'face') : undefined}
          photoSeed={alert.isCompany || alert.actor === 'Yara Okonkwo' ? null : alert.actor}
          style={{ borderRadius: alert.isCompany ? 8 : '50%' }}
        />
        <span className="alert-row__type-badge" style={{ color: ico.color }}>
          <Icon name={ico.icon} filled style={{ fontSize: 12 }} />
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: compact ? 13 : 14, lineHeight: 1.45, color: 'var(--fg)' }}>{alert.title}</div>
        {alert.body && (
          <div style={{ fontSize: compact ? 12 : 13, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.5 }}>
            {alert.body}
          </div>
        )}
        <div className="meta" style={{ marginTop: 6 }}>{alert.time} ago</div>
      </div>
      {!compact && (
        <button className="btn btn--ghost btn--sm" style={{ padding: 4, alignSelf: 'flex-start' }}>
          <Icon name="more_horiz" />
        </button>
      )}
    </div>
  );
}

function AlertsPage() {
  const [tab, setTab] = useState('all'); // all | mentions | jobs | posts

  const filtered = tab === 'all' ? ALERTS :
    tab === 'mentions' ? ALERTS.filter(a => a.type === 'mention' || a.type === 'reaction') :
    tab === 'jobs' ? ALERTS.filter(a => a.type === 'job') :
    tab === 'posts' ? ALERTS.filter(a => a.type === 'post') :
    ALERTS;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
      <main className="stack">
        <section className="panel" style={{ padding: '0 8px' }}>
          <div className="results-tabs">
            <button className={`results-tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All</button>
            <button className={`results-tab ${tab === 'mentions' ? 'active' : ''}`} onClick={() => setTab('mentions')}>Mentions</button>
            <button className={`results-tab ${tab === 'jobs' ? 'active' : ''}`} onClick={() => setTab('jobs')}>Jobs</button>
            <button className={`results-tab ${tab === 'posts' ? 'active' : ''}`} onClick={() => setTab('posts')}>Posts</button>
            <span style={{ marginLeft: 'auto', padding: '0 10px', fontSize: 12, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center' }}>
              <button className="btn btn--ghost btn--sm">Mark all read</button>
            </span>
          </div>
        </section>
        <section className="panel" style={{ padding: 0 }}>
          {filtered.map((a, i) => (
            <React.Fragment key={a.id}>
              <AlertRow alert={a} />
              {i === 2 && <InlineAd ad={AD_LIBRARY.course} />}
            </React.Fragment>
          ))}
        </section>
      </main>
      <aside className="stack">
        <section className="panel">
          <div className="panel__header"><span>Notification settings</span></div>
          <div style={{ padding: 14 }}>
            {['Mentions of you', 'Job recommendations', 'Network activity', 'Posts from groups', 'Profile searches'].map((x, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none' }}>
                <span style={{ fontSize: 13 }}>{x}</span>
                <span style={{ fontSize: 12, color: 'var(--success-fg)', fontWeight: 600 }}>On</span>
              </div>
            ))}
          </div>
        </section>
        <RailAd ad={AD_LIBRARY.aws} />
      </aside>
    </div>
  );
}

// ---------------- Alerts Dropdown (from bell) ----------------

function AlertsDropdown({ onClose, onViewAll }) {
  const recent = ALERTS.slice(0, 6);
  const unreadCount = ALERTS.filter(a => a.unread).length;
  return (
    <div className="alerts-dropdown">
      <div className="alerts-dropdown__header">
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Notifications</span>
        {unreadCount > 0 && <Pill variant="accent">{unreadCount} new</Pill>}
        <button
          className="btn btn--ghost btn--sm"
          style={{ marginLeft: 'auto', padding: 4 }}
          onClick={onClose}
          aria-label="Close"
        >
          <Icon name="close" />
        </button>
      </div>
      <div className="alerts-dropdown__body">
        {recent.map(a => <AlertRow key={a.id} alert={a} compact />)}
      </div>
      <div className="alerts-dropdown__footer">
        <button className="btn btn--ghost btn--sm" style={{ width: '100%' }} onClick={onViewAll}>
          View all notifications
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { MessagesPage, AlertsPage, AlertsDropdown });
