import * as React from "react";

import { Surface } from "@davinci/ui/components/ui/surface";
import { Input } from "@davinci/ui/components/ui/input";
import { Textarea } from "@davinci/ui/components/ui/textarea";
import { RichTextarea } from "@davinci/ui/components/ui/rich-textarea";
import { Separator } from "@davinci/ui/components/ui/separator";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@davinci/ui/components/ui/select";

import {
  Icon, seededPhoto, Button, Avatar, Pill, Panel,
  FeedAd, RailAd, InlineAd, AD_LIBRARY,
} from "./lib.jsx";

const { useState, useEffect, useRef } = React;

/* ============================ Reactions + comments ============================ */
/* Standard social reaction set, rendered with Material Symbols. Each type has a
   consistent color wherever it appears. State is persisted to localStorage so the
   demo feels like a living product (no backend). */
const REACTIONS = [
  { id: "like", label: "Like", icon: "thumb_up", color: "var(--blue-9)" },
  { id: "love", label: "Love", icon: "favorite", color: "var(--red-9)" },
  { id: "celebrate", label: "Celebrate", icon: "celebration", color: "var(--green-9)" },
  { id: "support", label: "Support", icon: "volunteer_activism", color: "var(--violet-9)" },
  { id: "insightful", label: "Insightful", icon: "lightbulb", color: "var(--amber-9)" },
  { id: "funny", label: "Funny", icon: "mood", color: "var(--teal-9)" },
];
const REACTION_BY_ID = Object.fromEntries(REACTIONS.map((r) => [r.id, r]));

function loadStore(key) { try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch { return {}; } }
function saveStore(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ } }

function useReaction(postId) {
  const [reaction, set] = useState(() => loadStore("davinci_reactions")[postId] || null);
  const update = (id) => {
    set(id);
    const store = loadStore("davinci_reactions");
    if (id) store[postId] = id; else delete store[postId];
    saveStore("davinci_reactions", store);
  };
  return [reaction, update];
}

function useComments(postId, seed = []) {
  const [list, setList] = useState(() => loadStore("davinci_comments")[postId] || seed);
  const add = (text) => {
    const next = [...list, { author: "Yara Okonkwo", text, time: "Just now", me: true }];
    setList(next);
    const store = loadStore("davinci_comments");
    store[postId] = next;
    saveStore("davinci_comments", store);
  };
  return [list, add];
}

function ReactionChips({ ids }) {
  return (
    <span className="reaction-chips">
      {ids.map((id) => {
        const r = REACTION_BY_ID[id];
        return r ? <span key={id} className="reaction-chip" style={{ background: r.color }}><Icon name={r.icon} filled /></span> : null;
      })}
    </span>
  );
}

function ReactionBar({ postId, baseReactions, topReactions = ["like", "love", "insightful"], commentCount, onToggleComments }) {
  const [reaction, setReaction] = useReaction(postId);
  const [flyout, setFlyout] = useState(false);
  const holdRef = useRef(null);
  const heldRef = useRef(false);

  const startHold = () => { heldRef.current = false; holdRef.current = setTimeout(() => { heldRef.current = true; setFlyout(true); }, 350); };
  const endHold = () => clearTimeout(holdRef.current);
  const onClick = () => { if (heldRef.current) return; setReaction(reaction ? null : "like"); };
  const pick = (id) => { setReaction(id === reaction ? null : id); setFlyout(false); };

  const current = reaction ? REACTION_BY_ID[reaction] : null;
  const total = baseReactions + (reaction ? 1 : 0);
  const chips = (reaction ? [reaction, ...topReactions.filter((r) => r !== reaction)] : topReactions).slice(0, 3);

  return (
    <>
      <div className="post__reactions">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <ReactionChips ids={chips} /> {total.toLocaleString()}
        </span>
        <button type="button" onClick={onToggleComments} style={{ color: "inherit", cursor: "pointer" }}>{commentCount} comments</button>
      </div>
      <div className="post__actions">
        <div style={{ position: "relative", flex: 1, display: "flex" }} onMouseLeave={() => setFlyout(false)}>
          {flyout && (
            <div className="reaction-flyout" role="menu" aria-label="Pick a reaction">
              {REACTIONS.map((r) => (
                <button key={r.id} type="button" className="reaction-flyout__btn" title={r.label} aria-label={r.label} onClick={() => pick(r.id)} style={{ color: r.color }}>
                  <Icon name={r.icon} filled />
                </button>
              ))}
            </div>
          )}
          <button type="button" className={`post__action ${current ? "active" : ""}`} style={current ? { color: current.color } : undefined}
            onPointerDown={startHold} onPointerUp={endHold} onPointerLeave={endHold} onClick={onClick} aria-label="Like (press and hold for reactions)">
            <Icon name={current ? current.icon : "thumb_up"} filled={!!current} /><span>{current ? current.label : "Like"}</span>
          </button>
        </div>
        <button type="button" className="post__action" onClick={onToggleComments}><Icon name="chat_bubble" /><span>Comment</span></button>
        <button type="button" className="post__action"><Icon name="repeat" /><span>Repost</span></button>
        <button type="button" className="post__action"><Icon name="send" /><span>Send</span></button>
      </div>
    </>
  );
}

function Comments({ postId, seed }) {
  const [list, add] = useComments(postId, seed);
  const [draft, setDraft] = useState("");
  const submit = () => { const t = draft.trim(); if (!t) return; add(t); setDraft(""); };
  return (
    <div className="post__comments">
      <div className="comment-composer">
        <Avatar initials="YO" size={32} photo={seededPhoto("yara-okonkwo", 64, 64, "face")} />
        <Input size="sm" className="!rounded-full" placeholder="Add a comment…" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }} />
        <Button variant="primary" size="sm" pill onClick={submit} disabled={!draft.trim()}>Post</Button>
      </div>
      {list.map((c, i) => (
        <div key={i} className="comment">
          <Avatar initials={c.me ? "YO" : (c.author || "?").slice(0, 2).toUpperCase()} size={32} variant="g3" photoSeed={c.me ? null : c.author} photo={c.me ? seededPhoto("yara-okonkwo", 64, 64, "face") : undefined} />
          <div className="comment__bubble">
            <div className="comment__author">{c.author}</div>
            <div className="comment__text">{c.text}</div>
            <div className="comment__time">{c.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================ Logo ============================ */
function Logo() {
  return (
    <svg viewBox="0 0 220 56" width={Math.round(32 * (220 / 56))} height={32} role="img" aria-label="Davinci">
      <g transform="translate(4,8)">
        <rect x="0" y="0" width="40" height="40" rx="8" style={{ fill: "var(--dv-logo-mark)" }} />
        <path d="M11 10 h10 a10 10 0 0 1 10 10 v0 a10 10 0 0 1 -10 10 h-10 z" style={{ fill: "var(--dv-logo-counter)" }} />
        <circle cx="24" cy="20" r="3" style={{ fill: "var(--dv-logo-accent)" }} />
      </g>
      <text x="54" y="29.5" dominantBaseline="central" style={{ fill: "var(--dv-logo-text)", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, letterSpacing: "-0.02em" }}>davinci</text>
    </svg>
  );
}

/* ============================ Search ============================ */
const SEARCH_INDEX = [
  { type: "person", id: "p1", title: "Sofia Antonova", sub: "Staff Designer · Helix", avatar: "SA", variant: "g4", connection: "2nd", location: "Lisbon, PT", industry: "Design" },
  { type: "person", id: "p3", title: "Sonya Petersen", sub: "Product Manager · Atlas", avatar: "SP", variant: "g2", connection: "2nd", location: "Oslo, NO", industry: "Product" },
  { type: "person", id: "p4", title: "Solomon Reyes", sub: "Design Engineer · Vector", avatar: "SR", variant: "g6", connection: "1st", location: "Mexico City, MX", industry: "Engineering" },
  { type: "person", id: "p5", title: "Miriam Chen", sub: "VP Design · Helix", avatar: "MC", variant: "g4", connection: "2nd", location: "London, UK", industry: "Design" },
  { type: "person", id: "p6", title: "Daniel Amrani", sub: "Head of Brand · Pylon", avatar: "DA", variant: "g2", connection: "1st", location: "Tel Aviv, IL", industry: "Design" },
  { type: "person", id: "p7", title: "Priya Ravi", sub: "Design Engineer · Atlas", avatar: "PR", variant: "g5", connection: "3rd", location: "Bengaluru, IN", industry: "Engineering" },
  { type: "company", id: "c1", title: "Helix Systems", sub: "Product & Design Platform · 24,802 followers", avatar: "HX", variant: "g2", industry: "Software", location: "Lisbon, PT" },
  { type: "company", id: "c2", title: "Atlas Docs", sub: "Knowledge Tools · 214,882 followers", avatar: "AT", variant: "g5", industry: "Software", location: "New York, NY" },
  { type: "company", id: "c4", title: "Vector Project OS", sub: "Developer Tools · 42,112 followers", avatar: "VE", variant: "g6", industry: "Software", location: "Amsterdam, NL" },
  { type: "job", id: "j1", title: "Staff Product Designer", sub: "Helix · Lisbon or Remote · 5d", avatar: "HX", variant: "g2", industry: "Design", location: "Lisbon, PT" },
  { type: "job", id: "j2", title: "Senior Design Engineer", sub: "Atlas Docs · Remote · 2d", avatar: "AT", variant: "g5", industry: "Engineering", location: "Remote" },
  { type: "job", id: "j3", title: "Design Systems Lead", sub: "Vector · Amsterdam · 1w", avatar: "VE", variant: "g6", industry: "Design", location: "Amsterdam, NL" },
  { type: "group", id: "g1", title: "Design Systems Guild", sub: "28,402 members · Active daily", avatar: "DS", variant: "g4", industry: "Design" },
  { type: "group", id: "g2", title: "Design Engineers", sub: "12,104 members · 4 new posts today", avatar: "DE", variant: "g5", industry: "Engineering" },
  { type: "post", id: "post1", title: '"Most design systems are asset libraries with a sitemap…"', sub: "Daniel Amrani · 1,204 reactions", avatar: "DA", variant: "g2", industry: "Design" },
  { type: "post", id: "post2", title: "Shipping a refresh of our component library today.", sub: "Sofia Antonova · 482 reactions", avatar: "SA", variant: "g4", industry: "Design" },
];
const RECENT_SEARCHES = ["staff designer", "helix systems", "design engineer remote", "priya ravi"];
const TYPE_LABELS = { person: "Person", company: "Company", job: "Job", group: "Group", post: "Post" };
const TYPE_ICONS = { person: "person", company: "work", job: "work", group: "groups", post: "article" };

function matchScore(q, e) {
  if (!q) return 0;
  const needle = q.toLowerCase();
  const hay = (e.title + " " + e.sub).toLowerCase();
  if (hay.startsWith(needle)) return 3;
  if (e.title.toLowerCase().includes(needle)) return 2;
  if (hay.includes(needle)) return 1;
  return 0;
}
function searchMatches(q, { limit = 50 } = {}) {
  if (!q) return [];
  return SEARCH_INDEX.map((e) => ({ e, s: matchScore(q, e) })).filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s).slice(0, limit).map((x) => x.e);
}
function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return text;
  return (<>{text.slice(0, idx)}<mark style={{ background: "var(--accent-subtle)", color: "var(--accent-fg)", padding: "0 2px", borderRadius: 2 }}>{text.slice(idx, idx + query.length)}</mark>{text.slice(idx + query.length)}</>);
}

function SearchBox({ value, onChange, onSubmit }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const matches = searchMatches(value, { limit: 30 });
  const submit = (q) => { onSubmit?.(q); setOpen(false); };
  return (
    <div ref={wrapRef} className="relative w-full max-w-72">
      <Icon name="search" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-[var(--fg-subtle)]" />
      <Input size="sm" className="ps-9" placeholder="Search" value={value} aria-label="Search"
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(value); else if (e.key === "Escape") setOpen(false); }}
      />
      {open && <Typeahead query={value} matches={matches} onSubmit={submit} />}
    </div>
  );
}

function Typeahead({ query, matches, onSubmit }) {
  const grouped = { person: [], company: [], job: [], group: [], post: [] };
  matches.forEach((m) => grouped[m.type]?.push(m));
  const order = ["person", "company", "job", "group", "post"];
  const titles = { person: "People", company: "Companies", job: "Jobs", group: "Groups", post: "Posts" };
  return (
    <div className="typeahead">
      {!query ? (
        <>
          <div className="typeahead__section-title">Recent</div>
          {RECENT_SEARCHES.map((q, i) => (
            <div key={i} className="typeahead__row" onMouseDown={(e) => { e.preventDefault(); onSubmit(q); }}>
              <span className="typeahead__icon"><Icon name="history" className="text-[18px]" /></span>
              <div style={{ flex: 1, fontSize: 13 }}>{q}</div>
              <Icon name="arrow_forward" className="text-[14px] text-[var(--fg-subtle)]" />
            </div>
          ))}
        </>
      ) : matches.length === 0 ? (
        <div style={{ padding: 20, textAlign: "center", color: "var(--fg-muted)", fontSize: 13 }}>
          No matches for "<strong style={{ color: "var(--fg)" }}>{query}</strong>". Press Enter to search.
        </div>
      ) : (
        <>
          <div className="typeahead__row typeahead__row--primary" onMouseDown={(e) => { e.preventDefault(); onSubmit(query); }}>
            <span className="typeahead__icon"><Icon name="search" className="text-[18px]" /></span>
            <div style={{ flex: 1, fontSize: 13 }}>See all results for <strong>"{query}"</strong></div>
            <Icon name="arrow_forward" className="text-[14px] text-[var(--fg-subtle)]" />
          </div>
          {order.map((t) => grouped[t].length > 0 && (
            <div key={t}>
              <div className="typeahead__section-title"><Icon name={TYPE_ICONS[t]} className="text-[12px] me-1 align-middle" />{titles[t]}</div>
              {grouped[t].slice(0, 3).map((m) => (
                <div key={m.id} className="typeahead__row" onMouseDown={(e) => { e.preventDefault(); onSubmit(m.title); }}>
                  <Avatar initials={m.avatar} size={36} variant={m.variant} photoSeed={t === "person" ? m.title : null} style={{ borderRadius: t === "company" || t === "job" ? 6 : "50%" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-display)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{highlightMatch(m.title, query)}</div>
                    <div className="meta" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.sub}</div>
                  </div>
                  {t === "person" && m.connection && <Pill>{m.connection}</Pill>}
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ============================ TopNav ============================ */
function TopNav({ active, onNavigate, searchValue, onSearchChange, onSearchSubmit, alertCount, alertsOpen, onToggleAlerts }) {
  const tabs = [
    { id: "home", label: "Home", icon: "home" },
    { id: "network", label: "Network", icon: "group" },
    { id: "jobs", label: "Jobs", icon: "work" },
    { id: "messaging", label: "Messages", icon: "chat_bubble" },
    { id: "notifications", label: "Alerts", icon: "notifications" },
  ];
  const bellRef = useRef(null);
  useEffect(() => {
    if (!alertsOpen) return;
    const onDoc = (e) => { if (!bellRef.current?.contains(e.target)) onToggleAlerts?.(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [alertsOpen, onToggleAlerts]);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-3 px-4">
        <Logo />
        <SearchBox value={searchValue} onChange={onSearchChange} onSubmit={onSearchSubmit} />
        <nav className="ml-auto flex items-stretch">
          {tabs.map((t) => {
            const isAlerts = t.id === "notifications";
            return (
              <div key={t.id} className="relative" ref={isAlerts ? bellRef : null}>
                <button
                  className="flex h-14 w-[68px] flex-col items-center justify-center gap-0.5 text-[11px] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)] data-[active=true]:text-[var(--fg)] data-[active=true]:shadow-[inset_0_-2px_0_var(--fg)]"
                  data-active={active === t.id || undefined}
                  onClick={() => (isAlerts ? onToggleAlerts?.(!alertsOpen) : onNavigate?.(t.id))}
                >
                  <span className="relative inline-flex">
                    <Icon name={t.icon} filled={active === t.id} className="text-[22px]" />
                    {isAlerts && alertCount > 0 && (
                      <span className="absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full border-2 border-[var(--bg-surface)] bg-[var(--danger)] text-[10px] font-bold text-white">{alertCount}</span>
                    )}
                  </span>
                  {t.label}
                </button>
                {isAlerts && alertsOpen && <AlertsDropdown onClose={() => onToggleAlerts?.(false)} onViewAll={() => { onToggleAlerts?.(false); onNavigate?.("notifications"); }} />}
              </div>
            );
          })}
          <Separator orientation="vertical" className="mx-2 my-auto h-8" />
          <button className="flex h-14 w-[68px] flex-col items-center justify-center gap-0.5 text-[11px] text-[var(--fg-muted)]">
            <Avatar initials="YO" size={26} photo={seededPhoto("yara-okonkwo", 64, 64, "face")} />
            You
          </button>
        </nav>
      </div>
    </header>
  );
}

/* ============================ Rails ============================ */
function LeftRail({ onViewProfile }) {
  return (
    <aside className="flex flex-col gap-3">
      <Panel bare className="cursor-pointer" style={{ cursor: "pointer" }}>
        <div role="button" onClick={onViewProfile}>
          <div className="profile-card__cover" style={{ backgroundImage: `url(${seededPhoto("yara-okonkwo-banner", 600, 180, "banner")})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="profile-card__body">
            <Avatar initials="YO" size={72} photo={seededPhoto("yara-okonkwo", 144, 144, "face")} style={{ border: "3px solid var(--bg-surface)" }} />
            <div className="profile-card__name">Yara Okonkwo</div>
            <div className="profile-card__role">Principal Designer · Davinci Systems</div>
            <Separator className="my-3" />
            <div className="flex justify-between text-xs"><span className="meta">Profile views</span><span style={{ color: "var(--accent-fg)", fontWeight: 600 }}>248</span></div>
            <div className="mt-1.5 flex justify-between text-xs"><span className="meta">Post impressions</span><span style={{ color: "var(--accent-fg)", fontWeight: 600 }}>3,402</span></div>
          </div>
        </div>
      </Panel>
      <Panel bare>
        <ul className="nav-list">
          <li><Icon name="bookmark" /> Saved items</li>
          <li><Icon name="groups" /> Groups <span className="count">12</span></li>
          <li><Icon name="event" /> Events</li>
          <li><Icon name="newspaper" /> Newsletters</li>
        </ul>
      </Panel>
      <RailAd ad={AD_LIBRARY.aws} />
    </aside>
  );
}

function RightRail() {
  const news = [
    { t: "AI tools reshape the design stack", sub: "4h ago · 8,204 readers" },
    { t: "Typography on the web, revisited", sub: "6h ago · 3,102 readers" },
    { t: "Remote-first companies hit new peak", sub: "12h ago · 12k readers" },
  ];
  const people = [
    { n: "Miriam Chen", r: "VP Design · Helix", i: "MC", v: "g4" },
    { n: "Daniel Amrani", r: "Head of Brand · Pylon", i: "DA", v: "g2" },
    { n: "Priya Ravi", r: "Design Engineer · Atlas", i: "PR", v: "g5" },
  ];
  return (
    <aside className="flex flex-col gap-3">
      <Panel title="Davinci News" action={<Icon name="info" className="text-[16px] text-[var(--fg-subtle)]" />} bodyStyle={{ padding: 0 }}>
        {news.map((n, i) => (
          <div key={i} className="rail-item" style={{ alignItems: "flex-start" }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: "var(--fg-muted)", marginTop: 7 }} />
            <div className="rail-item__text"><div className="rail-item__title">{n.t}</div><div className="rail-item__sub">{n.sub}</div></div>
          </div>
        ))}
      </Panel>
      <Panel title="People to follow" bodyStyle={{ padding: 0 }}>
        {people.map((p, i) => (
          <div key={i} className="rail-item">
            <Avatar initials={p.i} size={40} variant={p.v} photoSeed={p.n} />
            <div className="rail-item__text"><div className="rail-item__title">{p.n}</div><div className="rail-item__sub">{p.r}</div></div>
            <Button variant="outline" size="sm" pill icon="add">Follow</Button>
          </div>
        ))}
      </Panel>
      <RailAd ad={AD_LIBRARY.course} />
    </aside>
  );
}

/* ============================ Feed ============================ */
function Composer() {
  const [open, setOpen] = useState(false);
  return (
    <Panel bare>
      <div className="composer">
        <Avatar initials="YO" size={48} photo={seededPhoto("yara-okonkwo", 96, 96, "face")} />
        {!open
          ? <button className="composer__input" onClick={() => setOpen(true)}>Share an update, Yara…</button>
          : <div style={{ flex: 1, fontWeight: 600 }}>Create a post</div>}
      </div>
      {open && (
        <div style={{ padding: "0 16px 14px" }}>
          <RichTextarea placeholder="What do you want to talk about?" />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <div style={{ display: "flex", gap: 4, color: "var(--fg-muted)" }}>
              <Button variant="ghost" size="sm" icon="image" style={{ padding: 6 }} />
              <Button variant="ghost" size="sm" icon="play_circle" style={{ padding: 6 }} />
              <Button variant="ghost" size="sm" icon="event" style={{ padding: 6 }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" size="sm">Post</Button>
            </div>
          </div>
        </div>
      )}
      {!open && (
        <div className="composer__actions">
          {[{ icon: "image", label: "Photo", color: "var(--accent-fg)" }, { icon: "play_circle", label: "Video", color: "var(--success-fg)" }, { icon: "event", label: "Event", color: "var(--warning-fg)" }, { icon: "article", label: "Article", color: "var(--danger-fg)" }].map((a, i) => (
            <div key={i} className="composer__action"><Icon name={a.icon} style={{ color: a.color }} /><span>{a.label}</span></div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function Post({ id, author, role, time, avatar, variant = "g1", photoSeed, isCompany, body, attachment, reactions, comments, topReactions, seedComments }) {
  const [showComments, setShowComments] = useState(false);
  return (
    <Panel bare>
      <div className="post">
        <div className="post__header">
          <Avatar initials={avatar} size={48} variant={variant} photoSeed={photoSeed} style={isCompany ? { borderRadius: 8 } : undefined} />
          <div className="post__who">
            <div className="post__name">{author}</div>
            <div className="post__role">{role}</div>
            <div className="post__time">{time} <span className="dot-sep" /> <Icon name="public" className="text-[12px]" /></div>
          </div>
          <Button variant="ghost" size="sm" style={{ padding: 4 }} icon="more_horiz" />
        </div>
        <div className="post__body">{body}</div>
        {attachment && (
          <div className="post__attachment">
            <div className="post__attachment-img" style={attachment.image ? { backgroundImage: `url(${attachment.image})`, backgroundSize: "cover", backgroundPosition: "center" } : attachment.style} />
            <div className="post__attachment-body"><strong>{attachment.title}</strong><span className="meta">{attachment.sub}</span></div>
          </div>
        )}
        <ReactionBar postId={id} baseReactions={reactions} topReactions={topReactions} commentCount={comments} onToggleComments={() => setShowComments((s) => !s)} />
        {showComments && <Comments postId={id} seed={seedComments} />}
      </div>
    </Panel>
  );
}

function Feed() {
  const posts = [
    { id: "feed-sofia", author: "Sofia Antonova", role: "Staff Designer at Helix · 2nd", time: "2h", avatar: "SA", variant: "g4", photoSeed: "Sofia Antonova", body: "Shipping a refresh of our component library today. Fewer tokens, warmer neutrals, and — finally — a proper focus ring on every interactive surface.", attachment: { title: "Radix Colors for design systems that age well", sub: "davinci-systems.com · 8 min read", image: seededPhoto("article-radix-colors", 480, 240, "article") }, reactions: 482, comments: 34, topReactions: ["insightful", "like", "love"], seedComments: [
      { author: "Priya Ravi", text: "The focus-ring-on-every-surface bit is so underrated. Congrats on shipping!", time: "1h" },
      { author: "Daniel Amrani", text: "Warmer neutrals — finally. Sand scales age so much better than pure grays.", time: "45m" },
    ] },
    { id: "feed-helix", author: "Helix Systems", role: "Product & Design Platform · 24,802 followers", time: "5h", avatar: "HX", variant: "g2", isCompany: true, body: "We're hiring a Design Engineer to work on our token pipeline. Based in Lisbon or fully remote.", attachment: { title: "Design Engineer · Helix Platform Team", sub: "Remote / Lisbon · 5 days ago", style: { background: "linear-gradient(135deg, var(--yellow-7), var(--yellow-10))" } }, reactions: 188, comments: 12, topReactions: ["like", "celebrate", "support"] },
    { id: "feed-daniel", author: "Daniel Amrani", role: "Head of Brand at Pylon · 1st", time: "1d", avatar: "DA", variant: "g6", photoSeed: "Daniel Amrani", body: "Hot take: most “design systems” are asset libraries with a sitemap. A real system teaches you how to decide — what to build, what to reuse, what to leave alone.", reactions: 1204, comments: 96, topReactions: ["insightful", "like", "funny"] },
  ];
  return (
    <main className="flex min-w-0 flex-col gap-3">
      <Composer />
      {posts.map((p, i) => (
        <React.Fragment key={p.id}>
          <Post {...p} />
          {i === 0 && <FeedAd ad={AD_LIBRARY.notion} />}
          {i === 1 && <FeedAd ad={AD_LIBRARY.figma} />}
        </React.Fragment>
      ))}
    </main>
  );
}

/* ============================ Profile ============================ */
function ProfilePage() {
  return (
    <main className="flex flex-col gap-3">
      <Panel bare>
        <div className="profile-cover" style={{ backgroundImage: `url(${seededPhoto("yara-okonkwo-banner", 1200, 360, "banner")})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="profile-header">
          <Avatar initials="YO" size={128} photo={seededPhoto("yara-okonkwo", 256, 256, "face")} />
          <div className="profile-header__name">Yara Okonkwo</div>
          <div className="profile-header__headline">Principal Designer at Davinci Systems · Helping teams build design infrastructure that doesn't rot.</div>
          <div className="profile-header__meta">
            <span><Icon name="location_on" className="text-[14px]" /> Lisbon, Portugal</span>
            <span><Icon name="group" className="text-[14px]" /> 1,842 connections · 12k followers</span>
          </div>
          <div className="profile-header__actions">
            <Button variant="primary" icon="chat_bubble">Message</Button>
            <Button variant="outline" icon="add">Follow</Button>
            <Button variant="secondary">More</Button>
          </div>
        </div>
      </Panel>
      <Panel title="About">
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--fg-muted)", margin: 0 }}>
          Designer and systems thinker with 12 years of experience building design infrastructure for product teams. I care about the boring, load-bearing parts of design systems — tokens, governance, contribution models.
        </p>
        <div className="entry__skills" style={{ marginTop: 14 }}>
          {["Design Systems", "Typography", "Accessibility"].map((s) => <Pill key={s} variant="accent">{s}</Pill>)}
          {["Figma", "React", "CSS", "Product Strategy"].map((s) => <Pill key={s}>{s}</Pill>)}
        </div>
      </Panel>
      <Panel title="Experience">
        {[
          { logo: "DV", co: "Davinci Systems", title: "Principal Designer", time: "2022 – Present · 4 yrs", desc: "Lead design system and brand systems across the Davinci product suite. Built a token pipeline 40+ teams consume.", skills: ["Design Systems", "Tokens", "Leadership"] },
          { logo: "HX", co: "Helix", title: "Senior Product Designer", time: "2019 – 2022 · 3 yrs", desc: "Owned end-to-end redesign of the primary dashboard; partnered with eng on a React component library.", skills: ["Product Design", "React", "Figma"] },
          { logo: "NV", co: "Novatech", title: "Product Designer", time: "2015 – 2019 · 4 yrs", desc: "Shipped consumer features across web and iOS; built the first internal component library.", skills: ["iOS", "Web"] },
        ].map((e, i) => (
          <div key={i} className="entry">
            <div className="entry__logo">{e.logo}</div>
            <div style={{ flex: 1 }}>
              <div className="entry__title">{e.title}</div>
              <div className="entry__sub">{e.co}</div>
              <div className="entry__time">{e.time}</div>
              <div className="entry__desc">{e.desc}</div>
              <div className="entry__skills">{e.skills.map((s) => <Pill key={s}>{s}</Pill>)}</div>
            </div>
          </div>
        ))}
      </Panel>
      <Panel title="Skills">
        <div className="entry__skills">
          {["Design Systems", "Design Tokens", "Figma", "React", "TypeScript", "Accessibility (WCAG)", "Design Ops", "Typography", "Governance", "Component API Design"].map((s) => (
            <Pill key={s} variant="accent">{s}</Pill>
          ))}
        </div>
      </Panel>
      <Panel title="Projects">
        {[
          { logo: "DV", title: "Davinci Token Pipeline", time: "2022 – Present", desc: "A Radix-based token system + Figma sync consumed by 40+ product teams. Zero-config theming and lint-enforced overrides." },
          { logo: "OS", title: "Open Surface Guidelines", time: "2023", desc: "A public playbook for surface hierarchy and elevation, adopted across the design community." },
        ].map((e, i) => (
          <div key={i} className="entry">
            <div className="entry__logo">{e.logo}</div>
            <div style={{ flex: 1 }}>
              <div className="entry__title">{e.title}</div>
              <div className="entry__time">{e.time}</div>
              <div className="entry__desc">{e.desc}</div>
            </div>
          </div>
        ))}
      </Panel>
      <Panel title="Recommendations">
        {[
          { name: "Miriam Chen", role: "VP Design · Helix", text: "Yara is the rare designer who makes the boring parts of a system feel exciting. Our token sprawl dropped by half under her guidance." },
          { name: "Daniel Amrani", role: "Head of Brand · Pylon", text: "Equal parts systems thinker and craftsperson. Every handoff was airtight and every rationale documented." },
        ].map((r, i) => (
          <div key={i} className="entry">
            <Avatar initials={r.name.slice(0, 2).toUpperCase()} size={48} variant="g4" photoSeed={r.name} />
            <div style={{ flex: 1 }}>
              <div className="entry__title">{r.name}</div>
              <div className="entry__time">{r.role}</div>
              <div className="entry__desc">“{r.text}”</div>
            </div>
          </div>
        ))}
      </Panel>
      <Panel title="Interests" bodyStyle={{ padding: 0 }}>
        {[
          { n: "Helix Systems", r: "24,802 followers", i: "HX", v: "g2", company: true },
          { n: "Design Systems Guild", r: "28,402 members", i: "DS", v: "g4", company: true },
          { n: "Miriam Chen", r: "VP Design · Helix", i: "MC", v: "g4" },
        ].map((p, i) => (
          <div key={i} className="rail-item">
            <Avatar initials={p.i} size={40} variant={p.v} photoSeed={p.company ? null : p.n} style={p.company ? { borderRadius: 8 } : undefined} />
            <div className="rail-item__text"><div className="rail-item__title">{p.n}</div><div className="rail-item__sub">{p.r}</div></div>
            <Button variant="outline" size="sm" pill icon="add">Follow</Button>
          </div>
        ))}
      </Panel>
    </main>
  );
}

/* ============================ Company ============================ */
function CompanyPage() {
  const [tab, setTab] = useState("home");
  return (
    <main className="flex flex-col gap-3">
      <Panel bare>
        <div className="profile-cover" style={{ height: 140, backgroundImage: `url(${seededPhoto("davinci-systems-banner", 1200, 300, "office")})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ padding: "0 24px 16px", marginTop: -40, position: "relative" }}>
          <div style={{ width: 96, height: 96, borderRadius: 14, background: "var(--bg-surface)", border: "4px solid var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-md)", marginBottom: 14, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, color: "var(--accent-fg)" }}>D</div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div>
              <div className="profile-header__name">Davinci Systems</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>Design infrastructure for product teams.</div>
              <div className="profile-header__meta"><span>Software Development</span><span>Lisbon, Portugal</span><span style={{ color: "var(--accent-fg)", fontWeight: 600 }}>24,802 followers</span></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="primary" icon="add">Follow</Button>
              <Button variant="outline" icon="chat_bubble">Message</Button>
            </div>
          </div>
        </div>
        <div className="company-tabs">
          {["home", "about", "posts", "jobs", "people"].map((t) => (
            <div key={t} className={`company-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</div>
          ))}
        </div>
      </Panel>
      <Panel title="Overview">
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--fg-muted)", margin: 0 }}>Davinci Systems builds the design infrastructure behind some of the largest product organizations in Europe.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 20 }}>
          {[["342", "employees"], ["2018", "founded"], ["18", "open roles"], ["€42M", "series B"]].map(([v, l]) => (
            <div className="stat" key={l}><div className="stat__value">{v}</div><div className="stat__label">{l}</div></div>
          ))}
        </div>
      </Panel>
      <Panel title="Jobs" action={<Button variant="ghost" size="sm" iconRight="arrow_forward">See all 18</Button>}>
        {[{ title: "Senior Design Engineer", loc: "Remote · EU", team: "Platform", isNew: true }, { title: "Brand Designer", loc: "Lisbon · Hybrid", team: "Brand Studio", isNew: true }, { title: "Engineering Manager, Tokens", loc: "Remote · EU", team: "Platform" }].map((j, i) => (
          <div key={i} className="entry" style={{ alignItems: "center" }}>
            <div className="entry__logo" style={{ fontSize: 20 }}>D</div>
            <div style={{ flex: 1 }}>
              <div className="entry__title">{j.title} {j.isNew && <Pill variant="alt" style={{ marginLeft: 6 }}>New</Pill>}</div>
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

/* ============================ Network ============================ */
function NetworkNavItem({ icon, label, count }) {
  return (
    <div className="network-nav-item">
      <Icon name={icon} className="text-[18px] text-[var(--fg-muted)]" />
      <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 500 }}>{label}</div>
      <span className="meta" style={{ fontWeight: 600, color: "var(--fg)" }}>{count}</span>
    </div>
  );
}
function SuggestionCard({ person }) {
  const [following, setFollowing] = useState(false);
  return (
    <div className="suggestion-card">
      <div className="suggestion-card__cover" style={{ backgroundImage: `url(${seededPhoto(person.name + "-banner", 240, 56, "banner")})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <Avatar initials={person.avatar} size={64} variant={person.variant} photoSeed={person.name} style={{ border: "3px solid var(--bg-surface)", marginTop: -32, position: "relative" }} />
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, marginTop: 8, textAlign: "center" }}>{person.name}</div>
      <div style={{ fontSize: 12, color: "var(--fg-muted)", textAlign: "center", marginTop: 2, minHeight: 32, lineHeight: 1.35, padding: "0 8px" }}>{person.role}</div>
      <div className="meta" style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}><Icon name="group" className="text-[12px]" /> {person.mutual} mutual</div>
      <div style={{ padding: "10px 12px 14px", width: "100%", boxSizing: "border-box" }}>
        <Button variant={following ? "secondary" : "outline"} size="sm" pill icon={following ? "check" : "add"} style={{ width: "100%" }} onClick={() => setFollowing((f) => !f)}>{following ? "Pending" : "Connect"}</Button>
      </div>
    </div>
  );
}
function NetworkPage() {
  const [tab, setTab] = useState("grow");
  const invites = [
    { name: "Kai Thornton", role: "Design Engineer · Vector", mutual: 12, avatar: "KT", variant: "g5" },
    { name: "Noor Farsi", role: "Principal PM · Atlas Docs", mutual: 8, avatar: "NF", variant: "g2" },
    { name: "Lena Brandt", role: "Brand Director · Helix", mutual: 31, avatar: "LB", variant: "g4" },
  ];
  const suggested = [
    { name: "Ore Adebayo", role: "Head of Design · Pulse", mutual: 18, avatar: "OA", variant: "g6" },
    { name: "Tara Weiss", role: "Staff Researcher · Helix", mutual: 6, avatar: "TW", variant: "g1" },
    { name: "Marcus Lind", role: "Design Director · Vector", mutual: 4, avatar: "ML", variant: "g5" },
    { name: "Ines Caballero", role: "Founder · Unwritten", mutual: 22, avatar: "IC", variant: "g2" },
  ];
  return (
    <main className="flex min-w-0 flex-col gap-3">
      <Panel title="Manage your network" bodyStyle={{ padding: 0 }}>
        <div className="network-sub-nav">
          <NetworkNavItem icon="group" label="Connections" count="842" />
          <NetworkNavItem icon="person" label="Following & followers" count="2.1k" />
          <NetworkNavItem icon="groups" label="Groups" count="12" />
          <NetworkNavItem icon="event" label="Events" count="3" />
        </div>
      </Panel>
      <div className="results-tabs" style={{ padding: "0 4px", borderBottom: "1px solid var(--border-subtle)" }}>
        <button className={`results-tab ${tab === "grow" ? "active" : ""}`} onClick={() => setTab("grow")}>Grow</button>
        <button className={`results-tab ${tab === "invites" ? "active" : ""}`} onClick={() => setTab("invites")}>Invitations <span className="results-tab__count">{invites.length}</span></button>
      </div>
      {tab === "invites" ? (
        <Panel title="Pending invitations" bodyStyle={{ padding: 0 }}>
          {invites.map((inv, i) => (
            <div key={i} className="invite-row">
              <Avatar initials={inv.avatar} size={56} variant={inv.variant} photoSeed={inv.name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>{inv.name}</div>
                <div style={{ fontSize: 13, color: "var(--fg-muted)" }}>{inv.role}</div>
                <div style={{ fontSize: 12, color: "var(--fg-subtle)", marginTop: 4 }}><Icon name="group" className="text-[12px]" /> {inv.mutual} mutual</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}><Button variant="ghost" size="sm" pill>Ignore</Button><Button variant="primary" size="sm" pill>Accept</Button></div>
            </div>
          ))}
        </Panel>
      ) : (
        <>
          <InlineAd ad={AD_LIBRARY.recruit} />
          <Panel title="People you may know" action={<Button variant="ghost" size="sm">See all</Button>} bodyStyle={{ padding: 16 }}>
            <div className="network-grid">{suggested.map((p, i) => <SuggestionCard key={i} person={p} />)}</div>
          </Panel>
        </>
      )}
    </main>
  );
}

/* ============================ Jobs ============================ */
function JobsPage() {
  const [selected, setSelected] = useState(0);
  const [saved, setSaved] = useState(new Set([1]));
  const jobs = [
    { id: 0, title: "Staff Product Designer", company: "Helix Systems", logo: "HX", variant: "g2", location: "Lisbon or Remote · EU", salary: "€110k – €140k · Equity", posted: "5 days ago", applicants: "48 applicants", remote: true, easyApply: true, about: "We're looking for a staff-level designer to lead our design platform — the tokens, components, and docs that power every product surface at Helix.", fits: ["Your skills match 8 of 10 requirements", "Your connections can refer you", "3 people from your network work here"] },
    { id: 1, title: "Senior Design Engineer", company: "Atlas Docs", logo: "AT", variant: "g5", location: "Remote · Americas", salary: "$170k – $210k", posted: "2 days ago", applicants: "124 applicants", remote: true, easyApply: true, about: "Build the interactive canvas at the heart of Atlas. You'll work across React, typography, and performance.", fits: ["Your skills match 9 of 10 requirements"] },
    { id: 2, title: "Design Systems Lead", company: "Vector Project OS", logo: "VE", variant: "g6", location: "Amsterdam, NL (hybrid)", salary: "€95k – €125k", posted: "1 week ago", applicants: "63 applicants", easyApply: false, about: "Own Vector's design system end to end. Partner with product leads to scale our visual language.", fits: [] },
    { id: 3, title: "Staff Brand Designer", company: "Pulse Meetings", logo: "PU", variant: "g1", location: "New York, NY · Hybrid", salary: "$165k – $195k", posted: "3 days ago", applicants: "87 applicants", easyApply: true, about: "Define the visual identity of Pulse's next chapter.", fits: ["Your skills match 7 of 10 requirements"] },
  ];
  const current = jobs[selected];
  const toggleSave = (id) => setSaved((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 16, alignItems: "start" }}>
      <Panel title="Top picks for you" action={<span className="meta">{jobs.length}</span>} bodyStyle={{ padding: 0 }}>
        <div className="jobs-list">
          {jobs.map((j) => (
            <button key={j.id} type="button" className={`job-row ${selected === j.id ? "active" : ""}`} onClick={() => setSelected(j.id)}>
              <Avatar initials={j.logo} size={48} variant={j.variant} style={{ borderRadius: 8 }} />
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{j.title}</div>
                <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{j.company}</div>
                <div style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 2 }}>{j.location}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>{j.easyApply && <Pill variant="accent">Easy Apply</Pill>}{j.remote && <Pill>Remote</Pill>}</div>
              </div>
              <span role="button" className={`job-save ${saved.has(j.id) ? "active" : ""}`} onClick={(e) => { e.stopPropagation(); toggleSave(j.id); }} aria-label="Save"><Icon name="bookmark" filled={saved.has(j.id)} className="text-[18px]" /></span>
            </button>
          ))}
        </div>
      </Panel>
      <Panel title="Job details" action={<span className="meta">{current.posted}</span>}>
        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Avatar initials={current.logo} size={64} variant={current.variant} style={{ borderRadius: 10 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>{current.title}</div>
              <div style={{ fontSize: 14, marginTop: 2 }}>{current.company}</div>
              <div style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 2 }}>{current.location}</div>
              <div style={{ fontSize: 12, color: "var(--fg-subtle)", marginTop: 6, display: "flex", gap: 10 }}><span>{current.posted}</span><span>·</span><span>{current.applicants}</span><span>·</span><span>{current.salary}</span></div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Button variant="primary" pill iconRight="arrow_forward">{current.easyApply ? "Easy Apply" : "Apply"}</Button>
            <Button variant={saved.has(current.id) ? "secondary" : "outline"} pill icon={saved.has(current.id) ? "check" : "bookmark"} onClick={() => toggleSave(current.id)}>{saved.has(current.id) ? "Saved" : "Save"}</Button>
          </div>
          {current.fits.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><Icon name="check" className="text-[14px]" style={{ color: "var(--success-fg)" }} /> How you fit</div>
              {current.fits.map((f, i) => (<div key={i} style={{ fontSize: 13, color: "var(--fg-muted)", padding: "4px 0", display: "flex", gap: 8 }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent-fg)", marginTop: 8, flexShrink: 0 }} />{f}</div>))}
            </div>
          )}
          <Separator className="my-5" />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, margin: "0 0 10px" }}>About the role</h3>
          <p style={{ fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.55, margin: 0 }}>{current.about}</p>
        </div>
      </Panel>
    </div>
  );
}

/* ============================ Messages ============================ */
const CONVERSATIONS = [
  { id: 0, name: "Sofia Antonova", role: "Staff Designer · Helix", avatar: "SA", variant: "g4", time: "12:08 PM", preview: "Sounds great — I'll send the Figma file over this afternoon.", unread: true, messages: [
    { from: "them", text: "Hey! Loved your talk at DBS last week. Quick Q about your token architecture — do you scope aliases per-product or share globally?", time: "11:52 AM" },
    { from: "me", text: "Thank you! We tried both. Now we have one global scale and products can only override at the alias level with a lint.", time: "11:59 AM" },
    { from: "them", text: "That would be amazing. Could we do 30 min this week?", time: "12:05 PM" },
    { from: "me", text: "Yep — Thursday at 2pm your time?", time: "12:07 PM" },
    { from: "them", text: "Sounds great — I'll send the Figma file over this afternoon.", time: "12:08 PM" },
  ] },
  { id: 1, name: "Daniel Amrani", role: "Head of Brand · Pylon", avatar: "DA", variant: "g2", time: "10:42 AM", preview: "Totally — let me know when the deck is ready.", unread: true, messages: [{ from: "them", text: "Totally — let me know when the deck is ready and I'll review.", time: "10:42 AM" }] },
  { id: 2, name: "Priya Ravi", role: "Design Engineer · Atlas", avatar: "PR", variant: "g5", time: "Yesterday", preview: "You: Congrats on the launch 🎉", unread: false, messages: [{ from: "me", text: "Thanks! Congrats on the launch btw 🎉", time: "Yesterday 4:12 PM" }] },
  { id: 3, name: "Helix Recruiting", role: "Company page", avatar: "HX", variant: "g2", time: "Yesterday", preview: "We just opened a Staff role — interested?", unread: false, messages: [{ from: "them", text: "We just opened a Staff role on the platform team — interested?", time: "Yesterday 2:03 PM" }] },
];
function MessagesPage() {
  const [selectedId, setSelectedId] = useState(0);
  const [draft, setDraft] = useState("");
  const conv = CONVERSATIONS.find((c) => c.id === selectedId);
  return (
    <Panel style={{ padding: 0, overflow: "hidden", height: "calc(100vh - 150px)" }} bodyStyle={{ padding: 0, height: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", height: "100%" }}>
        <div style={{ borderRight: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>Messaging</div>
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
            {CONVERSATIONS.map((c) => (
              <button key={c.id} type="button" className={`conv-row ${selectedId === c.id ? "active" : ""}`} onClick={() => setSelectedId(c.id)}>
                <Avatar initials={c.avatar} size={48} variant={c.variant} photoSeed={c.role.includes("Company") ? null : c.name} style={c.role.includes("Company") ? { borderRadius: 8 } : undefined} />
                <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: c.unread ? 700 : 600, fontSize: 14, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: c.unread ? "var(--accent-fg)" : "var(--fg-subtle)" }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: c.unread ? "var(--fg)" : "var(--fg-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.preview}</div>
                </div>
                {c.unread && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar initials={conv.avatar} size={40} variant={conv.variant} photoSeed={conv.role.includes("Company") ? null : conv.name} />
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{conv.name}</div><div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{conv.role}</div></div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
            {conv.messages.map((m, i) => (<div key={i} className={`msg msg--${m.from}`}><div className="msg__bubble">{m.text}</div><div className="msg__time">{m.time}</div></div>))}
          </div>
          <div style={{ borderTop: "1px solid var(--border-subtle)", padding: 12, display: "flex", gap: 8, alignItems: "flex-end" }}>
            <Textarea size="sm" rows={2} placeholder={`Write a message to ${conv.name.split(" ")[0]}…`} value={draft} onChange={(e) => setDraft(e.target.value)} style={{ flex: 1 }} />
            <Button variant="primary" size="sm" pill iconRight="send" onClick={() => setDraft("")}>Send</Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ============================ Alerts ============================ */
const ALERTS = [
  { id: 0, type: "mention", unread: true, time: "12m", avatar: "SA", variant: "g4", actor: "Sofia Antonova", title: <><strong>Sofia Antonova</strong> mentioned you in a comment</>, body: '"…following Yara\'s approach on scoped aliases we\'ve cut our token sprawl in half."' },
  { id: 1, type: "reaction", unread: true, time: "1h", avatar: "DA", variant: "g2", actor: "Daniel Amrani", title: <><strong>Daniel Amrani</strong> and <strong>42 others</strong> reacted to your post</>, body: '"A design system is a contract, not a style guide."' },
  { id: 2, type: "job", unread: true, time: "3h", avatar: "HX", variant: "g2", isCompany: true, title: <>A new job matches your preferences: <strong>Staff Product Designer</strong> at Helix</>, body: "Lisbon or Remote · €110k – €140k · Matches 8 of 10 skills" },
  { id: 3, type: "connection", unread: false, time: "6h", avatar: "PR", variant: "g5", actor: "Priya Ravi", title: <><strong>Priya Ravi</strong> accepted your connection request</>, body: "You have 12 mutual connections, including Miriam Chen." },
  { id: 4, type: "anniversary", unread: false, time: "2d", avatar: "MC", variant: "g4", actor: "Miriam Chen", title: <><strong>Miriam Chen</strong> is celebrating 5 years at Helix Systems</>, body: "Say congrats to keep in touch." },
];
const ALERT_ICON_MAP = {
  mention: { icon: "chat_bubble", color: "var(--accent-fg)" }, reaction: { icon: "favorite", color: "var(--danger-fg)" },
  job: { icon: "work", color: "var(--success-fg)" }, connection: { icon: "group", color: "var(--accent-fg)" },
  anniversary: { icon: "favorite", color: "var(--alt-fg)" },
};
function AlertRow({ alert, compact }) {
  const ico = ALERT_ICON_MAP[alert.type] || { icon: "notifications", color: "var(--fg-muted)" };
  return (
    <div className={`alert-row ${alert.unread ? "alert-row--unread" : ""} ${compact ? "alert-row--compact" : ""}`}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <Avatar initials={alert.avatar} size={compact ? 40 : 48} variant={alert.variant} photoSeed={alert.isCompany ? null : alert.actor} style={{ borderRadius: alert.isCompany ? 8 : "50%" }} />
        <span className="alert-row__type-badge" style={{ color: ico.color }}><Icon name={ico.icon} /></span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: compact ? 13 : 14, lineHeight: 1.45 }}>{alert.title}</div>
        {alert.body && <div style={{ fontSize: compact ? 12 : 13, color: "var(--fg-muted)", marginTop: 4, lineHeight: 1.5 }}>{alert.body}</div>}
        <div className="meta" style={{ marginTop: 6 }}>{alert.time} ago</div>
      </div>
    </div>
  );
}
function AlertsDropdown({ onClose, onViewAll }) {
  const unread = ALERTS.filter((a) => a.unread).length;
  return (
    <div className="alerts-dropdown">
      <div className="alerts-dropdown__header">
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>Notifications</span>
        {unread > 0 && <Pill variant="accent">{unread} new</Pill>}
        <Button variant="ghost" size="sm" style={{ marginLeft: "auto", padding: 4 }} icon="close" onClick={onClose} />
      </div>
      <div className="alerts-dropdown__body">{ALERTS.slice(0, 5).map((a) => <AlertRow key={a.id} alert={a} compact />)}</div>
      <div className="alerts-dropdown__footer"><Button variant="ghost" size="sm" style={{ width: "100%" }} onClick={onViewAll}>View all notifications</Button></div>
    </div>
  );
}
function AlertsPage() {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? ALERTS : tab === "jobs" ? ALERTS.filter((a) => a.type === "job") : ALERTS.filter((a) => a.type === "mention" || a.type === "reaction");
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
      <main className="flex flex-col gap-3">
        <Panel style={{ padding: "0 8px" }} bodyStyle={{ padding: 0 }}>
          <div className="results-tabs">
            <button className={`results-tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>All</button>
            <button className={`results-tab ${tab === "mentions" ? "active" : ""}`} onClick={() => setTab("mentions")}>Mentions</button>
            <button className={`results-tab ${tab === "jobs" ? "active" : ""}`} onClick={() => setTab("jobs")}>Jobs</button>
          </div>
        </Panel>
        <Panel bodyStyle={{ padding: 0 }}>
          {filtered.map((a, i) => (<React.Fragment key={a.id}><AlertRow alert={a} />{i === 2 && <InlineAd ad={AD_LIBRARY.course} />}</React.Fragment>))}
        </Panel>
      </main>
      <aside className="flex flex-col gap-3">
        <Panel title="Notification settings">
          {["Mentions of you", "Job recommendations", "Network activity", "Profile searches"].map((x, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 3 ? "1px solid var(--border-subtle)" : "none" }}><span style={{ fontSize: 13 }}>{x}</span><span style={{ fontSize: 12, color: "var(--success-fg)", fontWeight: 600 }}>On</span></div>
          ))}
        </Panel>
        <RailAd ad={AD_LIBRARY.aws} />
      </aside>
    </div>
  );
}

/* ============================ Search results ============================ */
function FilterSelect({ label, value, options, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="min-w-36"><SelectValue /></SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o === "any" ? `Any ${label.toLowerCase()}` : o}</SelectItem>)}</SelectContent>
    </Select>
  );
}
function ResultRow({ result, query }) {
  const { type } = result;
  const isRound = type === "person";
  return (
    <Panel style={{ padding: 16 }} bodyStyle={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <Avatar initials={result.avatar} size={48} variant={result.variant} photoSeed={isRound ? result.title : null} style={{ borderRadius: isRound ? "50%" : 8 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>{highlightMatch(result.title, query)}</span>
          {type === "person" && result.connection && <Pill>{result.connection}</Pill>}
          {type === "job" && <Pill variant="success">Hiring</Pill>}
          <span style={{ marginLeft: "auto" }} className="typeahead__type-chip"><Icon name={TYPE_ICONS[type]} className="text-[12px]" />{TYPE_LABELS[type]}</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 2 }}>{result.sub}</div>
        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          {type === "person" && <><Button variant="outline" size="sm" pill icon="add">Connect</Button><Button variant="ghost" size="sm" pill>Message</Button></>}
          {type === "company" && <Button variant="outline" size="sm" pill icon="add">Follow</Button>}
          {type === "job" && <><Button variant="primary" size="sm" pill>Apply</Button><Button variant="ghost" size="sm" pill icon="bookmark">Save</Button></>}
          {type === "group" && <Button variant="outline" size="sm" pill>Join</Button>}
          {type === "post" && <Button variant="ghost" size="sm" pill iconRight="arrow_forward">Read post</Button>}
        </div>
      </div>
    </Panel>
  );
}
function SearchResults({ query }) {
  const [tab, setTab] = useState("all");
  const [filters, setFilters] = useState({ location: "any", industry: "any" });
  const base = searchMatches(query, { limit: 100 });
  const byTab = tab === "all" ? base : tab === "people" ? base.filter((e) => e.type === "person") : tab === "jobs" ? base.filter((e) => e.type === "job") : base.filter((e) => e.type === "company");
  const filtered = byTab.filter((e) => (filters.location === "any" || e.location === filters.location) && (filters.industry === "any" || e.industry === filters.industry));
  const locations = ["any", ...new Set(base.map((e) => e.location).filter(Boolean))];
  const industries = ["any", ...new Set(base.map((e) => e.industry).filter(Boolean))];
  const tabs = [["all", "All"], ["people", "People"], ["jobs", "Jobs"], ["companies", "Companies"]];
  return (
    <main className="flex min-w-0 flex-col gap-3">
      <Panel style={{ padding: "0 8px" }} bodyStyle={{ padding: 0 }}>
        <div className="results-tabs">{tabs.map(([id, label]) => <button key={id} className={`results-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>)}</div>
      </Panel>
      <Panel bodyStyle={{ padding: 14 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span className="meta" style={{ fontWeight: 600, color: "var(--fg)" }}>Smart filters</span>
          <FilterSelect label="Location" value={filters.location} options={locations} onChange={(v) => setFilters((f) => ({ ...f, location: v }))} />
          <FilterSelect label="Industry" value={filters.industry} options={industries} onChange={(v) => setFilters((f) => ({ ...f, industry: v }))} />
          <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--fg-muted)" }}><strong style={{ color: "var(--fg)" }}>{filtered.length}</strong> results</div>
        </div>
      </Panel>
      {query === "" ? (
        <Panel style={{ padding: 40 }} bodyStyle={{ textAlign: "center", padding: 40 }}>
          <Icon name="search" className="text-[48px] text-[var(--fg-subtle)]" />
          <h3 style={{ marginTop: 16, fontFamily: "var(--font-display)" }}>Search the Davinci network</h3>
          <p className="meta" style={{ marginTop: 8 }}>Start typing above to find people, companies, jobs, and posts.</p>
        </Panel>
      ) : filtered.map((r, i) => (<React.Fragment key={r.id}><ResultRow result={r} query={query} />{(i + 1) % 4 === 0 && i < filtered.length - 1 && <InlineAd ad={AD_LIBRARY.recruit} />}</React.Fragment>))}
    </main>
  );
}

/* ============================ App shell ============================ */
export function App() {
  const [route, setRoute] = useState("home");
  const [theme, setTheme] = useState("dark");
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

  const activeTab = { home: "home", profile: "home", company: "home", network: "network", jobs: "jobs", messaging: "messaging", notifications: "notifications", search: "home" }[route] || "home";

  const onSearchSubmit = (q) => { setSubmittedQuery(q); setSearchValue(q); setRoute("search"); };

  const pages = {
    home: <div className="grid grid-cols-1 gap-3 lg:grid-cols-[225px_minmax(0,1fr)_300px]"><LeftRail onViewProfile={() => setRoute("profile")} /><Feed /><RightRail /></div>,
    profile: <div className="mx-auto max-w-[760px]"><ProfilePage /></div>,
    company: <div className="mx-auto max-w-[860px]"><CompanyPage /></div>,
    network: <div className="mx-auto max-w-[820px]"><NetworkPage /></div>,
    jobs: <JobsPage />,
    messaging: <MessagesPage />,
    notifications: <AlertsPage />,
    search: <div className="mx-auto max-w-[820px]"><SearchResults query={submittedQuery} /></div>,
  };

  const jump = [["home", "Feed"], ["profile", "Profile"], ["company", "Company"], ["network", "Network"], ["jobs", "Jobs"], ["messaging", "Messages"], ["notifications", "Alerts"]];

  return (
    <Surface variant="canvas" className="min-h-screen">
      <TopNav
        active={activeTab} onNavigate={setRoute}
        searchValue={searchValue}
        onSearchChange={(v) => { setSearchValue(v); if (route === "search") setSubmittedQuery(v); }}
        onSearchSubmit={onSearchSubmit}
        alertCount={3} alertsOpen={alertsOpen} onToggleAlerts={setAlertsOpen}
      />
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-4" style={{ height: 48 }}>
        <span className="meta shrink-0 me-1">Jump to:</span>
        {jump.map(([id, label]) => (
          <Button key={id} size="sm" pill variant={route === id ? "primary" : "secondary"} onClick={() => setRoute(id)}>{label}</Button>
        ))}
        <div className="ms-auto flex shrink-0 items-center gap-2 ps-4">
          <span className="meta">Theme</span>
          <Button variant="ghost" size="sm" icon={theme === "dark" ? "light_mode" : "dark_mode"} onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} aria-label="Toggle theme" />
        </div>
      </div>
      <div className="mx-auto max-w-[1180px] px-4 py-5">{pages[route] || pages.home}</div>
    </Surface>
  );
}
