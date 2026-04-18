// Search: typeahead dropdown (2 layouts) + results page with smart filters.
//
// SearchBox is the live input. It:
//   - owns the query state
//   - on focus / non-empty value, renders Typeahead
//   - submits (Enter / click row) -> onSubmit(query) -> App routes to /search
//
// Typeahead layouts:
//   'grouped'  — LinkedIn-style: sections (People, Companies, Jobs, Groups, Posts) with headers
//   'compact'  — Spotlight-style: single flat list with small row-type chips
//
// SearchResults page renders smart filter rails + mixed-type list.

const SEARCH_INDEX = [
  // People
  { type: 'person', id: 'p1', title: 'Sofia Antonova', sub: 'Staff Designer · Helix', avatar: 'SA', variant: 'g4', connection: '2nd', location: 'Lisbon, PT', industry: 'Design' },
  { type: 'person', id: 'p2', title: 'Sofia Nakamura', sub: 'Design Lead · Pulse', avatar: 'SN', variant: 'g5', connection: '3rd', location: 'Berlin, DE', industry: 'Design' },
  { type: 'person', id: 'p3', title: 'Sonya Petersen', sub: 'Product Manager · Atlas', avatar: 'SP', variant: 'g2', connection: '2nd', location: 'Oslo, NO', industry: 'Product' },
  { type: 'person', id: 'p4', title: 'Solomon Reyes', sub: 'Design Engineer · Vector', avatar: 'SR', variant: 'g6', connection: '1st', location: 'Mexico City, MX', industry: 'Engineering' },
  { type: 'person', id: 'p5', title: 'Miriam Chen', sub: 'VP Design · Helix', avatar: 'MC', variant: 'g4', connection: '2nd', location: 'London, UK', industry: 'Design' },
  { type: 'person', id: 'p6', title: 'Daniel Amrani', sub: 'Head of Brand · Pylon', avatar: 'DA', variant: 'g2', connection: '1st', location: 'Tel Aviv, IL', industry: 'Design' },
  { type: 'person', id: 'p7', title: 'Priya Ravi', sub: 'Design Engineer · Atlas', avatar: 'PR', variant: 'g5', connection: '3rd', location: 'Bengaluru, IN', industry: 'Engineering' },

  // Companies
  { type: 'company', id: 'c1', title: 'Helix Systems', sub: 'Product & Design Platform · 24,802 followers', avatar: 'HX', variant: 'g2', industry: 'Software', location: 'Lisbon, PT' },
  { type: 'company', id: 'c2', title: 'Atlas Docs', sub: 'Knowledge Tools · 214,882 followers', avatar: 'AT', variant: 'g5', industry: 'Software', location: 'New York, NY' },
  { type: 'company', id: 'c3', title: 'Pulse Meetings', sub: 'Productivity · 84,320 followers', avatar: 'PU', variant: 'g1', industry: 'Software', location: 'Remote' },
  { type: 'company', id: 'c4', title: 'Vector Project OS', sub: 'Developer Tools · 42,112 followers', avatar: 'VE', variant: 'g6', industry: 'Software', location: 'Amsterdam, NL' },

  // Jobs
  { type: 'job', id: 'j1', title: 'Staff Product Designer', sub: 'Helix · Lisbon or Remote · 5d', avatar: 'HX', variant: 'g2', industry: 'Design', location: 'Lisbon, PT' },
  { type: 'job', id: 'j2', title: 'Senior Design Engineer', sub: 'Atlas Docs · Remote · 2d', avatar: 'AT', variant: 'g5', industry: 'Engineering', location: 'Remote' },
  { type: 'job', id: 'j3', title: 'Design Systems Lead', sub: 'Vector · Amsterdam · 1w', avatar: 'VE', variant: 'g6', industry: 'Design', location: 'Amsterdam, NL' },
  { type: 'job', id: 'j4', title: 'Staff Brand Designer', sub: 'Pulse · New York · 3d', avatar: 'PU', variant: 'g1', industry: 'Design', location: 'New York, NY' },

  // Groups
  { type: 'group', id: 'g1', title: 'Design Systems Guild', sub: '28,402 members · Active daily', avatar: 'DS', variant: 'g4', industry: 'Design' },
  { type: 'group', id: 'g2', title: 'Design Engineers', sub: '12,104 members · 4 new posts today', avatar: 'DE', variant: 'g5', industry: 'Engineering' },
  { type: 'group', id: 'g3', title: 'Staff+ Designers', sub: '4,822 members · Invite only', avatar: 'S+', variant: 'g2', industry: 'Design' },

  // Posts
  { type: 'post', id: 'post1', title: '"Most design systems are asset libraries with a sitemap…"', sub: 'Daniel Amrani · 1,204 reactions', avatar: 'DA', variant: 'g2', industry: 'Design' },
  { type: 'post', id: 'post2', title: 'Shipping a refresh of our component library today.', sub: 'Sofia Antonova · 482 reactions', avatar: 'SA', variant: 'g4', industry: 'Design' },
  { type: 'post', id: 'post3', title: 'A real system teaches you how to decide.', sub: 'Design Systems Guild · 312 reactions', avatar: 'DS', variant: 'g4', industry: 'Design' },
];

const RECENT_SEARCHES = ['staff designer', 'helix systems', 'design engineer remote', 'priya ravi'];

function matchScore(q, entry) {
  if (!q) return 0;
  const needle = q.toLowerCase();
  const hay = (entry.title + ' ' + entry.sub).toLowerCase();
  if (hay.startsWith(needle)) return 3;
  if (entry.title.toLowerCase().includes(needle)) return 2;
  if (hay.includes(needle)) return 1;
  return 0;
}

function searchMatches(q, { limit = 50 } = {}) {
  if (!q) return [];
  const scored = SEARCH_INDEX
    .map(e => ({ e, s: matchScore(q, e) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s);
  return scored.slice(0, limit).map(x => x.e);
}

const TYPE_LABELS = {
  person: 'Person', company: 'Company', job: 'Job', group: 'Group', post: 'Post',
};
const TYPE_ICONS = {
  person: 'person', company: 'work', job: 'work', group: 'groups', post: 'article',
};

function SearchBox({ value, onChange, onSubmit, typeaheadLayout = 'grouped' }) {
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const matches = searchMatches(value, { limit: 30 });

  const submit = (q) => {
    onSubmit?.(q);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="topnav__search" style={{ position: 'relative' }}>
      <Icon name="search" style={{ fontSize: 16 }} />
      <input
        placeholder="Search people, companies, posts"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setFocusIdx(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { submit(value); }
          else if (e.key === 'Escape') { setOpen(false); }
        }}
      />
      {open && (
        <TypeaheadDropdown
          query={value}
          matches={matches}
          layout={typeaheadLayout}
          onSubmit={submit}
        />
      )}
    </div>
  );
}

function TypeaheadDropdown({ query, matches, layout, onSubmit }) {
  if (!query) {
    return (
      <div className="typeahead">
        <div className="typeahead__section-title">Recent</div>
        {RECENT_SEARCHES.map((q, i) => (
          <div key={i} className="typeahead__row" onMouseDown={(e) => { e.preventDefault(); onSubmit(q); }}>
            <span className="typeahead__icon"><Icon name="history" style={{ fontSize: 18 }} /></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13 }}>{q}</div>
            </div>
            <Icon name="arrow_forward" style={{ fontSize: 14, color: 'var(--fg-subtle)' }} />
          </div>
        ))}
        <div className="typeahead__section-title">Try searching for</div>
        {['design engineer', 'product manager', 'helix', 'staff designer'].map((q, i) => (
          <div key={i} className="typeahead__row" onMouseDown={(e) => { e.preventDefault(); onSubmit(q); }}>
            <span className="typeahead__icon"><Icon name="search" style={{ fontSize: 18 }} /></span>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{q}</div>
          </div>
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="typeahead">
        <div style={{ padding: 20, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>
          No matches for "<strong style={{ color: 'var(--fg)' }}>{query}</strong>". Press Enter to search the full index.
        </div>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <div className="typeahead">
        <div
          className="typeahead__row typeahead__row--primary"
          onMouseDown={(e) => { e.preventDefault(); onSubmit(query); }}
        >
          <span className="typeahead__icon"><Icon name="search" style={{ fontSize: 18 }} /></span>
          <div style={{ flex: 1, fontSize: 13 }}>
            Search <strong>"{query}"</strong> everywhere
          </div>
          <Pill variant="accent">Enter ↵</Pill>
        </div>
        <div className="typeahead__divider" />
        {matches.slice(0, 10).map(m => (
          <div key={m.id} className="typeahead__row" onMouseDown={(e) => { e.preventDefault(); onSubmit(m.title); }}>
            <Avatar
              initials={m.avatar}
              size={32}
              variant={m.variant}
              photoSeed={m.type === 'person' ? m.title : null}
              style={{ borderRadius: m.type === 'company' ? 6 : '50%' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {highlightMatch(m.title, query)}
              </div>
              <div className="meta" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.sub}</div>
            </div>
            <span className="typeahead__type-chip">
              <Icon name={TYPE_ICONS[m.type]} style={{ fontSize: 12 }} />
              {TYPE_LABELS[m.type]}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // grouped
  const grouped = { person: [], company: [], job: [], group: [], post: [] };
  matches.forEach(m => grouped[m.type]?.push(m));
  const order = ['person', 'company', 'job', 'group', 'post'];
  const sectionTitles = { person: 'People', company: 'Companies', job: 'Jobs', group: 'Groups', post: 'Posts' };

  return (
    <div className="typeahead">
      <div
        className="typeahead__row typeahead__row--primary"
        onMouseDown={(e) => { e.preventDefault(); onSubmit(query); }}
      >
        <span className="typeahead__icon"><Icon name="search" style={{ fontSize: 18 }} /></span>
        <div style={{ flex: 1, fontSize: 13 }}>
          See all results for <strong>"{query}"</strong>
        </div>
        <Icon name="arrow_forward" style={{ fontSize: 14, color: 'var(--fg-subtle)' }} />
      </div>
      {order.map(t => grouped[t].length > 0 && (
        <div key={t}>
          <div className="typeahead__section-title">
            <Icon name={TYPE_ICONS[t]} style={{ fontSize: 12, marginRight: 4, verticalAlign: 'middle' }} />
            {sectionTitles[t]}
          </div>
          {grouped[t].slice(0, 3).map(m => (
            <div key={m.id} className="typeahead__row" onMouseDown={(e) => { e.preventDefault(); onSubmit(m.title); }}>
              <Avatar
                initials={m.avatar}
                size={36}
                variant={m.variant}
                photoSeed={t === 'person' ? m.title : null}
                style={{ borderRadius: (t === 'company' || t === 'job') ? 6 : '50%' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {highlightMatch(m.title, query)}
                </div>
                <div className="meta" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.sub}</div>
              </div>
              {t === 'person' && m.connection && <Pill>{m.connection}</Pill>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: 'var(--accent-subtle)', color: 'var(--accent-fg)', padding: '0 2px', borderRadius: 2 }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ---------- Results page ----------

function SearchResults({ query, onQueryChange }) {
  const [tab, setTab] = useState('all'); // all | people | jobs | companies | posts
  const [filters, setFilters] = useState({ location: 'any', industry: 'any', connection: 'any' });

  const base = searchMatches(query, { limit: 100 });

  const byTab = tab === 'all' ? base :
    tab === 'people' ? base.filter(e => e.type === 'person') :
    tab === 'jobs' ? base.filter(e => e.type === 'job') :
    tab === 'companies' ? base.filter(e => e.type === 'company') :
    tab === 'posts' ? base.filter(e => e.type === 'post' || e.type === 'group') :
    base;

  const filtered = byTab.filter(e =>
    (filters.location === 'any' || e.location === filters.location) &&
    (filters.industry === 'any' || e.industry === filters.industry) &&
    (filters.connection === 'any' || e.connection === filters.connection)
  );

  const allLocations = ['any', ...new Set(base.map(e => e.location).filter(Boolean))];
  const allIndustries = ['any', ...new Set(base.map(e => e.industry).filter(Boolean))];
  const allConnections = ['any', '1st', '2nd', '3rd'];

  const resetFilters = () => setFilters({ location: 'any', industry: 'any', connection: 'any' });
  const hasFilters = filters.location !== 'any' || filters.industry !== 'any' || filters.connection !== 'any';

  const tabs = [
    { id: 'all', label: 'All', count: base.length },
    { id: 'people', label: 'People', count: base.filter(e => e.type === 'person').length },
    { id: 'jobs', label: 'Jobs', count: base.filter(e => e.type === 'job').length },
    { id: 'companies', label: 'Companies', count: base.filter(e => e.type === 'company').length },
    { id: 'posts', label: 'Posts', count: base.filter(e => e.type === 'post' || e.type === 'group').length },
  ];

  return (
    <main className="stack" style={{ minWidth: 0 }}>
      {/* Tab row */}
      <section className="panel" style={{ padding: '0 8px' }}>
        <div className="results-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`results-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              <span className="results-tab__count">{t.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Filter rail */}
      <section className="panel" style={{ padding: 14 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="meta" style={{ fontWeight: 600, color: 'var(--fg)' }}>Smart filters</span>
          <FilterSelect label="Location" value={filters.location} options={allLocations} onChange={v => setFilters(f => ({ ...f, location: v }))} />
          <FilterSelect label="Industry" value={filters.industry} options={allIndustries} onChange={v => setFilters(f => ({ ...f, industry: v }))} />
          <FilterSelect label="Connection" value={filters.connection} options={allConnections} onChange={v => setFilters(f => ({ ...f, connection: v }))} />
          {hasFilters && (
            <button className="btn btn--ghost btn--sm" onClick={resetFilters}>Clear filters</button>
          )}
          <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--fg-muted)' }}>
            <strong style={{ color: 'var(--fg)' }}>{filtered.length}</strong> result{filtered.length === 1 ? '' : 's'}
          </div>
        </div>
      </section>

      {query === '' && (
        <section className="panel" style={{ padding: 40, textAlign: 'center' }}>
          <Icon name="search" style={{ fontSize: 48, color: 'var(--fg-subtle)' }} />
          <h3 style={{ marginTop: 16, fontFamily: 'var(--font-display)' }}>Search the Davinci network</h3>
          <p className="meta" style={{ marginTop: 8 }}>Start typing above to find people, companies, jobs, groups, and posts.</p>
        </section>
      )}

      {query !== '' && filtered.length === 0 && (
        <section className="panel" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 14 }}>No results for "<strong>{query}</strong>" with these filters.</div>
          {hasFilters && <button className="btn btn--outline btn--sm" style={{ marginTop: 12 }} onClick={resetFilters}>Clear filters</button>}
        </section>
      )}

      {filtered.map((r, i) => (
        <React.Fragment key={r.id}>
          <ResultRow result={r} query={query} />
          {/* Sprinkle an ad every 4 results */}
          {(i + 1) % 4 === 0 && i < filtered.length - 1 && (
            <InlineAd ad={AD_LIBRARY.recruit} />
          )}
        </React.Fragment>
      ))}
    </main>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="filter-select">
      <span className="filter-select__label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(o => (
          <option key={o} value={o}>{o === 'any' ? `Any ${label.toLowerCase()}` : o}</option>
        ))}
      </select>
      <Icon name="arrow_forward" style={{ fontSize: 12, transform: 'rotate(90deg)', color: 'var(--fg-subtle)' }} />
    </label>
  );
}

function ResultRow({ result, query }) {
  const { type } = result;
  const isRound = type === 'person';
  return (
    <section className="panel" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <Avatar
        initials={result.avatar}
        size={48}
        variant={result.variant}
        photoSeed={isRound ? result.title : null}
        style={{ borderRadius: isRound ? '50%' : 8 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>
            {highlightMatch(result.title, query)}
          </span>
          {type === 'person' && result.connection && <Pill>{result.connection}</Pill>}
          {type === 'job' && <Pill variant="success">Hiring</Pill>}
          <span style={{ marginLeft: 'auto' }}>
            <span className="typeahead__type-chip">
              <Icon name={TYPE_ICONS[type]} style={{ fontSize: 12 }} />
              {TYPE_LABELS[type]}
            </span>
          </span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>{result.sub}</div>
        {(result.location || result.industry) && (
          <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 12, color: 'var(--fg-muted)' }}>
            {result.location && <span><Icon name="location_on" style={{ fontSize: 12, verticalAlign: 'middle', marginRight: 2 }} />{result.location}</span>}
            {result.industry && <span>· {result.industry}</span>}
          </div>
        )}
        <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
          {type === 'person' && <Button variant="outline" size="sm" pill icon="add">Connect</Button>}
          {type === 'person' && <Button variant="ghost" size="sm" pill>Message</Button>}
          {type === 'company' && <Button variant="outline" size="sm" pill icon="add">Follow</Button>}
          {type === 'job' && <Button variant="primary" size="sm" pill>Apply</Button>}
          {type === 'job' && <Button variant="ghost" size="sm" pill icon="bookmark">Save</Button>}
          {type === 'group' && <Button variant="outline" size="sm" pill>Join</Button>}
          {type === 'post' && <Button variant="ghost" size="sm" pill icon="arrow_forward">Read post</Button>}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { SearchBox, TypeaheadDropdown, SearchResults });
