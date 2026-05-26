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
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@davinci/ui/components/ui/dropdown-menu";

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

import {
  Icon, seededPhoto, Button, Avatar, Pill, Panel,
  FeedAd, RailAd, InlineAd, AD_LIBRARY,
} from "./lib.jsx";
import { COMPANIES, GENERIC, companyIdFor, COMPANY_LOCATIONS } from "./companies.js";

const WORLD_GEO = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function LocationsMap({ locations = [] }) {
  const [hover, setHover] = React.useState(null);
  return (
    <div className="locations-map-wrap">
      <ComposableMap projectionConfig={{ scale: 135 }} width={800} height={360} style={{ width: "100%", height: "auto" }}>
        <Geographies geography={WORLD_GEO}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="var(--bg-active)"
                stroke="var(--border-strong)"
                strokeWidth={0.4}
                style={{ default: { outline: "none" }, hover: { fill: "var(--bg-active)", outline: "none" }, pressed: { outline: "none" } }}
              />
            ))
          }
        </Geographies>
        {locations.map((loc, i) => (
          <Marker key={i} coordinates={loc.coords} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <circle r={hover === i ? 7 : 5} fill="var(--accent)" stroke="#fff" strokeWidth={1.5} style={{ cursor: "pointer", transition: "r 120ms" }} />
            {hover === i && (
              <g transform="translate(0,-12)" style={{ pointerEvents: "none" }}>
                <rect x={-62} y={-30} width={124} height={28} rx={5} fill="var(--bg-elevated)" stroke="var(--border-subtle)" strokeWidth={0.5} />
                <text textAnchor="middle" y={-17} fontSize={9} fontWeight="700" fill="var(--fg)">{loc.name}</text>
                <text textAnchor="middle" y={-7} fontSize={8} fill="var(--fg-muted)">{loc.label}</text>
              </g>
            )}
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}

const { useState, useEffect, useRef } = React;

// App-wide navigation helpers (avoids prop-drilling everywhere).
const NavContext = React.createContext({ goToCompany: () => {}, openFooter: () => {} });

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

/* ============================ Footers ============================ */
/* Single-color, resizable Davinci mark (currentColor): a rounded square with
   a knocked-out "D" counter + accent dot. Inherits color + scales to any size. */
function LogoMark({ size = 14, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} role="img" aria-label="Davinci" style={{ display: "inline-block", verticalAlign: "-2px", flexShrink: 0 }}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0 H32 A8 8 0 0 1 40 8 V32 A8 8 0 0 1 32 40 H8 A8 8 0 0 1 0 32 V8 A8 8 0 0 1 8 0 Z M11 10 h10 a10 10 0 0 1 10 10 a10 10 0 0 1 -10 10 h-10 z"
      />
      <circle cx="24" cy="20" r="3" fill="currentColor" />
    </svg>
  );
}

function RailFooter() {
  const { openFooter } = React.useContext(NavContext);
  const links = ["About", "Accessibility", "Help Center", "Privacy & Terms", "Ad Choices", "Advertising", "Business Services", "Get the app"];
  return (
    <div className="rail-footer">
      <div className="rail-footer__links">
        {links.map((l) => <button key={l} onClick={openFooter}>{l}</button>)}
        <button onClick={openFooter}>More</button>
      </div>
      <div className="rail-footer__copy"><LogoMark size={14} /> Davinci Corporation © 2026</div>
    </div>
  );
}

function SiteFooter({ onClose }) {
  const cols = [
    ["General", ["About", "Accessibility", "Help Center", "Privacy & Terms", "Ad Choices"]],
    ["Solutions", ["Talent Solutions", "Marketing Solutions", "Advertising", "Sales Solutions"]],
    ["Directories", ["Members", "Jobs", "Companies", "Learning", "Mobile"]],
  ];
  return (
    <div className="site-footer" role="dialog" aria-label="Site footer">
      <div className="site-footer__inner">
        <Button variant="ghost" size="icon" className="site-footer__close" aria-label="Close footer" onClick={onClose}><Icon name="close" /></Button>
        <div className="site-footer__cols">
          {cols.map(([h, items]) => (<div key={h}><div className="site-footer__h">{h}</div>{items.map((i) => <a key={i}>{i}</a>)}</div>))}
          <div className="site-footer__meta">
            <div><strong>Questions?</strong><div className="meta">Visit our Help Center.</div></div>
            <div><strong>Manage your account and privacy</strong><div className="meta">Go to your Settings.</div></div>
            <div><strong>Recommendation transparency</strong><div className="meta">Learn more about Recommended Content.</div></div>
          </div>
          <div>
            <div className="site-footer__h">Select language</div>
            <Select defaultValue="en">
              <SelectTrigger size="sm" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English (English)</SelectItem>
                <SelectItem value="es">Español (Spanish)</SelectItem>
                <SelectItem value="fr">Français (French)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="site-footer__copy"><LogoMark size={16} /> Davinci Corporation © 2026</div>
      </div>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-14 w-[68px] flex-col items-center justify-center gap-0.5 text-[11px] text-[var(--fg-muted)] outline-none hover:text-[var(--fg)]">
                <Avatar initials="YO" size={26} photo={seededPhoto("yara-okonkwo", 64, 64, "face")} />
                <span className="flex items-center gap-0.5">Me <Icon name="expand_more" className="text-[14px]" /></span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="flex gap-3 p-2">
                <Avatar size={48} photo={seededPhoto("yara-okonkwo", 96, 96, "face")} />
                <div className="min-w-0">
                  <div className="font-semibold">Yara Okonkwo</div>
                  <div className="text-xs text-[var(--fg-muted)]">Principal Designer · Davinci Systems</div>
                </div>
              </div>
              <div className="px-2 pb-2">
                <Button variant="outline" size="sm" pill style={{ width: "100%" }} onClick={() => onNavigate?.("profile")}>View profile</Button>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem><Icon name="workspace_premium" className="text-[18px] me-1" /> Premium features</DropdownMenuItem>
              <DropdownMenuItem><Icon name="settings" className="text-[18px] me-1" /> Settings &amp; Privacy</DropdownMenuItem>
              <DropdownMenuItem><Icon name="help" className="text-[18px] me-1" /> Help</DropdownMenuItem>
              <DropdownMenuItem><Icon name="language" className="text-[18px] me-1" /> Language</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Manage</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onNavigate?.("profile")}><Icon name="history_edu" className="text-[18px] me-1" /> Posts &amp; Activity</DropdownMenuItem>
              <DropdownMenuItem><Icon name="work" className="text-[18px] me-1" /> Job Posting Account</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Icon name="logout" className="text-[18px] me-1" /> Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="flex h-14 w-[72px] flex-col items-center justify-center gap-0.5 border-l border-[var(--border-subtle)] text-[11px] text-[var(--fg-muted)] outline-none hover:text-[var(--fg)]" aria-label="Advertise">
            <Icon name="campaign" className="text-[22px]" />
            Advertise
          </button>
        </nav>
      </div>
    </header>
  );
}

/* ============================ Rails ============================ */
function LeftRail({ onViewProfile }) {
  return (
    <>
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
    </>
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
    <>
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
      <RailFooter />
    </>
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

function Post({ id, author, role, time, avatar, variant = "g1", photoSeed, isCompany, bg, body, attachment, reactions, comments, topReactions, seedComments }) {
  const [showComments, setShowComments] = useState(false);
  const { goToCompany } = React.useContext(NavContext);
  const cid = isCompany ? companyIdFor(author) : null;
  return (
    <Panel bare>
      <div className="post">
        <div className="post__header">
          <Avatar initials={avatar} size={48} variant={variant} photoSeed={photoSeed} bg={bg} style={isCompany ? { borderRadius: 8 } : undefined} />
          <div className="post__who">
            <div className="post__name" onClick={cid ? () => goToCompany(cid) : undefined} style={cid ? { cursor: "pointer" } : undefined}>{author}</div>
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
    <>
      <Composer />
      {posts.map((p, i) => (
        <React.Fragment key={p.id}>
          <Post {...p} />
          {i === 0 && <FeedAd ad={AD_LIBRARY.notion} />}
          {i === 1 && <FeedAd ad={AD_LIBRARY.figma} />}
        </React.Fragment>
      ))}
    </>
  );
}

/* ============================ Profile ============================ */
function ProfileRail() {
  const { goToCompany } = React.useContext(NavContext);
  const viewers = [
    { name: "Ann Peng", role: "Design at TikTok", conn: "2nd" },
    { name: "Braden Kowitz", role: "Design Leadership", conn: "2nd" },
    { name: "Kacey Lewis", role: "Defender of the Frontend", conn: "2nd" },
    { name: "Jenny Chang", role: "Design @ Vercel", conn: "2nd" },
    { name: "Dan Hiester", role: "Product Builder", conn: "2nd" },
  ];
  return (
    <>
      <Panel title="Profile language">
        <div style={{ fontSize: 13 }}>English</div>
        <Separator className="my-3" />
        <div style={{ fontWeight: 600, fontSize: 13 }}>Public profile &amp; URL</div>
        <div className="meta" style={{ marginTop: 2 }}>davinci.design/in/yara-okonkwo</div>
      </Panel>
      <Panel title="Who your viewers also viewed" bodyStyle={{ padding: 0 }}>
        {viewers.map((p, i) => (
          <div key={i} className="rail-item">
            <Avatar initials={p.name.slice(0, 2).toUpperCase()} size={40} photoSeed={p.name} />
            <div className="rail-item__text"><div className="rail-item__title">{p.name} <span className="meta">· {p.conn}</span></div><div className="rail-item__sub">{p.role}</div></div>
            <Button variant="outline" size="sm" pill icon="add">Connect</Button>
          </div>
        ))}
      </Panel>
      <Panel title="You might like — Pages for you" bodyStyle={{ padding: 0 }}>
        {Object.values(COMPANIES).slice(0, 3).map((x) => (
          <div key={x.id} className="rail-item" onClick={() => goToCompany(x.id)} style={{ cursor: "pointer" }}>
            <Avatar initials={x.initials} size={40} bg={x.logoBg} style={{ borderRadius: 8 }} />
            <div className="rail-item__text"><div className="rail-item__title">{x.name}</div><div className="rail-item__sub">{x.industry}</div></div>
            <Button variant="outline" size="sm" pill icon="add" onClick={(e) => e.stopPropagation()}>Follow</Button>
          </div>
        ))}
      </Panel>
      <RailAd ad={AD_LIBRARY.course} />
      <RailFooter />
    </>
  );
}

function ProfilePage() {
  const { goToCompany } = React.useContext(NavContext);
  const co = (name) => (companyIdFor(name) ? <span onClick={() => goToCompany(companyIdFor(name))} style={{ cursor: "pointer", color: "var(--accent-fg)" }}>{name}</span> : name);
  const Entry = ({ logo, logoBg, title, sub, time, desc, skills }) => (
    <div className="entry">
      <div className="entry__logo" style={logoBg ? { background: logoBg, color: "#fff" } : undefined}>{logo}</div>
      <div style={{ flex: 1 }}>
        <div className="entry__title">{title}</div>
        {sub && <div className="entry__sub">{sub}</div>}
        {time && <div className="entry__time">{time}</div>}
        {desc && <div className="entry__desc">{desc}</div>}
        {skills && <div className="entry__skills">{skills.map((s) => <Pill key={s}>{s}</Pill>)}</div>}
      </div>
    </div>
  );
  const main = (
    <>
      <Panel bare>
        <div className="profile-cover" style={{ backgroundImage: `url(${seededPhoto("yara-okonkwo-banner", 1200, 360, "banner")})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="profile-header">
          <Avatar initials="YO" size={128} photo={seededPhoto("yara-okonkwo", 256, 256, "face")} />
          <div className="profile-header__name">Yara Okonkwo</div>
          <div className="profile-header__headline">Principal Designer at Davinci Systems · Helping teams build design infrastructure that doesn't rot.</div>
          <div className="profile-header__meta">
            <span><Icon name="location_on" className="text-[14px]" /> Lisbon, Portugal · {co("Davinci Systems")}</span>
            <span><Icon name="group" className="text-[14px]" /> 1,842 connections · 12k followers</span>
          </div>
          <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8, background: "var(--accent-subtle)", color: "var(--accent-fg)", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600 }}>
            <Icon name="work" className="text-[16px]" /> Open to work — Design Systems &amp; Product Design roles
          </div>
          <div className="profile-header__actions">
            <Button variant="primary" icon="chat_bubble">Message</Button>
            <Button variant="outline" icon="add">Follow</Button>
            <Button variant="secondary">More</Button>
          </div>
        </div>
      </Panel>

      <Panel title="Analytics" action={<span className="meta">Private to you</span>}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[["98", "profile views", "Discover who's viewed your profile."], ["1,892", "post impressions", "Check out who's engaging with your posts."], ["27", "search appearances", "See how often you appear in search."]].map(([v, l, d]) => (
            <div key={l}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}><span className="stat__value">{v}</span><span style={{ fontSize: 13, fontWeight: 600 }}>{l}</span></div>
              <div className="meta" style={{ marginTop: 4, lineHeight: 1.4 }}>{d}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="About">
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--fg-muted)", margin: 0 }}>
          Designer and systems thinker with 12 years of experience building design infrastructure for product teams. I care about the boring, load-bearing parts of design systems — tokens, governance, contribution models — because those are what make every other part of design feel easy.
        </p>
        <div className="entry__skills" style={{ marginTop: 14 }}>
          {["Design Systems", "Design Tokens", "Accessibility"].map((s) => <Pill key={s} variant="accent">{s}</Pill>)}
          {["Figma", "React", "Typography", "Product Strategy"].map((s) => <Pill key={s}>{s}</Pill>)}
        </div>
      </Panel>

      <Panel title="Services">
        <p style={{ fontSize: 14, lineHeight: 1.6, margin: "0 0 12px" }}>I help product teams treat their design system as a product — set up the pipeline, governance, and rituals that keep it healthy.</p>
        <div className="entry__skills">
          {["Design Systems Consulting", "Design Ops", "Workshops & Training", "Token Architecture", "Audits"].map((s) => <Pill key={s}>{s}</Pill>)}
        </div>
      </Panel>

      <Panel title="Activity" action={<Button variant="outline" size="sm" pill>Create a post</Button>}>
        <div className="meta" style={{ marginBottom: 12 }}>1,094 followers</div>
        <div className="flex flex-col gap-3" style={{ margin: "0 -16px -14px" }}>
          <Post id="yara-act-1" author="Yara Okonkwo" role="Principal Designer · Davinci Systems" time="3d" avatar="YO" photoSeed="yara okonkwo" body="The unglamorous truth about design systems: the wins compound in the docs and governance, not the component count. Shipped our contribution guide this week and adoption already feels different." reactions={317} comments={18} topReactions={["insightful", "like", "celebrate"]} />
          <Post id="yara-act-2" author="Yara Okonkwo" role="Principal Designer · Davinci Systems" time="1w" avatar="YO" photoSeed="yara okonkwo" body="Reposting a great thread on surface hierarchy — exactly how we think about Canvas → Container → grouping at Davinci." reactions={142} comments={6} topReactions={["like", "love"]} />
        </div>
      </Panel>

      <Panel title="Experience">
        {[
          { logo: "DV", logoBg: "var(--blue-9)", title: "Principal Designer", sub: co("Davinci Systems"), time: "2022 – Present · 4 yrs", desc: "Lead design system and brand systems across the Davinci product suite. Built a token pipeline 40+ teams consume.", skills: ["Design Systems", "Tokens", "Leadership"] },
          { logo: "HX", logoBg: "var(--teal-9)", title: "Senior Product Designer", sub: co("Helix Systems"), time: "2019 – 2022 · 3 yrs", desc: "Owned end-to-end redesign of the primary dashboard; partnered with eng on a React component library.", skills: ["Product Design", "React", "Figma"] },
          { logo: "NV", title: "Product Designer", sub: "Novatech", time: "2015 – 2019 · 4 yrs", desc: "Shipped consumer features across web and iOS; built the first internal component library.", skills: ["iOS", "Web"] },
        ].map((e, i) => <Entry key={i} {...e} />)}
      </Panel>

      <Panel title="Education">
        <Entry logo="RC" title="Royal College of Art" sub="MA, Communication Design" time="2013 – 2015" desc="Graduated with Distinction. Thesis on systems thinking in interface design." />
        <Entry logo="UL" title="University of Lagos" sub="BSc, Computer Science" time="2009 – 2013" />
      </Panel>

      <Panel title="Projects">
        <Entry logo="DV" logoBg="var(--blue-9)" title="Davinci Token Pipeline" time="2022 – Present" desc="A Radix-based token system + Figma sync consumed by 40+ product teams. Zero-config theming and lint-enforced overrides." />
        <Entry logo="OS" title="Open Surface Guidelines" time="2023" desc="A public playbook for surface hierarchy and elevation, adopted across the design community." />
      </Panel>

      <Panel title="Skills">
        <div className="entry__skills">
          {["Design Systems", "Design Tokens", "Figma", "React", "TypeScript", "Accessibility (WCAG)", "Design Ops", "Typography", "Governance", "Component API Design"].map((s) => <Pill key={s} variant="accent">{s}</Pill>)}
        </div>
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

      <Panel title="Patents">
        <Entry logo="" title="System and method for token-driven theme resolution" sub="US 11,842,019 · Granted 2023" desc="A method for resolving design tokens across themes with lint-enforced alias overrides." />
      </Panel>

      <Panel title="Courses">
        {[["Advanced Design Systems", "Royal College of Art"], ["Accessibility Engineering", "Davinci Learning"], ["Type Design Fundamentals", "Type@Cooper"]].map(([t, sub]) => (
          <Entry key={t} logo="" title={t} sub={sub} />
        ))}
      </Panel>

      <Panel title="Languages">
        {[["English", "Native or bilingual proficiency"], ["Portuguese", "Professional working proficiency"], ["Yoruba", "Native or bilingual proficiency"]].map(([l, p]) => (
          <div key={l} className="detail-row"><div className="detail-row__value" style={{ fontWeight: 600 }}>{l}</div><div className="meta">{p}</div></div>
        ))}
      </Panel>

      <Panel title="Interests" bodyStyle={{ padding: 0 }}>
        {[
          { n: "Helix Systems", r: "24,802 followers", i: "HX", v: "g2", company: true },
          { n: "Atlas Docs", r: "214,882 followers", i: "AT", v: "g5", company: true },
          { n: "Design Systems Guild", r: "28,402 members", i: "DS", v: "g4" },
        ].map((p, i) => {
          const cid = p.company ? companyIdFor(p.n) : null;
          return (
            <div key={i} className="rail-item" onClick={cid ? () => goToCompany(cid) : undefined} style={cid ? { cursor: "pointer" } : undefined}>
              <Avatar initials={p.i} size={40} variant={p.v} bg={COMPANIES[cid]?.logoBg} photoSeed={p.company ? null : p.n} style={p.company ? { borderRadius: 8 } : undefined} />
              <div className="rail-item__text"><div className="rail-item__title">{p.n}</div><div className="rail-item__sub">{p.r}</div></div>
              <Button variant="outline" size="sm" pill icon="add" onClick={(e) => e.stopPropagation()}>Follow</Button>
            </div>
          );
        })}
      </Panel>

      <Panel title="Causes">
        <div className="entry__skills">{["Education", "Science and Technology", "Social Services", "Arts and Culture"].map((s) => <Pill key={s}>{s}</Pill>)}</div>
      </Panel>
    </>
  );
  return <PageTwoColRight right={<ProfileRail />}>{main}</PageTwoColRight>;
}

/* ============================ Company ============================ */
function MoreMenu({ size = "icon-sm" }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size={size} pill aria-label="More actions"><Icon name="more_horiz" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem><Icon name="open_in_new" className="text-[18px] me-1" /> Visit website</DropdownMenuItem>
        <DropdownMenuItem><Icon name="send" className="text-[18px] me-1" /> Send in a message</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Icon name="flag" className="text-[18px] me-1" /> Report abuse</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CompanySubnav({ c, tabs, tab, setTab, stuck }) {
  return (
    <div className={`company-subnav ${stuck ? "is-stuck" : ""}`}>
      <div className="company-subnav__id">
        <span className="company-subnav__logo" style={{ background: c.logoBg }}>{c.initials}</span>
        <span className="company-subnav__name">{c.name}</span>
      </div>
      <nav className="company-tabs">
        {tabs.map((t) => (
          <button key={t} className={`company-tab ${tab === t.toLowerCase() ? "active" : ""}`} onClick={() => setTab(t.toLowerCase())}>{t}</button>
        ))}
      </nav>
      <div className="company-subnav__actions">
        <MoreMenu />
        <Button variant="primary" size="sm" pill icon="add">Follow</Button>
      </div>
    </div>
  );
}

function CompanyRail({ c, goToCompany }) {
  const others = Object.values(COMPANIES).filter((x) => x.id !== c.id);
  const Mod = ({ title, sub, rows }) => (
    <Panel title={title} bodyStyle={{ padding: 0 }}>
      {sub && <div style={{ fontSize: 11, color: "var(--fg-muted)", padding: "0 16px 8px" }}>{sub}</div>}
      {rows.map(([name, kind], i) => {
        const id = companyIdFor(name);
        return (
          <div key={i} className="rail-item" onClick={id ? () => goToCompany(id) : undefined} style={id ? { cursor: "pointer" } : undefined}>
            <Avatar initials={name.slice(0, 2).toUpperCase()} size={40} variant="g2" bg={COMPANIES[id]?.logoBg} style={{ borderRadius: 8 }} />
            <div className="rail-item__text"><div className="rail-item__title">{name}</div><div className="rail-item__sub">{kind}</div></div>
            <Button variant="outline" size="sm" pill icon="add" onClick={(e) => e.stopPropagation()}>Follow</Button>
          </div>
        );
      })}
    </Panel>
  );
  return (
    <aside className="hidden flex-col gap-3 lg:flex">
      <Panel title="Pages people also viewed" bodyStyle={{ padding: 0 }}>
        {others.map((x) => (
          <div key={x.id} className="rail-item" onClick={() => goToCompany(x.id)} style={{ cursor: "pointer" }}>
            <Avatar initials={x.initials} size={40} bg={x.logoBg} style={{ borderRadius: 8 }} />
            <div className="rail-item__text"><div className="rail-item__title">{x.name}</div><div className="rail-item__sub">{x.industry}</div></div>
            <Button variant="outline" size="sm" pill icon="add" onClick={(e) => e.stopPropagation()}>Follow</Button>
          </div>
        ))}
      </Panel>
      <Mod title="Products people also use" rows={GENERIC.rail.alsoUse} />
      <Mod title="People also follow" rows={GENERIC.rail.alsoFollow} />
      <RailFooter />
    </aside>
  );
}

function CompanyPage({ companyId = "davinci", goToCompany }) {
  const c = COMPANIES[companyId] || COMPANIES.davinci;
  const [tab, setTab] = useState("home");
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 230);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setTab("home"); window.scrollTo({ top: 0 }); }, [companyId]);

  const TABS = ["Home", "About", "Products", "Posts", "Jobs", "People", "Insights"];
  const postProps = (p) => ({
    id: p.id, author: c.name, role: `${c.followers} followers`, time: p.time, avatar: c.initials, isCompany: true, bg: c.logoBg,
    body: p.body, attachment: p.attachment ? { title: p.attachment.title, sub: p.attachment.sub, image: seededPhoto(p.attachment.image, 480, 240, "article") } : undefined,
    reactions: p.reactions, comments: p.comments, topReactions: ["like", "celebrate", "support"],
  });

  // Pad to a consistent, "lived-in" density across every company.
  const densePosts = [...c.posts, ...GENERIC.fillerPosts.map((p, i) => ({ id: `${c.id}-f${i}`, time: ["6h", "2d", "1w", "2w"][i] || "1w", ...p }))].slice(0, 4);
  const denseJobs = [...c.jobs, ...GENERIC.fillerJobs].slice(0, 5);
  const customers = Object.values(COMPANIES).filter((x) => x.id !== c.id);
  const stats = [["employees", c.employees], ["founded", c.founded], ["open roles", String(denseJobs.length)], ["followers", c.followers]];

  const companyRow = (x) => (
    <div key={x.id} className="rail-item" onClick={() => goToCompany(x.id)} style={{ cursor: "pointer" }}>
      <Avatar initials={x.initials} size={44} bg={x.logoBg} style={{ borderRadius: 8 }} />
      <div className="rail-item__text"><div className="rail-item__title">{x.name}</div><div className="rail-item__sub">{x.industry} · {x.followers} followers</div></div>
      <Button variant="outline" size="sm" pill icon="add" onClick={(e) => e.stopPropagation()}>Follow</Button>
    </div>
  );

  const homeTab = (
    <>
      <Panel title="Overview" action={<Button variant="ghost" size="sm" onClick={() => setTab("about")}>Show all details</Button>}>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--fg-muted)", margin: "0 0 16px" }}>{c.about}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {stats.map(([v, l]) => <div className="stat" key={l}><div className="stat__value">{v}</div><div className="stat__label">{l}</div></div>)}
        </div>
      </Panel>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, margin: "2px 2px 8px" }}>Page posts</div>
        <div className="flex flex-col gap-3">{densePosts.slice(0, 3).map((p) => <Post key={p.id} {...postProps(p)} />)}</div>
      </div>
      <Panel title="Products" action={<Button variant="ghost" size="sm" onClick={() => setTab("products")}>Show all</Button>}>
        <div style={{ fontWeight: 600 }}>{c.product.name}</div>
        <p style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 4 }}>{c.product.desc}</p>
      </Panel>
      <Panel title="People highlights" bodyStyle={{ padding: 0 }}>
        {GENERIC.pymk.slice(0, 3).map((p, i) => (
          <div key={i} className="rail-item">
            <Avatar initials={p.name.slice(0, 2).toUpperCase()} size={44} photoSeed={p.name} />
            <div className="rail-item__text"><div className="rail-item__title">{p.name}</div><div className="rail-item__sub">{p.role} · {c.name}</div></div>
            <Button variant="outline" size="sm" pill>Message</Button>
          </div>
        ))}
      </Panel>
      <Panel title="Recent job openings" action={<Button variant="ghost" size="sm" onClick={() => setTab("jobs")}>Show all jobs</Button>} bodyStyle={{ padding: 0 }}>
        {denseJobs.slice(0, 3).map(([title, loc, posted], i) => (
          <div key={i} className="entry" style={{ alignItems: "center", padding: "12px 16px", borderBottom: i < 2 ? "1px solid var(--border-subtle)" : "none" }}>
            <Avatar initials={c.initials} size={40} bg={c.logoBg} style={{ borderRadius: 8 }} />
            <div style={{ flex: 1 }}><div className="entry__title">{title}</div><div className="entry__time">{loc} · {posted}</div></div>
          </div>
        ))}
      </Panel>
      <Panel title="Events">
        <div className="flex flex-col gap-3">
          {GENERIC.events.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-fg)" }}><Icon name="event" /></div>
              <div style={{ flex: 1 }}><div className="entry__title">{e.title}</div><div className="entry__time">{e.date} · {e.attendees} attendees</div></div>
              <Button variant="outline" size="sm" pill>View</Button>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Featured customers" bodyStyle={{ padding: 0 }}>
        {customers.slice(0, 4).map((x) => companyRow(x))}
      </Panel>
    </>
  );

  const aboutTab = (
    <>
      <Panel title="Overview">
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--fg-muted)", margin: "0 0 8px" }}>{c.about}</p>
        {[["Website", c.website], ["Industry", c.industry], ["Company size", c.size], ["Headquarters", c.location], ["Founded", c.founded], ["Specialties", c.specialties.join(", ")]].map(([l, v]) => (
          <div key={l} className="detail-row"><div className="detail-row__label">{l}</div><div className="detail-row__value">{v}</div></div>
        ))}
      </Panel>
      <Panel title={`Locations (${(COMPANY_LOCATIONS[c.id] || []).length})`}>
        <div style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 10 }}>Hover a marker to explore each location.</div>
        <LocationsMap locations={COMPANY_LOCATIONS[c.id] || []} />
      </Panel>
    </>
  );

  const productsTab = (
    <>
      <Panel title={`What is ${c.name}?`}><p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{c.product.desc}</p></Panel>
      <Panel title="Plans and pricing">
        <div className="pricing-grid">
          {c.product.pricing.map(([tier, price, blurb]) => (
            <div key={tier} className="pricing-card">
              <div style={{ fontWeight: 600 }}>{tier}</div>
              <div className="pricing-card__price">{price}</div>
              <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{blurb}</div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Top rated features">
        <div className="feature-grid">{c.product.features.map((f) => <div key={f} className="feature-card"><div style={{ fontWeight: 600, fontSize: 13 }}>{f}</div></div>)}</div>
      </Panel>
    </>
  );

  const postsTab = <div className="flex flex-col gap-3">{densePosts.map((p) => <Post key={p.id} {...postProps(p)} />)}</div>;

  const jobsTab = (
    <Panel title={`${c.name} has ${denseJobs.length} open roles`} bodyStyle={{ padding: 0 }}>
      {denseJobs.map(([title, loc, posted], i) => (
        <div key={i} className="entry" style={{ alignItems: "center", padding: "14px 16px", borderBottom: i < denseJobs.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
          <Avatar initials={c.initials} size={48} bg={c.logoBg} style={{ borderRadius: 8 }} />
          <div style={{ flex: 1 }}><div className="entry__title">{title}</div><div className="entry__sub">{c.name}</div><div className="entry__time">{loc} · {posted}</div></div>
          <Button variant="outline" size="sm" pill>Easy apply</Button>
        </div>
      ))}
    </Panel>
  );

  const peopleTab = (
    <>
      <Panel title={`${c.employees} associated members`}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {[["Where they live", GENERIC.people.live], ["Where they studied", GENERIC.people.studied]].map(([label, rows]) => {
            const max = Math.max(...rows.map((r) => r[1]));
            return (
              <div key={label}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>{label}</div>
                {rows.map(([name, n]) => (
                  <div key={name} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><span>{name}</span><span className="meta">{n}</span></div>
                    <div className="stat-bar" style={{ width: `${(n / max) * 100}%` }} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel title="People you may know">
        <div className="network-grid">
          {GENERIC.people.pymk.map((p, i) => (
            <div key={i} className="suggestion-card">
              <div className="suggestion-card__cover" style={{ backgroundImage: `url(${seededPhoto(p.seed + "-banner", 240, 56, "banner")})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <Avatar initials={p.name.slice(0, 2).toUpperCase()} size={64} photoSeed={p.name} style={{ border: "3px solid var(--bg-surface)", marginTop: -32, position: "relative" }} />
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, marginTop: 8, textAlign: "center" }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "var(--fg-muted)", textAlign: "center", minHeight: 28, padding: "0 8px" }}>{p.role}</div>
              <div style={{ padding: "10px 12px 14px", width: "100%", boxSizing: "border-box" }}><Button variant="outline" size="sm" pill icon="add" style={{ width: "100%" }}>Connect</Button></div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );

  const ins = GENERIC.insights;
  const insightsTab = (
    <>
      <Panel title="Hiring trends">
        <p style={{ fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.6, margin: "0 0 12px" }}>{ins.hiringBlurb}</p>
        <div style={{ display: "flex", gap: 32 }}>
          <div><div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800 }}>{ins.newHires}</div><div className="meta">New hires</div></div>
          <div><div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--success-fg)" }}>{ins.growth}</div><div className="meta">6-month growth</div></div>
        </div>
      </Panel>
      <Panel title="Total employee count">
        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800 }}>{c.employees}</div>
        <div className="meta">Median tenure · {ins.tenure}</div>
      </Panel>
      <Panel title="Headcount growth by function">
        {ins.functions.map(([f, g]) => (<div key={f} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: "1px solid var(--border-subtle)" }}><span>{f}</span><span style={{ color: "var(--success-fg)", fontWeight: 600 }}>{g}</span></div>))}
      </Panel>
      <Panel title="Notable alumni">
        {ins.alumni.map((a, i) => (<div key={i} className="entry" style={{ alignItems: "center" }}><Avatar initials={a.name.slice(0, 2).toUpperCase()} size={44} photoSeed={a.seed} /><div style={{ flex: 1 }}><div className="entry__title">{a.name}</div><div className="entry__time">{a.role} · {a.was} at {c.name}</div></div></div>))}
      </Panel>
      <Panel title="Competitors" bodyStyle={{ padding: 0 }}>
        {c.competitors.map(([name, kind], i) => { const id = companyIdFor(name); return (
          <div key={i} className="rail-item" onClick={id ? () => goToCompany(id) : undefined} style={id ? { cursor: "pointer" } : undefined}>
            <Avatar initials={name.slice(0, 2).toUpperCase()} size={40} variant="g5" bg={COMPANIES[id]?.logoBg} style={{ borderRadius: 8 }} />
            <div className="rail-item__text"><div className="rail-item__title">{name}</div><div className="rail-item__sub">{kind}</div></div>
            <Button variant="outline" size="sm" pill icon="add">Follow</Button>
          </div>
        ); })}
      </Panel>
    </>
  );

  const content = { home: homeTab, about: aboutTab, products: productsTab, posts: postsTab, jobs: jobsTab, people: peopleTab, insights: insightsTab }[tab] || homeTab;

  return (
    <div className="flex flex-col">
        <Panel bare className="rounded-b-none">
          <div className="profile-cover" style={{ height: 130, backgroundImage: `url(${seededPhoto(c.coverSeed, 1200, 300, c.coverKind || "office")})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div style={{ padding: "0 24px 16px", marginTop: -40, position: "relative" }}>
            <div className="company-logo" style={{ background: c.logoBg }}>{c.initials}</div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-end", flexWrap: "wrap", marginTop: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span className="profile-header__name">{c.name}</span>{c.verified && <Icon name="verified" className="text-[18px]" style={{ color: "var(--accent-fg)" }} />}</div>
                <div style={{ fontSize: 14, marginTop: 4 }}>{c.tagline}</div>
                <div className="profile-header__meta"><span>{c.industry}</span><span>{c.location}</span><span style={{ color: "var(--accent-fg)", fontWeight: 600 }}>{c.followers} followers</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--fg-muted)", marginTop: 8 }}>
                  <Avatar initials="KB" size={20} photoSeed="kaique borges" /> Kaique & 11 other connections follow this page
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <MoreMenu size="icon" />
                <Button variant="outline" icon="chat_bubble">Message</Button>
                <Button variant="primary" icon="add">Follow</Button>
              </div>
            </div>
          </div>
        </Panel>
        <CompanySubnav c={c} tabs={TABS} tab={tab} setTab={setTab} stuck={stuck} />
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-w-0 flex-col gap-3">{content}</div>
          <CompanyRail c={c} goToCompany={goToCompany} />
        </div>
    </div>
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
  const [state, setState] = useState("idle"); // idle | pending | dismissed
  if (state === "dismissed") return null;
  return (
    <div className="suggestion-card" style={{ position: "relative" }}>
      <button className="suggestion-card__dismiss" aria-label="Dismiss" onClick={() => setState("dismissed")}><Icon name="close" className="text-[16px]" /></button>
      <div className="suggestion-card__cover" style={{ backgroundImage: `url(${seededPhoto(person.name + "-banner", 240, 56, "banner")})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <Avatar initials={person.avatar} size={72} variant={person.variant} photoSeed={person.name} style={{ border: "3px solid var(--bg-surface)", marginTop: -36, position: "relative" }} />
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, marginTop: 8, textAlign: "center", padding: "0 8px" }}>{person.name}</div>
      <div style={{ fontSize: 12, color: "var(--fg-muted)", textAlign: "center", marginTop: 2, minHeight: 32, lineHeight: 1.35, padding: "0 8px" }}>{person.role}</div>
      <div className="meta" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, justifyContent: "center", padding: "0 8px" }}>
        <Avatar size={16} photoSeed={person.name + "-m"} /> {person.mutual} mutual connections
      </div>
      <div style={{ padding: "12px 12px 14px", width: "100%", boxSizing: "border-box" }}>
        <Button variant={state === "pending" ? "secondary" : "outline"} size="sm" pill icon={state === "pending" ? "check" : "add"} style={{ width: "100%" }} onClick={() => setState((s) => (s === "pending" ? "idle" : "pending"))}>{state === "pending" ? "Pending" : "Connect"}</Button>
      </div>
    </div>
  );
}
const NETWORK_PEOPLE = [
  { name: "Stuart Bayston", role: "Design Lead · Aston (ex-Google)", mutual: 11, avatar: "SB", variant: "g5" },
  { name: "Justin Cohen", role: "Product Design at Plaid", mutual: 11, avatar: "JC", variant: "g2" },
  { name: "Mallory Dean", role: "Designer Advocate at Figma", mutual: 17, avatar: "MD", variant: "g4" },
  { name: "Colin Robins", role: "Senior Experience Design Consultant", mutual: 1, avatar: "CR", variant: "g6" },
  { name: "Dimitri Otero", role: "Design Systems · helping product teams ship", mutual: 32, avatar: "DO", variant: "g1" },
  { name: "Amy Wong", role: "Brand & Creative @ Plaid", mutual: 6, avatar: "AW", variant: "g4" },
  { name: "Gili Boker", role: "Senior Director of Product Design", mutual: 6, avatar: "GB", variant: "g5" },
  { name: "Shamus Scott Grubb", role: "Principal Product Designer at Davinci", mutual: 15, avatar: "SG", variant: "g6" },
  { name: "Xavier Rivera", role: "Award-Winning Senior Art Director", mutual: 3, avatar: "XR", variant: "g1" },
  { name: "Rami Moghadam", role: "Creative Director, ESPN", mutual: 2, avatar: "RM", variant: "g4" },
  { name: "Nick Gawith", role: "EVP, Executive Creative Director", mutual: 4, avatar: "NG", variant: "g5" },
  { name: "Phillip Golub", role: "Experience Transformation Leader", mutual: 12, avatar: "PG", variant: "g2" },
  { name: "Steve Witmer", role: "Design Engineer & Technologist", mutual: 32, avatar: "SW", variant: "g2" },
  { name: "Kevin Muldoon", role: "Design Systems Architect & Writer", mutual: 55, avatar: "KM", variant: "g6" },
  { name: "Josh Silverman", role: "Designer, entrepreneur, educator", mutual: 21, avatar: "JS", variant: "g1" },
  { name: "Catherine Cakir", role: "VP, Operations at BranchLab", mutual: 3, avatar: "CC", variant: "g4" },
];
function NetworkPage() {
  const [tab, setTab] = useState("grow");
  const sidebar = [
    ["group", "Connections", "1,092"],
    ["person", "Following & followers", ""],
    ["groups", "Groups", "7"],
    ["event", "Events", "4"],
    ["article", "Pages", "58"],
    ["newspaper", "Newsletters", "3"],
  ];
  const Section = ({ title, people }) => (
    <Panel title={title} action={<Button variant="ghost" size="sm">Show all</Button>} bodyStyle={{ padding: 16 }}>
      <div className="network-grid">{people.map((p, i) => <SuggestionCard key={`${title}-${i}`} person={p} />)}</div>
    </Panel>
  );
  return (
    <PageTwoColLeft left={<>
        <Panel title="Manage my network" bodyStyle={{ padding: 6 }}>
          <ul className="nav-list">
            {sidebar.map(([ic, label, count]) => (
              <li key={label}><Icon name={ic} /> {label} {count && <span className="count">{count}</span>}</li>
            ))}
          </ul>
        </Panel>
        <RailAd ad={AD_LIBRARY.course} />
        <RailFooter />
      </>}>
        <div className="results-tabs" style={{ padding: "0 4px", borderBottom: "1px solid var(--border-subtle)" }}>
          <button className={`results-tab ${tab === "grow" ? "active" : ""}`} onClick={() => setTab("grow")}>Grow</button>
          <button className={`results-tab ${tab === "catchup" ? "active" : ""}`} onClick={() => setTab("catchup")}>Catch up</button>
        </div>
        <Panel bodyStyle={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 600 }}>No pending invitations</span>
          <Button variant="ghost" size="sm">Manage</Button>
        </Panel>
        <InlineAd ad={AD_LIBRARY.recruit} />
        <Section title="People you may know based on your recent activity" people={NETWORK_PEOPLE.slice(0, 4)} />
        <Section title="Adam Romanski's connections you may know" people={NETWORK_PEOPLE.slice(4, 8)} />
        <Section title="People in the Design Systems community" people={NETWORK_PEOPLE.slice(8, 12)} />
        <Section title="Suggestions for you" people={NETWORK_PEOPLE.slice(12, 16)} />
    </PageTwoColLeft>
  );
}

/* ============================ Jobs ============================ */
function JobsPage() {
  const { goToCompany } = React.useContext(NavContext);
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
                <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{companyIdFor(j.company) ? <span onClick={(e) => { e.stopPropagation(); goToCompany(companyIdFor(j.company)); }} style={{ cursor: "pointer" }}>{j.company}</span> : j.company}</div>
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
              <div style={{ fontSize: 14, marginTop: 2 }}>{companyIdFor(current.company) ? <span onClick={() => goToCompany(companyIdFor(current.company))} style={{ cursor: "pointer", color: "var(--accent-fg)" }}>{current.company}</span> : current.company}</div>
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
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: 12, alignItems: "start" }}>
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
        <RailFooter />
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
  const { goToCompany } = React.useContext(NavContext);
  const cid = type === "company" ? companyIdFor(result.title) : null;
  return (
    <Panel style={{ padding: 16 }} bodyStyle={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <Avatar initials={result.avatar} size={48} variant={result.variant} photoSeed={isRound ? result.title : null} bg={COMPANIES[cid]?.logoBg} style={{ borderRadius: isRound ? "50%" : 8, cursor: cid ? "pointer" : undefined }} onClick={cid ? () => goToCompany(cid) : undefined} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span onClick={cid ? () => goToCompany(cid) : undefined} style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, cursor: cid ? "pointer" : undefined }}>{highlightMatch(result.title, query)}</span>
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
/* ============================ Layout templates ============================ */
/* Consistent column sizing across pages: left rail 225px, right rail 300px,
   main flexes. Rails hide below lg. Pages compose these instead of hand-rolling
   their own grids. */
function PageThreeCol({ left, right, children }) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[225px_minmax(0,1fr)_300px]">
      <aside className="hidden flex-col gap-3 lg:flex">{left}</aside>
      <main className="flex min-w-0 flex-col gap-3">{children}</main>
      <aside className="hidden flex-col gap-3 lg:flex">{right}</aside>
    </div>
  );
}
function PageTwoColRight({ right, children }) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
      <main className="flex min-w-0 flex-col gap-3">{children}</main>
      <aside className="hidden flex-col gap-3 lg:flex">{right}</aside>
    </div>
  );
}
function PageTwoColLeft({ left, children }) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[225px_minmax(0,1fr)]">
      <aside className="hidden flex-col gap-3 lg:flex">{left}</aside>
      <main className="flex min-w-0 flex-col gap-3">{children}</main>
    </div>
  );
}
function PageSingle({ children, max = 820 }) {
  return <div className="mx-auto flex w-full flex-col gap-3" style={{ maxWidth: max }}>{children}</div>;
}

/* ============================ Ad gallery ============================ */
function AdGallery() {
  const G = ({ children }) => <p style={{ fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.6, margin: "0 0 14px" }}>{children}</p>;
  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-3">
      <Panel title="Ad formats & placement">
        <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          The demo ships three sponsored-content formats. Each shares the "Promoted" treatment and an advertiser chip so the pattern is recognizable across surfaces — but they differ in footprint and where they belong. Use the lightest format that fits the surface's density.
        </p>
      </Panel>
      <Panel title="Feed Ad — in-stream, full width">
        <G>Placement: inline in the main feed, between posts (about one per three organic posts). Best for rich creative with a single CTA. Avoid stacking two in a row.</G>
        <FeedAd ad={AD_LIBRARY.notion} />
      </Panel>
      <Panel title="Rail Ad — compact sidebar tile">
        <G>Placement: a right or left rail. A creative band + advertiser + one CTA. Good for a persistent, low-friction promo alongside content.</G>
        <div style={{ maxWidth: 300 }}><RailAd ad={AD_LIBRARY.aws} /></div>
      </Panel>
      <Panel title="Inline Ad — thin row between list items">
        <G>Placement: between list rows (jobs, alerts, search results, network suggestions) — about one per four items. The lowest-profile format; never use it where a Feed Ad fits.</G>
        <InlineAd ad={AD_LIBRARY.recruit} />
      </Panel>
    </div>
  );
}

export function App() {
  const [route, setRoute] = useState("home");
  const [companyId, setCompanyId] = useState("davinci");
  const [theme, setTheme] = useState("dark");
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [footerOpen, setFooterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

  const goToCompany = (id) => { setCompanyId(id); setRoute("company"); window.scrollTo({ top: 0 }); };
  const navValue = { goToCompany, openFooter: () => setFooterOpen(true) };

  const activeTab = { home: "home", profile: "home", company: "home", network: "network", jobs: "jobs", messaging: "messaging", notifications: "notifications", search: "home", ads: "home" }[route] || "home";

  const onSearchSubmit = (q) => { setSubmittedQuery(q); setSearchValue(q); setRoute("search"); };

  const pages = {
    home: <PageThreeCol left={<LeftRail onViewProfile={() => setRoute("profile")} />} right={<RightRail />}><Feed /></PageThreeCol>,
    profile: <ProfilePage />,
    company: <CompanyPage companyId={companyId} goToCompany={goToCompany} />,
    network: <NetworkPage />,
    jobs: <JobsPage />,
    messaging: <MessagesPage />,
    notifications: <AlertsPage />,
    search: <PageSingle max={820}><SearchResults query={submittedQuery} /></PageSingle>,
    ads: <AdGallery />,
  };

  const jump = [["home", "Feed"], ["profile", "Profile"], ["company", "Company"], ["network", "Network"], ["jobs", "Jobs"], ["messaging", "Messages"], ["notifications", "Alerts"], ["ads", "Ad gallery"]];

  return (
    <NavContext.Provider value={navValue}>
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
    {footerOpen && <SiteFooter onClose={() => setFooterOpen(false)} />}
    </NavContext.Provider>
  );
}
