// Topnav + shared components for the Davinci web-app UI kit

const { useState, useEffect, useRef } = React;

function Logo({ size = 32 }) {
  // Inlined so CSS vars (--dv-logo-*) flow through; <img src> would be opaque.
  const h = size;
  const w = Math.round(size * (220 / 56));
  return (
    <div className="topnav__brand" aria-label="Davinci">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 220 56"
        width={w}
        height={h}
        role="img"
        aria-label="Davinci"
        className="dv-logo"
      >
        <g transform="translate(4,8)">
          <rect x="0" y="0" width="40" height="40" rx="8" style={{ fill: 'var(--dv-logo-mark)' }} />
          <path d="M11 10 h10 a10 10 0 0 1 10 10 v0 a10 10 0 0 1 -10 10 h-10 z" style={{ fill: 'var(--dv-logo-counter)' }} />
          <circle cx="24" cy="20" r="3" style={{ fill: 'var(--dv-logo-accent)' }} />
        </g>
        <text
          x="54" y="29.5"
          dominantBaseline="central"
          style={{
            fill: 'var(--dv-logo-text)',
            fontFamily: 'var(--font-display, Inter, ui-sans-serif, system-ui, sans-serif)',
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: '-0.02em',
          }}
        >davinci</text>
      </svg>
    </div>
  );
}

/* Icon: Material Symbols Outlined via PUA codepoints.
   Codepoints are more reliable than ligatures in sandboxed iframes. */
const ICON_CODEPOINTS = {
  home: '\ue88a',
  search: '\ue8b6',
  group: '\uf233',
  groups: '\uf233',
  work: '\ue8f9',
  chat_bubble: '\ue0ca',
  notifications: '\ue7f4',
  person: '\ue7fd',
  settings: '\ue8b8',
  bookmark: '\ue866',
  favorite: '\ue87d',
  event: '\ue878',
  newspaper: '\ueb81',
  history: '\ue889',
  info: '\ue88e',
  add: '\ue145',
  edit: '\ue3c9',
  link: '\ue157',
  delete: '\ue872',
  more_horiz: '\ue5d3',
  more_vert: '\ue5d4',
  public: '\ue80b',
  thumb_up: '\ue8dc',
  repeat: '\ue040',
  send: '\ue163',
  mail: '\ue0be',
  image: '\ue3f4',
  play_circle: '\ue1c4',
  article: '\uef42',
  location_on: '\ue0c8',
  arrow_forward: '\ue5c8',
  dark_mode: '\ue51c',
  light_mode: '\ue518',
  close: '\ue5cd',
  check: '\ue5ca',
  visibility: '\ue8f4',
  lock: '\ue897',
};

function Icon({ name, filled, style, className = '' }) {
  return (
    <span
      className={`material-symbols-outlined ${filled ? 'icon-filled' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

// Deterministic seeded photo URL.
// kind: 'face' → hand-curated Unsplash portraits matched to each character;
//       'banner'/'article'/'office' → picsum.photos with topical seed prefixes.
//
// PORTRAIT_MAP pins each named character to a specific Unsplash portrait so
// gender + apparent ethnicity roughly match the (fictional) name. Keys are
// normalized (lowercase, alphanumeric-and-space). Add an entry here whenever
// you introduce a new named character.
//
// URLs are images.unsplash.com/photo-<id> — stable, CDN-served, no API key.
const PORTRAIT_MAP = {
  // Yara Okonkwo — West African woman (main user)
  'yara okonkwo':   'photo-1531123897727-8f129e1688ce',
  // Sofia Antonova — Eastern European woman
  'sofia antonova': 'photo-1544005313-94ddf0286df2',
  // Daniel Amrani — North African / Middle Eastern man
  'daniel amrani':  'photo-1507003211169-0a1dd7228f2d',
  // Priya Ravi — South Asian woman
  'priya ravi':     'photo-1580489944761-15a19d654956',
  // Miriam Chen — East Asian woman
  'miriam chen':    'photo-1573496359142-b8d87734a5a2',
  // Ines Caballero — Latina woman
  'ines caballero': 'photo-1534528741775-53994a69daeb',
  // Kai Thornton — White/mixed man
  'kai thornton':   'photo-1472099645785-5658abf4ff4e',
  // Noor Farsi — Middle Eastern / Persian woman (hijabi or not — using non-hijab portrait)
  'noor farsi':     'photo-1548142813-c348350df52b',
  // Lena Brandt — Northern European woman
  'lena brandt':    'photo-1438761681033-6461ffad8d80',
  // Ore Adebayo — West African man
  'ore adebayo':    'photo-1506794778202-cad84cf45f1d',
  // Tara Weiss — White woman
  'tara weiss':     'photo-1554151228-14d9def656e4',
  // Marcus Lind — Nordic/White man
  'marcus lind':    'photo-1492562080023-ab3db95bfbce',
  // Jude Abara — East/Southern African man
  'jude abara':     'photo-1519085360753-af0119f7cbe7',
  // Emeline Roux — French/White woman
  'emeline roux':   'photo-1494790108377-be9c29b29330',
  // Sofia Nakamura — Japanese woman (Berlin-based)
  'sofia nakamura': 'photo-1517365830460-955ce3ccd263',
  // Sonya Petersen — Nordic woman
  'sonya petersen': 'photo-1487412720507-e7ab37603c6f',
  // Solomon Reyes — Mexican / Latino man
  'solomon reyes':  'photo-1500648767791-00dcc994a43e',
};

function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Fallback pool: generic Unsplash portraits (varied demographics) indexed by hash
// when a name isn't in PORTRAIT_MAP. Try to keep this list balanced.
const FALLBACK_PORTRAITS = [
  'photo-1502823403499-6ccfcf4fb453', 'photo-1506794778202-cad84cf45f1d',
  'photo-1534528741775-53994a69daeb', 'photo-1580489944761-15a19d654956',
  'photo-1507003211169-0a1dd7228f2d', 'photo-1508214751196-bcfd4ca60f91',
  'photo-1573496359142-b8d87734a5a2', 'photo-1517841905240-472988babdf9',
  'photo-1438761681033-6461ffad8d80', 'photo-1519085360753-af0119f7cbe7',
  'photo-1544005313-94ddf0286df2',   'photo-1531123897727-8f129e1688ce',
];

function seededPhoto(seed, w = 200, h = 200, kind = 'face') {
  const safe = String(seed).toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'x';
  if (kind === 'face') {
    const lookupKey = String(seed).toLowerCase()
      .replace(/-banner$|-avatar$/, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
    const photoId = PORTRAIT_MAP[lookupKey]
      || FALLBACK_PORTRAITS[hashCode(safe) % FALLBACK_PORTRAITS.length];
    const size = Math.max(w, h);
    return `https://images.unsplash.com/${photoId}?w=${size}&h=${size}&fit=crop&crop=faces&auto=format&q=75`;
  }
  const prefix = kind === 'banner' ? 'b-' : kind === 'article' ? 'a-' : kind === 'office' ? 'o-' : '';
  return `https://picsum.photos/seed/${prefix}${safe}/${w}/${h}`;
}

// Returns a face photo URL for the given seed, always (deterministic, no skip).
// We used to skip ~30% at random to mix in initial tiles, but that caused the
// same person to show a photo on one page and initials on another. Consistency
// wins — always return a photo for person seeds.
function maybePhoto(seed, w = 200, h = 200) {
  return seededPhoto(seed, w, h, 'face');
}

function Avatar({ initials, size = 40, variant = 'g1', photo, photoSeed, style }) {
  const [broken, setBroken] = useState(false);
  // photo: explicit URL or null to force initials.
  // photoSeed: string — auto-derive via maybePhoto (30% come back null → initials).
  // neither: no photo, always initials.
  let resolved = null;
  if (photo === null) resolved = null;
  else if (typeof photo === 'string') resolved = photo;
  else if (photoSeed) resolved = maybePhoto(photoSeed, size * 2, size * 2);
  const showPhoto = resolved && !broken;
  return (
    <div
      className={`avatar avatar--${size} avatar--${variant}`}
      style={style}
    >
      {showPhoto ? (
        <img
          src={resolved}
          alt=""
          loading="lazy"
          onError={() => setBroken(true)}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            borderRadius: 'inherit', display: 'block',
          }}
        />
      ) : initials}
    </div>
  );
}

function Pill({ children, variant, style }) {
  return <span className={`pill ${variant ? 'pill--' + variant : ''}`} style={style}>{children}</span>;
}

function Button({ variant = 'secondary', size, pill, children, onClick, icon, iconRight, style }) {
  const cls = [
    'btn',
    `btn--${variant}`,
    size === 'sm' && 'btn--sm',
    pill && 'btn--pill',
  ].filter(Boolean).join(' ');
  return (
    <button className={cls} onClick={onClick} style={style}>
      {icon && <Icon name={icon} style={{ fontSize: 16 }} />}
      {children}
      {iconRight && <Icon name={iconRight} style={{ fontSize: 16 }} />}
    </button>
  );
}

function TopNav({ active = 'home', onNavigate, searchValue = '', onSearchChange, onSearchSubmit, typeaheadLayout = 'grouped', alertCount = 0, alertsOpen = false, onToggleAlerts }) {
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
      {onSearchChange ? (
        <SearchBox
          value={searchValue}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          typeaheadLayout={typeaheadLayout}
        />
      ) : (
        <div className="topnav__search">
          <Icon name="search" style={{ fontSize: 16 }} />
          <input placeholder="Search people, companies, posts" />
        </div>
      )}
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
              {isAlerts && alertsOpen && (
                <AlertsDropdown
                  onClose={() => onToggleAlerts?.(false)}
                  onViewAll={() => { onToggleAlerts?.(false); onNavigate?.('notifications'); }}
                />
              )}
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

function Panel({ title, action, children, style, bodyStyle }) {
  return (
    <section className="panel" style={style}>
      {(title || action) && (
        <header className="panel__header">
          <span>{title}</span>
          {action}
        </header>
      )}
      <div className="panel__body" style={bodyStyle}>{children}</div>
    </section>
  );
}

Object.assign(window, {
  Logo, Icon, Avatar, Pill, Button, TopNav, Panel, seededPhoto, maybePhoto,
});
